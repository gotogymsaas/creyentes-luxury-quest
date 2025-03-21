console.log("main.js cargado correctamente");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");
  let startButton = document.getElementById("start-button");
  console.log("startButton:", startButton);
  if (startButton) {
    startButton.addEventListener("click", function() {
      console.log("Botón 'Iniciar la misión' clickeado");
      document.getElementById("start-screen").style.display = "none";
      const canvas = document.getElementById("gameCanvas");
      canvas.style.display = "block";
      startGame();
    });
  } else {
    console.log("No se encontró el botón de inicio");
  }
});

// Datos del avatar (se comporta como Pac‑Man)
let avatar = { x: 100, y: 100, radius: 10, color: "#d9dfe2" };

// Definir un laberinto básico usando un array de paredes (simulando un estilo Pac‑Man)
const walls = [
  // Bordes
  {x: 50, y: 50, w: 700, h: 10},
  {x: 50, y: 50, w: 10, h: 500},
  {x: 50, y: 540, w: 700, h: 10},
  {x: 740, y: 50, w: 10, h: 500},
  // Paredes internas horizontales
  {x: 150, y: 150, w: 500, h: 10},
  {x: 150, y: 300, w: 500, h: 10},
  {x: 150, y: 450, w: 500, h: 10},
  // Paredes internas verticales
  {x: 150, y: 150, w: 10, h: 310},
  {x: 640, y: 150, w: 10, h: 310},
];

function startGame() {
  console.log("startGame ejecutado");
  redrawGame();

  // Permite mover el avatar con las flechas
  document.addEventListener("keydown", function(event) {
    const step = 5;
    if (event.key === "ArrowUp") {
      avatar.y -= step;
    } else if (event.key === "ArrowDown") {
      avatar.y += step;
    } else if (event.key === "ArrowLeft") {
      avatar.x -= step;
    } else if (event.key === "ArrowRight") {
      avatar.x += step;
    }
    console.log("Avatar pos:", avatar.x, avatar.y);
    redrawGame();
  });
}

function redrawGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLabyrinth(ctx);
  drawAvatar(ctx);
}

function drawLabyrinth(ctx) {
  console.log("drawLabyrinth ejecutado");
  walls.forEach(wall => {
    ctx.fillStyle = "#3d9fe3"; // Azul para las paredes
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  });
}

function drawAvatar(ctx) {
  console.log("drawAvatar ejecutado");
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.radius, 0, Math.PI * 2);
  ctx.fillStyle = avatar.color;
  ctx.fill();
  ctx.closePath();
}

