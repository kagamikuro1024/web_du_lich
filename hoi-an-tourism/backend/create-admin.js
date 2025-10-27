const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to database
const db = new sqlite3.Database('./hoi_an_tourism.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to database');
    }
});

// Create admin account
async function createAdmin() {
    const username = 'admin';
    const email = 'admin@khudulich.com';
    const password = '1';
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if admin already exists
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.error('Error checking admin:', err.message);
                db.close();
                process.exit(1);
            }
            
            if (row) {
                console.log('Admin account already exists!');
                console.log('Username: admin');
                console.log('Email:', row.email);
                db.close();
            } else {
                // Insert admin account
                db.run(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, hashedPassword],
                    function(err) {
                        if (err) {
                            console.error('Error creating admin:', err.message);
                            db.close();
                            process.exit(1);
                        }
                        
                        console.log('✅ Admin account created successfully!');
                        console.log('Username: admin');
                        console.log('Password: 1');
                        console.log('Email:', email);
                        console.log('User ID:', this.lastID);
                        
                        db.close();
                    }
                );
            }
        });
    } catch (error) {
        console.error('Error:', error);
        db.close();
        process.exit(1);
    }
}

createAdmin();
