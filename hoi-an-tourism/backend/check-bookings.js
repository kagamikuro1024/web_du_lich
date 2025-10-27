const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hoi_an_tourism.db');

console.log('=== CHECKING BOOKINGS TABLE ===\n');

// Check table structure
db.all('PRAGMA table_info(bookings)', [], (err, columns) => {
    if (err) {
        console.error('Error checking table structure:', err);
        db.close();
        return;
    }
    
    console.log('📋 Bookings table columns:');
    columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
    
    // Count total bookings
    db.get('SELECT COUNT(*) as total FROM bookings', [], (err, result) => {
        if (err) {
            console.error('Error counting bookings:', err);
            db.close();
            return;
        }
        
        console.log(`\n📊 Total bookings in database: ${result.total}`);
        
        if (result.total > 0) {
            // Show all bookings
            db.all('SELECT * FROM bookings LIMIT 20', [], (err, bookings) => {
                if (err) {
                    console.error('Error fetching bookings:', err);
                } else {
                    console.log('\n📝 Recent bookings:');
                    bookings.forEach((booking, index) => {
                        console.log(`\n${index + 1}. Booking #${booking.id}`);
                        console.log(`   User ID: ${booking.user_id}`);
                        console.log(`   Hotel: ${booking.hotel_name}`);
                        console.log(`   Room: ${booking.room_type}`);
                        console.log(`   Check-in: ${booking.check_in_date}`);
                        console.log(`   Check-out: ${booking.check_out_date}`);
                        console.log(`   Price: ${booking.total_price} VND`);
                        console.log(`   Status: ${booking.status || 'N/A'}`);
                    });
                }
                db.close();
            });
        } else {
            console.log('\n⚠️ No bookings found in database!');
            db.close();
        }
    });
});
