const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const abstractTypeSelect = document.getElementById('abstractType');
const elementCountInput = document.getElementById('elementCount');
const canvasSizeSelect = document.getElementById('canvasSize');

const color1Picker = new iro.ColorPicker('#color1Picker', { width: 100, color: "#ff80ed" });
const color2Picker = new iro.ColorPicker('#color2Picker', { width: 100, color: "#065535" });
let pieceNumber = '';


function setCanvasSize() {
    const size = canvasSizeSelect.value;
    if (size === 'instagram') {
        canvas.width = 1080;
        canvas.height = 1080;
    } else if (size === 'tiktok') {
        canvas.width = 1080;
        canvas.height = 1920;
    }
}

function getRandomColors() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function randomizeColors() {
    const randomColor1 = getRandomColors();
    const randomColor2 = getRandomColors();
    
    color1Picker.color.set(randomColor1);
    color2Picker.color.set(randomColor2);
}

// Tambahkan event listener ke tombol
document.getElementById('randomColorButton').addEventListener('click', randomizeColors);

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

function drawAbstractPainting(ctx, width, height, elementCount) {
    // Latar belakang dengan tekstur
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < width; i += 4) {
        for (let j = 0; j < height; j += 4) {
            if (Math.random() > 0.5) {
                ctx.fillStyle = getRandomColor(0.1);
                ctx.fillRect(i, j, 4, 4);
            }
        }
    }

    // Cipratan cat
    for (let i = 0; i < elementCount * 2; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 50 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getRandomColor(0.7);
        ctx.fill();

        // Tambahkan percikan
        for (let j = 0; j < 10; j++) {
            const splashX = x + (Math.random() - 0.5) * radius * 4;
            const splashY = y + (Math.random() - 0.5) * radius * 4;
            const splashRadius = Math.random() * 5 + 1;
            ctx.beginPath();
            ctx.arc(splashX, splashY, splashRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Goresan kuas
    for (let i = 0; i < elementCount; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        const controlPoint1 = {
            x: Math.random() * width,
            y: Math.random() * height
        };
        const controlPoint2 = {
            x: Math.random() * width,
            y: Math.random() * height
        };
        const endPoint = {
            x: Math.random() * width,
            y: Math.random() * height
        };
        ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        ctx.strokeStyle = getRandomColor(0.8);
        ctx.lineWidth = Math.random() * 20 + 5;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // Efek cat menetes
    for (let i = 0; i < elementCount / 2; i++) {
        let x = Math.random() * width;  // Ubah dari const menjadi let
        let y = Math.random() * height;
        const dripLength = Math.random() * 200 + 50;
        const dripWidth = Math.random() * 10 + 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        while (y < height && y < y + dripLength) {
            x += (Math.random() - 0.5) * 2;
            y += Math.random() * 5 + 2;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = getRandomColor(0.6);
        ctx.lineWidth = dripWidth;
        ctx.stroke();
    }
}


function drawFullAbstract(ctx, width, height, elementCount) {
    // Complex background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(0.5, getRandomColor(0.7));
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Flowing lines
    for (let i = 0; i < elementCount; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        for (let j = 0; j < 5; j++) {
            ctx.quadraticCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
        }
        ctx.strokeStyle = getRandomColor(0.4);
        ctx.lineWidth = Math.random() * 5 + 1;
        ctx.stroke();
    }

    // Scattered shapes
    for (let i = 0; i < elementCount / 2; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 100 + 20;
        const shape = Math.random();

        ctx.beginPath();
        if (shape < 0.33) {
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        } else if (shape < 0.66) {
            ctx.rect(x - size/2, y - size/2, size, size);
        } else {
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.closePath();
        }
        ctx.fillStyle = getRandomColor(0.6);
        ctx.fill();
    }

    // Overlaying texture
    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < width; i += 4) {
        for (let j = 0; j < height; j += 4) {
            if (Math.random() > 0.5) {
                ctx.fillStyle = getRandomColor(0.1);
                ctx.fillRect(i, j, 4, 4);
            }
        }
    }
    ctx.globalCompositeOperation = 'source-over';
}

function drawMinimalistAbstract(ctx, width, height, elementCount) {
    // Background color
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);

    const shapes = ['circle', 'rectangle', 'triangle'];

    for (let i = 0; i < elementCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 100 + 20;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        ctx.beginPath();
        if (shape === 'circle') {
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        } else if (shape === 'rectangle') {
            ctx.rect(x - size / 2, y - size / 2, size, size);
        } else if (shape === 'triangle') {
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.closePath();
        }
        
        // Gradient color
        let gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color2Picker.color.hexString);
        gradient.addColorStop(1, getRandomColor(0.3));
        ctx.fillStyle = i === 0 ? gradient : getRandomColor(0.1);
        ctx.fill();
    }

    // Single contrasting line with gradient
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * height);
    ctx.lineTo(width, Math.random() * height);
    let lineGradient = ctx.createLinearGradient(0, 0, width, height);
    lineGradient.addColorStop(0, color2Picker.color.hexString);
    lineGradient.addColorStop(1, getRandomColor(0.3));
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = Math.random() * 10 + 5;
    ctx.stroke();
}

