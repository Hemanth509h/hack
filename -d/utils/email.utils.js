import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options) => {
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
    if (process.env.SMTP_HOST?.includes("ethereal")) {
      console.log(
        `[email]: Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
      );
    }
  } catch (error) {
    console.error(`[email]: Error sending mail:`, error);
  }
};
