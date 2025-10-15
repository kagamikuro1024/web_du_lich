# HƯỚNG DẪN CHI TIẾT: SETUP NGROK TỪNG BƯỚC

## 🎯 **MỤC TIÊU:** Chia sẻ website localhost cho cả lớp truy cập

---

## 📋 **BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN NGROK**

### 1.1. Truy cập website ngrok:
- Mở browser và vào: **https://ngrok.com/**
- Click nút **"Sign up"** góc phải trên

### 1.2. Tạo tài khoản (chọn 1 cách):
**Cách 1 - Đăng ký bằng Google (Khuyến nghị):**
- Click "Sign up with Google"
- Chọn tài khoản Gmail của bạn
- Cho phép ngrok truy cập

**Cách 2 - Đăng ký bằng GitHub:**
- Click "Sign up with GitHub"  
- Đăng nhập GitHub và authorize

**Cách 3 - Đăng ký thủ công:**
- Điền Email, Password
- Xác nhận email trong hộp thư

### 1.3. Xác nhận đăng ký:
- Check email để verify account (nếu đăng ký thủ công)
- Đăng nhập vào dashboard ngrok

---

## 📋 **BƯỚC 2: TẢI VÀ CÀI ĐẶT NGROK**

### 2.1. Tải ngrok cho Windows:
- Trong dashboard ngrok, click **"Download"**
- Chọn **"Windows (x86_64)"**
- File tải về: `ngrok.exe` (khoảng 15MB)

### 2.2. Tạo thư mục cho ngrok:
```powershell
# Tạo thư mục C:\ngrok
New-Item -ItemType Directory -Path "C:\ngrok" -Force

# Copy file ngrok.exe vào thư mục này
# (Kéo thả file từ Downloads vào C:\ngrok\)
```

### 2.3. Kiểm tra ngrok hoạt động:
```powershell
# Mở PowerShell và test:
C:\ngrok\ngrok.exe version
# Kết quả: ngrok version 3.x.x
```

---

## 📋 **BƯỚC 3: LẤY AUTH TOKEN**

### 3.1. Truy cập trang Auth Token:
- Đăng nhập https://dashboard.ngrok.com/
- Click **"Your Authtoken"** trong menu bên trái
- Hoặc trực tiếp: https://dashboard.ngrok.com/get-started/your-authtoken

### 3.2. Copy Auth Token:
Bạn sẽ thấy màn hình như này:
```
Your Authtoken

Copy your authtoken and run this command:

./ngrok authtoken 2abc123def456ghi789jkl_xyz789ABC123defGHI456jkl

Token: 2abc123def456ghi789jkl_xyz789ABC123defGHI456jkl
```

**COPY TOÀN BỘ TOKEN** (dài khoảng 50 ký tự)

### 3.3. Nhập token vào ngrok:
```powershell
# Thay YOUR_TOKEN_HERE bằng token vừa copy:
C:\ngrok\ngrok.exe authtoken YOUR_TOKEN_HERE

# Ví dụ thực tế:
C:\ngrok\ngrok.exe authtoken 2abc123def456ghi789jkl_xyz789ABC123defGHI456jkl
```

### 3.4. Xác nhận thành công:
Bạn sẽ thấy thông báo:
```
Authtoken saved to configuration file: C:\Users\YourName\.ngrok2\ngrok.yml
```

---

## 📋 **BƯỚC 4: CHẠY WEBSITE VÀ CHIA SẺ**

### 4.1. Chuẩn bị 2 cửa sổ PowerShell:

**PowerShell 1 - Chạy website:**
```powershell
# Vào thư mục backend
cd "d:\gitHub\web_du_lich\hoi-an-tourism\backend"

# Chạy server
node server.js

# Thấy thông báo:
# Server is running on http://localhost:3000
# Connected to SQLite database
```

**PowerShell 2 - Chạy ngrok:**
```powershell
# Chạy ngrok (KHÔNG tắt PowerShell 1)
C:\ngrok\ngrok.exe http 3000
```

### 4.2. Lấy Public URL từ ngrok:
Sau khi chạy ngrok, bạn sẽ thấy:
```
ngrok                                                          

Session Status                online
Account                       your-email@gmail.com (Plan: Free)
Version                       3.5.0
Region                        Asia Pacific (ap)
Latency                       25ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1a2b-3c4d-5e6f.ngrok.io -> http://localhost:3000
Forwarding                    http://1a2b-3c4d-5e6f.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**🎯 COPY LINK HTTPS:** `https://1a2b-3c4d-5e6f.ngrok.io`

### 4.3. Test link trước khi gửi:
- Mở browser mới
- Dán link ngrok và truy cập
- Kiểm tra website hoạt động bình thường
- Test trên điện thoại (dùng 4G, không dùng WiFi nhà)

