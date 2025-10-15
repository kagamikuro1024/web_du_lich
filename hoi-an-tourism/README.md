# Hoi An Tourism Website

A complete full-stack web application showcasing the beauty and attractions of Hoi An, Vietnam. This project includes user authentication, hotel booking functionality, and comprehensive tourism information.

## 🌟 Features

### Frontend
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Multi-page Navigation**: Home, Hotels, and Attractions pages
- **User Authentication**: Login and registration with JWT tokens
- **Booking System**: Complete hotel reservation functionality
- **Interactive Elements**: Smooth scrolling, hover effects, and modal windows

### Backend
- **Node.js/Express Server**: RESTful API architecture
- **SQLite Database**: Lightweight local database for development
- **JWT Authentication**: Secure user sessions
- **Password Encryption**: bcrypt for secure password hashing
- **CORS Enabled**: Cross-origin resource sharing
- **Data Validation**: Input validation and error handling

### Core Functionality
- ✅ **User Registration/Login**: Secure authentication system
- ✅ **Hotel Booking**: Complete reservation system with date validation
- ✅ **User Dashboard**: View and manage bookings
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Tourism Content**: Detailed information about Hoi An attractions

## 🚀 Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite3**: Database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **body-parser**: Request parsing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality
- **Fetch API**: HTTP requests to backend

## 📁 Project Structure

```
hoi-an-tourism/
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server file
│   └── hoi_an_tourism.db     # SQLite database (auto-generated)
└── frontend/
    ├── index.html            # Landing page
    ├── hotels.html           # Hotels listing page
    ├── attractions.html      # Attractions information page
    ├── css/
    │   └── style.css         # All styles
    ├── js/
    │   ├── auth.js          # Authentication functionality
    │   ├── booking.js       # Booking system
    │   └── main.js          # Main JavaScript functions
    └── assets/
        └── (placeholder for images)
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### Step 1: Download the Project
1. Download or clone the project to your local machine
2. Open PowerShell/Command Prompt
3. Navigate to the project directory:
   ```powershell
   cd "d:\gitHub\web_du_lich\hoi-an-tourism"
   ```

### Step 2: Install Backend Dependencies
1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. Install required packages:
   ```powershell
   npm install
   ```

   This will install:
   - express
   - bcryptjs
   - jsonwebtoken
   - sqlite3
   - cors
   - body-parser
   - nodemon (for development)

### Step 3: Start the Server
1. From the backend directory, run:
   ```powershell
   npm start
   ```
   
   Or for development with auto-restart:
   ```powershell
   npm run dev
   ```

2. You should see:
   ```
   Connected to SQLite database
   Server is running on http://localhost:3000
   ```

### Step 4: Access the Website
1. Open your web browser
2. Go to: `http://localhost:3000`
3. The website should load with the Hoi An Tourism homepage

## 🎯 How to Use

### User Registration & Login
1. Click "Login" in the navigation bar
2. Choose "Register here" to create a new account
3. Fill in username, email, and password
4. After registration, you'll be automatically logged in

### Making Hotel Bookings
1. Navigate to the "Hotels" page
2. Browse available accommodations
3. Click "Book Now" on any hotel (requires login)
4. Select check-in/check-out dates and number of guests
5. Add special requests (optional)
6. Confirm your booking

### Viewing Your Bookings
1. After logging in, click on your username in the navigation
2. View all your current and past bookings
3. See booking details including dates, prices, and requests

## 🗄️ Database Schema

The application uses SQLite with two main tables:

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
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

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (requires auth)

### Bookings
- `POST /api/bookings` - Create new booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)

### Static Files
- `GET /` - Serve homepage
- Static files served from `/frontend` directory

## 🔧 Development

### Adding New Features
1. **Frontend**: Modify HTML, CSS, or JavaScript files in the `frontend/` directory
2. **Backend**: Add new routes or modify `server.js`
3. **Database**: Add new tables or modify existing schema in `server.js`

### Environment Variables (Optional)
For production, consider using environment variables:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT secret key
- `DB_PATH`: Database file path

## 🎨 Customization

### Styling
- Modify `frontend/css/style.css` for visual changes
- CSS uses modern features like Grid, Flexbox, and CSS Variables
- Responsive design with mobile-first approach

### Content
- Update HTML files for text content
- Replace placeholder images in the `assets/` folder
- Modify attraction and hotel data directly in HTML

### Colors & Branding
The CSS uses a consistent color scheme:
- Primary: `#e74c3c` (Red)
- Secondary: `#3498db` (Blue)
- Accent: `#f39c12` (Orange)
- Dark: `#2c3e50` (Navy)

## 🚀 Deployment

### Local Development
The current setup is perfect for local development and testing.

### Production Deployment
For production deployment, consider:
1. **Database**: Migrate from SQLite to PostgreSQL/MySQL
2. **Environment Variables**: Use proper environment configuration
3. **Security**: Add rate limiting, input sanitization
4. **Assets**: Optimize images and minify CSS/JavaScript
5. **HTTPS**: Enable SSL/TLS encryption

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is available
- Verify all dependencies are installed: `npm install`

**Database errors:**
- The SQLite database is created automatically
- Check file permissions in the backend directory

**Login/Registration issues:**
- Check browser console for JavaScript errors
- Verify server is running on port 3000
- Ensure CORS is properly configured

**Booking system not working:**
- Must be logged in to make bookings
- Check date validation (check-out must be after check-in)
- Verify all required fields are filled

### Debug Mode
Enable detailed logging by checking the browser console (F12) and server console for error messages.

## 📱 Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author
Built with ❤️ for showcasing the beautiful heritage town of Hoi An, Vietnam.

---

**Happy Exploring Hoi An! 🏮**