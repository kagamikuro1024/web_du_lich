// Booking functionality
let currentBooking = {};

// Book room function
function bookRoom(hotelName, roomType, pricePerNight) {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        showAuthModal();
        showNotification('Please login to make a booking', 'info');
        return;
    }
    
    // Set current booking details
    currentBooking = {
        hotelName: hotelName,
        roomType: roomType,
        pricePerNight: pricePerNight
    };
    
    // Update modal with booking details
    document.getElementById('hotelName').textContent = hotelName;
    document.getElementById('roomType').textContent = roomType;
    document.getElementById('roomPrice').textContent = pricePerNight;
    
    // Show booking modal
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Set up date change listeners
    setupDateListeners();
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    clearBookingForm();
}

// Clear booking form
function clearBookingForm() {
    document.getElementById('checkInDate').value = '';
    document.getElementById('checkOutDate').value = '';
    document.getElementById('guests').value = '';
    document.getElementById('specialRequests').value = '';
    updateBookingSummary();
}

// Setup date change listeners
function setupDateListeners() {
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate && checkOutDate) {
        checkInDate.addEventListener('change', function() {
            // Update minimum checkout date
            const checkIn = new Date(this.value);
            checkIn.setDate(checkIn.getDate() + 1); // Minimum 1 night stay
            checkOutDate.min = checkIn.toISOString().split('T')[0];
            
            // Clear checkout date if it's now invalid
            if (checkOutDate.value && new Date(checkOutDate.value) <= new Date(this.value)) {
                checkOutDate.value = '';
            }
            
            updateBookingSummary();
        });
        
        checkOutDate.addEventListener('change', updateBookingSummary);
    }
}

// Update booking summary
function updateBookingSummary() {
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const totalNightsElement = document.getElementById('totalNights');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (checkOut > checkIn) {
            const timeDifference = checkOut.getTime() - checkIn.getTime();
            const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
            const totalPrice = nights * currentBooking.pricePerNight;
            
            totalNightsElement.textContent = nights;
            totalPriceElement.textContent = totalPrice;
            
            return { nights, totalPrice };
        }
    }
    
    totalNightsElement.textContent = '0';
    totalPriceElement.textContent = '0';
    return { nights: 0, totalPrice: 0 };
}

// Handle booking submission
async function handleBooking(event) {
    event.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
        showNotification('Please login to make a booking', 'error');
        return;
    }
    
    // Get form data
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const guests = parseInt(document.getElementById('guests').value);
    const specialRequests = document.getElementById('specialRequests').value;
    
    // Validate dates
    if (!checkInDate || !checkOutDate) {
        showNotification('Please select check-in and check-out dates', 'error');
        return;
    }
    
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
        showNotification('Check-out date must be after check-in date', 'error');
        return;
    }
    
    // Calculate total price
    const summary = updateBookingSummary();
    
    if (summary.nights === 0) {
        showNotification('Invalid date selection', 'error');
        return;
    }
    
    // Prepare booking data
    const bookingData = {
        hotelName: currentBooking.hotelName,
        roomType: currentBooking.roomType,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guests: guests,
        totalPrice: summary.totalPrice,
        specialRequests: specialRequests
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Booking confirmed successfully!', 'success');
            closeBookingModal();
            
            // Show booking confirmation details
            showBookingConfirmation(bookingData, data.bookingId);
        } else {
            showNotification(data.message || 'Booking failed', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('Booking failed. Please try again.', 'error');
    }
}

// Show booking confirmation
function showBookingConfirmation(bookingData, bookingId) {
    const confirmationHTML = `
        <div class="booking-confirmation">
            <h3>🎉 Booking Confirmed!</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Hotel:</strong> ${bookingData.hotelName}</p>
            <p><strong>Room:</strong> ${bookingData.roomType}</p>
            <p><strong>Check-in:</strong> ${bookingData.checkInDate}</p>
            <p><strong>Check-out:</strong> ${bookingData.checkOutDate}</p>
            <p><strong>Guests:</strong> ${bookingData.guests}</p>
            <p><strong>Total Price:</strong> $${bookingData.totalPrice}</p>
            <p class="confirmation-note">
                📧 A confirmation email will be sent to your registered email address.
            </p>
        </div>
    `;
    
    // Create temporary modal for confirmation
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal';
    confirmationModal.style.display = 'block';
    confirmationModal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${confirmationHTML}
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (confirmationModal.parentNode) {
            confirmationModal.parentNode.removeChild(confirmationModal);
        }
    }, 10000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const authModal = document.getElementById('authModal');
    const dashboardModal = document.getElementById('dashboardModal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    if (event.target === authModal) {
        closeAuthModal();
    }
    if (event.target === dashboardModal) {
        closeDashboardModal();
    }
}

// Initialize booking functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum dates for date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    
    if (checkInInput) {
        checkInInput.min = today;
    }
    if (checkOutInput) {
        checkOutInput.min = today;
    }
});