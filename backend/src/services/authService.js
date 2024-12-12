import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import admin, { db } from '../../config/firebase-admin.js';
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
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            // Create a batch operation
            const batch = db.batch();


            // Create user with correct data structure
            const userRef = db.collection('users').doc();
            const userId = userRef.id;

            // User data
            const userDocData = {
                id: userId,
                email: userData.email,
                password: hashedPassword,
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


            // Create menu for the user
            const menuRef = db.collection('menus').doc(userId);
            const menuData = {
                userId: userId,
                email: userData.email,
                menu: userData.menuSchema || {},
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(userRef, userDocData);
            batch.set(menuRef, menuData);

            // Commit the batch
            await batch.commit();

            const token = this.generateToken(userDocData);
            return { user: this.excludePassword(userDocData), token };
        } catch (error) {
            console.error('Registration error:', error.message);
            if (error.message === 'Email already exists') {
                return response.status(409).json({ error: 'Email already exists' });
            }
            return response.status(500).json({ error: 'Internal server error' });
        }

    }

    async login(email, password) {
        const userSnapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (userSnapshot.empty) {
            throw new Error('Invalid email or password');
        }

        const user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }
        const token = this.generateToken(user);
        return { user: this.excludePassword(user), token };
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