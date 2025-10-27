// Google Sheets API Handler
const SHEET_ID = '13dyoOiEih13amADcAjGSlW1QhcqRe3At9hGmZkPXHew';
const SHEET_NAME = 'Sheet1'; // Hoặc tên sheet của bạn
const SHEET_RANGE = 'A1:Z100'; // Đọc toàn bộ

// Function để lấy dữ liệu từ Google Sheets (public sheet)
async function loadPriceTable() {
    try {
        // Sử dụng Google Sheets API public endpoint
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // Parse response (Google trả về JSONP format)
        const json = JSON.parse(text.substring(47).slice(0, -2));
        
        const table = json.table;
        const rows = table.rows;
        const cols = table.cols;
        
        // Tạo bảng HTML
        let htmlTable = '<div class="table-responsive"><table class="price-table">';
        
        // Header row
        if (rows.length > 0) {
            htmlTable += '<thead><tr>';
            rows[0].c.forEach(cell => {
                if (cell && cell.v) {
                    htmlTable += `<th>${cell.v}</th>`;
                } else {
                    htmlTable += '<th></th>';
                }
            });
            htmlTable += '</tr></thead>';
        }
        
        // Data rows
        htmlTable += '<tbody>';
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i] || !rows[i].c) continue;
            
            htmlTable += '<tr>';
            rows[i].c.forEach(cell => {
                if (cell && cell.v !== null && cell.v !== undefined) {
                    htmlTable += `<td>${cell.v}</td>`;
                } else {
                    htmlTable += '<td></td>';
                }
            });
            htmlTable += '</tr>';
        }
        htmlTable += '</tbody></table></div>';
        
        return htmlTable;
        
    } catch (error) {
        console.error('Error loading price table:', error);
        return `
            <div class="error-message">
                <p>⚠️ Không thể tải bảng giá tự động.</p>
                <p>Vui lòng <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=0#gid=0" target="_blank" class="btn btn-primary">Xem bảng giá tại đây</a></p>
            </div>
        `;
    }
}

// CSS cho bảng giá - Đẹp và cân đối
const priceTableStyles = `
<style>
.table-responsive {
    overflow-x: auto;
    margin: 2rem auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    border-radius: 15px;
    background: white;
    max-width: 1200px;
}

.price-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: white;
    border-radius: 15px;
    overflow: hidden;
    font-size: 0.95rem;
}

.price-table thead {
    background: linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%);
    color: white;
}

.price-table th {
    padding: 1.2rem 1.5rem;
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 4px solid #F5B041;
    white-space: nowrap;
}

.price-table th:first-child {
    text-align: left;
    border-radius: 15px 0 0 0;
}

.price-table th:last-child {
    border-radius: 0 15px 0 0;
}

.price-table tbody tr {
    border-bottom: 1px solid #e8f4f8;
    transition: all 0.3s ease;
}

.price-table tbody tr:hover {
    background: linear-gradient(90deg, #E8F4F8 0%, #FFF9E6 100%);
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.price-table tbody tr:last-child {
    border-bottom: none;
}

.price-table td {
    padding: 1rem 1.5rem;
    color: #2c3e50;
    text-align: center;
    vertical-align: middle;
    border-right: 1px solid #f0f0f0;
}

.price-table td:first-child {
    text-align: left;
    font-weight: 600;
    color: #2C5F8D;
    border-left: 4px solid transparent;
}

.price-table td:last-child {
    border-right: none;
}

.price-table tbody tr:hover td:first-child {
    border-left-color: #F5B041;
}

.price-table tbody tr:nth-child(odd) {
    background: #fafafa;
}

.price-table tbody tr:nth-child(even) {
    background: white;
}

/* Định dạng số tiền */
.price-table td:not(:first-child) {
    font-family: 'Courier New', monospace;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .price-table {
        font-size: 0.85rem;
    }
    
    .price-table th,
    .price-table td {
        padding: 0.8rem 0.5rem;
    }
    
    .price-table th {
        font-size: 0.9rem;
    }
}

.error-message {
    text-align: center;
    padding: 3rem;
    background: linear-gradient(135deg, #FFF9E6 0%, #FFE5B4 100%);
    border-radius: 15px;
    border: 2px solid #F5B041;
    margin: 2rem auto;
    max-width: 600px;
}

.error-message p {
    margin: 1rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.error-message .btn {
    margin-top: 1rem;
}
</style>
`;

// Export để sử dụng trong HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadPriceTable, priceTableStyles };
}
