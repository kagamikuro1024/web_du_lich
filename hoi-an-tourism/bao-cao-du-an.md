# BÁO CÁO DỰ ÁN WEBSITE DU LỊCH HỘI AN

---

## THÔNG TIN CHUNG

**Tên dự án:** Website Du lịch Hội An - Hệ thống Booking Online
**Sinh viên thực hiện:** [Tên của bạn]
**Mã số sinh viên:** [MSSV]
**Lớp:** [Tên lớp]
**Môn học:** [Tên môn học]
**Giảng viên hướng dẫn:** [Tên GV]
**Thời gian thực hiện:** [Thời gian]

---

## 1. GIỚI THIỆU DỰ ÁN

### 1.1 Mục tiêu
Xây dựng một website du lịch hoàn chỉnh giới thiệu về Hội An - Di sản văn hóa thế giới, bao gồm:
- Hệ thống quản lý người dùng với đăng ký/đăng nhập
- Tính năng đặt phòng khách sạn online
- Giới thiệu các điểm du lịch nổi tiếng
- Giao diện responsive, thân thiện người dùng

### 1.2 Phạm vi dự án
- **Frontend:** Giao diện người dùng hiện đại, responsive
- **Backend:** API server với database management
- **Database:** Quản lý users và bookings
- **Security:** Authentication và data validation

### 1.3 Ý nghĩa thực tiễn
- Áp dụng kiến thức lập trình web full-stack
- Tạo ra sản phẩm có thể sử dụng thực tế
- Quảng bá du lịch Hội An

---

## 2. PHÂN TÍCH YÊU CẦU

### 2.1 Yêu cầu chức năng
**2.1.1 Quản lý người dùng:**
- Đăng ký tài khoản với validation
- Đăng nhập/đăng xuất an toàn
- Profile management
- Session management với JWT

**2.1.2 Hệ thống booking:**
- Xem danh sách khách sạn
- Đặt phòng với validation ngày tháng
- Tính toán giá tự động
- Lưu trữ và xem lịch sử booking

**2.1.3 Quản lý nội dung:**
- Trang chủ giới thiệu Hội An
- Thông tin chi tiết các khách sạn
- Hướng dẫn điểm tham quan

### 2.2 Yêu cầu phi chức năng
- **Performance:** Load time < 3s
- **Security:** Password hashing, SQL injection prevention
- **Usability:** Giao diện trực quan, dễ sử dụng
- **Compatibility:** Hoạt động trên mọi browser hiện đại
- **Responsive:** Tương thích mobile, tablet, desktop

---

## 3. THIẾT KẾ HỆ THỐNG

### 3.1 Kiến trúc tổng thể
```
Client (Browser) ↔ Frontend (HTML/CSS/JS) ↔ Backend API (Express.js) ↔ Database (SQLite)
```

### 3.2 Công nghệ sử dụng

**Frontend Technologies:**
- HTML5: Cấu trúc semantic
- CSS3: Styling với Flexbox/Grid, animations
- JavaScript ES6+: Interactive functionality
- Responsive Design: Mobile-first approach

**Backend Technologies:**
- Node.js: JavaScript runtime environment
- Express.js: Web application framework
- SQLite3: Lightweight database solution
- bcryptjs: Password hashing library
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- body-parser: Request body parsing middleware

### 3.3 Thiết kế Database

**3.3.1 Bảng Users:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**3.3.2 Bảng Bookings:**
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    hotel_name TEXT NOT NULL,
    room_type TEXT NOT NULL,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    guests INTEGER NOT NULL,
    total_price REAL NOT NULL,
    special_requests TEXT,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

## 4. THIẾT KẾ GIAO DIỆN

### 4.1 Wireframe và Layout
- **Header:** Navigation với logo và menu
- **Hero Section:** Hình ảnh đại diện và call-to-action
- **Content Sections:** Grid layout cho hotels và attractions
- **Footer:** Thông tin liên hệ và links

### 4.2 Color Scheme
- **Primary:** #e74c3c (Red) - Màu chủ đạo
- **Secondary:** #3498db (Blue) - Màu phụ
- **Accent:** #f39c12 (Orange) - Màu nhấn
- **Dark:** #2c3e50 (Navy) - Màu text chính
- **Light:** #ecf0f1 (Light Gray) - Background

### 4.3 Typography
- **Font Family:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Heading:** Font-weight 600-700
- **Body Text:** Font-size 1rem, line-height 1.6

---

## 5. TRIỂN KHAI

### 5.1 Cấu trúc thư mục
```
hoi-an-tourism/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── hoi_an_tourism.db
├── frontend/
│   ├── index.html
│   ├── hotels.html
│   ├── attractions.html
│   ├── css/style.css
│   └── js/
│       ├── auth.js
│       ├── booking.js
│       └── main.js
└── documentation/
```

### 5.2 API Endpoints

