const categories = [
    'indo', "film", "quote", 'islamicQuote', 'beauty', 'coffee', 'friendship', 'habits', 'happiness', 'life',
    'loneliness', 'love', 'marriage', 'night', 'risk', 'sadness',
    'sport', 'success', 'travel'
];
const categorySelect = document.getElementById('category');
const fontSelect = document.getElementById('font');
const bgStyleSelect = document.getElementById('bgStyle');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const toggleSizeBtn = document.getElementById('toggle-size-btn');
const toggleCustomMenuBtn = document.getElementById('toggle-custom-menu');
const customMenu = document.getElementById('custom-menu');
const resetBtn = document.getElementById('reset-btn');
const canvas = document.getElementById('quoteCanvas');
const ctx = canvas.getContext('2d');
let isInstagramSize = true;

const fontSizeInput = document.getElementById('fontSize');
const lineHeightInput = document.getElementById('lineHeight');

const color1Picker = new iro.ColorPicker('#color1Picker', { width: 100, color: "#fce7f3" });
const color2Picker = new iro.ColorPicker('#color2Picker', { width: 100, color: "#e9d5ff" });
const fontColorPicker = new iro.ColorPicker('#fontColorPicker', { width: 100, color: "#4c1d95" });

let currentQuote = null;

const defaultSettings = {
    font: 'Playfair Display',
    bgStyle: 'gradient',
    color1: "#fce7f3",
    color2: "#e9d5ff",
    fontColor: "#4c1d95",
    fontSize: 50,
    lineHeight: 1.5
};

function setCanvasSize(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function toggleCanvasSize() {
    if (isInstagramSize) {
        setCanvasSize(1080, 1920); // TikTok size
        isInstagramSize = false;
        toggleSizeBtn.textContent = "Instagram";
    } else {
        setCanvasSize(1080, 1080); // Instagram size
        isInstagramSize = true;
        toggleSizeBtn.textContent = "TikTok";
    }
    generateQuoteImage(false);
}

async function fetchQuote(category) {
    if (category === 'random') {
        category = categories[Math.floor(Math.random() * categories.length)];
    }
    const response = await fetch(`en/${category}.json`);
    const quotes = await response.json();
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        }
        else {
            line = testLine;
        }
    }
    lines.push(line);

    for(let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, y);
        y += lineHeight;
    }
    return y;
}

// function drawPattern(ctx, width, height) {
//     const size = 20;
//     const gradient = ctx.createLinearGradient(0, 0, width, height);
//     gradient.addColorStop(0, color1Picker.color.hexString);
//     gradient.addColorStop(1, color2Picker.color.hexString);
    
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, width, height);
    
//     ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    
//     for (let x = 0; x < width; x += size * 2) {
//         for (let y = 0; y < height; y += size * 2) {
//             ctx.fillRect(x, y, size, size);
//             ctx.fillRect(x + size, y + size, size, size);
//         }
//     }
// }


function drawPattern(ctx, width, height) {
    const size = 100;
    const halfSize = size / 2;
    const quarterSize = size / 4;

    // Latar belakang
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);

    // Warna untuk pola
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;

    // Pre-calculate patterns
    const star = createStarPath(halfSize);
    const geometric = createGeometricPath(size);

    for (let x = 0; x < width + size; x += size) {
        for (let y = 0; y < height + size; y += size) {
            ctx.save();
            ctx.translate(x + halfSize, y + halfSize);

            // Gambar bintang 8 sudut
            ctx.stroke(star);

            // Gambar lingkaran dalam
            ctx.beginPath();
            ctx.arc(0, 0, quarterSize, 0, Math.PI * 2);
            ctx.stroke();

            // Gambar pola geometris tambahan
            ctx.stroke(geometric);

            ctx.restore();
        }
    }
}

function createStarPath(size) {
    const path = new Path2D();
    for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        if (i === 0) {
            path.moveTo(x, y);
        } else {
            path.lineTo(x, y);
        }
        const x2 = size / 2 * Math.cos(angle + Math.PI / 8);
        const y2 = size / 2 * Math.sin(angle + Math.PI / 8);
        path.lineTo(x2, y2);
    }
    path.closePath();
    return path;
}

