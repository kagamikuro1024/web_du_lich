const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

console.log('✅ Email service ready with:', process.env.EMAIL_USER);

// Import booking routes
const bookingRoutes = require('./routes/booking');

// Middleware
app.use(cors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Add request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize SQLite database
const db = new sqlite3.Database('./hoi_an_tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

// Create tables if they don't exist
function initializeTables() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
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
    )`);
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Booking routes
app.use('/api/booking', bookingRoutes);

// Root route - serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve other HTML pages
app.get('/hotels', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/hotels.html'));
});

app.get('/attractions', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/attractions.html'));
});

app.get('/restaurant.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/restaurant.html'));
});

app.get('/news.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/news.html'));
});

app.get('/about-us.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/about-us.html'));
});

app.get('/news-detail-1.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/news-detail-1.html'));
});

app.get('/news-detail-2.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/news-detail-2.html'));
});

app.get('/news-detail-3.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/news-detail-3.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Admin API Routes
// Get all bookings (Admin only)
app.get('/api/admin/bookings', authenticateToken, (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY booking_date DESC', [], (err, bookings) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách đặt phòng' });
        }
        res.json(bookings);
    });
});

// Update booking status (Admin only)
app.patch('/api/admin/bookings/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }
    
    db.run(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Không tìm thấy đặt phòng' });
            }
            res.json({ message: 'Cập nhật thành công', bookingId: id, status });
        }
    );
});

// Get all customers with booking count (Admin only)
app.get('/api/admin/customers', authenticateToken, (req, res) => {
    const query = `
        SELECT u.*, COUNT(b.id) as booking_count
        FROM users u
        LEFT JOIN bookings b ON u.id = b.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `;
    
    db.all(query, [], (err, customers) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng' });
        }
        // Remove password from response
        const sanitizedCustomers = customers.map(({ password, ...customer }) => customer);
        res.json(sanitizedCustomers);
    });
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ message: 'Username or email already exists' });
                    }
                    return res.status(500).json({ message: 'Error creating user' });
                }

                const token = jwt.sign(
                    { userId: this.lastID, username: username },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(201).json({
                    message: 'User created successfully',
                    token: token,
                    user: { id: this.lastID, username: username, email: email }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
app.post('/api/login', (req, res) => {
    try {
        const { email, username, password } = req.body;
        const loginIdentifier = username || email; // Support both username and email

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: 'Username/Email and password are required' });
        }

        // Find user in database by username or email
        db.get(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [loginIdentifier, loginIdentifier],
            async (err, user) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ message: 'Invalid username/email or password' });
                }

                // Compare password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid username/email or password' });
                }

                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'Login successful',
                    token: token,
                    user: { id: user.id, username: user.username, email: user.email }
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Booking
app.post('/api/bookings', authenticateToken, (req, res) => {
    try {
        const { hotelName, roomType, bookingType, checkInDate, checkOutDate, guests, adults, children, services, totalPrice, specialRequests, name, email, phone, numRooms } = req.body;
        const userId = req.user.userId;

        // Validate input - chỉ kiểm tra các trường bắt buộc
        if (!hotelName || !roomType || !checkInDate || !name || !phone) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        
        // Tính giá tự động nếu không có
        let finalTotalPrice = totalPrice || 0;
        if (!finalTotalPrice || finalTotalPrice === 0) {
            // Bảng giá mặc định
            const roomPrices = {
                'Phòng Đơn': 500000,
                'Phòng Đôi': 700000,
                'Phòng Cộng Đồng - Lầu Đài': 300000,
                'Khu A - Phòng 1': 1500000,
                'Khu A - Phòng 2': 1500000,
                'Khu B - Phòng 1': 1800000,
                'Khu B - Phòng 2': 1000000,
                'Khu B - Phòng 3': 1000000,
                'Khu B - Phòng 4': 1000000,
                'Khu B - Phòng 5': 1000000
            };
            
            finalTotalPrice = roomPrices[roomType] || 500000;
        }

        // Get user info if email not provided
        if (!email) {
            db.get('SELECT username, email FROM users WHERE id = ?', [userId], (err, user) => {
                if (err || !user) {
                    return res.status(500).json({ message: 'Error fetching user info' });
                }
                
                const bookingEmail = user.email;
                
                insertBooking(userId, hotelName, roomType, bookingType, checkInDate, checkOutDate, guests, adults, children, services, finalTotalPrice, specialRequests, name, bookingEmail, phone, numRooms, res);
            });
        } else {
            insertBooking(userId, hotelName, roomType, bookingType, checkInDate, checkOutDate, guests, adults, children, services, finalTotalPrice, specialRequests, name, email, phone, numRooms, res);
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

function insertBooking(userId, hotelName, roomType, bookingType, checkInDate, checkOutDate, guests, adults, children, services, totalPrice, specialRequests, name, email, phone, numRooms, res) {
    const depositAmount = totalPrice * 0.5; // 50% deposit
    
    // Tạo note kết hợp special requests và thông tin bổ sung
    let fullNotes = [];
    if (bookingType) fullNotes.push(`Loại hình: ${bookingType}`);
    if (adults) fullNotes.push(`Người lớn: ${adults}`);
    if (children) fullNotes.push(`Trẻ em: ${children}`);
    if (services) fullNotes.push(`Dịch vụ: ${services}`);
    if (specialRequests) fullNotes.push(specialRequests);
    const combinedNotes = fullNotes.join(' | ');
    
    db.run(
        `INSERT INTO bookings (user_id, hotel_name, room_type, check_in_date, check_out_date, 
         checkin_date, checkout_date, guests, total_price, deposit_amount, special_requests, name, email, phone, 
         num_rooms, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, hotelName, roomType, checkInDate, checkOutDate, checkInDate, checkOutDate, 
         guests, totalPrice, depositAmount, combinedNotes, name, email, phone || '', numRooms || 1, 'pending', 'unpaid'],
        function(err) {
            if (err) {
                console.error('Insert booking error:', err);
                return res.status(500).json({ message: 'Error creating booking' });
            }

            const bookingId = this.lastID;
            
            // Send confirmation emails
            sendBookingEmails(bookingId, {
                name, email, hotelName, roomType, bookInDate: checkInDate, checkOutDate, 
                guests, totalPrice, depositAmount, specialRequests: combinedNotes, numRooms: numRooms || 1,
                bookingType, adults, children, services
            });

            res.status(201).json({
                message: 'Booking created successfully',
                bookingId: bookingId,
                totalPrice: totalPrice,
                depositAmount: depositAmount,
                depositPercentage: 50
            });
        }
    );
}

