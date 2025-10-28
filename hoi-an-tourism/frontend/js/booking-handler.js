// Booking authentication and submission handler

// Check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bookingForm')) {
        checkBookingAuth();
    }
});

// Check authentication for booking form
function checkBookingAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // Lưu URL hiện tại để quay lại sau khi đăng nhập
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        // Hiển thị thông báo và chuyển hướng
        alert('⚠️ Vui lòng đăng nhập để đặt phòng!\n\nBạn sẽ được chuyển đến trang đăng nhập.');
        
        // Chuyển hướng đến trang chủ với modal đăng nhập
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Handle booking form submission
async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Lưu URL để quay lại sau khi đăng nhập
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        alert('⚠️ Vui lòng đăng nhập để đặt phòng!');
        window.location.href = 'index.html';
        return;
    }
    
    const formData = new FormData(event.target);
    
    // Tính tổng số khách
    const adults = parseInt(formData.get('adults') || 0);
    const children = parseInt(formData.get('children') || 0);
    const totalGuests = adults + children;
    
    // Lấy dịch vụ bổ sung
    const services = formData.getAll('services').join(', ');
    
    const bookingData = {
        name: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email') || '',
        hotelName: 'Khu Sinh Thái Nhà Tôi',
        roomType: formData.get('roomType'),
        bookingType: formData.get('bookingType'),
        checkInDate: formData.get('checkIn'),
        checkOutDate: formData.get('checkIn'), // Sử dụng checkIn vì form chỉ có 1 ngày
        guests: totalGuests,
        adults: adults,
        children: children,
        numRooms: 1, // Mặc định 1 phòng
        services: services,
        totalPrice: 0, // Sẽ tính ở server
        specialRequests: formData.get('notes') || ''
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showBookingSuccess(result);
        } else {
            alert('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại!');
    }
}

// Calculate total price
function calculateTotalPrice(formData) {
    const roomType = formData.get('roomType');
    const numRooms = parseInt(formData.get('numRooms') || 1);
    const checkIn = new Date(formData.get('checkIn'));
    const checkOut = new Date(formData.get('checkOut'));
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const prices = {
        'Standard': 800000,
        'Deluxe': 1200000,
        'Suite': 1800000,
        'Family': 2500000
    };
    
    const pricePerNight = prices[roomType] || 800000;
    return pricePerNight * nights * numRooms;
}

// Show booking success modal
function showBookingSuccess(result) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2.5rem; border-radius: 15px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                <h2 style="color: #27ae60; margin: 0 0 0.5rem 0;">Đặt phòng thành công!</h2>
                <p style="color: #666; margin: 0;">Mã đặt phòng: <strong>#${result.bookingId}</strong></p>
            </div>
            
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="color: #856404; margin: 0 0 1rem 0; font-size: 1.1rem;">💰 Thông tin thanh toán</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Tổng giá:</span>
                    <strong>${result.totalPrice.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 1.1rem;">
                    <span><strong>Đặt cọc (50%):</strong></span>
                    <strong style="color: #e74c3c;">${result.depositAmount.toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #666;">
                    <span>Thanh toán tại khách sạn:</span>
                    <span>${(result.totalPrice - result.depositAmount).toLocaleString('vi-VN')} VNĐ</span>
                </div>
            </div>
            
            <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 1rem; border-radius: 5px; margin: 1.5rem 0;">
                <p style="margin: 0; color: #0c5460; font-size: 0.95rem;">
                    <strong>📧 Email xác nhận</strong> đã được gửi đến hộp thư của bạn.<br>
                    Vui lòng <strong>thanh toán 50% tiền đặt cọc</strong> theo hướng dẫn trong email để giữ phòng.
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button onclick="closeSuccessModal(); showDashboard();" style="flex: 1; padding: 0.8rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Xem đặt phòng của tôi
                </button>
                <button onclick="closeSuccessModal()" style="flex: 1; padding: 0.8rem; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Đóng
                </button>
            </div>
        </div>
    `;
    
    modal.id = 'bookingSuccessModal';
    document.body.appendChild(modal);
    document.getElementById('bookingForm').reset();
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('bookingSuccessModal');
    if (modal) {
        modal.remove();
    }
}
