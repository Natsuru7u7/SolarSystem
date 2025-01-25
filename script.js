// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding; // Corrección gamma
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; // Ajusta exposición
document.body.appendChild(renderer.domElement);

// Fondo oscuro
scene.background = new THREE.Color(0x000000); // Fondo negro

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Luz tenue
scene.add(ambientLight);

// Luz puntual principal
const light = new THREE.PointLight(0xffffff, 1); // Luz principal ajustada
light.position.set(5, 5, 5);
scene.add(light);

// Luz secundaria
const secondLight = new THREE.PointLight(0xffffff, 0.5); // Luz de relleno
secondLight.position.set(-5, -5, -5);
scene.add(secondLight);

// Cargar texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
const earthBumpMap = textureLoader.load('bump.jpg');
const cloudTexture = textureLoader.load('cloud.jpg');

// Material para la Tierra
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  bumpMap: earthBumpMap,
  bumpScale: 0.05,
  roughness: 1,
  metalness: 0
});

// Geometría y malla de la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Material para las nubes
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5
});

// Geometría y malla de las nubes
const cloudGeometry = new THREE.SphereGeometry(1.01, 32, 32);
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Geometría, material y malla de la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0xbababa,
  emissive: 0x333333,
  emissiveIntensity: 0.3
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

// Orbitar la Luna
const moonOrbit = new THREE.Object3D();
scene.add(moonOrbit);
moonOrbit.add(moon);

// Ajustar posiciones
moon.position.set(2, 0, 0);
camera.position.set(0, 2, 5);

// Controles de la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animación
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.01;
  clouds.rotation.y += 0.005;
  moonOrbit.rotation.y = clock.getElapsedTime() * 0.5;

  controls.update();
  renderer.render(scene, camera);
}

animate();
