const bubbleBtn = document.getElementById('bubbleBtn');
const zenBtn = document.getElementById('zenBtn');
const gameContainer = document.getElementById('gameContainer');
const zenCanvas = document.getElementById('zenCanvas');
const scoreElement = document.getElementById('score');
const scoreValueElement = document.getElementById('scoreValue');

let score = 0;
let animationFrameId;
let zenParticles = [];

bubbleBtn.addEventListener('click', startBubbleGame);
zenBtn.addEventListener('click', startZenGame);

function resetState() {
  // stop zen animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  // clear bubbles
  gameContainer.innerHTML = '';
  score = 0;
  updateScore();
}

function startBubbleGame() {
  resetState();
  // show/hide appropriate elements
  gameContainer.classList.remove('hidden');
  scoreElement.classList.remove('hidden');
  zenCanvas.classList.add('hidden');
  // create bubbles
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
  scoreValueElement.textContent = score;
}

function startZenGame() {
  resetState();
  // prepare canvas
  zenCanvas.classList.remove('hidden');
  gameContainer.classList.add('hidden');
  scoreElement.classList.add('hidden');
  const ctx = zenCanvas.getContext('2d');
  // set canvas size to container size
  zenCanvas.width = gameContainer.clientWidth;
  zenCanvas.height = gameContainer.clientHeight;
  // initialize particles
  zenParticles = [];
  const particleCount = 80;
  for (let i = 0; i < particleCount; i++) {
    zenParticles.push(createParticle(zenCanvas.width, zenCanvas.height));
  }
  // animation loop
  function animate() {
    ctx.clearRect(0, 0, zenCanvas.width, zenCanvas.height);
    zenParticles.forEach(p => {
      // draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      // update position
      p.x += p.dx;
      p.y += p.dy;
      // bounce off edges
      if (p.x - p.r < 0 || p.x + p.r > zenCanvas.width) {
        p.dx *= -1;
      }
      if (p.y - p.r < 0 || p.y + p.r > zenCanvas.height) {
        p.dy *= -1;
      }
    });
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

function createParticle(maxWidth, maxHeight) {
  const radius = Math.random() * 4 + 2; // 2-6 px
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.5 + 0.3; // 0.3 - 0.8
  return {
    x: Math.random() * maxWidth,
    y: Math.random() * maxHeight,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    r: radius,
    color: getRandomColor(),
  };
}

function getRandomColor() {
  const colors = ['#007BFF', '#17A2B8', '#28A745', '#FFC107', '#6610F2'];
  return colors[Math.floor(Math.random() * colors.length)];
}