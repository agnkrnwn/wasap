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

    for (let x = 0; x < width + size; x += size) {
        for (let y = 0; y < height + size; y += size) {
            // Gambar bintang 8 sudut
            drawEightPointStar(ctx, x + halfSize, y + halfSize, halfSize);

            // Gambar lingkaran dalam
            ctx.beginPath();
            ctx.arc(x + halfSize, y + halfSize, quarterSize, 0, Math.PI * 2);
            ctx.stroke();

            // Gambar pola geometris tambahan
            drawGeometricPattern(ctx, x, y, size);
        }
    }
}

function drawEightPointStar(ctx, cx, cy, size) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        const x2 = cx + size / 2 * Math.cos(angle + Math.PI / 8);
        const y2 = cy + size / 2 * Math.sin(angle + Math.PI / 8);
        ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.stroke();
}

function drawGeometricPattern(ctx, x, y, size) {
    const halfSize = size / 2;
    const quarterSize = size / 4;

    // Gambar diamond
    ctx.beginPath();
    ctx.moveTo(x + halfSize, y);
    ctx.lineTo(x + size, y + halfSize);
    ctx.lineTo(x + halfSize, y + size);
    ctx.lineTo(x, y + halfSize);
    ctx.closePath();
    ctx.stroke();

    // Gambar garis-garis tambahan
    ctx.beginPath();
    ctx.moveTo(x + quarterSize, y + quarterSize);
    ctx.lineTo(x + 3 * quarterSize, y + quarterSize);
    ctx.moveTo(x + quarterSize, y + 3 * quarterSize);
    ctx.lineTo(x + 3 * quarterSize, y + 3 * quarterSize);
    ctx.moveTo(x + quarterSize, y + quarterSize);
    ctx.lineTo(x + quarterSize, y + 3 * quarterSize);
    ctx.moveTo(x + 3 * quarterSize, y + quarterSize);
    ctx.lineTo(x + 3 * quarterSize, y + 3 * quarterSize);
    ctx.stroke();
}

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
    
    ctx.strokeStyle = color2Picker.color.hexString;
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    
    for (let radius = maxRadius; radius > 0; radius -= 20) {
        const petals = 8 + Math.floor((maxRadius - radius) / 20);
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
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
    ctx.lineWidth = 1;
    
    const spacing = 20;
    for (let i = 0; i < width + height; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(i, 0);
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