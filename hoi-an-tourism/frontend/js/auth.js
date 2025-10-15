// Authentication functionality
const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setMinDate();
});

// Set minimum date for date inputs to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate) checkInDate.min = today;
    if (checkOutDate) checkOutDate.min = today;
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.username) {
        updateAuthUI(true, user);
    } else {
        updateAuthUI(false);
    }
}

// Update UI based on authentication status
function updateAuthUI(isLoggedIn, user = null) {
    const authNav = document.getElementById('auth-nav');
    
    if (isLoggedIn && user) {
        authNav.innerHTML = `
            <a href="#" class="nav-link" onclick="showDashboard()">
                Welcome, ${user.username}
            </a>
        `;
    } else {
        authNav.innerHTML = `
            <a href="#" class="nav-link" onclick="showAuthModal()">Login</a>
        `;
    }
}

// Show authentication modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'block';
    showLoginForm();
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    clearAuthForms();
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// Show register form
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Clear authentication forms
function clearAuthForms() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Update UI
            updateAuthUI(true, data.user);
            closeAuthModal();
            
            showNotification('Login successful!', 'success');
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Update UI
            updateAuthUI(true, data.user);
            closeAuthModal();
            
            showNotification('Registration successful!', 'success');
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Show user dashboard
function showDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.username) {
        showAuthModal();
        return;
    }
    
    document.getElementById('username').textContent = user.username;
    
    // Load user bookings
    loadUserBookings();
    
    const modal = document.getElementById('dashboardModal');
    modal.style.display = 'block';
}

// Close dashboard modal
function closeDashboardModal() {
    const modal = document.getElementById('dashboardModal');
    modal.style.display = 'none';
}

// Load user bookings
async function loadUserBookings() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const bookings = await response.json();
        
        if (response.ok) {
            displayUserBookings(bookings);
        } else {
            showNotification('Failed to load bookings', 'error');
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNotification('Failed to load bookings', 'error');
    }
}

// Display user bookings
function displayUserBookings(bookings) {
    const bookingsContainer = document.getElementById('userBookings');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p class="no-bookings">No bookings found.</p>';
        return;
    }
    
    const bookingsHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-header">
                <h4>${booking.hotel_name}</h4>
                <span class="booking-date">${new Date(booking.booking_date).toLocaleDateString()}</span>
            </div>
            <div class="booking-details">
                <p><strong>Room:</strong> ${booking.room_type}</p>
                <p><strong>Check-in:</strong> ${booking.check_in_date}</p>
                <p><strong>Check-out:</strong> ${booking.check_out_date}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                <p><strong>Total Price:</strong> $${booking.total_price}</p>
                ${booking.special_requests ? `<p><strong>Special Requests:</strong> ${booking.special_requests}</p>` : ''}
            </div>
        </div>
    `).join('');
    
    bookingsContainer.innerHTML = bookingsHTML;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    updateAuthUI(false);
    closeDashboardModal();
    showNotification('Logged out successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background-color: #4CAF50;' : ''}
        ${type === 'error' ? 'background-color: #f44336;' : ''}
        ${type === 'info' ? 'background-color: #2196F3;' : ''}
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Check if user is authenticated (helper function for other scripts)
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

// Get auth token (helper function for other scripts)
function getAuthToken() {
    return localStorage.getItem('authToken');
}