// Send booking confirmation emails
function sendBookingEmails(bookingId, bookingData) {
    const { name, email, hotelName, roomType, checkInDate, checkOutDate, guests, totalPrice, depositAmount, specialRequests, numRooms } = bookingData;
    
    // Email to customer
    const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🏡 Xác nhận đặt phòng #${bookingId} - Khu Sinh Thái Nhà Tôi`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #3498db; text-align: center;">🏡 Khu Sinh Thái Nhà Tôi - Hòa Bình</h2>
                <h3 style="color: #2c3e50;">Xác Nhận Đặt Phòng</h3>
                
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>Cảm ơn bạn đã đặt phòng tại <strong>Khu Sinh Thái Nhà Tôi</strong>. Dưới đây là thông tin đặt phòng của bạn:</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #3498db; margin-top: 0;">📋 Thông Tin Đặt Phòng</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Mã đặt phòng:</strong></td><td>#${bookingId}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Khách sạn:</strong></td><td>${hotelName}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Loại phòng:</strong></td><td>${roomType}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Số phòng:</strong></td><td>${numRooms} phòng</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Số khách:</strong></td><td>${guests} người</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Ngày nhận phòng:</strong></td><td>${new Date(checkInDate).toLocaleDateString('vi-VN')}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Ngày trả phòng:</strong></td><td>${new Date(checkOutDate).toLocaleDateString('vi-VN')}</td></tr>
                        ${specialRequests ? `<tr><td style="padding: 8px 0;"><strong>Yêu cầu đặc biệt:</strong></td><td>${specialRequests}</td></tr>` : ''}
                    </table>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="color: #856404; margin-top: 0;">💰 Thông Tin Thanh Toán</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Tổng giá:</strong></td><td style="font-size: 18px; color: #2c3e50;"><strong>${totalPrice.toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Tiền đặt cọc (50%):</strong></td><td style="font-size: 20px; color: #e74c3c;"><strong>${depositAmount.toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Còn lại:</strong></td><td style="font-size: 18px; color: #27ae60;"><strong>${(totalPrice - depositAmount).toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                    </table>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #856404;">
                        <strong>⚠️ Lưu ý:</strong> Theo quy định, quý khách vui lòng thanh toán <strong>50% tiền đặt cọc</strong> 
                        để giữ phòng. Số tiền còn lại sẽ được thanh toán khi nhận phòng.
                    </p>
                </div>
                
                <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
                    <p style="margin: 0; color: #0c5460;">
                        <strong>📞 Liên hệ:</strong><br>
                        Nếu cần hỗ trợ, vui lòng liên hệ:<br>
                        📧 Email: support@nhatoi-hoabinh.vn<br>
                        📱 Hotline: 0123 456 789<br>
                        📍 Địa chỉ: Xóm Ngành, xã Liên Sơn, huyện Lương Sơn, tỉnh Hòa Bình
                    </p>
                </div>
                
                <p style="text-align: center; color: #7f8c8d; margin-top: 30px;">
                    Cảm ơn bạn đã tin tưởng và lựa chọn Khu Sinh Thái Nhà Tôi!<br>
                    Chúng tôi rất mong được phục vụ bạn! 🌿
                </p>
            </div>
        `
    };

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `🔔 Đơn đặt phòng mới #${bookingId} - Cần xác nhận`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #e74c3c; text-align: center;">🔔 ĐƠN ĐẶT PHÒNG MỚI</h2>
                
                <div style="background: #ffe5e5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
                    <p style="margin: 0; color: #c0392b; font-size: 16px;">
                        <strong>⚠️ Có đơn đặt phòng mới cần xác nhận!</strong>
                    </p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #3498db; margin-top: 0;">👤 Thông Tin Khách Hàng</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Họ tên:</strong></td><td>${name}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Số điện thoại:</strong></td><td>${bookingData.phone || 'Chưa cung cấp'}</td></tr>
                    </table>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #3498db; margin-top: 0;">📋 Chi Tiết Đặt Phòng</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Mã booking:</strong></td><td>#${bookingId}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Khách sạn:</strong></td><td>${hotelName}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Loại phòng:</strong></td><td>${roomType}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Số phòng:</strong></td><td>${numRooms} phòng</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Số khách:</strong></td><td>${guests} người</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Check-in:</strong></td><td>${new Date(checkInDate).toLocaleDateString('vi-VN')}</td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Check-out:</strong></td><td>${new Date(checkOutDate).toLocaleDateString('vi-VN')}</td></tr>
                        ${specialRequests ? `<tr><td style="padding: 8px 0;"><strong>Yêu cầu:</strong></td><td>${specialRequests}</td></tr>` : ''}
                    </table>
                </div>
                
                <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h4 style="color: #155724; margin-top: 0;">💰 Thông Tin Thanh Toán</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0;"><strong>Tổng giá:</strong></td><td style="font-size: 18px;"><strong>${totalPrice.toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Đặt cọc (50%):</strong></td><td style="font-size: 20px; color: #e74c3c;"><strong>${depositAmount.toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                        <tr><td style="padding: 8px 0;"><strong>Thanh toán tại khách sạn:</strong></td><td style="font-size: 18px; color: #27ae60;"><strong>${(totalPrice - depositAmount).toLocaleString('vi-VN')} VNĐ</strong></td></tr>
                    </table>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #7f8c8d;">Vui lòng truy cập trang quản trị để xác nhận đơn đặt phòng này sau khi nhận được tiền đặt cọc.</p>
                    <a href="http://localhost:3000/admin.html" style="display: inline-block; padding: 12px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                        Vào Trang Quản Trị
                    </a>
                </div>
            </div>
        `
    };

    // Send emails
    transporter.sendMail(customerMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending customer email:', error);
        } else {
            console.log('Customer email sent:', info.response);
        }
    });

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending admin email:', error);
        } else {
            console.log('Admin email sent:', info.response);
        }
    });
}

// Get User Bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.all(
        'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
        [userId],
        (err, bookings) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching bookings' });
            }
            res.json(bookings);
        }
    );
});

// Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching profile' });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Gracefully close database on exit
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});