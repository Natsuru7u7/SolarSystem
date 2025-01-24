// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texturas
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('sun.jpg'); // Textura del Sol
const earthTexture = textureLoader.load('earth.jpg'); // Textura de la Tierra
const moonTexture = textureLoader.load('moon.jpg'); // Textura de la Luna

// Tamaños y geometrías
const sunGeometry = new THREE.SphereGeometry(5, 32, 32); // Sol
const earthGeometry = new THREE.SphereGeometry(2, 32, 32); // Tierra
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Luna

// Materiales
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });

// Meshes
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Luces
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0); // Luz en el Sol
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental tenue
scene.add(ambientLight);

// Posición inicial
earth.position.set(10, 0, 0); // Tierra a 10 unidades del Sol
moon.position.set(12, 0, 0); // Luna a 2 unidades de la Tierra

// Variables de órbita y rotación
let earthAngle = 0;
let moonAngle = 0;

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Rotación sobre el eje
  sun.rotation.y += 0.001;
  earth.rotation.y += 0.01;
  moon.rotation.y += 0.02;

  // Órbitas
  earthAngle += 0.01; // Orbita de la Tierra alrededor del Sol
  moonAngle += 0.05; // Orbita de la Luna alrededor de la Tierra

  earth.position.set(
    10 * Math.cos(earthAngle),
    0,
    10 * Math.sin(earthAngle)
  );

  moon.position.set(
    earth.position.x + 2 * Math.cos(moonAngle),
    0,
    earth.position.z + 2 * Math.sin(moonAngle)
  );

  renderer.render(scene, camera);
}

// Posición inicial de la cámara
camera.position.z = 20;

// Control del tamaño del canvas al cambiar ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicia la animación
animate();
