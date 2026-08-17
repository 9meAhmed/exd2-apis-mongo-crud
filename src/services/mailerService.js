const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER || '33cb51d556ee88',
        pass: process.env.SMTP_PASS || '1f4a0a53e7c624',
    },
});


exports.sendMail = async (to, subject, text, html) => {

    try {
        const info = await transporter.sendMail({
            from: '"Exd Team" <team@example.com>',
            to,
            subject,
            text,
            html
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }

}