// Helper function to generate random color with opacity
function getRandomColor(opacity) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},${opacity})`;
}


function drawElegantAbstract(ctx, width, height, elementCount) {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1Picker.color.hexString);
    gradient.addColorStop(1, color2Picker.color.hexString);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Flowing curves
    for (let i = 0; i < elementCount; i++) {
        ctx.beginPath();
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        ctx.moveTo(startX, startY);
        
        for (let j = 0; j < 3; j++) {
            const endX = Math.random() * width;
            const endY = Math.random() * height;
            const cp1x = (startX + endX) / 2 + (Math.random() - 0.5) * 100;
            const cp1y = Math.random() * height;
            const cp2x = (startX + endX) / 2 + (Math.random() - 0.5) * 100;
            const cp2y = Math.random() * height;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        }
        
        ctx.strokeStyle = getRandomColor(0.3);
        ctx.lineWidth = Math.random() * 3 + 0.5;
        ctx.stroke();
    }

    // Gold accents
    const goldColor = 'rgba(255, 215, 0, 0.6)';
    for (let i = 0; i < elementCount / 3; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 20 + 5;

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = goldColor;
        ctx.fill();
    }
}

function drawModernAbstract(ctx, width, height, elementCount) {
    // Bold background
    ctx.fillStyle = color1Picker.color.hexString;
    ctx.fillRect(0, 0, width, height);

    // Large geometric shapes
    for (let i = 0; i < elementCount / 2; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 200 + 100;

        ctx.beginPath();
        if (Math.random() > 0.5) {
            ctx.rect(x - size/2, y - size/2, size, size);
        } else {
            const points = Math.floor(Math.random() * 3) + 3;
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const px = x + Math.cos(angle) * size / 2;
                const py = y + Math.sin(angle) * size / 2;
                j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
        }
        ctx.fillStyle = getRandomColor(0.7);
        ctx.fill();
    }

    // Overlapping lines
    for (let i = 0; i < elementCount * 2; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.strokeStyle = getRandomColor(0.8);
        ctx.lineWidth = Math.random() * 10 + 2;
        ctx.stroke();
    }

    // Contrasting dots
    for (let i = 0; i < elementCount * 3; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 10 + 2;

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color2Picker.color.hexString;
        ctx.fill();
    }
}

function generateAbstractArt() {
    setCanvasSize();
    const abstractType = abstractTypeSelect.value;
    const elementCount = parseInt(elementCountInput.value);
    pieceNumber = `Piece no ${Date.now()}`; // Generate unique piece number

    switch (abstractType) {
        case 'full':
            drawFullAbstract(ctx, canvas.width, canvas.height, elementCount);
            break;
        case 'minimalist':
            drawMinimalistAbstract(ctx, canvas.width, canvas.height, elementCount);
            break;
        case 'elegant':
            drawElegantAbstract(ctx, canvas.width, canvas.height, elementCount);
            break;
        case 'modern':
            drawModernAbstract(ctx, canvas.width, canvas.height, elementCount);
            break;
        case 'painting':
            drawAbstractPainting(ctx, canvas.width, canvas.height, elementCount);
            break;
    }

    // Add the bold text at the bottom center of the canvas
    ctx.font = 'bold 20px Arial'; // Make text bold
    ctx.fillStyle = 'black'; // Change color if needed
    ctx.textAlign = 'center';
    ctx.fillText(pieceNumber, canvas.width / 2, canvas.height - 10);
}

const copyTextBtn = document.getElementById('copyTextBtn');

copyTextBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(pieceNumber).then(() => {
        alert('Text copied to clipboard: ' + pieceNumber);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});



function downloadImage() {
    const link = document.createElement('a');
    link.download = 'abstract-art.png';
    link.href = canvas.toDataURL();
    link.click();
}

generateBtn.addEventListener('click', generateAbstractArt);
downloadBtn.addEventListener('click', downloadImage);
canvasSizeSelect.addEventListener('change', generateAbstractArt);

// Generate initial abstract art
generateAbstractArt();