function createGeometricPath(size) {
    const halfSize = size / 2;
    const quarterSize = size / 4;
    
    const path = new Path2D();
    
    // Diamond
    path.moveTo(0, -halfSize);
    path.lineTo(halfSize, 0);
    path.lineTo(0, halfSize);
    path.lineTo(-halfSize, 0);
    path.closePath();

    // Garis-garis tambahan
    path.moveTo(-quarterSize, -quarterSize);
    path.lineTo(quarterSize, -quarterSize);
    path.moveTo(-quarterSize, quarterSize);
    path.lineTo(quarterSize, quarterSize);
    path.moveTo(-quarterSize, -quarterSize);
    path.lineTo(-quarterSize, quarterSize);
    path.moveTo(quarterSize, -quarterSize);
    path.lineTo(quarterSize, quarterSize);
    
    return path;
}

//////

function drawGeometricMosaic(ctx, width, height) {
    const tileSize = 50;
    const colors = [color1Picker.color.hexString, color2Picker.color.hexString];
    
    for (let x = 0; x < width; x += tileSize) {
        for (let y = 0; y < height; y += tileSize) {
            ctx.fillStyle = colors[(x + y) / tileSize % 2];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + tileSize / 2, y + tileSize);
            ctx.lineTo(x + tileSize, y);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function drawMandala(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    
    for (let radius = maxRadius; radius > 0; radius -= 20) {
        const petals = 8;
        
        // Lingkaran utama
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Pola sederhana di setiap titik
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Garis penghubung ke pusat
            if (radius < maxRadius - 40) {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }
    
    // Titik pusat
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
}



function drawAbstractWaves(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    
    for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 10) {
            ctx.lineTo(x, y + Math.sin(x * 0.03) * 10);
        }
        ctx.stroke();
    }
}

function drawDottedTexture(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = color2Picker.color.hexString;
    const dotSize = 3;
    const spacing = 15;
    
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x + (Math.random() - 0.5) * 5, y + (Math.random() - 0.5) * 5, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawMinimalistLines(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    
    const spacing = 30;
    const diagonal = Math.sqrt(width * width + height * height);
    
    for (let i = 0; i < diagonal; i += spacing) {
        // Garis diagonal dari kiri atas ke kanan bawah
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(Math.min(i, width), Math.max(0, i - width));
        ctx.lineWidth = 0.5 + Math.random();
        ctx.stroke();
        
        // Garis diagonal dari kanan atas ke kiri bawah
        ctx.beginPath();
        ctx.moveTo(width, i);
        ctx.lineTo(Math.max(0, width - i), Math.max(0, i - width));
        ctx.lineWidth = 0.5 + Math.random();
        ctx.stroke();
    }
    
    // Tambahkan beberapa lingkaran acak
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 10 + Math.random() * 20;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Tambahkan garis horizontal dan vertikal di tengah
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawGeometricPattern(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;
    
    const size = Math.min(width, height) / 10;
    const cols = Math.ceil(width / size);
    const rows = Math.ceil(height / size);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * size;
            const y = j * size;
            const randomShape = Math.floor(Math.random() * 4);
            
            ctx.save();
            ctx.translate(x + size / 2, y + size / 2);
            ctx.rotate(Math.PI / 4 * Math.floor(Math.random() * 4));
            
            switch (randomShape) {
                case 0: // Persegi
                    ctx.strokeRect(-size / 4, -size / 4, size / 2, size / 2);
                    break;
                case 1: // Lingkaran
                    ctx.beginPath();
                    ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 2: // Segitiga
                    ctx.beginPath();
                    ctx.moveTo(-size / 4, size / 4);
                    ctx.lineTo(0, -size / 4);
                    ctx.lineTo(size / 4, size / 4);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case 3: // Garis silang
                    ctx.beginPath();
                    ctx.moveTo(-size / 4, -size / 4);
                    ctx.lineTo(size / 4, size / 4);
                    ctx.moveTo(size / 4, -size / 4);
                    ctx.lineTo(-size / 4, size / 4);
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
        }
    }
}

function drawWavePattern(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;
    
    const waveCount = 5;
    const amplitude = height / (waveCount * 2);
    const frequency = Math.PI * 2 / width;
    
    for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
            const y = height / 2 
                + Math.sin(x * frequency + i * Math.PI / 3) * amplitude 
                + i * (height / waveCount) 
                - height / 2 + amplitude;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    // Tambahkan titik-titik di sepanjang gelombang tengah
    ctx.fillStyle = color2Picker.color.hexString;
    for (let x = 0; x <= width; x += width / 20) {
        const y = height / 2 
            + Math.sin(x * frequency + 2 * Math.PI / 3) * amplitude 
            + 2 * (height / waveCount) 
            - height / 2 + amplitude;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawModernAbstractPattern(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    const shapes = 15;
    const maxSize = Math.min(width, height) / 4;
    
    for (let i = 0; i < shapes; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * maxSize + 20;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);
        
        const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
        gradient.addColorStop(0, color2Picker.color.hexString);
        gradient.addColorStop(1, color1Picker.color.hexString);
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = color2Picker.color.hexString;
        ctx.lineWidth = 2;
        
        const shapeType = Math.floor(Math.random() * 3);
        
        switch(shapeType) {
            case 0: // Bentuk tidak beraturan
                ctx.beginPath();
                ctx.moveTo(0, -size/2);
                for (let j = 0; j < 5; j++) {
                    const ang = (j / 5) * Math.PI * 2;
                    const rad = size/2 * (0.5 + Math.random() * 0.5);
                    ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 1: // Setengah lingkaran
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            case 2: // Segitiga
                ctx.beginPath();
                ctx.moveTo(-size/2, size/2);
                ctx.lineTo(size/2, size/2);
                ctx.lineTo(0, -size/2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
    
    // Tambahkan garis-garis tipis untuk aksen
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, 0);
        ctx.lineTo(Math.random() * width, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * height);
        ctx.lineTo(width, Math.random() * height);
        ctx.stroke();
    }
}

function drawAbstractFlowerPattern(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    const flowerCount = 7;
    const maxSize = Math.min(width, height) / 3;
    
    for (let i = 0; i < flowerCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * maxSize + maxSize / 2;
        const petalCount = Math.floor(Math.random() * 5) + 5;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Gambar kelopak bunga
        for (let j = 0; j < petalCount; j++) {
            ctx.save();
            ctx.rotate((j / petalCount) * Math.PI * 2);
            
            const gradient = ctx.createLinearGradient(0, 0, size/2, 0);
            gradient.addColorStop(0, color2Picker.color.hexString);
            gradient.addColorStop(1, color1Picker.color.hexString);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(size/4, -size/8, size/2, 0);
            ctx.quadraticCurveTo(size/4, size/8, 0, 0);
            ctx.fill();
            
            ctx.restore();
        }
        
        // Gambar pusat bunga
        ctx.fillStyle = color2Picker.color.hexString;
        ctx.beginPath();
        ctx.arc(0, 0, size/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Tambahkan garis-garis melengkung untuk efek tambahan
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * height);
        const cp1x = width / 3;
        const cp1y = Math.random() * height;
        const cp2x = width * 2 / 3;
        const cp2y = Math.random() * height;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, width, Math.random() * height);
        ctx.stroke();
    }
}

function drawMinimalistGeometry(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;
    
    const size = Math.min(width, height) / 10;
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const shape = Math.floor(Math.random() * 3);
        
        switch(shape) {
            case 0: // Circle
                ctx.beginPath();
                ctx.arc(x, y, size/2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 1: // Square
                ctx.strokeRect(x - size/2, y - size/2, size, size);
                break;
            case 2: // Triangle
                ctx.beginPath();
                ctx.moveTo(x, y - size/2);
                ctx.lineTo(x - size/2, y + size/2);
                ctx.lineTo(x + size/2, y + size/2);
                ctx.closePath();
                ctx.stroke();
                break;
        }
    }
}

function drawDigitalMosaic(ctx, width, height) {
    // Latar belakang gradien
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Fungsi untuk menghasilkan warna acak antara dua warna
    function interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Membuat mozaik dengan ukuran yang bervariasi
    for (let x = 0; x < width; x += Math.random() * 60 + 10) {
        for (let y = 0; y < height; y += Math.random() * 60 + 10) {
            const tileWidth = Math.random() * 60 + 10;
            const tileHeight = Math.random() * 60 + 10;
            
            // Menentukan bentuk: persegi, lingkaran, atau segitiga
            const shape = Math.floor(Math.random() * 3);
            
            // Warna acak antara color1 dan color2
            ctx.fillStyle = interpolateColor(color1Picker.color.hexString, color2Picker.color.hexString, Math.random());
            
            ctx.beginPath();
            switch(shape) {
                case 0: // Persegi
                    ctx.fillRect(x, y, tileWidth, tileHeight);
                    break;
                case 1: // Lingkaran
                    ctx.arc(x + tileWidth/2, y + tileHeight/2, Math.min(tileWidth, tileHeight)/2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 2: // Segitiga
                    ctx.moveTo(x + tileWidth/2, y);
                    ctx.lineTo(x, y + tileHeight);
                    ctx.lineTo(x + tileWidth, y + tileHeight);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
        }
    }
    
    // Menambahkan garis-garis acak untuk efek abstrak
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }
    
    // Menambahkan beberapa titik besar untuk aksen
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = color1Picker.color.hexString;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 20 + 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Pola 3: Spiral Abstrak
function drawAbstractSpiral(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    // Fungsi untuk menghasilkan warna acak berdasarkan color picker
    function getRandomColor() {
        const r1 = parseInt(color1Picker.color.hexString.slice(1, 3), 16);
        const g1 = parseInt(color1Picker.color.hexString.slice(3, 5), 16);
        const b1 = parseInt(color1Picker.color.hexString.slice(5, 7), 16);
        
        const r2 = parseInt(color2Picker.color.hexString.slice(1, 3), 16);
        const g2 = parseInt(color2Picker.color.hexString.slice(3, 5), 16);
        const b2 = parseInt(color2Picker.color.hexString.slice(5, 7), 16);
        
        const r = Math.floor(r1 + Math.random() * (r2 - r1));
        const g = Math.floor(g1 + Math.random() * (g2 - g1));
        const b = Math.floor(b1 + Math.random() * (b2 - b1));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Membuat lapisan-lapisan abstrak
    for (let layer = 0; layer < 5; layer++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        
        // Membuat kurva Bézier acak
        for (let i = 0; i < 5; i++) {
            const cp1x = Math.random() * width;
            const cp1y = Math.random() * height;
            const cp2x = Math.random() * width;
            const cp2y = Math.random() * height;
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        
        ctx.strokeStyle = getRandomColor();
        ctx.lineWidth = Math.random() * 10 + 5;
        ctx.stroke();
        
        // Menambahkan efek transparansi
        ctx.globalAlpha = 0.7;
    }
    
    // Menambahkan percikan warna
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 20 + 5;
        
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fill();
    }
    
    // Menambahkan garis-garis ekspresif
    ctx.globalAlpha = 1;
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.strokeStyle = color2Picker.color.hexString;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.stroke();
    }
}
// Pola 4: Garis Dinamis
function drawDynamicLines(ctx, width, height) {
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, 0);
        ctx.quadraticCurveTo(
            Math.random() * width, Math.random() * height,
            Math.random() * width, height
        );
        ctx.stroke();
    }
}

// Pola 5: Dot Matrix drawDotMatrix
function drawDotMatrix(ctx, width, height) {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const spacing = 30;
    const maxSize = 8;
    
    // Create a subtle wave effect
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            const distanceToCenter = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
            const waveOffset = Math.sin(distanceToCenter * 0.05) * 10;
            
            const size = Math.max(1, (maxSize - (distanceToCenter * maxSize / (Math.max(width, height) / 2))) + waveOffset);
            
            // Create a glow effect
            const glow = ctx.createRadialGradient(x, y, 0, x, y, size);
            glow.addColorStop(0, color2Picker.color.hexString);
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            // Main dot
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color2Picker.color.hexString;
            ctx.fill();
        }
    }
    
    // Add some connecting lines for extra effect
    ctx.strokeStyle = `${color2Picker.color.hexString}40`; // 40 is for 25% opacity
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * height);
        ctx.bezierCurveTo(
            width / 3, Math.random() * height,
            width * 2 / 3, Math.random() * height,
            width, Math.random() * height
        );
        ctx.stroke();
    }
}

