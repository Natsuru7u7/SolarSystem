const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/sun.jpg');
const earthTexture = textureLoader.load('textures/earth.jpg');
const moonTexture = textureLoader.load('textures/moon.jpg');

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

earth.position.set(10, 0, 0);
moon.position.set(12, 0, 0);

let earthAngle = 0;
let moonAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;
  earth.rotation.y += 0.01;
  moon.rotation.y += 0.02;

  earthAngle += 0.01;
  moonAngle += 0.05;

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

camera.position.z = 20;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
