import dotenv from 'dotenv';
dotenv.config();

export const config = {
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        clientId: process.env.FIREBASE_CLIENT_ID,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
    },
    server: {
        port: process.env.PORT || 5000
    }
};