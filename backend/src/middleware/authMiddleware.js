import jwt from 'jsonwebtoken';
import { db } from '../../config/firebase-admin.js';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({message: 'Authorization header required'});
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: 'Token required'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userDoc = await db.collection('users').doc(decoded.userId).get();

        if (!userDoc.exists) {
            return res.status(401).json({message: 'User not found'});
        }

        // Get user data and add id to the object
        const userData = userDoc.data();
        req.user = {
            id: userDoc.id,
            ...userData
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message: 'Invalid token'});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Token expired'});
        }
        console.error('Error verifying token:', error);
        res.status(500).json({error: 'Authentication error'});
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: 'User not authenticated'});
        }
        if (!roles.includes(req.user.accountType)) {
            return res.status(403).json({message: 'User not authorized'});
        }
        next();
    };
};

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const resourceId = req.params.id;
        const userId = req.user.id;

        if (req.user.accountType === 'ADMIN') {
            return next();
        }

        if (userId === resourceId) {
            return next();
        }
        res.status(403).json({ error: 'User not authorized' });
    } catch (error) {
        res.status(500).json({error: 'Authorization error' });
    }
};