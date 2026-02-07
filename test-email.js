const nodemailer = require('nodemailer');

// 👇 REPLACE THESE WITH YOUR REAL DETAILS FOR TESTING
const EMAIL = 'usamakazi1999@gmail.com'; 
const APP_PASSWORD = 'nmon kfzk jmzr excn'; // No spaces!

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL, pass: APP_PASSWORD }
});

const mailOptions = {
    from: EMAIL,
    to: EMAIL, // Sending to yourself
    subject: 'Test Email from ScholarMed',
    text: 'If you see this, your email system is WORKING! 🚀'
};

console.log("⏳ Attempting to send email...");

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("❌ FAILED!");
        console.log(error); // This will tell us the exact reason
    } else {
        console.log("✅ SUCCESS! Email sent: " + info.response);
    }
});