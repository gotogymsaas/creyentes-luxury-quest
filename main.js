document.getElementById("start-button").addEventListener("click", function() {
  document.getElementById("start-screen").style.display = "none";
  const canvas = document.getElementById("gameCanvas");
  canvas.style.display = "block";
  startGame();
});

function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Llamamos a la función para dibujar un laberinto básico
  drawLabyrinth(ctx);
}

function drawLabyrinth(ctx) {
  // Ejemplo simple: dibuja un rectángulo representando el laberinto de lujo
  ctx.fillStyle = "#3d9fe3"; // Color placeholder, ajusta según la paleta
  ctx.fillRect(50, 50, 700, 500);
  
  // Aquí puedes agregar más detalles: paredes, power-ups, etc.
}