function drawFullyAbstractArt(ctx, width, height) {
    // Latar belakang gradien
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Fungsi untuk warna acak antara color1 dan color2
    function getRandomColor(alpha = 1) {
        const r1 = parseInt(color1Picker.color.hexString.slice(1, 3), 16);
        const g1 = parseInt(color1Picker.color.hexString.slice(3, 5), 16);
        const b1 = parseInt(color1Picker.color.hexString.slice(5, 7), 16);
        const r2 = parseInt(color2Picker.color.hexString.slice(1, 3), 16);
        const g2 = parseInt(color2Picker.color.hexString.slice(3, 5), 16);
        const b2 = parseInt(color2Picker.color.hexString.slice(5, 7), 16);
        const r = Math.floor(r1 + Math.random() * (r2 - r1));
        const g = Math.floor(g1 + Math.random() * (g2 - g1));
        const b = Math.floor(b1 + Math.random() * (b2 - b1));
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Lapisan abstrak dengan kurva Bézier
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        for (let j = 0; j < 4; j++) {
            const cp1x = Math.random() * width;
            const cp1y = Math.random() * height;
            const cp2x = Math.random() * width;
            const cp2y = Math.random() * height;
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        ctx.strokeStyle = getRandomColor(0.6);
        ctx.lineWidth = Math.random() * 10 + 5;
        ctx.stroke();
    }

    // Blobs abstrak
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 100 + 50;
        ctx.moveTo(x, y);
        for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2;
            const randomRadius = radius * (0.8 + Math.random() * 0.4);
            const blobX = x + Math.cos(angle) * randomRadius;
            const blobY = y + Math.sin(angle) * randomRadius;
            ctx.lineTo(blobX, blobY);
        }
        ctx.closePath();
        ctx.fillStyle = getRandomColor(0.4);
        ctx.fill();
    }

    // Garis-garis ekspresif
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.strokeStyle = getRandomColor(0.8);
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.stroke();
    }

    // Titik-titik acak
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 10 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = getRandomColor(0.7);
        ctx.fill();
    }

    // Bentuk geometris abstrak
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 100 + 50;
        const sides = Math.floor(Math.random() * 5) + 3;
        ctx.beginPath();
        for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2;
            const pointX = x + Math.cos(angle) * size;
            const pointY = y + Math.sin(angle) * size;
            j === 0 ? ctx.moveTo(pointX, pointY) : ctx.lineTo(pointX, pointY);
        }
        ctx.closePath();
        ctx.strokeStyle = getRandomColor();
        ctx.lineWidth = Math.random() * 5 + 2;
        ctx.stroke();
    }
}

