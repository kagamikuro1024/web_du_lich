const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./hoi_an_tourism.db');

// Test login với admin/1
const testLogin = async () => {
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            db.close();
            return;
        }
        
        if (!user) {
            console.log('❌ User admin not found');
            db.close();
            return;
        }
        
        console.log('✅ User found:', {
            id: user.id,
            username: user.username,
            email: user.email,
            password_hash: user.password
        });
        
        // Test password
        const password = '1';
        const isMatch = await bcrypt.compare(password, user.password);
        
        console.log('\n🔐 Password test:');
        console.log('Input password:', password);
        console.log('Match result:', isMatch ? '✅ CORRECT' : '❌ WRONG');
        
        if (!isMatch) {
            console.log('\n🔧 Creating new password hash...');
            const newHash = await bcrypt.hash('1', 10);
            console.log('New hash:', newHash);
            
            db.run('UPDATE users SET password = ? WHERE username = ?', [newHash, 'admin'], (err) => {
                if (err) {
                    console.error('Error updating password:', err);
                } else {
                    console.log('✅ Password updated successfully!');
                }
                db.close();
            });
        } else {
            db.close();
        }
    });
};

testLogin();
