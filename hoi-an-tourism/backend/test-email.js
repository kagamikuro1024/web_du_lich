// Test email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Checking email configuration...\n');

// Check environment variables
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('🔑 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set (hidden)' : '✗ Not set');
console.log('📬 OWNER_EMAIL:', process.env.OWNER_EMAIL);
console.log('\n');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify connection
console.log('🔌 Testing connection to Gmail SMTP...\n');

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration ERROR:');
        console.error(error.message);
        console.log('\n📝 Common issues:');
        console.log('   1. App Password chưa đúng (check .env file)');
        console.log('   2. Gmail chưa bật 2-Step Verification');
        console.log('   3. App Password đã expire hoặc bị revoke');
        console.log('\n🔗 Create new App Password: https://myaccount.google.com/apppasswords');
    } else {
        console.log('✅ Email service is READY!');
        console.log('✅ Connection to Gmail SMTP: OK');
        console.log('✅ Authentication: OK');
        console.log('\n🎉 Bạn có thể gửi email booking ngay bây giờ!');
    }
    process.exit(error ? 1 : 0);
});
