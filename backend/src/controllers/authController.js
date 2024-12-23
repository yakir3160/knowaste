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
        if (error.message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
            return res.status(400).json({ error: 'Too many attempts. Try again later' });
        }
        res.status(500).json({ error: 'Error during login' });
    }
};

export const googleSignIn = async (req, res) => {
    try {
        const { token, isSignUp, email, displayName, photoURL } = req.body;

        const result = await authService.googleSignIn({
            token,
            isSignUp,
            email,
            displayName,
            photoURL
        });
        if (result.isNewUser) {
            res.status(201).json({
                message: 'User successfully registered',
                ...result
            });
        } else {
            res.json({
                message: 'User successfully logged in',
                ...result
            });
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(401).json({
            error: 'Authentication failed',
            details: error.message
        });
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
export const updatePasswordWithVerification = async (req, res) => {
    try {
        const {email, currentPassword, newPassword } = req.body;
        const result = await authService.updatePasswordWithVerification(email, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error updating password' });
    }
};
export const updateEmail = async (req, res) => {
    try {
        const {firebaseToken,newEmail} = req.body;
        const result = await authService.updateEmail(firebaseToken,newEmail);
        res.json(result);
        console.log('result:',result);
    } catch (error) {
        if (error.message === 'Invalid email') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error updating email' });
    }
}