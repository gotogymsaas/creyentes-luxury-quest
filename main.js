// Mensaje para confirmar que main.js se carga
console.log("main.js cargado correctamente");

// Espera a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");

  // Verifica si el botón existe
  let startButton = document.getElementById("start-button");
  console.log("startButton:", startButton);
  if (startButton) {
    startButton.addEventListener("click", function() {
      console.log("Botón 'Iniciar la misión' clickeado");
      // Ocultar pantalla de inicio
      document.getElementById("start-screen").style.display = "none";
      // Mostrar el canvas
      const canvas = document.getElementById("gameCanvas");
      canvas.style.display = "block";
      startGame();
    });
  } else {
    console.log("No se encontró el botón de inicio");
  }
});

function startGame() {
  console.log("startGame ejecutado");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  drawLabyrinth(ctx);
}

function drawLabyrinth(ctx) {
  console.log("drawLabyrinth ejecutado");
  ctx.fillStyle = "#3d9fe3";
  ctx.fillRect(50, 50, 700, 500);
}

