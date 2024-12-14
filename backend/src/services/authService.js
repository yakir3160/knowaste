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
        console.log('Starting Google Sign In process');

        console.log('Verifying Google token...');
        const decodedToken = await auth.verifyIdToken(token);
        console.log('Token verified successfully:');

        const email = decodedToken.email;
        console.log('User email:', email);

        const userRef = db.collection('users').doc(decodedToken.sub);
        const userDoc = await userRef.get();

        let user;
        if (userDoc.exists) {
            user = userDoc.data();
        } else {
            user = {
                id: userRef.id,
                email: decodedToken.email,
                googleId: decodedToken.sub,
                accountType: 'restaurant-manager',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await userRef.set(user);
            console.log('User created/updated:', user);
        }
        const authToken = this.generateToken(user);
        console.log('JWT token generated');

        return { user, token: authToken };
    }

    async sendPasswordResetEmail(email) {
        try {
            // Get the ID token for authentication
            const idToken = await auth.createCustomToken(email);

            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_WEB_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestType: 'PASSWORD_RESET',
                        email: email,
                        continueUrl: `${process.env.FRONTEND_URL}/auth`
                    })
                }
            );

            const data = await response.json();
            console.log('Reset email response:', data);

            return { message: 'Password reset email sent successfully' };
        } catch (error) {
            console.log('Error details:', error);
            throw {
                status: 500,
                message: 'Failed to send reset email'
            };
        }
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