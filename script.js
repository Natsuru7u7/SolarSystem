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

// Crear la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2a7de1, 
  emissive: 0x0a3d8f, // Emisión azul tenue
  emissiveIntensity: 0.5 
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Crear la Luna
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xbababa, 
  emissive: 0x333333, // Emisión gris tenue
  emissiveIntensity: 0.3 
});
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

  // La luz principal sigue la posición de la cámara para mejorar la iluminación
  light.position.copy(camera.position);

  controls.update();
  renderer.render(scene, camera);
}

// Cargar texturas con TextureLoader
const textureLoader = new THREE.TextureLoader();

// Textura de la Tierra
const earthColorTexture = textureLoader.load('earth.jpg'); // Mapa de color
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthColorTexture // Aplica la textura de color
});

// Crear la Tierra con textura
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Textura de la Luna
const moonColorTexture = textureLoader.load('moon.jpg'); // Mapa de color
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonColorTexture // Aplica la textura de color
});

// Crear la Luna con textura
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moonOrbit.add(moon);



animate();
