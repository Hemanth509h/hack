"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};
const sendEmail = async (options) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"The Quad" <noreply@thequad.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[email]: Message sent: ${info.messageId}`);
        // If using Ethereal, you can log the preview URL like so:
        if (process.env.SMTP_HOST?.includes('ethereal')) {
            console.log(`[email]: Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
    }
    catch (error) {
        console.error(`[email]: Error sending mail:`, error);
    }
};
exports.sendEmail = sendEmail;
