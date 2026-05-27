// emailService.js
const nodemailer = require('nodemailer');

// Template configuration for SMTP (values to be loaded from .env)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.finki.ukim.mk',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Sends a notification email.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - (Optional) HTML body
 */
exports.sendNotification = async (to, subject, text, html = '') => {
    try {
        // TODO: Enable actual sending when SMTP credentials are provided
        /*
        const info = await transporter.sendMail({
            from: '"STGS Notifications" <noreply-stgs@finki.ukim.mk>',
            to,
            subject,
            text,
            html: html || text // Fallback to plain text if HTML isn't provided
        });
        console.log('Message sent: %s', info.messageId);
        */

        // Mock success for prototype testing
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return true;
    } catch (error) {
        console.error('Error sending email notification:', error);
        // Do not throw the error; failing to send an email shouldn't crash the grant process
        return false;
    }
};