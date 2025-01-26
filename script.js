// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controlador de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Configuración de luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Sol
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd700,
  emissive: 0xffaa00,
  emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0); // Sol en el origen
scene.add(sun);

// Luz direccional del Sol
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.copy(sun.position);
sunLight.castShadow = true;
scene.add(sunLight);

// Cargar texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
const earthBumpMap = textureLoader.load('bump.jpg');
const cloudTexture = textureLoader.load('cloud.jpg');
const moonTexture = textureLoader.load('moon.jpg');

// Tierra
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

// Nubes de la Tierra
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Luna
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

// Líneas orbitales
const createOrbitLine = (radius, segments = 128) => {
  const orbitGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    positions.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  }
  orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  return new THREE.Line(orbitGeometry, orbitMaterial);
};

// Añadir órbitas
const earthOrbit = createOrbitLine(10); // Orbita de la Tierra alrededor del Sol
scene.add(earthOrbit);

const moonOrbit = createOrbitLine(3.84); // Orbita de la Luna alrededor de la Tierra
scene.add(moonOrbit);

// Parámetros del sistema solar
const G = 1; // Constante gravitacional simplificada
const sunMass = 1.989; // Masa del Sol relativa
const earthMass = 0.000003; // Masa de la Tierra relativa
const semiMajorAxis = 10; // Semieje mayor de la órbita
const eccentricity = 0.0167; // Excentricidad de la órbita

let theta = 0; // Anomalía verdadera inicial
const dt = 0.01; // Incremento de tiempo

// Actualización de la posición de la Tierra
const updateEarthPosition = () => {
  // Distancia Tierra-Sol en la órbita elíptica
  const r = semiMajorAxis * (1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(theta));

  // Posición de la Tierra
  earth.position.set(
    r * Math.cos(theta), // Coordenada X
    0,
    r * Math.sin(theta) // Coordenada Z
  );

  // Velocidad angular ajustada (ley de áreas iguales)
  const angularVelocity = Math.sqrt(G * sunMass / r ** 3);
  theta += angularVelocity * dt;
};

// Cámara
camera.position.set(15, 10, 25);

// Animación
const animate = () => {
  requestAnimationFrame(animate);

  updateEarthPosition(); // Actualiza la posición orbital de la Tierra

  // Movimiento orbital de la Luna alrededor de la Tierra
  const moonTheta = theta * 12; // Más rápido que la Tierra
  moon.position.set(
    earth.position.x + 3.84 * Math.cos(moonTheta),
    0,
    earth.position.z + 3.84 * Math.sin(moonTheta)
  );

  // Rotación de la Tierra y movimiento de nubes
  earth.rotation.y += 0.003;
  clouds.rotation.y += 0.002;

  // Sincronizar las nubes con la Tierra
  clouds.position.copy(earth.position);

  controls.update();
  renderer.render(scene, camera);
};

animate();
