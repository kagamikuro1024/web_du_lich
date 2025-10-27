const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hoi_an_tourism.db');

console.log('🔧 Updating existing bookings with user info...\n');

// Get all bookings without name/email
db.all(`SELECT b.*, u.username, u.email FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        WHERE b.name IS NULL OR b.email IS NULL`, [], (err, bookings) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    console.log(`Found ${bookings.length} bookings to update`);
    
    if (bookings.length === 0) {
        console.log('✅ All bookings already have user info');
        db.close();
        return;
    }
    
    let updated = 0;
    bookings.forEach((booking, index) => {
        db.run(`UPDATE bookings SET name = ?, email = ? WHERE id = ?`,
            [booking.username, booking.email, booking.id],
            (err) => {
                if (err) {
                    console.error(`Error updating booking #${booking.id}:`, err);
                } else {
                    console.log(`✅ Updated booking #${booking.id} with name: ${booking.username}`);
                }
                
                updated++;
                if (updated === bookings.length) {
                    console.log(`\n🎉 Successfully updated ${updated} bookings!`);
                    db.close();
                }
            }
        );
    });
});
