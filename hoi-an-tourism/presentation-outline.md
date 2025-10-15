# Hoi An Tourism Website - Presentation Outline

## Slide 1: Title Slide
**HỆ THỐNG WEBSITE DU LỊCH HỘI AN**
- Tên nhóm/Sinh viên: [Tên của bạn]
- Lớp: [Tên lớp]
- Môn học: [Tên môn]
- Ngày trình bày: [Ngày]

## Slide 2: Mục tiêu dự án
### 🎯 MỤC TIÊU DỰ ÁN
- Xây dựng website du lịch hoàn chỉnh
- Giới thiệu di sản văn hóa Hội An
- Hệ thống đăng ký/đăng nhập người dùng
- Tính năng đặt phòng khách sạn online
- Thiết kế responsive, thân thiện người dùng

## Slide 3: Công nghệ sử dụng
### 🛠️ CÔNG NGHỆ & TOOLS
**Frontend:**
- HTML5, CSS3, JavaScript ES6+
- Responsive Design (Mobile-first)
- Modern UI/UX với animations

**Backend:**
- Node.js & Express.js
- SQLite Database
- JWT Authentication
- bcrypt Password Hashing

## Slide 4: Tính năng chính
### ⭐ TÍNH NĂNG CHÍNH
1. **Trang chủ**: Giới thiệu Hội An với hero section
2. **Khách sạn**: 6 khách sạn với thông tin chi tiết
3. **Điểm tham quan**: Thông tin du lịch đầy đủ
4. **Đăng ký/Đăng nhập**: Bảo mật với JWT
5. **Đặt phòng**: Hệ thống booking hoàn chỉnh
6. **Dashboard**: Quản lý booking cá nhân

## Slide 5: Giao diện website
### 🎨 GIAO DIỆN WEBSITE
- **Trang chủ**: Hero section + Giới thiệu Hội An
- **Khách sạn**: Grid layout với thông tin chi tiết
- **Điểm tham quan**: Layout đa dạng với hình ảnh
- **Form đăng ký**: Modal popup hiện đại
- **Booking form**: Validation và tính toán giá

## Slide 6: Database Schema
### 🗄️ CƠ SỞ DỮ LIỆU
**Bảng Users:**
- ID, Username, Email, Password (hashed), Created_at

**Bảng Bookings:**
- ID, User_ID, Hotel_name, Room_type
- Check_in/out dates, Guests, Total_price
- Special_requests, Booking_date

## Slide 7: Bảo mật
### 🔒 TÍNH NĂNG BẢO MẬT
- **Mã hóa mật khẩu**: bcrypt hashing
- **JWT Authentication**: Secure sessions
- **Input validation**: Kiểm tra dữ liệu đầu vào
- **CORS**: Cross-origin security
- **SQL Injection protection**: Prepared statements

## Slide 8: Demo trực tiếp
### 🚀 DEMO WEBSITE
**Link truy cập:** http://localhost:3000

**Tính năng demo:**
1. Đăng ký tài khoản mới
2. Đăng nhập hệ thống
3. Xem thông tin khách sạn
4. Đặt phòng online
5. Xem lịch sử booking

## Slide 9: Kết quả đạt được
### ✅ KẾT QUẢ ĐẠT ĐƯỢC
- Website hoàn chỉnh với full-stack architecture
- Responsive design trên mọi thiết bị
- Hệ thống authentication bảo mật
- Booking system hoạt động ổn định
- Code clean, có documentation đầy đủ
- Tuân thủ best practices

## Slide 10: Hướng phát triển
### 🔮 HƯỚNG PHÁT TRIỂN
**Tính năng mở rộng:**
- Payment integration (VNPay, Momo)
- Email confirmation system
- Admin panel quản lý
- Review & rating system
- Multi-language support
- Mobile app development

## Slide 11: Kết luận
### 🎉 KẾT LUẬN
- Dự án đạt được mục tiêu đề ra
- Áp dụng thành công các công nghệ web hiện đại
- Website có thể triển khai thực tế
- Kinh nghiệm quý báu trong phát triển full-stack
- Sẵn sàng cho các dự án lớn hơn

## Slide 12: Q&A
### ❓ HỎI ĐÁP
**Cảm ơn thầy/cô và các bạn đã lắng nghe!**

**GitHub Repository:** 
https://github.com/kagamikuro1024/web_du_lich

**Website Demo:**
http://localhost:3000