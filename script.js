// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let redAI = { x: 50, y: 50, color: 'red', hp: 100, territory: [], speed: 1, emotion: 'neutral' };
let blueAI = { x: 750, y: 550, color: 'blue', hp: 100, territory: [], speed: 1, emotion: 'neutral' };
let balance = 1000;
let currentBet = null;
let betAmount = 0;

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bases
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, 50, 50); // Red base
    ctx.fillRect(750, 550, 50, 50); // Blue base

    // Draw AI
    ctx.fillStyle = redAI.color;
    ctx.fillRect(redAI.x, redAI.y, 20, 20);
    ctx.fillStyle = blueAI.color;
    ctx.fillRect(blueAI.x, blueAI.y, 20, 20);

    // Draw territory
    for (let pos of redAI.territory) {
        ctx.fillStyle = 'red';
        ctx.fillRect(pos.x, pos.y, 10, 10);
    }
    for (let pos of blueAI.territory) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(pos.x, pos.y, 10, 10);
    }

    // Draw emotions
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    if (redAI.emotion === 'angry') {
        ctx.fillText('😠', redAI.x + 10, redAI.y + 30);
    } else if (redAI.emotion === 'happy') {
        ctx.fillText('😊', redAI.x + 10, redAI.y + 30);
    }
    if (blueAI.emotion === 'angry') {
        ctx.fillText('😠', blueAI.x + 10, blueAI.y + 30);
    } else if (blueAI.emotion === 'happy') {
        ctx.fillText('😊', blueAI.x + 10, blueAI.y + 30);
    }
}

// Basic AI movement logic
function moveAI(ai) {
    // Simple random movement for demonstration
    let direction = Math.floor(Math.random() * 4); // 0: up, 1: right, 2: down, 3: left
    switch (direction) {
        case 0:
            ai.y -= ai.speed * 10;
            break;
        case 1:
            ai.x += ai.speed * 10;
            break;
        case 2:
            ai.y += ai.speed * 10;
            break;
        case 3:
            ai.x -= ai.speed * 10;
            break;
    }

    // Add territory
    ai.territory.push({ x: ai.x, y: ai.y });

    // Boundary check
    if (ai.x < 0) ai.x = 0;
    if (ai.y < 0) ai.y = 0;
    if (ai.x > canvas.width - 20) ai.x = canvas.width - 20;
    if (ai.y > canvas.height - 20) ai.y = canvas.height - 20;
}

// Collision detection and HP reduction
function checkCollision() {
    if (Math.abs(redAI.x - blueAI.x) < 20 && Math.abs(redAI.y - blueAI.y) < 20) {
        // Randomly reduce HP
        if (Math.random() < 0.5) {
            redAI.hp -= Math.floor(Math.random() * 10);
            redAI.emotion = 'angry';
        } else {
            blueAI.hp -= Math.floor(Math.random() * 10);
            blueAI.emotion = 'angry';
        }
    }
}

// Territory capture logic
function checkTerritoryCapture() {
    for (let pos of blueAI.territory) {
        if (redAI.territory.some(t => t.x === pos.x && t.y === pos.y)) {
            blueAI.emotion = 'angry';
        }
    }
    for (let pos of redAI.territory) {
        if (blueAI.territory.some(t => t.x === pos.x && t.y === pos.y)) {
            redAI.emotion = 'angry';
        }
    }
}

// Betting logic
document.getElementById('betRed').addEventListener('click', () => {
    currentBet = 'red';
});
document.getElementById('betBlue').addEventListener('click', () => {
    currentBet = 'blue';
});
document.getElementById('placeBet').addEventListener('click', () => {
    betAmount = parseInt(document.getElementById('betAmount').value);
    if (betAmount > balance) {
        alert('Insufficient balance');
        return;
    }
    balance -= betAmount;
    document.getElementById('balance').innerText = `Balance: ${balance}`;
});

// Settings panel
const settingsPanel = document.createElement('div');
settingsPanel.id = 'settingsPanel';
settingsPanel.innerHTML = `
    <select id="themeSelect">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
`;
document.body.appendChild(settingsPanel);

document.getElementById('settings').addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('themeSelect').addEventListener('change', (e) => {
    const theme = e.target.value;
    if (theme === 'dark') {
        document.body.style.background = 'black';
        document.body.style.color = 'white';
    } else {
        document.body.style.background = '';
        document.body.style.color = '';
    }
});

// Game loop
setInterval(() => {
    moveAI(redAI);
    moveAI(blueAI);
    checkCollision();
    checkTerritoryCapture();
    draw();

    // Check game over
    if (redAI.hp <= 0 || blueAI.hp <= 0) {
        alert('Game Over');
        // Handle betting outcome
        if (currentBet === 'red' && redAI.hp > blueAI.hp) {
            balance += betAmount * 2;
        } else if (currentBet === 'blue' && blueAI.hp > redAI.hp) {
            balance += betAmount * 2;
        }
        document.getElementById('balance').innerText = `Balance: ${balance}`;
        // Reset game state
        redAI = { x: 50, y: 50, color: 'red', hp: 100, territory: [], speed: 1, emotion: 'neutral' };
        blueAI = { x: 750, y: 550, color: 'blue', hp: 100, territory: [], speed: 1, emotion: 'neutral' };
    }
}, 1000); // Update every second

draw();
