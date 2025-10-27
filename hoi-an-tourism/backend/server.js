const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user in database
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                // Compare password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid email or password' });
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
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Booking
app.post('/api/bookings', authenticateToken, (req, res) => {
    try {
        const { hotelName, roomType, checkInDate, checkOutDate, guests, totalPrice, specialRequests } = req.body;
        const userId = req.user.userId;

        // Validate input
        if (!hotelName || !roomType || !checkInDate || !checkOutDate || !guests || !totalPrice) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        db.run(
            `INSERT INTO bookings (user_id, hotel_name, room_type, check_in_date, check_out_date, 
             guests, total_price, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, hotelName, roomType, checkInDate, checkOutDate, guests, totalPrice, specialRequests || ''],
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Error creating booking' });
                }

                res.status(201).json({
                    message: 'Booking created successfully',
                    bookingId: this.lastID
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

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