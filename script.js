// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controlador de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Configuración de luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiental
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Luz puntual (sol)
pointLight.position.set(5, 3, 5);
scene.add(pointLight);

// Cargar texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
earthTexture.wrapS = THREE.RepeatWrapping;
earthTexture.wrapT = THREE.RepeatWrapping;
earthTexture.minFilter = THREE.LinearFilter;

const earthBumpMap = textureLoader.load('bump.jpg');
const cloudTexture = textureLoader.load('cloud.jpg');
cloudTexture.wrapS = THREE.RepeatWrapping;
cloudTexture.wrapT = THREE.RepeatWrapping;
cloudTexture.minFilter = THREE.LinearFilter;

// Geometría y material de la Tierra
const earthGeometry = new THREE.SphereGeometry(1, 64, 64); // Más segmentos para suavizar
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  bumpMap: earthBumpMap,
  bumpScale: 0.05,
  roughness: 1,
  metalness: 0
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Nubes
const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64); // Un poco más grande que la Tierra
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.5
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Geometría y material de la Luna
const moonTexture = textureLoader.load('moon.jpg');
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  roughness: 1,
  metalness: 0
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Posicionar cámara
camera.position.set(3, 2, 5);

// Animación de la Tierra, nubes y la Luna
const animate = () => {
  requestAnimationFrame(animate);

  // Rotación de la Tierra
  earth.rotation.y += 0.003;

  // Rotación de las nubes
  clouds.rotation.y += 0.002;

  // Rotación de la Luna alrededor de la Tierra
  const time = Date.now() * 0.001;
  moon.position.set(
    Math.cos(time) * 3, // Radio de 3
    0,
    Math.sin(time) * 3
  );

  controls.update();
  renderer.render(scene, camera);
};

animate();
