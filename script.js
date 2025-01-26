// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Habilitar sombras
document.body.appendChild(renderer.domElement);

// Controlador de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Configuración de luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Luz ambiental tenue
scene.add(ambientLight);

// Añadir el Sol
const sunGeometry = new THREE.SphereGeometry(2, 32, 32); // Esfera para el Sol
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd700, // Amarillo dorado
  emissive: 0xffaa00, // Luz emitida para simular el brillo
  emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(10, 0, -15); // Posición del Sol lejos del sistema Tierra-Luna
scene.add(sun);

// Luz direccional del Sol
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // Luz brillante
sunLight.position.copy(sun.position); // La luz viene desde la posición del Sol
sunLight.castShadow = true; // Activar sombras
sunLight.shadow.mapSize.width = 2048; // Resolución de sombras
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 50;
scene.add(sunLight);

// Cargar texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
const earthBumpMap = textureLoader.load('bump.jpg');
const cloudTexture = textureLoader.load('cloud.jpg');
const moonTexture = textureLoader.load('moon.jpg');

// Geometría y material de la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  bumpMap: earthBumpMap,
  bumpScale: 0.05,
  roughness: 1,
  metalness: 0
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

// Nubes
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Geometría y material de la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 1,
  metalness: 0
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// Configurar cámara
camera.position.set(5, 3, 8);

// Parámetros del sistema Tierra-Luna
const moonOrbitRadius = 3.84; // Radio promedio en escala simplificada
const moonInclination = 5 * (Math.PI / 180); // Inclinación orbital en radianes
const earthMass = 5.972; // Masa de la Tierra (en escala relativa)
const moonMass = 0.073; // Masa de la Luna (en escala relativa)

// Cálculo del baricentro
const barycenterDistance = moonOrbitRadius * (moonMass / (earthMass + moonMass));

// Animación
const animate = () => {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0001; // Tiempo escalado para la órbita

  // Posición de la Luna (órbita inclinada y elíptica)
  const moonX = Math.cos(time) * moonOrbitRadius;
  const moonZ = Math.sin(time) * moonOrbitRadius * 0.98; // Simulación de excentricidad
  const moonY = Math.sin(time) * Math.sin(moonInclination);

  // Posicionar la Luna
  moon.position.set(moonX, moonY, moonZ);

  // Rotación sincrónica de la Luna
  moon.rotation.y = time;

  // Posicionar la Tierra alrededor del baricentro
  const earthX = -moonX * (moonMass / earthMass);
  const earthZ = -moonZ * (moonMass / earthMass);
  earth.position.set(earthX, 0, earthZ);
  clouds.position.copy(earth.position);

  // Rotación de la Tierra y las nubes
  earth.rotation.y += 0.003;
  clouds.rotation.y += 0.002;

  controls.update();
  renderer.render(scene, camera);
};

animate();
