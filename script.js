const gameContainer = document.getElementById('game-container');
const ball = document.getElementById('ball');
const spikeWall = document.getElementById('spike-wall');
const timerElement = document.getElementById('timer');
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const finalTime = document.getElementById('final-time');
const restartButton = document.getElementById('restart-button');

let ballX;
let ballY;
let ballSpeedY = 2; // Velocidade inicial da bola
let ballSpeedX = 6; // Velocidade lateral inicial
let platforms = [];
let gameInterval;
let timerInterval;
let platformInterval;
let speedIncreaseInterval;
let seconds = 0;

function createPlatform(y) {
    const platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = `${Math.random() * (window.innerWidth - window.innerWidth * 0.15)}px`;
    platform.style.top = `${y}px`;
    gameContainer.appendChild(platform);
    platforms.push(platform);
}

function moveBall() {
    ballY += ballSpeedY;

    // Verifica colisão com a parede de espinhos
    if (ballY <= spikeWall.clientHeight) {
        endGame();
    }

    // Verifica colisão com o chão
    if (ballY >= window.innerHeight - ball.clientHeight) {
        endGame();
    }

    // Verifica colisão com as plataformas
    platforms.forEach((platform, index) => {
        platform.style.top = `${parseInt(platform.style.top) - ballSpeedY * 0.5}px`; // Reduzir a velocidade das plataformas

        if (parseInt(platform.style.top) < -parseInt(platform.style.height)) {
            gameContainer.removeChild(platform);
            platforms.splice(index, 1);
        }

        if (
            ballY + ball.clientHeight > parseInt(platform.style.top) &&
            ballY + ball.clientHeight < parseInt(platform.style.top) + platform.clientHeight &&
            ballX + ball.clientWidth > parseInt(platform.style.left) &&
            ballX < parseInt(platform.style.left) + platform.clientWidth
        ) {
            ballY = parseInt(platform.style.top) - ball.clientHeight;
        }
    });

    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;
}

function moveBallLeft() {
    if (ballX > 0) ballX -= ballSpeedX;
}

function moveBallRight() {
    if (ballX < window.innerWidth - ball.clientWidth) ballX += ballSpeedX;
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
}

function increaseSpeed() {
    ballSpeedY += 0.1; // Aumenta a velocidade da bola
    ballSpeedX += 0.1; // Aumenta a velocidade lateral da bola
}

function restartGame() {
    ballX = window.innerWidth / 2 - ball.clientWidth / 2;
    ballY = window.innerHeight * 0.3;
    platforms.forEach(platform => gameContainer.removeChild(platform));
    platforms = [];
    for (let i = 0; i < 7; i++) { // Aumente o número de plataformas iniciais
        createPlatform(window.innerHeight - (i * 100));
    }
    seconds = 0;
    timerElement.textContent = '00:00';
    clearInterval(timerInterval);
    clearInterval(platformInterval);
    clearInterval(speedIncreaseInterval);
    ballSpeedY = 2; // Redefine a velocidade inicial da bola
    ballSpeedX = 6; // Redefine a velocidade lateral inicial
    timerInterval = setInterval(updateTimer, 1000);
    gameInterval = setInterval(moveBall, 20);
    platformInterval = setInterval(() => createPlatform(window.innerHeight), 2000); // Adicione novas plataformas a cada 2 segundos
    speedIncreaseInterval = setInterval(increaseSpeed, 30000); // Aumenta a velocidade a cada 30 segundos
}

function showMenu() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    gameOverScreen.style.display = 'none';
}

function startGame() {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(platformInterval);
    clearInterval(speedIncreaseInterval);
    finalTime.textContent = timerElement.textContent;
    gameOverScreen.style.display = 'flex';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'ArrowLeft') moveBallLeft();
    if (e.key === 'd' || e.key === 'ArrowRight') moveBallRight();
});

document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (touch.clientX < window.innerWidth / 2) {
        moveBallLeft();
    } else {
        moveBallRight();
    }
});

restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    showMenu();
});

startButton.addEventListener('click', startGame);

window.onload = () => {
    showMenu();
    // Ajuste os tamanhos com base na largura da janela
    const ballSize = window.innerWidth * 0.02;
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    ballX = window.innerWidth / 2 - ballSize / 2;
    ballY = window.innerHeight * 0.3;
};
