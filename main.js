console.log("main.js cargado correctamente");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");
let startButton = document.getElementById("start-button");
if (startButton) {
  startButton.addEventListener("click", function() {
    console.log("Botón 'Iniciar la misión' clickeado");
    document.getElementById("start-screen").style.display = "none";
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block";
    startGame();
  });
}
      
      // Reproduce la música de fondo (el usuario ya interactuó, por lo que se permite)
let bgMusic = document.getElementById("bg-music");
if (bgMusic) {
  bgMusic.volume = 0.5;  // Ajusta el volumen al 50%
  bgMusic.play().then(() => {
    console.log("Música de fondo reproduciéndose");
  }).catch((error) => {
    console.log("Error al reproducir música de fondo:", error);
  });
}
      
      startGame();
    });
  } else {
    console.log("No se encontró el botón de inicio");
  }
});

// Función para ajustar el canvas según el tamaño de la ventana (responsive)
function resizeCanvas() {
  const canvas = document.getElementById("gameCanvas");
  const aspect = 4 / 3; // Relación de aspecto 800x600
  let width = window.innerWidth;
  if (width > 800) width = 800;
  let height = width / aspect;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let score = 0;

let avatar = { x: 100, y: 100, radius: 10, color: "#d9dfe2", speed: 3 };

// Generar pellets (puntos dorados)
let pellets = [];
for (let i = 0; i < 20; i++) {
  pellets.push({
    x: Math.random() * (canvas.width - 120) + 60,
    y: Math.random() * (canvas.height - 120) + 60,
    radius: 4,
    collected: false,
    color: "#d4af37"  // dorado
  });
}

// Generar fantasmas (obstáculos: "El Estrés")
let ghosts = [];
for (let i = 0; i < 3; i++) {
  ghosts.push({
    x: 200 + i * 150,
    y: 200,
    radius: 10,
    color: "#ff4d4d",  // rojo
    dx: (Math.random() < 0.5 ? -1 : 1) * 2,
    dy: (Math.random() < 0.5 ? -1 : 1) * 2
  });
}

// Definir paredes del laberinto (se adapta al canvas)
function getWalls() {
  return [
    { x: 50, y: 50, w: canvas.width - 100, h: 10 },
    { x: 50, y: 50, w: 10, h: canvas.height - 100 },
    { x: 50, y: canvas.height - 50, w: canvas.width - 100, h: 10 },
    { x: canvas.width - 50, y: 50, w: 10, h: canvas.height - 100 },
    { x: 150, y: 150, w: canvas.width - 300, h: 10 },
    { x: 150, y: 300, w: canvas.width - 300, h: 10 },
    { x: 150, y: 450, w: canvas.width - 300, h: 10 },
    { x: 150, y: 150, w: 10, h: canvas.height - 300 },
    { x: canvas.width - 150, y: 150, w: 10, h: canvas.height - 300 }
  ];
}

let walls = getWalls();

// Capturar entradas del teclado
let keys = {};
document.addEventListener("keydown", function(e) {
  keys[e.key] = true;
});
document.addEventListener("keyup", function(e) {
  keys[e.key] = false;
});

function startGame() {
  score = 0;
  // Reinicia pellets (puedes regenerarlos si lo deseas)
  pellets.forEach(p => p.collected = false);
  // Actualiza las paredes según el tamaño del canvas
  walls = getWalls();
  gameLoop();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys["ArrowUp"]) avatar.y -= avatar.speed;
  if (keys["ArrowDown"]) avatar.y += avatar.speed;
  if (keys["ArrowLeft"]) avatar.x -= avatar.speed;
  if (keys["ArrowRight"]) avatar.x += avatar.speed;

  // Mantener al avatar dentro del área
  if (avatar.x < 60) avatar.x = 60;
  if (avatar.x > canvas.width - 60) avatar.x = canvas.width - 60;
  if (avatar.y < 60) avatar.y = 60;
  if (avatar.y > canvas.height - 60) avatar.y = canvas.height - 60;

  // Movimiento de fantasmas (rebote en los límites)
  ghosts.forEach(ghost => {
    ghost.x += ghost.dx;
    ghost.y += ghost.dy;
    if (ghost.x < 60 || ghost.x > canvas.width - 60) ghost.dx *= -1;
    if (ghost.y < 60 || ghost.y > canvas.height - 60) ghost.dy *= -1;
  });

  // Colisión: avatar y pellets
  pellets.forEach(p => {
    if (!p.collected && isColliding(avatar, p)) {
      p.collected = true;
      score += 10;
      console.log("Pellet collected! Score: " + score);
    }
  });

  // Colisión: avatar y fantasmas
  ghosts.forEach(ghost => {
    if (isColliding(avatar, ghost)) {
      alert("¡Has sido atrapado por El Estrés!");
      document.location.reload();
    }
  });
}

function isColliding(c1, c2) {
  let dx = c1.x - c2.x;
  let dy = c1.y - c2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLabyrinth();
  drawPellets();
  drawAvatar();
  drawGhosts();
  drawScore();
}

function drawLabyrinth() {
  walls.forEach(wall => {
    ctx.fillStyle = "#3d9fe3";
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  });
}

function drawPellets() {
  pellets.forEach(p => {
    if (!p.collected) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.closePath();
    }
  });
}

function drawAvatar() {
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.radius, 0, Math.PI * 2);
  ctx.fillStyle = avatar.color;
  ctx.fill();
  ctx.closePath();
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
    ctx.fillStyle = ghost.color;
    ctx.fill();
    ctx.closePath();
  });
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9dfe2";
  ctx.fillText("Score: " + score, canvas.width - 150, 30);
}

