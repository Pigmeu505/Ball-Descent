const gameContainer = document.getElementById('game-container');
const ball = document.getElementById('ball');
const spikeWall = document.getElementById('spike-wall');
const timerElement = document.getElementById('timer');
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');

let ballX = window.innerWidth / 2 - 10;
let ballY = window.innerHeight * 0.3;
let ballSpeedY = 4; // Aumentar a velocidade vertical
let ballSpeedX = 7; // Aumentar a velocidade horizontal
let platforms = [];
let gameInterval;
let timerInterval;
let seconds = 0;

function createPlatform(y) {
    const platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = `${Math.random() * (window.innerWidth - 150)}px`;
    platform.style.top = `${y}px`;
    gameContainer.appendChild(platform);
    platforms.push(platform);
}

function moveBall() {
    ballY += ballSpeedY;

    // Verifica colisão com a parede de espinhos
    if (ballY <= 20) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert('Game Over');
        showMenu();
    }

    // Verifica colisão com o chão
    if (ballY >= window.innerHeight - 20) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert('Game Over');
        showMenu();
    }

    // Verifica colisão com as plataformas
    platforms.forEach((platform, index) => {
        platform.style.top = `${parseInt(platform.style.top) - 1}px`;

        if (parseInt(platform.style.top) < -15) {
            gameContainer.removeChild(platform);
            platforms.splice(index, 1);
            createPlatform(window.innerHeight);
        }

        if (
            ballY + 20 > parseInt(platform.style.top) &&
            ballY + 20 < parseInt(platform.style.top) + 15 &&
            ballX + 20 > parseInt(platform.style.left) &&
            ballX < parseInt(platform.style.left) + 150
        ) {
            ballY = parseInt(platform.style.top) - 20;
        }
    });

    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;
}

function moveBallLeft() {
    if (ballX > 0) ballX -= ballSpeedX;
}

function moveBallRight() {
    if (ballX < window.innerWidth - 20) ballX += ballSpeedX;
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
}

function restartGame() {
    ballX = window.innerWidth / 2 - 10;
    ballY = window.innerHeight * 0.3;
    platforms.forEach(platform => gameContainer.removeChild(platform));
    platforms = [];
    for (let i = 0; i < 5; i++) {
        createPlatform(window.innerHeight - (i * 100));
    }
    seconds = 0;
    timerElement.textContent = '00:00';
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    gameInterval = setInterval(moveBall, 20);
}

function showMenu() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
}

function startGame() {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'ArrowLeft') moveBallLeft();
    if (e.key === 'd' || e.key === 'ArrowRight') moveBallRight();
});

startButton.addEventListener('click', startGame);

window.onload = () => {
    showMenu();
};
