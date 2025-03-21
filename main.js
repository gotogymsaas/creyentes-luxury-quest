console.log("main.js cargado correctamente");

// Obtener el botón de inicio y agregar el event listener
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

// Definir el avatar de forma global
let avatar = { x: 100, y: 100, radius: 10, color: "#d9dfe2" };

function startGame() {
  console.log("startGame ejecutado");
  redrawGame();

  // Agregar event listener para mover el avatar con las teclas de flecha
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
  ctx.fillStyle = "#3d9fe3"; // Azul para el laberinto
  ctx.fillRect(50, 50, 700, 500);
}

function drawAvatar(ctx) {
  console.log("drawAvatar ejecutado");
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.radius, 0, Math.PI * 2);
  ctx.fillStyle = avatar.color;
  ctx.fill();
  ctx.closePath();
}

