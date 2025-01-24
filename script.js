const canvas = document.getElementById("solar-system");
const ctx = canvas.getContext("2d");

// Variables para la "cámara"
let cameraX = 0;
let cameraY = 0;
let zoom = 1;

// Parámetros de la órbita
let earthAngle = 0; // Ángulo actual de la órbita de la Tierra
let moonAngle = 0; // Ángulo actual de la órbita de la Luna

// Radio de las órbitas (en píxeles)
const earthOrbitRadius = 200; // Tierra orbitando al "sol"
const moonOrbitRadius = 50; // Luna orbitando a la Tierra

// Velocidades angulares (en radianes por frame)
const earthOrbitSpeed = 0.01; // Velocidad de la Tierra
const moonOrbitSpeed = 0.05; // Velocidad de la Luna

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

  // Calcula la posición de la Tierra
  const earthX = earthOrbitRadius * Math.cos(earthAngle);
  const earthY = earthOrbitRadius * Math.sin(earthAngle);

  // Dibuja la órbita de la Tierra
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(0, 0, earthOrbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Dibuja la Tierra
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(earthX, earthY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Calcula la posición de la Luna (relativa a la Tierra)
  const moonX = earthX + moonOrbitRadius * Math.cos(moonAngle);
  const moonY = earthY + moonOrbitRadius * Math.sin(moonAngle);

  // Dibuja la órbita de la Luna
  ctx.strokeStyle = "gray";
  ctx.beginPath();
  ctx.arc(earthX, earthY, moonOrbitRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Dibuja la Luna
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(moonX, moonY, 10, 0, Math.PI * 2);
  ctx.fill();
}

// Actualiza las posiciones y redibuja el sistema solar
function update() {
  // Actualiza los ángulos de la Tierra y la Luna
  earthAngle += earthOrbitSpeed;
  moonAngle += moonOrbitSpeed;

  // Redibuja el sistema
  drawSystem();

  // Llama al siguiente frame
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
