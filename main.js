console.log("main.js cargado correctamente");

document.addEventListener("DOMContentLoaded", function() {
  let startButton = document.getElementById("start-button");
  if (startButton) {
    startButton.addEventListener("click", function() {
      document.getElementById("start-screen").style.display = "none";
      const canvas = document.getElementById("gameCanvas");
      canvas.style.display = "block";
      let bgMusic = document.getElementById("bg-music");
      if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
          console.log("Música de fondo reproduciéndose");
        }).catch((error) => {
          console.log("Error al reproducir música de fondo:", error);
        });
      }
      gameLoop();
    });
  } else {
    console.log("No se encontró el botón de inicio");
  }
});

// Función para dibujar rectángulos redondeados (suaviza los pasillos)
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Configuración del canvas y laberinto en cuadrícula
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
const cellSize = 40;
const rows = 9;
const cols = 15;

// Laberinto clásico: 1 = pared, 0 = espacio (donde se encuentran los logos)
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Inicializar estado de logos (pellets) sin recoger
let pelletsCollected = [];
for (let r = 0; r < rows; r++) {
  pelletsCollected[r] = [];
  for (let c = 0; c < cols; c++) {
    pelletsCollected[r][c] = (maze[r][c] === 0) ? false : true;
  }
}

let score = 0;

// Cargar imagen para los pellets (logo de GoToGym)
let pelletImg = new Image();
pelletImg.src = "logo.png";
const pelletSize = 20;

// Configuración del jugador (Pac-Man)
let player = {
  x: cellSize + cellSize/2,
  y: cellSize + cellSize/2,
  radius: cellSize/2 - 5,
  direction: {x: 0, y: 0},
  speed: 2
};

// Configuración del fantasma ("El Estrés")
// El fantasma solo se moverá por los pasillos, ya que se revisa colisión con paredes
let ghost = {
  x: 7 * cellSize + cellSize/2,
  y: 4 * cellSize + cellSize/2,
  radius: cellSize/2 - 5,
  direction: {x: 1, y: 0},
  speed: 2
};

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Actualiza la posición del jugador si no colisiona con pared
  let newX = player.x + player.direction.x * player.speed;
  let newY = player.y + player.direction.y * player.speed;
  if (!collidesWithWall(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
  // Recolecta el logo (pellet) en la celda correspondiente
  let col = Math.floor(player.x / cellSize);
  let row = Math.floor(player.y / cellSize);
  if (maze[row][col] === 0 && !pelletsCollected[row][col]) {
    pelletsCollected[row][col] = true;
    score += 10;
  }
  // Movimiento del fantasma: calcular posición nueva y evitar paredes
  let newGhostX = ghost.x + ghost.direction.x * ghost.speed;
  let newGhostY = ghost.y + ghost.direction.y * ghost.speed;
  if (!collidesWithWall(newGhostX, newGhostY)) {
    ghost.x = newGhostX;
    ghost.y = newGhostY;
  } else {
    ghost.direction = randomDirection();
  }
  // Colisión entre jugador y fantasma
  if (Math.hypot(player.x - ghost.x, player.y - ghost.y) < player.radius + ghost.radius) {
    alert("¡Has sido atrapado por El Estrés!");
    document.location.reload();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPellets();
  drawPlayer();
  drawGhost();
  drawScore();
}

function drawMaze() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 1) {
        ctx.fillStyle = "#3d9fe3"; // Color de marca para las paredes
        // Dibujar pared con esquinas redondeadas (minimalismo)
        drawRoundedRect(ctx, c * cellSize, r * cellSize, cellSize, cellSize, 5);
      }
    }
  }
}

function drawPellets() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !pelletsCollected[r][c]) {
        // Dibujar el logo reducido en lugar de un pellet
        ctx.drawImage(pelletImg, c * cellSize + cellSize/2 - pelletSize/2, r * cellSize + cellSize/2 - pelletSize/2, pelletSize, pelletSize);
      }
    }
  }
}

function drawPlayer() {
  ctx.beginPath();
  // Dibujar Pac-Man clásico con "boca" abierta
  ctx.arc(player.x, player.y, player.radius, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(player.x, player.y);
  ctx.fillStyle = "#FFFF00"; // Amarillo clásico
  ctx.fill();
  ctx.closePath();
}

function drawGhost() {
  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000"; // Rojo
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9dfe2";
  ctx.fillText("Score: " + score, 10, 30);
}

function collidesWithWall(x, y) {
  let col = Math.floor(x / cellSize);
  let row = Math.floor(y / cellSize);
  if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
  return maze[row][col] === 1;
}

function randomDirection() {
  const directions = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1}
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

// Capturar entradas del teclado para mover al jugador
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowUp") {
    player.direction = {x: 0, y: -1};
  } else if (e.key === "ArrowDown") {
    player.direction = {x: 0, y: 1};
  } else if (e.key === "ArrowLeft") {
    player.direction = {x: -1, y: 0};
  } else if (e.key === "ArrowRight") {
    player.direction = {x: 1, y: 0};
  }
});

