import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import admin, { db ,auth} from '../../config/firebase-admin.js';
import nodemailer from 'nodemailer';



const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

class AuthService {
    async register(userData) {
        try {
            const batch = db.batch();

            // Create Firebase Auth user
            const firebaseUser = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.businessName
            });

            const userId = firebaseUser.uid;
            const userRef = db.collection('users').doc(userId);

            const userDocData = {
                id: userId,
                firebaseUID: userId,
                email: userData.email,
                businessName: userData.businessName,
                contactName: userData.contactName,
                phone: userData.phone,
                address: userData.address,
                city: userData.city,
                zipCode: userData.zipCode,
                accountType: userData.accountType,
                kosher: userData.kosher,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const menuRef = db.collection('menus').doc(userId);
            const menuData = {
                userId: userId,
                email: userData.email,
                menu: userData.menuSchema || {},
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await admin.auth().setCustomUserClaims(userId, {
                role: userData.accountType
            });

            batch.set(userRef, userDocData);
            batch.set(menuRef, menuData);
            await batch.commit();

            const token = await admin.auth().createCustomToken(userId);
            return { user: userDocData, token };
        } catch (error) {
            console.error('Registration error:', error.message);
            if (error.code === 'auth/email-already-exists') {
                throw { status: 409, message: 'Email already exists' };
            }
            throw { status: 500, message: 'Internal server error' };
        }
    }


    async login(email, password) {
        try {
            console.log('Fetching user from Firebase Auth...');
            const userRecord = await auth.getUserByEmail(email);

            console.log('Authenticating via Firebase REST API...');
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true
                    })
                }
            );

            const authData = await response.json();
            if (!response.ok) {
                console.error('Auth error:', authData.error);
                throw new Error(authData.error.message);
            }

            console.log('Fetching user data from Firestore...');
            const userDoc = await db.collection('users').doc(userRecord.uid).get();

            console.log('Creating custom token...');
            // Generate JWT token
            const token = this.generateToken(userDoc.data());

            return {
                user: userDoc.data(),
                token: token
            };
        } catch (error) {
            console.error('Login error:', error);
            throw { status: 401, message: 'Invalid email or password' };
        }
    }


    async googleSignIn(token) {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        let userSnapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        let user;
        if (userSnapshot.empty) {
            const userRef = db.collection('users').doc();
            user = {
                id: userRef.id,
                email,
                googleId: payload.sub,
                accountType: 'restaurant-manager',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await userRef.set(user);
            console.log('User created:', user);
        } else {
            user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
        }

        const authToken = this.generateToken(user);
        return {user: this.excludePassword(user), token: authToken};
    }

    async sendPasswordResetEmail(email) {
        const userSnapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            throw new Error('User not found');
        }
        const user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
        const resetToken = this.generateResetToken(user, '1h');

        await db.collection('passwordResets').add({
            userId: user.id,
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600000), // 1 hour
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            used: false
        })
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        console.log('Reset link:', resetLink);

        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `Click <a href="${resetLink}">here</a> to reset your password`
        });

        return { message: 'Password reset email sent' };
    }

    async resetPassword(token, newPassword) {
        const resetSnapshot = await db.collection('passwordResets')
            .where('token', '==', token)
            .where('used', '==', false)
            .where('expiresAt', '>', new Date())
            .limit(1)
            .get();

        if (resetSnapshot.empty) {
            throw new Error('Invalid or expired token');
        }

        const resetDoc = resetSnapshot.docs[0];
        const resetData = resetDoc.data();

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Use transaction to update password and mark reset token as used
        await db.runTransaction(async (transaction) => {
            await transaction.update(db.collection('users').doc(resetData.userId), {
                password: hashedPassword,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            await transaction.update(resetDoc.ref, {
                used: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        return { message: 'Password reset successful' };
    }

    generateToken(user, expiresIn = '24h') {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn});
    }

    generateResetToken(user, expiresIn = '1h') {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn});
    }
    excludePassword(user) {
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }
}

export default new AuthService();