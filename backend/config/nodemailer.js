import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host : "smtp-relay.brevo.com",
    port : 587,
    auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false // ⬅️ bypasses self-signed cert error
    }
});

export default transporter;