// Pricing Table for Khu Sinh Thái Nhà Tôi Hòa Bình
// Theo Google Sheet: https://docs.google.com/spreadsheets/d/1rAJM6IqwxhV441IQexNpboOOAC3VMTkocWOXXzA7Ens

document.addEventListener('DOMContentLoaded', function() {
    loadPricingTable();
    setupBookingForm();
});

function loadPricingTable() {
    const container = document.getElementById('priceTableContainer');
    if (!container) return;

    const pricingHTML = `
        <style>
            .pricing-section {
                margin-bottom: 2rem;
                border: 2px solid #ddd;
                border-radius: 10px;
                overflow: hidden;
                background: white;
            }
            
            .pricing-header {
                background: linear-gradient(135deg, #F5B041 0%, #F39C12 100%);
                color: white;
                padding: 1rem;
                text-align: center;
                font-size: 1.3rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .pricing-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .pricing-table th {
                background: linear-gradient(135deg, #4A90E2, #2C5F8D);
                color: white;
                padding: 1rem;
                text-align: center;
                font-weight: 600;
                border: 1px solid #ddd;
            }
            
            .pricing-table td {
                padding: 0.8rem;
                border: 1px solid #ddd;
                text-align: center;
            }
            
            .pricing-table tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            .pricing-table tr:hover {
                background: #E8F4F8;
            }
            
            .pricing-table td:first-child {
                text-align: left;
                font-weight: 600;
                color: #2C5F8D;
            }
            
            .price-highlight {
                color: #E74C3C;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .pricing-note {
                background: #FFF9E6;
                padding: 1rem;
                border-top: 2px solid #F5B041;
                font-style: italic;
                color: #666;
                font-size: 0.9rem;
            }
            
            .room-type-header {
                background: #E8F4F8 !important;
                color: #2C5F8D !important;
                font-weight: bold;
                text-align: left !important;
                padding-left: 1rem !important;
            }
            
            @media (max-width: 768px) {
                .pricing-table {
                    font-size: 0.85rem;
                }
                
                .pricing-table th,
                .pricing-table td {
                    padding: 0.5rem;
                }
                
                .pricing-header {
                    font-size: 1.1rem;
                }
            }
        </style>

        <!-- VÉ THAM QUAN -->
        <div class="pricing-section">
            <div class="pricing-header">🎫 VÉ THAM QUAN</div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>Loại vé</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Người lớn (Trên 1.3m)</td>
                        <td><span class="price-highlight">100,000 đ</span></td>
                    </tr>
                    <tr>
                        <td>Trẻ em (Từ 1m - 1.3m)</td>
                        <td><span class="price-highlight">50,000 đ</span></td>
                    </tr>
                    <tr>
                        <td>Trẻ em dưới 1m</td>
                        <td><span class="price-highlight">Miễn phí</span></td>
                    </tr>
                    <tr>
                        <td>Người cao tuổi (Từ 80 tuổi)</td>
                        <td><span class="price-highlight">Miễn phí</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="pricing-note">
                <strong>Lưu ý:</strong> Miễn vé vào cổng áp dụng khách lưu trú qua đêm phòng đơn và phòng đôi<br>
                <strong>Khách lưu trú qua đêm phòng cộng đồng có mua vé vào cổng</strong>
            </div>
        </div>

        <!-- DỊCH VỤ PHÁT SINH -->
        <div class="pricing-section">
            <div class="pricing-header">🎯 DỊCH VỤ PHÁT SINH NGOÀI VÉ THAM QUAN</div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Dịch vụ</th>
                        <th>Giá</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Vé xe điện</td>
                        <td><span class="price-highlight">20,000 đ / 1 lượt/ khách</span></td>
                        <td>Xe đón tại Lầu đài lên đỉnh núi hoặc ngược lại<br>Giờ hoạt động: 07:30 - 11h30; 13h30 - 17:30</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Vé trượt pháo</td>
                        <td><span class="price-highlight">30,000 đ /lượt</span></td>
                        <td>Giờ hoạt động: 07:30 - 11h30; 13h30 - 17:30</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- GIÁ PHÒNG TÒA LẦU ĐÀI -->
        <div class="pricing-section">
            <div class="pricing-header">🏰 GIÁ PHÒNG TRONG NGÀY TÒA LẦU ĐÀI</div>
            <div class="pricing-note" style="border-top: none; border-bottom: 2px solid #F5B041;">
                <strong>Áp dụng:</strong> Phòng sau 12h, trả phòng 17h
            </div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>Loại phòng</th>
                        <th>Phòng đơn (SL: 5)</th>
                        <th>Phòng đôi (SL: 3)</th>
                        <th>Phòng cộng đồng (SL: 1)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="room-type-header" colspan="4">Mô tả</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            - 1 giường 1.8m x 2m<br>
                            - Tiêu chuẩn 2 khách người lớn = 1 trẻ em dưới 5 tuổi
                        </td>
                        <td>
                            - 02 giường 1.8m x 2.0m<br>
                            - Tiêu chuẩn 4 khách người lớn = 2 trẻ em dưới 5 tuổi
                        </td>
                        <td>
                            - 12 đệm đôi<br>
                            - Tiêu chuẩn 25 khách người lớn
                        </td>
                    </tr>
                    <tr>
                        <td>Phòng nghỉ trưa 3 tiếng</td>
                        <td><span class="price-highlight">500,000 đ</span></td>
                        <td><span class="price-highlight">800,000 đ</span></td>
                        <td><span class="price-highlight">2,500,000</span></td>
                    </tr>
                    <tr>
                        <td>Phát sinh 01 người (Không kể đêm phụ)</td>
                        <td><span class="price-highlight">200,000 đ</span></td>
                        <td><span class="price-highlight">200,000 đ</span></td>
                        <td><span class="price-highlight">100,000</span></td>
                    </tr>
                    <tr>
                        <td>Trẻ em dưới 5 tuổi</td>
                        <td colspan="3"><span class="price-highlight">Miễn phí</span></td>
                    </tr>
                    <tr>
                        <td>Điểm phụ</td>
                        <td colspan="3"><span class="price-highlight">200,000 đêm</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- KHU PHÒNG CỘNG ĐỒNG -->
        <div class="pricing-section">
            <div class="pricing-header">🏡 KHU PHÒNG CỘNG ĐỒNG</div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th rowspan="2">Loại phòng</th>
                        <th colspan="2">KHU A</th>
                        <th colspan="2">KHU B</th>
                    </tr>
                    <tr>
                        <th>Tổng khách (40)</th>
                        <th>Giá</th>
                        <th>Tổng khách (73)</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Phòng 1</td>
                        <td>20</td>
                        <td>Nghỉ trưa <span class="price-highlight">2,000,000đ</span>;<br>qua đêm <span class="price-highlight">4,000,000đ</span></td>
                        <td>25</td>
                        <td>Nghỉ trưa <span class="price-highlight">2,500,000đ</span>;<br>qua đêm <span class="price-highlight">5,000,000đ</span></td>
                    </tr>
                    <tr>
                        <td>Phòng 2</td>
                        <td>20</td>
                        <td>Nghỉ trưa <span class="price-highlight">2,000,000đ</span>;<br>qua đêm <span class="price-highlight">4,000,000đ</span></td>
                        <td>12</td>
                        <td>Nghỉ trưa <span class="price-highlight">1,200,000đ</span>;<br>qua đêm <span class="price-highlight">2,400,000đ</span></td>
                    </tr>
                    <tr>
                        <td>Phòng 3</td>
                        <td>-</td>
                        <td>-</td>
                        <td>12</td>
                        <td>Nghỉ trưa <span class="price-highlight">1,200,000đ</span>;<br>qua đêm <span class="price-highlight">2,400,000đ</span></td>
                    </tr>
                    <tr>
                        <td>Phòng 4</td>
                        <td>-</td>
                        <td>-</td>
                        <td>12</td>
                        <td>Nghỉ trưa <span class="price-highlight">1,200,000đ</span>;<br>qua đêm <span class="price-highlight">2,400,000đ</span></td>
                    </tr>
                    <tr>
                        <td>Phòng 5</td>
                        <td>-</td>
                        <td>-</td>
                        <td>12</td>
                        <td>Nghỉ trưa <span class="price-highlight">1,200,000đ</span>;<br>qua đêm <span class="price-highlight">2,400,000đ</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="pricing-note">
                <strong>Lưu ý:</strong> Phát sinh khách ngoài tiêu chuẩn phụ thu <strong>100,000đ</strong> khách trong ngày; <strong>200,000đ</strong> khách qua đêm (miễn phụ thu trẻ em dưới 5 tuổi)<br>
                <em>Khách qua đêm nhận phòng sau 12h, trả phòng 17h</em><br>
                <em>Sách trong ngày: nhận phòng sau 12h, trả phòng 17h</em>
            </div>
        </div>

        <!-- CÁC TIỆN ÍCH BỔ SUNG -->
        <div class="pricing-section">
            <div class="pricing-header">⭐ CÁC TIỆN ÍCH BỔ SUNG</div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Dịch vụ</th>
                        <th>Đơn vị tính</th>
                        <th>Phí dịch vụ (VNĐ)</th>
                        <th>Lưu ý</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Ăn thanh tổ chức trại (Team Gala)</td>
                        <td>Cái</td>
                        <td><span class="price-highlight">2,500,000</span></td>
                        <td>6 loa, mixer, kỹ thuật treo, đèn led, màn treo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Loa kéo + mic</td>
                        <td>Giờ</td>
                        <td><span class="price-highlight">200,000</span></td>
                        <td>500,000đ/ 1 buổi</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Gói Teambuilding (Mc, Loa kéo, Dụng cụ tổ chức)</td>
                        <td>Buổi</td>
                        <td><span class="price-highlight">Từ 4,000,000 trở lên</span></td>
                        <td>Tùy theo số lượng và yêu cầu của khách</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>MC Club Dinner</td>
                        <td>Buổi</td>
                        <td><span class="price-highlight">2,000,000</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Đốt lửa trại</td>
                        <td>Đoàn</td>
                        <td><span class="price-highlight">800,000</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Đốt văn nghệ bản Mường</td>
                        <td>Chương trình</td>
                        <td><span class="price-highlight">2,500,000</span></td>
                        <td>Múa, nhảy sáp</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>In & treo backdrop</td>
                        <td>3m x 5m</td>
                        <td><span class="price-highlight">1,200,000</span></td>
                        <td>Khách hàng design và gửi file trước 3 ngày</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Phí phục vụ mang đồ ăn vào</td>
                        <td>Bàn</td>
                        <td><span class="price-highlight">300,000</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Phí phục vụ mang đồ uống vào</td>
                        <td>Bàn</td>
                        <td><span class="price-highlight">60,000</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Phí set up tổ chức ngoài trời</td>
                        <td>Đoàn dưới 50 khách</td>
                        <td><span class="price-highlight">2,000,000</span></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- QUY ĐỊNH HOÀN HỦY -->
        <div class="pricing-section">
            <div class="pricing-header">📋 HƯỚNG DẪN ĐẶT PHÒNG VÀ QUY ĐỊNH HOÀN HỦY DỊCH VỤ</div>
            <div class="pricing-note" style="border-top: none;">
                <strong>Đặt với khách qua đêm:</strong> Thời gian nhận phòng sau 12h; thời gian trả phòng 11h<br><br>
                <strong>Đặt với khách đến nghỉ trưa:</strong> Thời gian nhận phòng sau 12h; thời gian trả phòng 17h<br><br>
                <strong>Bảo giá chưa bao gồm thuế VAT</strong><br><br>
                <strong>Quy định đặt cọc trước ngày khách hành đối thiểu 50% giá trị booking:</strong> khách tốt lưu sinh thái sẽ thành toán 100% tiền bill<br><br>
                <strong>Khách hàng vui lòng không hút thuốc trong phòng; không sử dụng đồ ăn trong phòng</strong><br><br>
                
                <div style="margin-top: 1rem; padding: 1rem; background: #FFE5E5; border-radius: 5px; border-left: 4px solid #E74C3C;">
                    <strong style="color: #E74C3C;">QUY ĐỊNH HOÀN HỦY DỊCH VỤ:</strong><br>
                    • <strong>Hủy dịch vụ trước 05 ngày khởi hành:</strong> Miễn phí<br>
                    • <strong>Hủy dịch vụ dưới 05 ngày khởi hành:</strong> Thu 100% chi phí đã đặt cọc<br>
                    • <strong>Hoàn dịch vụ trước 05 ngày khởi hành:</strong> Miễn phí
                </div>
            </div>
        </div>
    `;

    container.innerHTML = pricingHTML;
}

function setupBookingForm() {
    // Form will be handled in the HTML section
    console.log('Booking form setup complete');
}
