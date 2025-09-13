const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Mouse Control
canvas.addEventListener('mousemove', function(evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(Math.min(playerY, canvas.height - PADDLE_HEIGHT), 0);
});

// Game Functions
function drawPaddle(x, y) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

function drawCenterLine() {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 18]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScores() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
  ctx.fillText(aiScore, canvas.width / 2 + 36, 50);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() * 2 - 1);
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and Bottom wall collision
  if (ballY - BALL_RADIUS < 0) {
    ballY = BALL_RADIUS;
    ballSpeedY = -ballSpeedY;
  }
  if (ballY + BALL_RADIUS > canvas.height) {
    ballY = canvas.height - BALL_RADIUS;
    ballSpeedY = -ballSpeedY;
  }

  // Player paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ballSpeedX = -ballSpeedX;
    // Add effect based on where the ball hits the paddle
    let hitPoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY = hitPoint * 5;
  }

  // AI paddle collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_RADIUS;
    ballSpeedX = -ballSpeedX;
    let hitPoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY = hitPoint * 5;
  }

  // Scoring
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function updateAI() {
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 18) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + 18) {
    aiY -= AI_SPEED;
  }
  aiY = Math.max(Math.min(aiY, canvas.height - PADDLE_HEIGHT), 0);
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCenterLine();
  drawScores();
  drawPaddle(PLAYER_X, playerY);
  drawPaddle(AI_X, aiY);
  drawBall(ballX, ballY);
}

function gameLoop() {
  updateBall();
  updateAI();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();