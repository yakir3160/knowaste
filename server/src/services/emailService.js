import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});



class EmailService {
    async sendContactEmail(contactData) {
        console.log('Sending email...');
        const mailOptions = {
            from : contactData.email,
            to: process.env.ADMIN_EMAIL,
            subject: `Message from ${contactData.firstName} ${contactData.lastName}`,
            text: contactData.message,
            html: `
        <div style="font-family: 'Jost', Arial, sans-serif; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: #FEFFF6; 
                    padding: 30px; 
                    border-radius: 35px;
                    border: 2px solid #eff5de;">
            <h2 style="color: #2A522A; font-weight: 600; font-size: 24px;">
                New Message Received
            </h2>
            
            <div style="color: #2A522A; font-size: 16px; font-weight: 400;">
                <p>A new message has been received from <span style="color: #3B763B; font-weight: 500;">${contactData.firstName} ${contactData.lastName}}</span></p>
            </div>
            
            <div style="background-color: #f8f9fa;
                        border-radius: 15px;
                        padding: 20px;
                        margin: 20px 0;
                        color: #2A522A;">
                <p><strong style="color: #3B763B;">Sender Details:</strong></p>
                <p>Name: ${contactData.firstName} ${contactData.lastName}</p>
                <p>Email: ${contactData.email}</p>
                <p><strong style="color: #3B763B;">Message:</strong></p>
                <p>${contactData.message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.ADMIN_DASHBOARD_URL || '#'}" 
                   style="background-color: #3B763B; 
                          color: #B5F517; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 35px; 
                          display: inline-block;
                          font-weight: 500;
                          border: 2px solid #B5F517;">
                    View in Dashboard
                </a>
            </div>
            
            <hr style="border: 1px solid #B5F517; margin: 30px 0;">
            
            <p style="color: #9CA3AF; font-size: 14px; text-align: center;">
                This is an automated message from your contact form system
            </p>
        </div>
      `
        };
        await emailTransporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return {
            success: true,
            message: 'Email sent successfully'
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export default new EmailService();