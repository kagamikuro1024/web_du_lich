const express = require('express');
const router = express.Router();
const { sendOwnerNotification, sendCustomerConfirmation } = require('../emailService');

// POST /api/booking - Create new booking
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            phone,
            email,
            roomType,
            bookingType,
            checkIn,
            adults,
            children,
            services,
            notes
        } = req.body;

        // Validate required fields
        if (!fullName || !phone || !roomType || !bookingType || !checkIn) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc (*)'
            });
        }

        // Prepare booking data
        const bookingData = {
            fullName,
            phone,
            email,
            roomType,
            bookingType,
            checkIn,
            adults: adults || 0,
            children: children || 0,
            services: services || [],
            notes: notes || '',
            createdAt: new Date().toISOString()
        };

        // Send notification to owner
        await sendOwnerNotification(bookingData);
        console.log('✅ Owner notification sent');

        // Send confirmation to customer (if email provided)
        if (email) {
            await sendCustomerConfirmation(bookingData);
            console.log('✅ Customer confirmation sent');
        }

        // Return success response
        res.json({
            success: true,
            message: 'Đặt phòng thành công! Chúng tôi sẽ liên hệ lại bạn trong vòng 24 giờ.',
            booking: {
                fullName,
                phone,
                email,
                roomType,
                checkIn,
                bookingId: `BK${Date.now()}`
            }
        });

    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau hoặc liên hệ hotline: 0964 233 100',
            error: error.message
        });
    }
});

// GET /api/booking/test - Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Booking API is working',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
