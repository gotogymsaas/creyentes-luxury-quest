console.log("main.js cargado correctamente");

// Definir el laberinto: 1 = pared, 0 = pellet
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

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Establece tamaño del canvas basado en la cuadrícula
canvas.width = 600;
canvas.height = 600;
const cellSize = 40;
const rows = maze.length;
const cols = maze[0].length;

// Estado de los pellets (false = no recogido)
let pelletsCollected = [];
for (let r = 0; r < rows; r++) {
  pelletsCollected[r] = [];
  for (let c = 0; c < cols; c++) {
    pelletsCollected[r][c] = (maze[r][c] === 0) ? false : true;
  }
}

let score = 0;

// Posición inicial del jugador (Pac-Man): en el centro de la celda (1,1)
let player = {
  x: cellSize + cellSize/2,
  y: cellSize + cellSize/2,
  radius: cellSize/2 - 5,
  direction: {x: 0, y: 0},
  speed: 2
};

// Un fantasma: "El Estrés"
let ghost = {
  x: 7 * cellSize + cellSize/2,
  y: 4 * cellSize + cellSize/2,
  radius: cellSize/2 - 5,
  direction: {x: 1, y: 0},
  speed: 2
};

// Función principal de bucle de juego
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Actualiza posición del jugador con base en su dirección
  let newX = player.x + player.direction.x * player.speed;
  let newY = player.y + player.direction.y * player.speed;
  if (!collidesWithWall(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
  // Recoger pellet si está en la celda
  let col = Math.floor(player.x / cellSize);
  let row = Math.floor(player.y / cellSize);
  if (maze[row][col] === 0 && !pelletsCollected[row][col]) {
    pelletsCollected[row][col] = true;
    score += 10;
  }
  // Movimiento simple del fantasma
  ghost.x += ghost.direction.x * ghost.speed;
  ghost.y += ghost.direction.y * ghost.speed;
  if (ghost.x - ghost.radius < 0 || ghost.x + ghost.radius > canvas.width ||
      ghost.y - ghost.radius < 0 || ghost.y + ghost.radius > canvas.height ||
      collidesWithWall(ghost.x, ghost.y)) {
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
        ctx.fillStyle = "#0000FF"; // Paredes azules
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawPellets() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !pelletsCollected[r][c]) {
        ctx.beginPath();
        ctx.arc(c * cellSize + cellSize/2, r * cellSize + cellSize/2, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700"; // Dorado para los pellets
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPlayer() {
  // Dibujar "Pac-Man" (nuestro avatar) con forma de círculo abierto
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(player.x, player.y);
  ctx.fillStyle = "#FFFF00"; // Amarillo clásico
  ctx.fill();
  ctx.closePath();
}

function drawGhost() {
  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000"; // Fantasma rojo
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Score: " + score, 10, 20);
}

function collidesWithWall(x, y) {
  let col = Math.floor(x / cellSize);
  let row = Math.floor(y / cellSize);
  if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
  return maze[row][col] === 1;
}

function randomDirection() {
  let directions = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1}
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

// Capturar eventos del teclado para mover al jugador
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

// Iniciar el juego al hacer clic en el botón "Iniciar la misión"
let startButton = document.getElementById("start-button");
if (startButton) {
  startButton.addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
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

