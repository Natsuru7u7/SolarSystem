// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añadir una luz
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0); // El Sol será la fuente de luz
scene.add(light);

// Crear el Sol
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Función para crear planetas
function createPlanet(radius, distance, color) {
  const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({ color: color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  // Añadir órbita visual (opcional)
  const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.05, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2; // Colocar en el plano horizontal
  scene.add(orbit);

  return { mesh: planet, distance, angle: Math.random() * Math.PI * 2 };
}

// Crear los planetas
const planets = [
  createPlanet(1, 10, 0x00ff00), // Planeta 1 (verde)
  createPlanet(1.5, 15, 0x0000ff), // Planeta 2 (azul)
  createPlanet(2, 20, 0xff0000) // Planeta 3 (rojo)
];
planets.forEach(planet => scene.add(planet.mesh));

// Ajustar posición inicial de la cámara
camera.position.z = 50;

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Mover planetas en sus órbitas
  planets.forEach(planet => {
    planet.angle += 0.01; // Incrementar el ángulo
    planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
    planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
  });

  renderer.render(scene, camera);
}

// Llamar a la animación
animate();
