// Script to create demo accounts for presentation
// Run this after starting the server to create demo data

const API_BASE_URL = 'http://localhost:3000/api';

// Demo accounts data
const demoAccounts = [
    {
        username: 'demo_user',
        email: 'demo@hoian.com',
        password: '123456'
    },
    {
        username: 'student1',
        email: 'student1@hoian.com', 
        password: '123456'
    },
    {
        username: 'student2',
        email: 'student2@hoian.com',
        password: '123456'
    },
    {
        username: 'teacher',
        email: 'teacher@hoian.com',
        password: '123456'
    }
];

// Function to create demo accounts
async function createDemoAccounts() {
    console.log('🎯 Creating demo accounts...');
    
    for (const account of demoAccounts) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log(`✅ Created account: ${account.username}`);
                
                // Create some sample bookings for demo account
                if (account.username === 'demo_user') {
                    await createSampleBookings(result.token);
                }
            } else {
                console.log(`⚠️ Account ${account.username} may already exist`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${account.username}:`, error);
        }
    }
    
    console.log('🎉 Demo accounts setup complete!');
    console.log('\n📋 DEMO ACCOUNTS LIST:');
    demoAccounts.forEach(account => {
        console.log(`👤 ${account.username}: ${account.email} / ${account.password}`);
    });
}

// Function to create sample bookings
async function createSampleBookings(token) {
    const sampleBookings = [
        {
            hotelName: 'Hoi An Riverside Resort & Spa',
            roomType: 'Deluxe River View',
            checkInDate: '2024-11-01',
            checkOutDate: '2024-11-03',
            guests: 2,
            totalPrice: 240,
            specialRequests: 'Late check-in please'
        },
        {
            hotelName: 'Royal Heritage Hotel',
            roomType: 'Presidential Suite',
            checkInDate: '2024-12-15',
            checkOutDate: '2024-12-18',
            guests: 4,
            totalPrice: 450,
            specialRequests: 'Airport transfer needed'
        }
    ];
    
    for (const booking of sampleBookings) {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(booking)
            });
            
            if (response.ok) {
                console.log(`✅ Created sample booking: ${booking.hotelName}`);
            }
        } catch (error) {
            console.error('❌ Error creating sample booking:', error);
        }
    }
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
    // Browser environment - add button to run
    const button = document.createElement('button');
    button.textContent = 'Create Demo Accounts';
    button.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        padding: 10px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    button.onclick = createDemoAccounts;
    document.body.appendChild(button);
} else {
    // Node.js environment
    createDemoAccounts();
}

// Instructions for manual setup
console.log(`
🎯 DEMO ACCOUNTS SETUP INSTRUCTIONS:

1. Make sure your server is running:
   node server.js

2. Open browser console on http://localhost:3000

3. Copy and paste this entire script

4. Call: createDemoAccounts()

5. Demo accounts will be created automatically!

📋 ACCOUNTS CREATED:
- demo@hoian.com / 123456 (with sample bookings)
- student1@hoian.com / 123456  
- student2@hoian.com / 123456
- teacher@hoian.com / 123456
`);