async function generateQuoteImage(newQuote = false) {
    if (newQuote) {
        const category = categorySelect.value;
        currentQuote = await fetchQuote(category);
    }

    const font = fontSelect.value;
    const bgStyle = bgStyleSelect.value;
    const fontSize = fontSizeInput.value;
    const lineHeight = lineHeightInput.value;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (bgStyle === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, color1Picker.color.hexString);
        gradient.addColorStop(1, color2Picker.color.hexString);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'solid') {
        ctx.fillStyle = color1Picker.color.hexString;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'pattern') {
        drawPattern(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'geometric') {
        drawGeometricMosaic(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'mandala') {
        drawMandala(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'waves') {
        drawAbstractWaves(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'dotted') {
        drawDottedTexture(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'minimalist') {
        drawMinimalistLines(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'GeometricPattern') {
        drawGeometricPattern(ctx, canvas.width, canvas.height); 
    } else if (bgStyle === 'drawWavePattern') {
      drawWavePattern(ctx, canvas.width, canvas.height); drawWavePattern
    } else if (bgStyle === 'drawModernAbstractPattern') {
        drawModernAbstractPattern(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawAbstractFlowerPattern') {
        drawAbstractFlowerPattern(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawMinimalistGeometry') {
        drawMinimalistGeometry(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawDigitalMosaic') {
        drawDigitalMosaic(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawAbstractSpiral') {
        drawAbstractSpiral(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawDynamicLines') {
        drawDynamicLines(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawDotMatrix') {
        drawDotMatrix(ctx, canvas.width, canvas.height);
    } else if (bgStyle === 'drawFullyAbstractArt') {
        drawFullyAbstractArt(ctx, canvas.width, canvas.height);
    }
    
    


    // Quote text
    ctx.font = `bold ${fontSize}px "${font}"`;
    ctx.fillStyle = fontColorPicker.color.hexString;
    ctx.textAlign = 'center';
    
    // Calculate text height
    const quoteText = `"${currentQuote.text}"`;
    const textMetrics = ctx.measureText(quoteText);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const totalTextHeight = textHeight * (quoteText.split(' ').length / 3) * lineHeight; // Rough estimate

    // Calculate starting Y position to center the text
    let startY = (canvas.height - totalTextHeight) / 2;

    let endY = wrapText(ctx, quoteText, canvas.width / 2, startY, canvas.width * 0.8, parseInt(fontSize) * lineHeight);

    // Author
    ctx.font = `${fontSize * 0.7}px "${font}"`;
    ctx.fillStyle = fontColorPicker.color.hexString;
    ctx.fillText(`- ${currentQuote.author}`, canvas.width / 2, endY + parseInt(fontSize) * lineHeight);

    // Category (using default font and fixed size)
    ctx.font = `bold 24px Arial`;
    ctx.fillStyle = fontColorPicker.color.hexString;
    ctx.fillText(`#${categorySelect.value}`, canvas.width / 2, canvas.height - 30);
}

function resetToDefault() {
    fontSelect.value = defaultSettings.font;
    bgStyleSelect.value = defaultSettings.bgStyle;
    color1Picker.color.set(defaultSettings.color1);
    color2Picker.color.set(defaultSettings.color2);
    fontColorPicker.color.set(defaultSettings.fontColor);
    fontSizeInput.value = defaultSettings.fontSize;
    lineHeightInput.value = defaultSettings.lineHeight;
    generateQuoteImage(false);
}

generateBtn.addEventListener('click', () => generateQuoteImage(true));
toggleSizeBtn.addEventListener('click', toggleCanvasSize);
toggleCustomMenuBtn.addEventListener('click', () => customMenu.classList.toggle('hidden'));
resetBtn.addEventListener('click', resetToDefault);
fontSelect.addEventListener('change', () => generateQuoteImage(false));
bgStyleSelect.addEventListener('change', () => generateQuoteImage(false));
color1Picker.on('color:change', () => generateQuoteImage(false));
color2Picker.on('color:change', () => generateQuoteImage(false));
fontColorPicker.on('color:change', () => generateQuoteImage(false));
fontSizeInput.addEventListener('input', () => generateQuoteImage(false));
lineHeightInput.addEventListener('input', () => generateQuoteImage(false));

downloadBtn.addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const date = new Date();
    const timestamp = date.getTime();
    const category = categorySelect.value;
    link.download = `aesthetic-quote-${category}-${timestamp}.png`;
    link.href = dataURL;
    link.click();
});

// Make color pickers responsive
function resizeColorPickers() {
    const colorPickerContainers = document.querySelectorAll('#colorPickers > div');
    colorPickerContainers.forEach(container => {
        const containerWidth = container.offsetWidth;
        const newWidth = Math.min(150, containerWidth);
        const picker = container.querySelector('.w-full');
        if (picker) {
            // Ensure picker has a resize method
            if (typeof picker.resize === 'function') {
                picker.resize(newWidth);
            } else {
                picker.style.width = newWidth + 'px';
            }
        }
    });
}

// Call resizeColorPickers on window resize
window.addEventListener('resize', resizeColorPickers);

// Initial setup
setCanvasSize(1080, 1080);
generateQuoteImage(true);
resizeColorPickers();