---

## 📋 **BƯỚC 5: GỬI LINK CHO CẢ LỚP**

### 5.1. Template tin nhắn gửi lớp:
```
🏮 DEMO WEBSITE DU LỊCH HỘI AN 🏮

Chào các bạn! Website của mình đã LIVE và sẵn sàng demo:

🔗 LINK TRUY CẬP: https://1a2b-3c4d-5e6f.ngrok.io
(Thay bằng link thật của bạn)

👤 TÀI KHOẢN DEMO:
Email: demo@hoian.com
Password: 123456

📱 HƯỚNG DẪN SỬ DỤNG:
1. Truy cập link trên
2. Click "Login" → "Register here" để tạo tài khoản
3. Vào "Hotels" để xem và đặt phòng
4. Trải nghiệm trên cả điện thoại và máy tính

⏰ Website sẽ hoạt động trong suốt buổi học hôm nay!

#DemoWebsite #HoiAnTourism
```

### 5.2. Gửi vào các kênh:
- ✅ Group chat lớp (Zalo/Facebook)
- ✅ Email lớp (nếu có)
- ✅ Thông báo trực tiếp trong lớp

---

## 🚨 **TROUBLESHOOTING - XỬ LÝ LỖI THƯỜNG GẶP**

### ❌ **Lỗi: "command not found" hoặc "not recognized"**
**Nguyên nhân:** Chưa vào đúng thư mục hoặc chưa copy file ngrok.exe

**Giải pháp:**
```powershell
# Kiểm tra file có tồn tại:
Test-Path "C:\ngrok\ngrok.exe"
# Kết quả phải là: True

# Nếu False, tải lại ngrok và copy vào C:\ngrok\
```

### ❌ **Lỗi: "authtoken not found"**
**Nguyên nhân:** Chưa setup auth token hoặc token sai

**Giải pháp:**
```powershell
# Lấy token mới từ: https://dashboard.ngrok.com/get-started/your-authtoken
# Chạy lại lệnh authtoken với token mới
C:\ngrok\ngrok.exe authtoken [new-token-here]
```

### ❌ **Lỗi: "failed to connect to localhost:3000"**
**Nguyên nhân:** Server website chưa chạy

**Giải pháp:**
```powershell
# Đảm bảo server đang chạy trong PowerShell khác:
cd "d:\gitHub\web_du_lich\hoi-an-tourism\backend"
node server.js
# Phải thấy: "Server is running on http://localhost:3000"
```

### ❌ **Lỗi: "tunnel not found"**
**Nguyên nhân:** Đường truyền mạng không ổn định

**Giải pháp:**
```powershell
# Restart ngrok:
# Tắt ngrok (Ctrl+C)
# Chạy lại: C:\ngrok\ngrok.exe http 3000
```

### ❌ **Link ngrok không truy cập được từ bên ngoài**
**Nguyên nhân:** Firewall Windows chặn

**Giải pháp:**
1. Vào Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Click "Change settings" → "Allow another app"
4. Browse và chọn `ngrok.exe`
5. Cho phép cả Private và Public networks

---

## 💡 **TIPS VÀ LƯU Ý QUAN TRỌNG**

### ✅ **Những điều cần nhớ:**
- **Giữ 2 PowerShell chạy:** 1 cho server, 1 cho ngrok
- **Không tắt máy tính:** Link ngrok sẽ mất nếu tắt máy
- **Link thay đổi mỗi lần restart:** Nên khởi động ngrok 1 lần duy nhất
- **Tốc độ có thể chậm:** Do đi qua server ngrok ở Singapore/US
- **Miễn phí có giới hạn:** 1 tunnel cùng lúc, băng thông hạn chế

### ✅ **Backup plan nếu ngrok lỗi:**
- **Plan B:** Sử dụng IP local nếu cùng WiFi trường
- **Plan C:** Screenshots + video demo offline
- **Plan D:** Deploy lên Vercel/Netlify (frontend only)

### ✅ **Tối ưu trải nghiệm:**
- Test link trước khi gửi lớp 30 phút
- Tạo sẵn 3-4 tài khoản demo
- Có screenshots backup phòng khi link chậm
- Chuẩn bị giải thích cách hoạt động của ngrok

---

## 🎉 **HOÀN TẤT!**

Sau khi làm theo hướng dẫn này, bạn sẽ có:
- ✅ Website chạy trên internet, ai cũng truy cập được
- ✅ Link ổn định trong suốt buổi thuyết trình  
- ✅ Cả lớp có thể test cùng lúc
- ✅ Ấn tượng với thầy/cô và bạn bè

**Chúc bạn thành công! 🚀**