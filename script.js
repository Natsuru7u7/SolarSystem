// Selecciona el canvas y establece el contexto
const canvas = document.getElementById("solar-system");
const ctx = canvas.getContext("2d");

// Dibuja un fondo negro
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Dibuja un "sol" en el centro
ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
ctx.fill();

// Dibuja un planeta orbitando alrededor del sol
ctx.fillStyle = "blue";
ctx.beginPath();
ctx.arc(canvas.width / 2 + 150, canvas.height / 2, 20, 0, Math.PI * 2);
ctx.fill();
