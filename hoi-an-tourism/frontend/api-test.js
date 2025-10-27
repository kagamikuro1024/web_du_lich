// Test API connectivity script
// Copy and paste this into browser console to test API

async function testAPI() {
    console.log('🧪 Testing API connectivity...');
    
    // Auto-detect API URL
    const API_BASE_URL = window.location.hostname.includes('ngrok') 
        ? `${window.location.protocol}//${window.location.host}/api`
        : 'http://localhost:3000/api';
    
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    try {
        // Test 1: Register new user
        console.log('Test 1: Registering test user...');
        const registerResponse = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser_' + Date.now(),
                email: 'test_' + Date.now() + '@example.com',
                password: 'password123'
            })
        });
        
        console.log('Register Response Status:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('Register Response Data:', registerData);
        
        if (registerResponse.ok) {
            console.log('✅ Registration successful!');
            
            // Test 2: Login with created user
            console.log('Test 2: Testing login...');
            const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registerData.user.email,
                    password: 'password123'
                })
            });
            
            console.log('Login Response Status:', loginResponse.status);
            const loginData = await loginResponse.json();
            console.log('Login Response Data:', loginData);
            
            if (loginResponse.ok) {
                console.log('✅ Login successful!');
                console.log('🎉 API is working correctly!');
                
                // Test 3: Test protected route
                console.log('Test 3: Testing protected route...');
                const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                console.log('Profile Response Status:', profileResponse.status);
                const profileData = await profileResponse.json();
                console.log('Profile Response Data:', profileData);
                
                if (profileResponse.ok) {
                    console.log('✅ Protected route working!');
                } else {
                    console.log('❌ Protected route failed');
                }
                
            } else {
                console.log('❌ Login failed:', loginData.message);
            }
        } else {
            console.log('❌ Registration failed:', registerData.message);
        }
        
    } catch (error) {
        console.error('❌ API Test Error:', error);
        console.log('Possible issues:');
        console.log('1. Server not running');
        console.log('2. CORS not configured properly');
        console.log('3. Network connectivity issues');
        console.log('4. Wrong API URL');
    }
}

// Auto-run test
testAPI();

// Instructions
console.log(`
🔧 API DEBUG INSTRUCTIONS:

1. Open browser console (F12)
2. Paste this entire script and press Enter
3. Check the results:
   - ✅ Green checkmarks = API working
   - ❌ Red X marks = Issues found

4. If API fails:
   - Check server is running: node server.js
   - Check console for CORS errors
   - Verify API URL is correct
   - Try refreshing the page

5. Manual test:
   - Try registering on the website
   - Check browser Network tab for failed requests
`);

// Export for manual use
window.testAPI = testAPI;