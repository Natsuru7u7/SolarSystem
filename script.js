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

// Cargar texturas para la Tierra y la Luna
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/8/8f/Earthmap1000x500compac.jpg');
const moonTexture = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Color_Moon_LRO_June_2009.jpg');

// Crear la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Crear la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Orbitar la Luna
const moonOrbit = new THREE.Object3D();
scene.add(moonOrbit);
moonOrbit.add(moon);

// Ajustar posiciones
moon.position.set(2, 0, 0);
camera.position.set(0, 2, 5);

// Control de la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animación
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Rotación de la Tierra
  earth.rotation.y += 0.01;

  // Rotación de la Luna alrededor de la Tierra
  const elapsedTime = clock.getElapsedTime();
  moonOrbit.rotation.y = elapsedTime * 0.5;

  controls.update();
  renderer.render(scene, camera);
}

animate();
