import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.1;
scene.add(group);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x00ff88 }),
);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(1.5, 3, 32),
  new THREE.MeshStandardMaterial({ color: 0x2d199e }),
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1.5, 0.5, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xff2200 }),
);
torus.position.x = -6;
group.add(torus);
cone.position.x = 0;
group.add(cone);
sphere.position.x = 6;
group.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  group.rotateZ(0.1);
  torus.rotateX(0.1);
  sphere.rotateX(0.1);
  cone.rotateX(0.1);
}

animate();
