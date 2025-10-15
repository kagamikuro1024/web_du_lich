# HƯỚNG DẪN CHIA SẺ WEBSITE CHO CẢ LỚP

## 🌐 **CÁCH CHIA SẺ WEBSITE CHO BẠN LỚP (MIỄN PHÍ)**

### **Phương pháp 1: Sử dụng ngrok (Khuyến nghị) - MIỄN PHÍ**

#### Bước 1: Tải ngrok
1. Truy cập: https://ngrok.com/
2. Đăng ký tài khoản miễn phí
3. Tải ngrok cho Windows
4. Giải nén vào thư mục (ví dụ: C:\ngrok\)

#### Bước 2: Lấy Auth Token từ ngrok
1. **Đăng ký tài khoản ngrok:**
   - Truy cập: https://ngrok.com/
   - Click "Sign up" để tạo tài khoản miễn phí
   - Có thể đăng ký bằng Google/GitHub cho nhanh

2. **Lấy Auth Token:**
   - Sau khi đăng nhập, truy cập: https://dashboard.ngrok.com/get-started/your-authtoken
   - Hoặc click "Your Authtoken" trong dashboard
   - Copy token (dạng: `2abc123def456ghi789jkl0mnop1qrs2_3stuv4wxyz5ABCDE6FGHIJ`)

3. **Setup ngrok với token:**
```bash
# Mở PowerShell và chạy (thay YOUR_ACTUAL_TOKEN bằng token vừa copy):
C:\ngrok\ngrok.exe authtoken 2abc123def456ghi789jkl0mnop1qrs2_3stuv4wxyz5ABCDE6FGHIJ

# Ví dụ token thật sẽ trông như thế này:
# C:\ngrok\ngrok.exe authtoken 2NzI2YjFhM18xNjQ5ODQ3NzA1XzJjNGU3YjMwNjBhNGQ1ZGY2YjRiYjc5NGQ5YzFkZGQ2
```

**Lưu ý:** Token này là miễn phí và không giới hạn thời gian!

#### Bước 3: Xác nhận setup thành công
Sau khi chạy lệnh authtoken, bạn sẽ thấy thông báo:
```
Authtoken saved to configuration file: C:\Users\[username]\.ngrok2\ngrok.yml
```

#### Bước 4: Chạy website + ngrok
```bash
# Terminal 1: Chạy server
cd "d:\gitHub\web_du_lich\hoi-an-tourism\backend"
node server.js

# Terminal 2: Tạo public URL
C:\ngrok\ngrok.exe http 3000
```

#### Bước 5: Lấy link public
Khi chạy `ngrok http 3000`, bạn sẽ thấy màn hình như này:
```
ngrok by @inconshreveable

Session Status                online
Account                       [your-email] (Plan: Free)
Version                       3.0.0
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok.io -> http://localhost:3000
Forwarding                    http://abc123-def456.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**COPY LINK HTTPS:** `https://abc123-def456.ngrok.io` 

**GỬI LINK NÀY CHO CẢ LỚP!** 🎉

⚠️ **Lưu ý quan trọng:**
- Link này chỉ hoạt động khi máy tính của bạn BẬT và server đang chạy
- Mỗi lần restart ngrok, link sẽ thay đổi (trừ khi upgrade plan trả phí)
- Tốc độ có thể chậm hơn localhost do đi qua server ngrok

---

### **Phương pháp 2: Sử dụng Vercel (Deploy miễn phí)**

#### Bước 1: Chuẩn bị code
1. Push code lên GitHub
2. Đăng ký Vercel: https://vercel.com/

#### Bước 2: Deploy
1. Connect GitHub repository
2. Deploy frontend tự động
3. Lấy URL: `https://your-project.vercel.app`

---

### **Phương pháp 3: Local Network (Cùng WiFi)**

#### Kiểm tra IP máy tính:
```bash
ipconfig
# Tìm dòng IPv4 Address: 192.168.x.x
```

#### Link cho bạn lớp:
`http://192.168.x.x:3000`
(Thay x.x bằng IP thực tế của bạn)

**Lưu ý:** Chỉ hoạt động khi cùng mạng WiFi

---

## 📱 **HƯỚNG DẪN CHO BẠN LỚP SỬ DỤNG WEBSITE**

### **Link truy cập:** 
`[Điền link ngrok hoặc Vercel của bạn]`

