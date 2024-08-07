const gameContainer = document.getElementById('game-container');
const ball = document.getElementById('ball');
const spikeWall = document.getElementById('spike-wall');
const timerElement = document.getElementById('timer');
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const optionsButton = document.getElementById('options-button');
const optionsMenu = document.getElementById('options-menu');
const backButton = document.getElementById('back-button');
const exampleBall = document.getElementById('example-ball');
const colorOptions = document.querySelectorAll('.color-option');
const gameOverScreen = document.getElementById('game-over');
const finalTimeElement = document.getElementById('final-time');
const restartButton = document.getElementById('restart-button');
const optionsFromGameButton = document.getElementById('options-from-game-button');

let ballX;
let ballY;
let ballSpeedY = 2; // Velocidade inicial da bola
let ballSpeedX = 6; // Velocidade lateral inicial
let mobileBallSpeedX = 3; // Velocidade lateral para dispositivos móveis
let platformSpeed = 1; // Velocidade inicial das plataformas
let platforms = [];
let gameInterval;
let timerInterval;
let platformInterval;
let speedIncreaseInterval;
let speedIncrement = 0.5; // Incremento inicial da velocidade
let seconds = 0;
let selectedColor = 'red';
let moveDirection = null;
let moveInterval;
let isMobile = /Mobi|Android/i.test(navigator.userAgent); // Detectar dispositivos móveis

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
        platform.style.top = `${parseInt(platform.style.top) - platformSpeed}px`; // Movimenta a plataforma com a velocidade ajustada

        if (parseInt(platform.style.top) < -parseInt(platform.style.height)) {
            gameContainer.removeChild(platform);
            platforms.splice(index, 1);
        }

        // Ajusta a colisão da bolinha com as plataformas
        if (
            ballY + ball.clientHeight > parseInt(platform.style.top) &&
            ballY < parseInt(platform.style.top) + platform.clientHeight &&
            ballX + ball.clientWidth > parseInt(platform.style.left) &&
            ballX < parseInt(platform.style.left) + platform.clientWidth
        ) {
            ballY = parseInt(platform.style.top) - ball.clientHeight;
            ballSpeedY = Math.max(ballSpeedY, 2); // Garante que a bolinha não passe rapidamente
        }
    });

    // Ajusta o comportamento da bolinha após 1 minuto para dispositivos móveis
    if (seconds >= 60 && isMobile) {
        ballSpeedX = mobileBallSpeedX; // Reduz a velocidade lateral
    }

    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;
}

function moveBallLeft() {
    if (ballX > 0) ballX -= ballSpeedX;
}

function moveBallRight() {
    if (ballX < window.innerWidth - ball.clientWidth) ballX += ballSpeedX;
}

function moveBallLeftMobile() {
    if (ballX > 0) ballX -= mobileBallSpeedX;
}

function moveBallRightMobile() {
    if (ballX < window.innerWidth - ball.clientWidth) ballX += mobileBallSpeedX;
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
}

function increaseSpeed() {
    ballSpeedY += speedIncrement; // Aumenta a velocidade da bola
    ballSpeedX += speedIncrement; // Aumenta a velocidade lateral da bola
    platformSpeed += speedIncrement; // Aumenta a velocidade das plataformas
}

function restartGame() {
    ballX = window.innerWidth / 2 - ball.clientWidth / 2;
    ballY = window.innerHeight / 2 - ball.clientHeight / 2;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    ball.style.backgroundColor = selectedColor; // Restabelece a cor selecionada

    platforms.forEach(platform => gameContainer.removeChild(platform));
    platforms = [];

    seconds = 0;
    timerElement.textContent = '00:00';
    ballSpeedY = 2; // Resetar a velocidade da bola
    ballSpeedX = 6; // Resetar a velocidade lateral
    platformSpeed = 1; // Resetar a velocidade das plataformas
    speedIncrement = 0.5; // Resetar o incremento de velocidade

    gameInterval = setInterval(moveBall, 20);
    timerInterval = setInterval(updateTimer, 1000);
    platformInterval = setInterval(() => createPlatform(window.innerHeight), 1500);
    speedIncreaseInterval = setInterval(increaseSpeed, 30000);
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'block';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(platformInterval);
    clearInterval(speedIncreaseInterval);

    gameContainer.style.display = 'none';
    gameOverScreen.style.display = 'block';
    finalTimeElement.textContent = timerElement.textContent;
}

function handleStartButtonClick() {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
}

function handleOptionsButtonClick() {
    menu.style.display = 'none';
    optionsMenu.style.display = 'block';
}

function handleBackButtonClick() {
    optionsMenu.style.display = 'none';
    menu.style.display = 'block';
}

function handleColorOptionClick(event) {
    selectedColor = event.target.dataset.color;
    exampleBall.style.backgroundColor = selectedColor;
}

function handleRestartButtonClick() {
    restartGame();
}

function handleOptionsFromGameButtonClick() {
    gameOverScreen.style.display = 'none';
    optionsMenu.style.display = 'block';
}

function startMovingBall(direction) {
    moveDirection = direction;
    if (!moveInterval) {
        moveInterval = setInterval(() => {
            if (moveDirection === 'left') moveBallLeftMobile();
            if (moveDirection === 'right') moveBallRightMobile();
        }, 30); // Aumenta o intervalo para desacelerar a movimentação
    }
}

function stopMovingBall() {
    clearInterval(moveInterval);
    moveInterval = null;
    moveDirection = null;
}

startButton.addEventListener('click', handleStartButtonClick);
optionsButton.addEventListener('click', handleOptionsButtonClick);
backButton.addEventListener('click', handleBackButtonClick);
colorOptions.forEach(option => option.addEventListener('click', handleColorOptionClick));
restartButton.addEventListener('click', handleRestartButtonClick);
optionsFromGameButton.addEventListener('click', handleOptionsFromGameButtonClick);

document.addEventListener('keydown', event => {
    if (event.key === 'a') moveBallLeft();
    if (event.key === 'd') moveBallRight();
});

document.addEventListener('touchstart', event => {
    if (event.touches[0].clientX < window.innerWidth / 2) startMovingBall('left');
    else startMovingBall('right');
});

document.addEventListener('touchend', stopMovingBall);
