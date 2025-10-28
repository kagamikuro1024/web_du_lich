const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hoi_an_tourism.db');

console.log('🔧 Adding payment columns to bookings table...\n');

const columns = [
    { name: 'deposit_amount', type: 'REAL DEFAULT 0', desc: 'Số tiền đặt cọc (50%)' },
    { name: 'payment_status', type: 'TEXT DEFAULT "unpaid"', desc: 'Trạng thái thanh toán' },
    { name: 'payment_method', type: 'TEXT', desc: 'Phương thức thanh toán' },
    { name: 'paid_at', type: 'DATETIME', desc: 'Thời gian thanh toán' }
];

let completed = 0;

columns.forEach(col => {
    db.run(`ALTER TABLE bookings ADD COLUMN ${col.name} ${col.type}`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error(`❌ Error adding ${col.name}:`, err.message);
        } else if (!err) {
            console.log(`✅ Added column: ${col.name} - ${col.desc}`);
        } else {
            console.log(`ℹ️  Column ${col.name} already exists`);
        }
        
        completed++;
        if (completed === columns.length) {
            // Update existing bookings
            db.run(`UPDATE bookings SET deposit_amount = total_price * 0.5, payment_status = 'unpaid' WHERE deposit_amount = 0 OR deposit_amount IS NULL`, (err) => {
                if (err) {
                    console.error('❌ Error updating existing bookings:', err);
                } else {
                    console.log('✅ Updated existing bookings with deposit amounts');
                }
                console.log('\n🎉 Database schema updated successfully!');
                db.close();
            });
        }
    });
});