**Authentication:**
- POST /api/register - Đăng ký user mới
- POST /api/login - Đăng nhập user
- GET /api/profile - Lấy thông tin profile (require auth)

**Booking Management:**
- POST /api/bookings - Tạo booking mới (require auth)
- GET /api/bookings - Lấy danh sách booking của user (require auth)

**Static Files:**
- GET / - Serve homepage
- Static files từ /frontend directory

### 5.3 Security Implementation
- **Password Hashing:** bcrypt với salt rounds = 10
- **JWT Authentication:** Expire time 24h
- **Input Validation:** Kiểm tra required fields
- **SQL Injection Prevention:** Prepared statements
- **CORS Configuration:** Chỉ cho phép trusted origins

---

## 6. TESTING VÀ DEPLOYMENT

### 6.1 Test Cases

**6.1.1 Authentication Testing:**
- ✅ Đăng ký với thông tin hợp lệ
- ✅ Đăng ký với email đã tồn tại (should fail)
- ✅ Đăng nhập với credentials đúng
- ✅ Đăng nhập với credentials sai (should fail)
- ✅ Access protected routes without token (should fail)

**6.1.2 Booking Testing:**
- ✅ Tạo booking với dates hợp lệ
- ✅ Tạo booking với check-out trước check-in (should fail)
- ✅ View booking history
- ✅ Calculate total price correctly

**6.1.3 UI/UX Testing:**
- ✅ Responsive design trên mobile/tablet/desktop
- ✅ Form validation và error handling
- ✅ Loading states và user feedback
- ✅ Navigation và user flow

### 6.2 Deployment

**6.2.1 Local Development:**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

**6.2.2 Production Considerations:**
- Environment variables cho sensitive data
- Database migration sang PostgreSQL/MySQL
- HTTPS configuration
- Rate limiting và security headers
- Error logging và monitoring

---

## 7. KỚT QUẢ ĐẠT ĐƯỢC

### 7.1 Tính năng hoàn thành
- ✅ **Frontend:** 3 pages responsive với modern design
- ✅ **Backend:** RESTful API với authentication
- ✅ **Database:** SQLite với proper schema design
- ✅ **Authentication:** Secure login/register system
- ✅ **Booking:** Full booking functionality với validation
- ✅ **Security:** Password hashing, JWT, input validation
- ✅ **Documentation:** Comprehensive code documentation

### 7.2 Metrics và Performance
- **Code Quality:** Clean, readable, well-commented
- **Performance:** Fast loading, optimized queries
- **Security:** Industry-standard practices
- **Usability:** Intuitive user interface
- **Maintainability:** Modular code structure

### 7.3 Screenshots và Demo
- Trang chủ với hero section
- Hotels page với booking modal
- Attractions với detailed information
- User dashboard với booking history
- Mobile responsive views

---

## 8. ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN

### 8.1 Đánh giá dự án
**Điểm mạnh:**
- Hoàn thành đầy đủ yêu cầu đề ra
- Code quality cao, tuân thủ best practices
- UI/UX hiện đại, professional
- Security implementation tốt
- Documentation đầy đủ

**Điểm cần cải thiện:**
- Image optimization
- Advanced error handling
- Performance monitoring
- Automated testing

### 8.2 Hướng phát triển tương lai
- **Payment Integration:** VNPay, Momo, PayPal
- **Email System:** Booking confirmation emails
- **Admin Panel:** Quản lý hotels, bookings, users
- **Review System:** User reviews và ratings
- **Multi-language:** Hỗ trợ tiếng Việt/English
- **Mobile App:** React Native/Flutter app
- **AI Integration:** Chatbot support
- **Analytics:** User behavior tracking

---

## 9. TÀI LIỆU THAM KHẢO

### 9.1 Technical Documentation
- Node.js Official Documentation
- Express.js Guide
- SQLite Documentation
- JWT.io - JSON Web Tokens
- MDN Web Docs - HTML/CSS/JavaScript

### 9.2 Design Resources
- Material Design Guidelines
- CSS-Tricks for modern CSS
- Can I Use - Browser compatibility
- Responsive Design Patterns

### 9.3 Security Best Practices
- OWASP Top 10 Web Security Risks
- Node.js Security Checklist
- JWT Security Best Practices

---

## 10. PHỤ LỤC

### 10.1 Source Code Structure
[Detailed code explanations và comments]

### 10.2 Installation Guide
[Step-by-step setup instructions]

### 10.3 API Documentation
[Complete API endpoint documentation]

### 10.4 Database Schema
[Detailed database design và relationships]

---

**Ngày hoàn thành:** [Ngày tháng năm]
**Chữ ký sinh viên:** [Chữ ký]

---

**LƯU Ý:** Báo cáo này có thể in ra giấy A4, font Times New Roman 12pt, spacing 1.5 để nộp cho giảng viên.