const canvas = document.getElementById("solar-system");
const ctx = canvas.getContext("2d");

// Variables para la "cámara"
let cameraX = 0;
let cameraY = 0;
let zoom = 1;

// Dibujar el sistema solar
function drawSystem() {
  // Limpia el canvas
  ctx.resetTransform(); // Resetea transformaciones previas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Aplica la transformación de la cámara
  ctx.translate(canvas.width / 2, canvas.height / 2); // Centra el origen
  ctx.scale(zoom, zoom); // Aplica el zoom
  ctx.translate(-cameraX, -cameraY); // Mueve la cámara

  // Dibuja el "Sol"
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();

  // Dibuja un planeta
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(150, 0, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Actualiza la pantalla
function update() {
  drawSystem();
  requestAnimationFrame(update);
}

// Maneja el zoom con la rueda del ratón
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomFactor = 0.1; // Incremento o decremento del zoom
  if (event.deltaY < 0) {
    zoom += zoomFactor; // Zoom in
  } else {
    zoom = Math.max(0.1, zoom - zoomFactor); // Zoom out (límite mínimo)
  }
});

// Maneja el movimiento de la cámara con clic y arrastre
let isDragging = false;
let dragStartX, dragStartY;

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  dragStartX = event.offsetX;
  dragStartY = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const dx = (event.offsetX - dragStartX) / zoom; // Ajuste según el zoom
    const dy = (event.offsetY - dragStartY) / zoom;
    cameraX -= dx;
    cameraY -= dy;
    dragStartX = event.offsetX;
    dragStartY = event.offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

// Inicia la simulación
update();
