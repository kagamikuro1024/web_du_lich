// Booking form handler for Khu Sinh Thái Nhà Tôi Hòa Bình

// ========== CẤU HÌNH API URL ==========
// Khi chạy local: 'http://localhost:3000'
// Khi dùng ngrok: Thay bằng URL ngrok của bạn (ví dụ: 'https://1a2b-3c4d-5e6f.ngrok.io')
window.API_BASE_URL = window.API_BASE_URL || (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin); // Tự động dùng domain hiện tại (ngrok)

// Debug: Log ra console để kiểm tra
console.log('🔧 DEBUG - Current hostname:', window.location.hostname);
console.log('🔧 DEBUG - API_BASE_URL:', window.API_BASE_URL);
console.log('🔧 DEBUG - Full URL will be:', `${window.API_BASE_URL}/api/booking`);
// =======================================

document.addEventListener('DOMContentLoaded', function() {
    setupBookingFormHandler();
});

function setupBookingFormHandler() {
    const form = document.getElementById('bookingForm');
    if (!form) {
        console.error('❌ KHÔNG TÌM THẤY FORM #bookingForm!');
        return;
    }
    
    console.log('✅ Đã tìm thấy form booking:', form);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('📝 Form submitted! Bắt đầu xử lý...');
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('📦 Form data:', data);
        
        // Collect checkbox services
        const services = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(cb => cb.value);
        data.services = services;
        
        // Validate
        if (!data.fullName || !data.phone || !data.roomType || !data.bookingType || !data.checkIn) {
            alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
            console.log('⚠️ Validation failed:', {fullName: data.fullName, phone: data.phone, roomType: data.roomType, bookingType: data.bookingType, checkIn: data.checkIn});
            return;
        }
        
        console.log('✅ Validation passed! Gọi API...');
        
        // Send booking request
        sendBookingRequest(data, services, e.target);
    });
}

async function sendBookingRequest(data, services, form) {
    // Show loading
    showLoadingModal();
    
    console.log('🚀 Sending booking request to:', `${API_BASE_URL}/api/booking`);
    console.log('📦 Data:', data);
    
    try {
        // Call API to send emails
        const response = await fetch(`${window.API_BASE_URL}/api/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: data.fullName,
                phone: data.phone,
                email: data.email || '',
                roomType: data.roomType,
                bookingType: data.bookingType,
                checkIn: data.checkIn,
                adults: data.adults || 0,
                children: data.children || 0,
                services: services,
                notes: data.notes || ''
            })
        });
        
        console.log('📡 Response status:', response.status);
        const result = await response.json();
        console.log('📥 Response data:', result);
        
        // Hide loading
        hideLoadingModal();
        
        if (result.success) {
            // Show success modal
            showBookingConfirmationModal(data, services, form, result.booking);
        } else {
            // Show error
            alert('❌ Lỗi: ' + result.message + '\n\nVui lòng thử lại hoặc liên hệ hotline: 0964 233 100');
        }
        
    } catch (error) {
        // Hide loading
        hideLoadingModal();
        
        console.error('Booking error:', error);
        alert('❌ Không thể kết nối đến server!\n\nVui lòng kiểm tra:\n1. Backend server đang chạy (node server.js)\n2. Port 3000 không bị chặn\n\nHoặc liên hệ hotline: 0964 233 100');
    }
}

function showLoadingModal() {
    const loading = document.createElement('div');
    loading.id = 'loadingModal';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    loading.innerHTML = `
        <div style="background: white; padding: 2rem 3rem; border-radius: 15px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <h3 style="color: #4A90E2; margin-bottom: 0.5rem;">Đang xử lý...</h3>
            <p style="color: #666;">Vui lòng đợi trong giây lát</p>
            <div style="margin-top: 1rem;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4A90E2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('spinAnimation')) {
        const style = document.createElement('style');
        style.id = 'spinAnimation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
}

function hideLoadingModal() {
    const loading = document.getElementById('loadingModal');
    if (loading) {
        document.body.removeChild(loading);
    }
}

function showBookingConfirmationModal(data, services, form, bookingInfo) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2.5rem;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: #27ae60; margin-bottom: 0.5rem;">Đặt phòng thành công!</h2>
            <p style="color: #666; font-size: 1.1rem;">Cảm ơn bạn đã tin tưởng Khu Sinh Thái Nhà Tôi</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <h3 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.3rem;">📋 Thông tin đặt phòng</h3>
            <div style="line-height: 2;">
                <p><strong>🆔 Mã đặt phòng:</strong> <span style="color: #4A90E2; font-family: monospace;">${bookingInfo.bookingId}</span></p>
                <p><strong>👤 Họ tên:</strong> ${data.fullName}</p>
                <p><strong>📞 SĐT:</strong> ${data.phone}</p>
                ${data.email ? `<p><strong>📧 Email:</strong> ${data.email}</p>` : ''}
                <p><strong>🏡 Loại phòng:</strong> ${data.roomType}</p>
                <p><strong>📅 Loại hình:</strong> ${data.bookingType}</p>
                <p><strong>📆 Ngày nhận phòng:</strong> ${data.checkIn}</p>
                <p><strong>👥 Số khách:</strong> ${data.adults || 0} người lớn, ${data.children || 0} trẻ em</p>
            </div>
        </div>
        
        <div style="background: #d4edda; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #28a745;">
            <h4 style="color: #155724; margin-bottom: 0.8rem;">✅ Email đã được gửi</h4>
            <p style="color: #155724; line-height: 1.7; margin: 0;">
                Chúng tôi đã gửi email xác nhận đến <strong>${data.email || 'chủ nhà'}</strong>. 
                Vui lòng kiểm tra hộp thư đến hoặc thư mục spam.
            </p>
        </div>
        
        <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #2196F3;">
            <h4 style="color: #1976D2; margin-bottom: 0.8rem;">📞 Chúng tôi sẽ liên hệ lại bạn</h4>
            <p style="color: #555; line-height: 1.7; margin: 0;">
                Đội ngũ của chúng tôi sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong> để xác nhận đặt phòng.
            </p>
        </div>
        
        <div style="text-align: center; border-top: 2px dashed #ddd; padding-top: 1.5rem;">
            <p style="color: #666; margin-bottom: 1rem;">
                <strong>Hotline: </strong><a href="tel:0964233100" style="color: #4A90E2;">0964 233 100</a> - 
                <a href="tel:0963631295" style="color: #4A90E2;">0963 631 295</a>
            </p>
            <button id="closeModalBtn" style="
                background: linear-gradient(135deg, #4A90E2, #2c5f8d);
                color: white;
                border: none;
                padding: 1rem 3rem;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(74, 144, 226, 0.6)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(74, 144, 226, 0.4)'">
                Đóng
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add CSS animations
    if (!document.getElementById('modalAnimations')) {
        const style = document.createElement('style');
        style.id = 'modalAnimations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close modal handler
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            form.reset();
        }, 300);
    });
}
