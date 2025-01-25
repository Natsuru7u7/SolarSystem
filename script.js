// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Crear la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2a7de1 }); // Azul para la Tierra
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Crear la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xbababa }); // Gris para la Luna
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Orbitar la Luna
const moonOrbit = new THREE.Object3D();
scene.add(moonOrbit);
moonOrbit.add(moon);

// Ajustar posiciones
moon.position.set(2, 0, 0); // La Luna orbita a 2 unidades de la Tierra
camera.position.set(0, 2, 5); // La cámara comienza mirando desde una perspectiva elevada

// Controles de la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animación
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Rotación de la Tierra
  earth.rotation.y += 0.01;

  // Rotación de la Luna alrededor de la Tierra
  const elapsedTime = clock.getElapsedTime();
  moonOrbit.rotation.y = elapsedTime * 0.5; // Ajusta la velocidad de la órbita si es necesario

  controls.update();
  renderer.render(scene, camera);
}

animate();
