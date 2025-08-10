const startBtn = document.getElementById('startBtn');
const gameContainer = document.getElementById('gameContainer');
const scoreText = document.getElementById('score');

let score = 0;

startBtn.addEventListener('click', startGame);

function startGame() {
  // Remove existing bubbles if any
  gameContainer.innerHTML = '';
  score = 0;
  updateScore();

  // create 30 bubbles
  for (let i = 0; i < 30; i++) {
    createBubble();
  }
}

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  const size = Math.random() * 60 + 20; // 20-80 px
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.left = Math.random() * (gameContainer.clientWidth - size) + 'px';
  bubble.style.top = Math.random() * (gameContainer.clientHeight - size) + 'px';
  bubble.addEventListener('click', () => {
    bubble.remove();
    score++;
    updateScore();
  });
  gameContainer.appendChild(bubble);
}

function updateScore() {
  scoreText.textContent = `Bubbles popped: ${score}`;
}