### **Tài khoản demo:**
- **Username:** demo_user
- **Email:** demo@hoian.com  
- **Password:** 123456

### **Hướng dẫn sử dụng:**

#### 1. **Đăng ký tài khoản mới:**
- Click "Login" ở góc phải
- Chọn "Register here" 
- Điền thông tin và đăng ký

#### 2. **Xem thông tin khách sạn:**
- Click "Hotels" trên menu
- Xem 6 khách sạn có sẵn
- Đọc thông tin chi tiết

#### 3. **Đặt phòng (yêu cầu đăng nhập):**
- Chọn khách sạn và click "Book Now"
- Chọn ngày check-in/check-out
- Chọn số khách
- Hoàn tất đặt phòng

#### 4. **Xem lịch sử booking:**
- Click tên user ở góc phải
- Xem danh sách booking đã tạo

#### 5. **Khám phá điểm du lịch:**
- Click "Attractions"
- Đọc thông tin các địa điểm nổi tiếng Hội An

---

## 🎯 **CHUẨN BỊ CHO BUỔI THUYẾT TRÌNH**

### **Checklist trước khi trình bày:**

#### ✅ **Technical Setup:**
- [ ] Server chạy ổn định
- [ ] Database có dữ liệu demo
- [ ] Ngrok/Public URL hoạt động
- [ ] Test trên mobile/desktop
- [ ] Backup plan (localhost nếu internet lỗi)

#### ✅ **Presentation Materials:**
- [ ] PowerPoint slides (từ outline đã tạo)
- [ ] Báo cáo in giấy cho GV
- [ ] Link website gửi nhóm chat lớp
- [ ] Tài khoản demo sẵn sàng
- [ ] Screenshots để backup

#### ✅ **Demo Script:**
1. **Giới thiệu** (2 phút): Mục tiêu và công nghệ
2. **Demo trực tiếp** (5 phút): 
   - Trang chủ → Hotels → Đăng ký → Đặt phòng
   - Mobile responsive
3. **Code review** (3 phút): Highlight key features
4. **Q&A** (2-3 phút)

---

## 💡 **TIPS THUYẾT TRÌNH HIỆU QUẢ**

### **Trước buổi thuyết trình:**
- Gửi link vào group chat lớp 30 phút trước
- Nhờ 2-3 bạn test trước để đảm bảo hoạt động
- Chuẩn bị câu hỏi có thể được hỏi

### **Trong buổi thuyết trình:**
- Bắt đầu bằng demo trực tiếp để thu hút
- Giải thích code quan trọng (authentication, booking)
- Nhấn mạnh responsive design và UX
- Show database structure và security features

### **Câu hỏi thường gặp:**
- **"Làm thế nào để deploy?"** → Giải thích ngrok/Vercel
- **"Database lưu ở đâu?"** → SQLite local, có thể migrate
- **"Security như thế nào?"** → JWT, bcrypt, validation
- **"Responsive không?"** → Demo trên mobile ngay

---

## 📋 **TEMPLATE THÔNG BÁO GỬI LỚP**

```
🏮 DEMO WEBSITE DU LỊCH HỘI AN 🏮

Chào các bạn! Mình vừa hoàn thành dự án website du lịch Hội An với đầy đủ tính năng:

🌟 TÍNH NĂNG CHÍNH:
✅ Đăng ký/Đăng nhập an toàn  
✅ Đặt phòng khách sạn online
✅ Xem điểm du lịch Hội An
✅ Responsive trên mọi thiết bị

🔗 LINK TRẢI NGHIỆM: 
[Điền link của bạn]

👤 TÀI KHOẢN DEMO:
- Email: demo@hoian.com
- Password: 123456

📱 Các bạn có thể truy cập bằng điện thoại hoặc máy tính để test nhé!

#WebDuLich #HoiAn #FullStack #Demo
```

---

## 🎉 **KẾT QUẢ MONG ĐỢI**

Sau khi làm theo hướng dẫn này, bạn sẽ có:

1. ✅ **PowerPoint slides** cho presentation
2. ✅ **Báo cáo chi tiết** để in và nộp GV  
3. ✅ **Public URL** để cả lớp truy cập
4. ✅ **Demo script** để thuyết trình tự tin
5. ✅ **Backup plan** phòng trường hợp lỗi

**Chúc bạn thuyết trình thành công! 🚀**