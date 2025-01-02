import EmailService from '../services/emailService.js';

export const sendContactEmail = async (req, res) => {
    try {
        const result = await EmailService.sendContactEmail(req.body);
        if (result.success) {
            return res.json({ message: 'Email sent successfully' });
        }

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Error sending email'  ,
            error: error.message
        });
    }


}