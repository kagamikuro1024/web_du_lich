// Placeholder Image Generator
// Thay thế các đường dẫn hình ảnh bằng SVG placeholder đẹp mắt

// Tạo SVG placeholder với gradient đẹp
function createPlaceholder(index, text) {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    ];
    
    const icons = [
        '🏔️ Hòa Bình',
        '🌊 Bãi Bùi',
        '💧 Thác Mu',
        '🌾 Đồi Thung',
        '🏡 Nhà Tôi',
        '🏠 Phòng nghỉ',
        '🍽️ Nhà hàng',
        '🏊 Hồ bơi',
        '🌳 Cảnh quan',
        '🌸 Thảo Nguyên'
    ];
    
    const gradient = gradients[index % gradients.length];
    const icon = icons[index] || text;
    
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
            <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:%23667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:%23764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect fill="url(%23grad${index})" width="800" height="600"/>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="60" font-family="Arial, sans-serif" dy=".3em">
            ${encodeURIComponent(icon)}
        </text>
    </svg>`;
}

// Thay thế tất cả hình ảnh bằng placeholder
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[src*="assets/images/"]');
    
    images.forEach((img, index) => {
        const originalSrc = img.src;
        const filename = originalSrc.split('/').pop();
        const imageIndex = parseInt(filename.match(/\d+/)?.[0] || 0) - 1;
        
        img.onerror = function() {
            this.src = createPlaceholder(imageIndex, img.alt || 'Hòa Bình');
            this.style.objectFit = 'cover';
        };
        
        // Trigger error if image doesn't exist
        const testImg = new Image();
        testImg.onerror = () => {
            img.src = createPlaceholder(imageIndex, img.alt || 'Hòa Bình');
        };
        testImg.src = originalSrc;
    });
});
