import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(100, 70, 160);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("app").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(100, 120, 60);
sun.castShadow = true;
scene.add(sun);

const grassMat = new THREE.MeshStandardMaterial({
  color: 0x2e7d32,
  roughness: 0.9,
});
const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 250), grassMat);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

const roadMat = new THREE.MeshStandardMaterial({
  color: 0x2c2c2c,
  roughness: 0.85,
});
const road = new THREE.Mesh(new THREE.PlaneGeometry(250, 14), roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.02, 0);
road.receiveShadow = true;
scene.add(road);

const court = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), roadMat);
court.rotation.x = -Math.PI / 2;
court.position.set(-75, 5, -50);
court.receiveShadow = true;
scene.add(court);

const width = 12;
const height = 10;
const depth = 60;

const building1 = new THREE.Group();
const body1 = new THREE.Mesh(
  new THREE.BoxGeometry(20, height, depth),
  new THREE.MeshStandardMaterial({ color: 0x1565c0 }),
);
body1.position.y = height / 2;
building1.add(body1);

const roof1 = new THREE.Mesh(
  new THREE.BoxGeometry(20 + 0.5, 0.5, depth + 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffffff }),
);
roof1.position.y = height + 0.25;
building1.add(roof1);

building1.position.set(-70, 0, -25);
building1.rotation.y = THREE.MathUtils.degToRad(90);
scene.add(building1);

const building2 = new THREE.Group();
const body2 = new THREE.Mesh(
  new THREE.BoxGeometry(width, height, depth),
  new THREE.MeshStandardMaterial({ color: 0x1565c0 }),
);
body2.position.y = height / 2;
building2.add(body2);

const roof2 = new THREE.Mesh(
  new THREE.BoxGeometry(width + 0.5, 0.5, depth + 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffffff }),
);
roof2.position.y = height + 0.25;
building2.add(roof2);

building2.position.set(50, 0, -25);
building2.rotation.y = THREE.MathUtils.degToRad(75);
scene.add(building2);

const building3 = new THREE.Group();
const body3 = new THREE.Mesh(
  new THREE.BoxGeometry(width, height, 30),
  new THREE.MeshStandardMaterial({ color: 0x1565c0 }),
);
body3.position.y = height / 2;
building3.add(body3);

const roof3 = new THREE.Mesh(
  new THREE.BoxGeometry(width + 0.5, 0.5, 30 + 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffffff }),
);
roof3.position.y = height + 0.25;
building3.add(roof3);

building3.position.set(50, 0, 20);
building3.rotation.y = THREE.MathUtils.degToRad(90);
scene.add(building3);

const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });

function createTree(x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 5),
    trunkMaterial,
  );
  trunk.position.y = 2.5;
  tree.add(trunk);

  const leaves = new THREE.Mesh(new THREE.ConeGeometry(2, 6, 8), treeMaterial);
  leaves.position.y = 7;
  tree.add(leaves);

  tree.position.set(x, 0, z);
  tree.castShadow = true;
  tree.receiveShadow = true;

  scene.add(tree);
}

function plantTreesAroundBuilding(building, width, depth, spacing = 6) {
  const pos = building.position;

  for (let i = -1; i <= 1; i++) {
    createTree(pos.x + width / 2 + 1, pos.z + i * spacing);
  }

  for (let i = -1; i <= 1; i++) {
    createTree(pos.x - width / 2 - 1, pos.z + i * spacing);
  }

  for (let i = -1; i <= 1; i++) {
    createTree(pos.x + i * spacing, pos.z - depth / 2 - 1);
  }
}

plantTreesAroundBuilding(building1, 80, 80);
plantTreesAroundBuilding(building2, 90, 100);
plantTreesAroundBuilding(building3, -50, -50);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
