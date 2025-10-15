# Quick Setup Guide

## Prerequisites
1. Install Node.js from https://nodejs.org (download the LTS version)
2. Verify installation by opening PowerShell and running:
   ```
   node --version
   npm --version
   ```

## Setup Steps

### 1. Navigate to Project
```powershell
cd "d:\gitHub\web_du_lich\hoi-an-tourism\backend"
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start the Server
```powershell
npm start
```

### 4. Open Website
Open your browser and go to: `http://localhost:3000`

## Test the Features

### Register a New User
1. Click "Login" in the top navigation
2. Click "Register here"
3. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Register"

### Make a Booking
1. Go to "Hotels" page
2. Click "Book Now" on any hotel
3. Select dates and number of guests
4. Click "Confirm Booking"

### View Your Bookings
1. Click on your username in the navigation
2. See your booking history

That's it! Your Hoi An Tourism website is now running locally.

## Stopping the Server
Press `Ctrl + C` in the PowerShell window to stop the server.