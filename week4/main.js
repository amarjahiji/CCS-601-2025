import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Dark background

const camera = new THREE.PerspectiveCamera(75, 800 / 600);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.ConeGeometry(1, 2, 32);
const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
// const geometry = new THREE.ConeGeometry(1, 2, 32);
// const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);

// Try different materials by uncommenting lines below

// Basic Material – no light interaction
// const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Lambert Material – reacts to ambient & diffuse light
// const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

// Standard Material – physically based (ambient + diffuse + specular)
const coneMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.4,
  roughness: 0.6,
});

const sphere = new THREE.Mesh(geometry, coneMaterial);
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // color, intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

ambientLight.intensity = 0.8;
directionalLight.position.set(-2, 1, 2);

function animate() {
  sphere.rotation.y += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
