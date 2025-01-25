// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz ambiental para iluminar uniformemente toda la escena
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz blanca suave
scene.add(ambientLight);

// Luz puntual principal
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Luz adicional desde el lado opuesto para evitar sombras oscuras
const secondLight = new THREE.PointLight(0xffffff, 1);
secondLight.position.set(-5, -5, -5);
scene.add(secondLight);

// Cargar texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg'); // Mapa de color
const earthBumpMap = textureLoader.load('bump.jpg'); // Mapa de relieve (opcional)
const cloudTexture = textureLoader.load('cloud.jpg'); // Mapa de nubes (opcional)

// Material para la Tierra
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,      // Mapa de color
  bumpMap: earthBumpMap,  // Mapa de relieve (opcional)
  bumpScale: 0.05         // Escala del relieve
});

// Geometría y malla de la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Material para las nubes
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: cloudTexture,
  transparent: true, // Hace que el fondo sea transparente
  opacity: 0.8      // Ajusta la opacidad de las nubes
});

// Geometría y malla de las nubes
const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32); // Ligeramente más grande que la Tierra
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Geometría, material y malla de la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0xbababa,
  emissive: 0x333333, // Emisión gris tenue
  emissiveIntensity: 0.3
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

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

  // Rotación de las nubes
  clouds.rotation.y += 0.005; // Rotación lenta de las nubes

  // Rotación de la Luna alrededor de la Tierra
  const elapsedTime = clock.getElapsedTime();
  moonOrbit.rotation.y = elapsedTime * 0.5; // Ajusta la velocidad de la órbita

  // La luz principal sigue la posición de la cámara para mejorar la iluminación
  light.position.copy(camera.position);

  controls.update();
  renderer.render(scene, camera);
}

animate();
