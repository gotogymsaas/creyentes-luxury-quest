console.log("main.js cargado correctamente");

// Iniciar el juego al hacer clic en "Iniciar sesión"
document.addEventListener("DOMContentLoaded", function() {
  let startButton = document.getElementById("start-button");
  if (startButton) {
    startButton.addEventListener("click", function() {
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("mission-info").style.display = "block";
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
      startGame();
    });
  } else {
    console.log("No se encontró el botón de inicio");
  }
});

// Función para dibujar paredes con degradado y esquinas redondeadas (efecto grafeno y oro líquido)
function drawRoundedWall(ctx, x, y, width, height, radius) {
  let grad = ctx.createLinearGradient(x, y, x, y + height);
  grad.addColorStop(0, "#3d3d3d");  // Grafeno (gris metálico)
  grad.addColorStop(1, "#d4af37");    // Oro líquido suave
  ctx.fillStyle = grad;
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

// Laberinto clásico: 1 = pared, 0 = espacio (donde se muestran los logos)
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

// Estado de los logos (pellets) sin recolectar
let pelletsCollected = [];
for (let r = 0; r < rows; r++) {
  pelletsCollected[r] = [];
  for (let c = 0; c < cols; c++) {
    pelletsCollected[r][c] = (maze[r][c] === 0) ? false : true;
  }
}

let score = 0;
let startTime = 0;

// Imagen para los pellets (logo de GoToGym reducido)
let pelletImg = new Image();
pelletImg.src = "logo.png";
const pelletSize = 20;

// Configuración del jugador (Pac-Man feliz y animado con pequeño ojo)
let player = {
  x: cellSize + cellSize/2,
  y: cellSize + cellSize/2,
  radius: cellSize/2 - 5,
  direction: {x: 0, y: 0},
  speed: 2
};

// Configuración de los fantasmas ("El Estrés") – ahora tres, iniciando en celdas válidas
let ghosts = [
  {
    x: 7 * cellSize + cellSize/2,
    y: 4 * cellSize + cellSize/2,
    radius: cellSize/2 - 5,
    direction: {x: 1, y: 0},
    speed: 2
  },
  {
    x: 10 * cellSize + cellSize/2,
    y: 6 * cellSize + cellSize/2,
    radius: cellSize/2 - 5,
    direction: {x: -1, y: 0},
    speed: 2
  },
  {
    x: 11 * cellSize + cellSize/2,
    y: 3 * cellSize + cellSize/2,
    radius: cellSize/2 - 5,
    direction: {x: 0, y: 1},
    speed: 2
  }
];

function startGame() {
  score = 0;
  startTime = performance.now();
  // Reiniciar pellets
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0) pelletsCollected[r][c] = false;
    }
  }
  gameLoop();
}

function gameLoop() {
  update();
  draw();
  if (checkMissionComplete()) {
    displayCongratulations();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function checkMissionComplete() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !pelletsCollected[r][c]) {
        return false;
      }
    }
  }
  return true;
}

function update() {
  // Actualiza la posición del jugador si no colisiona con pared
  let newX = player.x + player.direction.x * player.speed;
  let newY = player.y + player.direction.y * player.speed;
  if (!collidesWithWall(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
  // Recolecta el logo (pellet)
  let col = Math.floor(player.x / cellSize);
  let row = Math.floor(player.y / cellSize);
  if (maze[row][col] === 0 && !pelletsCollected[row][col]) {
    pelletsCollected[row][col] = true;
    score += 10;
    // Aquí se puede agregar una animación de destellos (opcional)
  }
  // Actualiza movimiento de cada fantasma
  ghosts.forEach(ghost => {
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
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPellets();
  drawPlayer();
  drawGhosts();
  drawScore();
  drawTimer();
}

function drawMaze() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 1) {
        drawRoundedWall(ctx, c * cellSize, r * cellSize, cellSize, cellSize, 8);
      }
    }
  }
}

function drawPellets() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 0 && !pelletsCollected[r][c]) {
        ctx.drawImage(pelletImg, c * cellSize + cellSize/2 - pelletSize/2, r * cellSize + cellSize/2 - pelletSize/2, pelletSize, pelletSize);
      }
    }
  }
}

function drawPlayer() {
  let currentTime = performance.now();
  let mouthAngle = 0.25 * Math.PI * (1 + Math.sin(currentTime / 150));
  let grad = ctx.createRadialGradient(player.x, player.y, player.radius * 0.3, player.x, player.y, player.radius);
  grad.addColorStop(0, "#ffff66");
  grad.addColorStop(1, "#ffff00");
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(player.x, player.y);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.closePath();
  // Dibujar el pequeño ojo clásico
  ctx.beginPath();
  ctx.arc(player.x + player.radius/3, player.y - player.radius/2, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    drawGhostShape(ghost);
  });
}

function drawGhostShape(ghost) {
  ctx.beginPath();
  // Cabeza (semicírculo)
  ctx.arc(ghost.x, ghost.y, ghost.radius, Math.PI, 0, false);
  // Base ondulada (dividida en 3 segmentos)
  let segment = (ghost.radius * 2) / 3;
  ctx.lineTo(ghost.x + ghost.radius, ghost.y + ghost.radius);
  ctx.arc(ghost.x + ghost.radius - segment/2, ghost.y + ghost.radius, segment/2, 0, Math.PI, true);
  ctx.arc(ghost.x, ghost.y + ghost.radius, segment/2, 0, Math.PI, true);
  ctx.arc(ghost.x - ghost.radius + segment/2, ghost.y + ghost.radius, segment/2, 0, Math.PI, true);
  ctx.closePath();
  let grad = ctx.createRadialGradient(ghost.x, ghost.y, ghost.radius * 0.3, ghost.x, ghost.y, ghost.radius);
  grad.addColorStop(0, "#ff6666");
  grad.addColorStop(1, "#ff0000");
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9dfe2";
  ctx.fillText("Tokens: " + score, 10, 30);
}

function drawTimer() {
  let elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#d9dfe2";
  ctx.fillText("Tiempo: " + elapsed + " s", canvas.width - 150, 30);
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

// Mostrar felicitación y enlace a la landing page cuando la misión se completa
function displayCongratulations() {
  // Detener el juego y limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Crear un overlay de felicitación
  let overlay = document.createElement("div");
  overlay.id = "congrats-overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "#d9dfe2";
  overlay.style.fontSize = "1.5em";
  overlay.style.zIndex = "1000";
  overlay.innerHTML = `
    <p>¡Felicidades!</p>
    <p>Has completado la misión en <strong>${((performance.now()-startTime)/1000).toFixed(2)} segundos</strong> con <strong>${score} Tokens</strong>.</p>
    <p>Descubre el lujo exclusivo en <a href="https://gotogymsbyjohnfrankalza.mailchimpsites.com/" target="_blank" style="color:#65d3a8; text-decoration:none;">Go To Gym by John Frank Alza</a></p>
    <button id="restart-button" style="padding:10px 20px; font-size:1em; margin-top:20px; background-color:#65d3a8; border:none; border-radius:5px; cursor:pointer;">Jugar de nuevo</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById("restart-button").addEventListener("click", function(){
    location.reload();
  });
}

