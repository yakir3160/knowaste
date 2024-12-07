import authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Email already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error during login' });
    }
};

export const googleSignIn = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await authService.googleSingIn(token);
        res.json(result);
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(401).json({ error: 'Error during Google sign-in' });
    }
};

export const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.sendPasswordResetEmail(email);
        res.json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error sending password reset email' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid or expired token') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error resetting password' });
    }
};