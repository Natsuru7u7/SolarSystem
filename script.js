// Constantes físicas
const G = 39.478; // Constante gravitacional en UA³/(M_solar * año²)
const sunMass = 1.0; // Masa del Sol en masas solares
const earthMass = 3e-6; // Masa de la Tierra en masas solares
const earthOrbitRadius = 10; // Semieje mayor en UA
const earthOrbitEccentricity = 0.0167; // Excentricidad orbital
const earthOrbitalPeriod = Math.sqrt((4 * Math.PI ** 2 * earthOrbitRadius ** 3) / (G * (sunMass + earthMass))); // Período orbital en años

// Función para resolver la ecuación de Kepler usando el método de Newton-Raphson
const solveKepler = (M, e, tolerance = 1e-6) => {
  let E = M; // Valor inicial para E (anomalía excéntrica)
  let delta = 1;
  while (Math.abs(delta) > tolerance) {
    delta = E - e * Math.sin(E) - M;
    E -= delta / (1 - e * Math.cos(E));
  }
  return E;
};

// Calcular coordenadas cartesianas desde la anomalía excéntrica
const calculateOrbitalPosition = (a, e, E) => {
  const x = a * (Math.cos(E) - e);
  const y = a * Math.sqrt(1 - e ** 2) * Math.sin(E);
  return { x, y };
};

// Función de animación
const animate = () => {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.00005; // Escalado del tiempo
  const M = (2 * Math.PI * time) / earthOrbitalPeriod; // Anomalía media
  const E = solveKepler(M % (2 * Math.PI), earthOrbitEccentricity); // Anomalía excéntrica
  const position = calculateOrbitalPosition(earthOrbitRadius, earthOrbitEccentricity, E);

  // Actualizar posición de la Tierra
  earth.position.set(position.x, 0, position.y);

  // Rotación de la Tierra
  earth.rotation.y += 0.003;

  // Actualizar nubes
  clouds.position.copy(earth.position);
  clouds.rotation.y += 0.002;

  // Actualizar la Luna (simplificado para mantenerla orbitando la Tierra)
  const moonTheta = time * 12;
  moon.position.set(
    earth.position.x + moonOrbitRadius * Math.cos(moonTheta),
    0,
    earth.position.z + moonOrbitRadius * Math.sin(moonTheta)
  );

  controls.update();
  renderer.render(scene, camera);
};

animate();
