const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service error:', error);
    } else {
        console.log('✅ Email service ready');
    }
});

// Send booking confirmation to owner
async function sendOwnerNotification(bookingData) {
    const { fullName, phone, email, roomType, bookingType, checkIn, adults, children, services, notes } = bookingData;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL || 'khusinhthainhatoi@gmail.com',
        subject: `[ĐẶT PHÒNG MỚI] ${fullName} - ${roomType}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #4A90E2, #2c5f8d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🎉 ĐẶT PHÒNG MỚI</h1>
                    <p style="margin: 10px 0 0; font-size: 16px;">Khu Sinh Thái Nhà Tôi Hòa Bình</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #2c3e50; border-bottom: 3px solid #4A90E2; padding-bottom: 10px;">📋 Thông tin khách hàng</h2>
                    <table style="width: 100%; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>👤 Họ và tên:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>📞 Số điện thoại:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>📧 Email:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email || 'Không cung cấp'}</td>
                        </tr>
                    </table>
                    
                    <h2 style="color: #2c3e50; border-bottom: 3px solid #F5B041; padding-bottom: 10px; margin-top: 30px;">🏠 Thông tin đặt phòng</h2>
                    <table style="width: 100%; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>🏡 Loại phòng:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${roomType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>📅 Loại hình thuê:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${bookingType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>📆 Ngày nhận phòng:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${checkIn}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>👥 Số khách:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${adults || 0} người lớn, ${children || 0} trẻ em</td>
                        </tr>
                    </table>
                    
                    ${services && services.length > 0 ? `
                    <h2 style="color: #2c3e50; border-bottom: 3px solid #27ae60; padding-bottom: 10px; margin-top: 30px;">🎁 Dịch vụ bổ sung</h2>
                    <ul style="list-style: none; padding: 0;">
                        ${services.map(s => `<li style="padding: 8px 0; color: #27ae60;">✓ ${s}</li>`).join('')}
                    </ul>
                    ` : ''}
                    
                    ${notes ? `
                    <h2 style="color: #2c3e50; border-bottom: 3px solid #95a5a6; padding-bottom: 10px; margin-top: 30px;">📝 Ghi chú</h2>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #555;">${notes}</p>
                    ` : ''}
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
                        <p style="margin: 0; color: #1976D2; font-size: 14px;">
                            📞 <strong>Vui lòng liên hệ lại khách hàng trong vòng 24 giờ</strong>
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                    <p>Khu Sinh Thái Nhà Tôi Hòa Bình</p>
                    <p>📍 Xóm Ngành, xã Liên Sơn, huyện Lương Sơn, Tỉnh Hòa Bình</p>
                    <p>☎️ 0964 233 100 - 0963 631 295</p>
                </div>
            </div>
        `
    };
    
    return transporter.sendMail(mailOptions);
}

// Send confirmation to customer
async function sendCustomerConfirmation(bookingData) {
    const { fullName, phone, email, roomType, bookingType, checkIn, adults, children, services } = bookingData;
    
    if (!email) {
        return { success: false, message: 'No email provided' };
    }
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `✅ Xác nhận đặt phòng - Khu Sinh Thái Nhà Tôi Hòa Bình`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
                    <h1 style="margin: 0; font-size: 28px;">ĐẶT PHÒNG THÀNH CÔNG!</h1>
                    <p style="margin: 10px 0 0; font-size: 16px;">Khu Sinh Thái Nhà Tôi Hòa Bình</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #2c3e50;">Kính chào <strong>${fullName}</strong>,</p>
                    <p style="font-size: 14px; color: #555; line-height: 1.7;">
                        Cảm ơn Quý khách đã tin tưởng và đặt phòng tại <strong>Khu Sinh Thái Nhà Tôi Hòa Bình</strong>!
                        Chúng tôi đã nhận được yêu cầu đặt phòng của Quý khách.
                    </p>
                    
                    <h2 style="color: #2c3e50; border-bottom: 3px solid #4A90E2; padding-bottom: 10px; margin-top: 30px;">📋 Thông tin đặt phòng</h2>
                    <table style="width: 100%; margin: 20px 0; background: #f8f9fa; border-radius: 5px;">
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>🏡 Loại phòng:</strong></td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${roomType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>📅 Loại hình thuê:</strong></td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${bookingType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>📆 Ngày nhận phòng:</strong></td>
                            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${checkIn}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px;"><strong>👥 Số khách:</strong></td>
                            <td style="padding: 12px;">${adults || 0} người lớn, ${children || 0} trẻ em</td>
                        </tr>
                    </table>
                    
                    ${services && services.length > 0 ? `
                    <h3 style="color: #2c3e50; margin-top: 20px;">🎁 Dịch vụ bổ sung:</h3>
                    <ul style="background: #e8f5e9; padding: 15px 15px 15px 35px; border-radius: 5px;">
                        ${services.map(s => `<li style="padding: 5px 0; color: #27ae60;">${s}</li>`).join('')}
                    </ul>
                    ` : ''}
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 5px solid #ffc107;">
                        <h3 style="margin: 0 0 10px 0; color: #856404;">📞 Chúng tôi sẽ liên hệ lại Quý khách</h3>
                        <p style="margin: 0; color: #555; line-height: 1.7;">
                            Đội ngũ của chúng tôi sẽ liên hệ với Quý khách trong vòng <strong>24 giờ</strong> 
                            để xác nhận chi tiết đặt phòng và giải đáp mọi thắc mắc.
                        </p>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center;">
                        <h3 style="margin: 0 0 15px 0; color: #1976D2;">📞 Liên hệ ngay</h3>
                        <p style="margin: 5px 0; font-size: 16px;">
                            <strong>Hotline:</strong> 
                            <a href="tel:0964233100" style="color: #1976D2; text-decoration: none;">0964 233 100</a> - 
                            <a href="tel:0963631295" style="color: #1976D2; text-decoration: none;">0963 631 295</a>
                        </p>
                        <p style="margin: 5px 0;">
                            <strong>Email:</strong> 
                            <a href="mailto:khusinhthainhatoi@gmail.com" style="color: #1976D2;">khusinhthainhatoi@gmail.com</a>
                        </p>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #555; line-height: 1.7;">
                        Chúng tôi rất mong được phục vụ Quý khách tại <strong>Khu Sinh Thái Nhà Tôi Hòa Bình</strong>!
                    </p>
                    
                    <p style="margin-top: 20px; color: #888; font-size: 13px; font-style: italic;">
                        Trân trọng,<br>
                        <strong>Ban Quản Lý Khu Sinh Thái Nhà Tôi Hòa Bình</strong>
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; margin-top: 20px;">
                    <p style="margin: 5px 0;"><strong>Khu Sinh Thái Nhà Tôi Hòa Bình</strong></p>
                    <p style="margin: 5px 0;">📍 Xóm Ngành, xã Liên Sơn, huyện Lương Sơn, Tỉnh Hòa Bình</p>
                    <p style="margin: 5px 0;">☎️ 0964 233 100 - 0963 631 295</p>
                </div>
            </div>
        `
    };
    
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendOwnerNotification,
    sendCustomerConfirmation
};
