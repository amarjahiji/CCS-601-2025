import * as THREE from 'three';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 30);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const cubes = [];
for (let i = 0; i < 20; i++) {
  const width = Math.random() * 2 + 0.5;
  const height = Math.random() * 2 + 0.5;
  const depth = Math.random() * 2 + 0.5;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random())
  });

  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 40
  );

  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;

  cube.userData = {
    originalColor: material.color.clone(),
    width,
    height,
    depth,
    id: i,
    baseY: cube.position.y
  };

  cubes.push(cube);
  scene.add(cube);
}

const infoPanel = document.createElement('div');
infoPanel.id = 'info-panel';
infoPanel.innerHTML = '<p>Click a cube to see its information here.</p>';
document.body.appendChild(infoPanel);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedMesh = null;

function onClick(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cubes, true);

  if (selectedMesh) {
    selectedMesh.material.color.copy(selectedMesh.userData.originalColor);
    selectedMesh.material.emissive.setHex(0x000000);
    selectedMesh.scale.set(1, 1, 1);
    selectedMesh.position.y = selectedMesh.userData.baseY;
  }

  if (hits.length > 0) {
    selectedMesh = hits[0].object;

    selectedMesh.material.emissive.setHex(0x555555);
    selectedMesh.scale.set(1.1, 1.1, 1.1);

    infoPanel.innerHTML = `
      <h3>Cube #${selectedMesh.userData.id + 1}</h3>

      <div class="info-section">
        <h4>Position</h4>
        <p>X: ${selectedMesh.position.x.toFixed(2)}</p>
        <p>Y: ${selectedMesh.position.y.toFixed(2)}</p>
        <p>Z: ${selectedMesh.position.z.toFixed(2)}</p>
      </div>

      <div class="info-section">
        <h4>Size</h4>
        <p>Width: ${selectedMesh.userData.width.toFixed(2)}</p>
        <p>Height: ${selectedMesh.userData.height.toFixed(2)}</p>
        <p>Depth: ${selectedMesh.userData.depth.toFixed(2)}</p>
      </div>
    `;
  } else {
    selectedMesh = null;
    infoPanel.innerHTML = '<p class="no-selection">No object selected. Click a cube!</p>';
  }
}

window.addEventListener('pointerdown', onClick);

// Resize
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  cubes.forEach(cube => {
    cube.rotation.x += 0.002;
    cube.rotation.y += 0.002;
  });

  if (selectedMesh) {
    const baseY = selectedMesh.userData.baseY;
    selectedMesh.position.y = baseY + Math.sin(t * 2) * 0.5;
  }

  renderer.render(scene, camera);
}

animate();
