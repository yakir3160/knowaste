import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';
import admin, {auth, db} from '../../config/firebase-admin.js';
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
             const userRef = db.collection('users').doc(userRecord.uid);

            await userRef.update({
                lastLogin: new Date().toISOString()
            });
            const userDoc = await userRef.get();
            console.log('Creating custom token...');
            // Generate JWT token
            const token = this.generateToken(userDoc.data());
            const firebaseToken = authData.idToken || authData.token;
            console.log('Token generated successfully');
            console.log('User logged in successfully:', email);
            return {
                user: userDoc.data(),
                token: token,
                firebaseToken: firebaseToken,
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async googleSignIn(userData) {
        try {
            const { token, email,displayName, photoURL } = userData;
            console.log('Verifying Google token...');
            const decodedToken = await auth.verifyIdToken(token);

            const userRef = db.collection('users').doc(decodedToken.sub);
            const userDoc = await userRef.get();

            let user;
            if (userDoc.exists) {
                // User exists - update login timestamp
                user = userDoc.data();
                await userRef.update({
                    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log('Existing user logged in:', user.email);
            } else {
                // New user - create account
                user = {
                    id: userRef.id,
                    email: email,
                    contactName: displayName,
                    photoURL: photoURL,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                   lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                };
                await userRef.set(user);
                console.log('New user created:', user.email);
            }

            const authToken = this.generateToken(user);
            return { user, token: authToken };
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email) {
        try {
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
        console.log('Starting password reset process');
        try {
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        oobCode: token,
                        newPassword: newPassword
                    })
                }
            );
            console.log('Password updated successfully');

            return { message: 'Password reset successful' };
        }catch(error) {
            console.error('Reset password error:', error);
            throw { status: 400, message: 'Invalid or expired token' };
        }
    }
    async updatePasswordWithVerification(email,currentPassword,newPassword) {
        try {
            console.log('Starting password update process for:', email);
            console.log('Verifying current password using login...');
            const {firebaseToken} = await this.login(email, currentPassword);
            console.log('Password verified successfully');
            if (!firebaseToken) {
                throw { status: 400, message: 'Invalid email or password' };
            }
            console.log('firebaseToken:', firebaseToken);
            console.log('Current password verified. Proceeding to update password...');

            const updateResponse = await fetch( `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.FIREBASE_WEB_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: firebaseToken,
                    password: newPassword,
                })
            })
            console.log('Password updated successfully');
            const updateData = await updateResponse.json();
            return {message: 'Password updated successfully',updateData};
        } catch (error) {
            console.error('Error updating password:', error.message);
            throw { status: 400, message: error.message || 'Invalid password' };
        }
    }
    async updateEmail(firebaseToken, newEmail) {
        try {
            console.log('Starting AUTH email update process IN AUTH SERVICE');
            console.log('new email in auth',newEmail);
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.FIREBASE_WEB_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({

                        idToken: firebaseToken,
                        email: newEmail,
                        returnSecureToken: true
                    })
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Failed to update email');
            }

            const updateData = await response.json();
            console.log('Email updated successfully IN AUTH SERVICE');
            return { message: 'Email updated successfully', updateData };
        } catch (error) {
            console.error('Error updating email:', error);
            throw { status: 400, message: error.message || 'Invalid email' };
        }
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