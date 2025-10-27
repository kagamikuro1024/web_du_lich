const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hoi_an_tourism.db');

console.log('🔧 Updating bookings table schema...\n');

// Add status column if not exists
db.run(`ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding status column:', err.message);
    } else if (!err) {
        console.log('✅ Added status column');
    }
    
    // Add name column
    db.run(`ALTER TABLE bookings ADD COLUMN name TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding name column:', err.message);
        } else if (!err) {
            console.log('✅ Added name column');
        }
        
        // Add email column
        db.run(`ALTER TABLE bookings ADD COLUMN email TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error('Error adding email column:', err.message);
            } else if (!err) {
                console.log('✅ Added email column');
            }
            
            // Add phone column
            db.run(`ALTER TABLE bookings ADD COLUMN phone TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    console.error('Error adding phone column:', err.message);
                } else if (!err) {
                    console.log('✅ Added phone column');
                }
                
                // Add checkin_date column
                db.run(`ALTER TABLE bookings ADD COLUMN checkin_date TEXT`, (err) => {
                    if (err && !err.message.includes('duplicate column')) {
                        console.error('Error adding checkin_date column:', err.message);
                    } else if (!err) {
                        console.log('✅ Added checkin_date column');
                    }
                    
                    // Add checkout_date column
                    db.run(`ALTER TABLE bookings ADD COLUMN checkout_date TEXT`, (err) => {
                        if (err && !err.message.includes('duplicate column')) {
                            console.error('Error adding checkout_date column:', err.message);
                        } else if (!err) {
                            console.log('✅ Added checkout_date column');
                        }
                        
                        // Add num_rooms column
                        db.run(`ALTER TABLE bookings ADD COLUMN num_rooms INTEGER DEFAULT 1`, (err) => {
                            if (err && !err.message.includes('duplicate column')) {
                                console.error('Error adding num_rooms column:', err.message);
                            } else if (!err) {
                                console.log('✅ Added num_rooms column');
                            }
                            
                            // Update existing records with default status
                            db.run(`UPDATE bookings SET status = 'pending' WHERE status IS NULL`, (err) => {
                                if (err) {
                                    console.error('Error updating status:', err.message);
                                } else {
                                    console.log('✅ Updated existing bookings with default status');
                                }
                                
                                // Copy check_in_date to checkin_date
                                db.run(`UPDATE bookings SET checkin_date = check_in_date WHERE checkin_date IS NULL`, (err) => {
                                    if (err) {
                                        console.error('Error copying checkin_date:', err.message);
                                    } else {
                                        console.log('✅ Copied check_in_date to checkin_date');
                                    }
                                    
                                    // Copy check_out_date to checkout_date
                                    db.run(`UPDATE bookings SET checkout_date = check_out_date WHERE checkout_date IS NULL`, (err) => {
                                        if (err) {
                                            console.error('Error copying checkout_date:', err.message);
                                        } else {
                                            console.log('✅ Copied check_out_date to checkout_date');
                                        }
                                        
                                        console.log('\n🎉 Database schema updated successfully!');
                                        db.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
