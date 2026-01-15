import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("app").appendChild(renderer.domElement);

// OrbitControls for interactive camera navigation
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

//Ambient light for base illumination
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//Directional sunlight with shadow casting
const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(100, 120, 60);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 500;
sun.shadow.camera.left = -150;
sun.shadow.camera.right = 150;
sun.shadow.camera.top = 150;
sun.shadow.camera.bottom = -150;
scene.add(sun);

const animatedLight = new THREE.PointLight(0xffa500, 1, 100);
animatedLight.position.set(0, 20, 0);
animatedLight.castShadow = true;
scene.add(animatedLight);

const textureLoader = new THREE.TextureLoader();

//road and grass textures
const grassColorTexture = textureLoader.load("./textures/Stylized_Stone_Floor_010_basecolor.png");
const grassNormalTexture = textureLoader.load("./textures/Stylized_Stone_Floor_010_normal.png");

[grassColorTexture, grassNormalTexture].forEach(tex => {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(40, 25);
});

//grass material
const grassMat = new THREE.MeshStandardMaterial({
  color: 0x2e7d32,
  map: grassColorTexture,
  normalMap: grassNormalTexture,
  roughness: 0.9,
});

//Ground plane mesh
const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 250), grassMat);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

//wood textures
const woodColorTexture = textureLoader.load("./textures/Stylized_Wood_Floor_001_basecolor.png");
const woodNormalTexture = textureLoader.load("./textures/Stylized_Wood_Floor_001_normal.png");
const woodRoughnessTexture = textureLoader.load("./textures/Stylized_Wood_Floor_001_roughness.png");

[woodColorTexture, woodNormalTexture, woodRoughnessTexture].forEach(tex => {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(15, 1);
});

const roadMat = new THREE.MeshStandardMaterial({
  map: woodColorTexture,
  normalMap: woodNormalTexture,
  roughnessMap: woodRoughnessTexture,
  roughness: 0.85,
});

//road
const road = new THREE.Mesh(new THREE.PlaneGeometry(250, 14), roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.02, 0);
road.receiveShadow = true;
scene.add(road);

//volleyball court
const courtGroup = new THREE.Group();

// asphalt base
const asphaltMat = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.9,
});
const courtBase = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), asphaltMat);
courtBase.rotation.x = -Math.PI / 2;
courtBase.receiveShadow = true;
courtGroup.add(courtBase);

// court lines
const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const lineWidth = 0.15;
const outerLines = [
  { w: 28, h: lineWidth, x: 0, z: 6.5 },
  { w: 28, h: lineWidth, x: 0, z: -6.5 },
  { w: lineWidth, h: 13, x: 13.5, z: 0 },
  { w: lineWidth, h: 13, x: -13.5, z: 0 },
  { w: lineWidth, h: 13, x: 0, z: 0 },
];

outerLines.forEach(line => {
  const lineMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(line.w, line.h),
    lineMat
  );
  lineMesh.rotation.x = -Math.PI / 2;
  lineMesh.position.set(line.x, 0.01, line.z);
  courtGroup.add(lineMesh);
});

courtGroup.position.set(-75, 0.03, -50);
scene.add(courtGroup);

//buildings dimensions
const width = 12;
const height = 10;
const depth = 60;

//glass material for windows
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x88ccff,
  transparent: true,
  opacity: 0.4,
  roughness: 0.1,
  metalness: 0.1,
  transmission: 0.9,
  thickness: 0.5,
});

//function to create wall sections
function createWallSection(w, h, d, x, y, z, material) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  wall.position.set(x, y, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}

//building1
const building1 = new THREE.Group();
const wallMaterial1 = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.8 });

const b1Width = 20;
const b1Height = 10;
const b1Depth = 60;

// back wall
building1.add(createWallSection(b1Width, b1Height, 0.5, 0, b1Height/2, -b1Depth/2 + 0.25, wallMaterial1));

// front wall
const b1FrontPillars = [-10, -6, -2, 2, 6, 10];
b1FrontPillars.forEach(x => {
  building1.add(createWallSection(1, b1Height, 0.5, x, b1Height/2, b1Depth/2 - 0.25, wallMaterial1));
});
// floor
building1.add(createWallSection(b1Width, 1.5, 0.5, 0, 0.75, b1Depth/2 - 0.25, wallMaterial1));
//floor divider
building1.add(createWallSection(b1Width, 1, 0.5, 0, 5, b1Depth/2 - 0.25, wallMaterial1));
// ceiling
building1.add(createWallSection(b1Width, 1.5, 0.5, 0, b1Height - 0.75, b1Depth/2 - 0.25, wallMaterial1));
// windows
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 5; i++) {
    const xPos = -8 + i * 4;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), glassMaterial);
    glass.position.set(xPos, yPos, b1Depth/2 - 0.25);
    building1.add(glass);
  }
}

building1.add(createWallSection(0.5, 1.5, b1Depth, -b1Width/2 + 0.25, 0.75, 0, wallMaterial1)); // bottom
building1.add(createWallSection(0.5, 1, b1Depth, -b1Width/2 + 0.25, 5, 0, wallMaterial1)); // middle divider
building1.add(createWallSection(0.5, 1.5, b1Depth, -b1Width/2 + 0.25, b1Height - 0.75, 0, wallMaterial1)); // top
const b1SidePillars = [-28, -14, 0, 14, 28];
b1SidePillars.forEach(z => {
  building1.add(createWallSection(0.5, b1Height, 1, -b1Width/2 + 0.25, b1Height/2, z, wallMaterial1));
});
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 4; i++) {
    const zPos = -21 + i * 14;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 2.5), glassMaterial);
    glass.position.set(-b1Width/2 + 0.25, yPos, zPos);
    glass.rotation.y = -Math.PI/2;
    building1.add(glass);
  }
}

building1.add(createWallSection(0.5, 1.5, b1Depth, b1Width/2 - 0.25, 0.75, 0, wallMaterial1)); // bottom
building1.add(createWallSection(0.5, 1, b1Depth, b1Width/2 - 0.25, 5, 0, wallMaterial1)); // middle divider
building1.add(createWallSection(0.5, 1.5, b1Depth, b1Width/2 - 0.25, b1Height - 0.75, 0, wallMaterial1)); // top
b1SidePillars.forEach(z => {
  building1.add(createWallSection(0.5, b1Height, 1, b1Width/2 - 0.25, b1Height/2, z, wallMaterial1));
});
// Right windows - 4 windows per floor, 2 floors
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 4; i++) {
    const zPos = -21 + i * 14;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 2.5), glassMaterial);
    glass.position.set(b1Width/2 - 0.25, yPos, zPos);
    glass.rotation.y = Math.PI/2;
    building1.add(glass);
  }
}

building1.add(createWallSection(b1Width - 1, 0.3, b1Depth - 1, 0, 0.15, 0, wallMaterial1));

// roof
const roof1 = new THREE.Mesh(
  new THREE.BoxGeometry(b1Width + 1, 0.5, b1Depth + 1),
  new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
);
roof1.position.y = b1Height + 0.25;
roof1.castShadow = true;
building1.add(roof1);

//entrance door
const door1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.5), glassMaterial);
door1.position.set(0, 1.25, b1Depth/2 - 0.24);
building1.add(door1);

building1.position.set(-70, 0, -25);
building1.rotation.y = THREE.MathUtils.degToRad(90);
scene.add(building1);

/**
 * Building 2 - Brick building with 2 floors of small windows
 * Textured with lighter blue wall material and glass windows
 */
const building2 = new THREE.Group();
const wallMaterial2 = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.8 });

const b2Width = width;
const b2Height = height;
const b2Depth = depth;

building2.add(createWallSection(b2Width, b2Height, 0.5, 0, b2Height/2, -b2Depth/2 + 0.25, wallMaterial2));

const b2FrontPillars = [-6, -2, 2, 6];
b2FrontPillars.forEach(x => {
  building2.add(createWallSection(1, b2Height, 0.5, x, b2Height/2, b2Depth/2 - 0.25, wallMaterial2));
});
building2.add(createWallSection(b2Width, 1.5, 0.5, 0, 0.75, b2Depth/2 - 0.25, wallMaterial2));
building2.add(createWallSection(b2Width, 1, 0.5, 0, 5, b2Depth/2 - 0.25, wallMaterial2));
building2.add(createWallSection(b2Width, 1.5, 0.5, 0, b2Height - 0.75, b2Depth/2 - 0.25, wallMaterial2));
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 3; i++) {
    const xPos = -4 + i * 4;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), glassMaterial);
    glass.position.set(xPos, yPos, b2Depth/2 - 0.25);
    building2.add(glass);
  }
}

building2.add(createWallSection(0.5, 1.5, b2Depth, -b2Width/2 + 0.25, 0.75, 0, wallMaterial2));
building2.add(createWallSection(0.5, 1, b2Depth, -b2Width/2 + 0.25, 5, 0, wallMaterial2));
building2.add(createWallSection(0.5, 1.5, b2Depth, -b2Width/2 + 0.25, b2Height - 0.75, 0, wallMaterial2));
const b2SidePillars = [-28, -14, 0, 14, 28];
b2SidePillars.forEach(z => {
  building2.add(createWallSection(0.5, b2Height, 1, -b2Width/2 + 0.25, b2Height/2, z, wallMaterial2));
});
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 4; i++) {
    const zPos = -21 + i * 14;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 2.5), glassMaterial);
    glass.position.set(-b2Width/2 + 0.25, yPos, zPos);
    glass.rotation.y = -Math.PI/2;
    building2.add(glass);
  }
}

building2.add(createWallSection(0.5, 1.5, b2Depth, b2Width/2 - 0.25, 0.75, 0, wallMaterial2)); // bottom
building2.add(createWallSection(0.5, 1, b2Depth, b2Width/2 - 0.25, 5, 0, wallMaterial2)); // middle divider
building2.add(createWallSection(0.5, 1.5, b2Depth, b2Width/2 - 0.25, b2Height - 0.75, 0, wallMaterial2)); // top
b2SidePillars.forEach(z => {
  building2.add(createWallSection(0.5, b2Height, 1, b2Width/2 - 0.25, b2Height/2, z, wallMaterial2));
});
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 4; i++) {
    const zPos = -21 + i * 14;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 2.5), glassMaterial);
    glass.position.set(b2Width/2 - 0.25, yPos, zPos);
    glass.rotation.y = Math.PI/2;
    building2.add(glass);
  }
}

building2.add(createWallSection(b2Width - 1, 0.3, b2Depth - 1, 0, 0.15, 0, wallMaterial2));

const door2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.5), glassMaterial);
door2.position.set(0, 1.25, b2Depth/2 - 0.24);
building2.add(door2);

const roof2 = new THREE.Mesh(
  new THREE.BoxGeometry(b2Width + 0.5, 0.5, b2Depth + 0.5),
  new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
);
roof2.position.y = b2Height + 0.25;
roof2.castShadow = true;
building2.add(roof2);

building2.position.set(50, 0, -25);
building2.rotation.y = THREE.MathUtils.degToRad(75);
scene.add(building2);

const building3 = new THREE.Group();
const building3Depth = 30;
const wallMaterial3 = new THREE.MeshStandardMaterial({ color: 0x2196f3, roughness: 0.6 });

const b3Width = width;
const b3Height = height;
const b3Depth = building3Depth;

building3.add(createWallSection(b3Width, b3Height, 0.5, 0, b3Height/2, -b3Depth/2 + 0.25, wallMaterial3));

const b3FrontPillars = [-6, -2, 2, 6];
b3FrontPillars.forEach(x => {
  building3.add(createWallSection(1, b3Height, 0.5, x, b3Height/2, b3Depth/2 - 0.25, wallMaterial3));
});
// Bottom, middle divider, and top strips
building3.add(createWallSection(b3Width, 1.5, 0.5, 0, 0.75, b3Depth/2 - 0.25, wallMaterial3));
building3.add(createWallSection(b3Width, 1, 0.5, 0, 5, b3Depth/2 - 0.25, wallMaterial3));
building3.add(createWallSection(b3Width, 1.5, 0.5, 0, b3Height - 0.75, b3Depth/2 - 0.25, wallMaterial3));
// Front windows - 3 windows per floor, 2 floors
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 3; i++) {
    const xPos = -4 + i * 4;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), glassMaterial);
    glass.position.set(xPos, yPos, b3Depth/2 - 0.25);
    building3.add(glass);
  }
}

building3.add(createWallSection(0.5, 1.5, b3Depth, -b3Width/2 + 0.25, 0.75, 0, wallMaterial3));
building3.add(createWallSection(0.5, 1, b3Depth, -b3Width/2 + 0.25, 5, 0, wallMaterial3));
building3.add(createWallSection(0.5, 1.5, b3Depth, -b3Width/2 + 0.25, b3Height - 0.75, 0, wallMaterial3));
const b3SidePillars = [-14, -5, 5, 14];
b3SidePillars.forEach(z => {
  building3.add(createWallSection(0.5, b3Height, 1, -b3Width/2 + 0.25, b3Height/2, z, wallMaterial3));
});
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 3; i++) {
    const zPos = -9.5 + i * 9.5;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 2.5), glassMaterial);
    glass.position.set(-b3Width/2 + 0.25, yPos, zPos);
    glass.rotation.y = -Math.PI/2;
    building3.add(glass);
  }
}

building3.add(createWallSection(0.5, 1.5, b3Depth, b3Width/2 - 0.25, 0.75, 0, wallMaterial3));
building3.add(createWallSection(0.5, 1, b3Depth, b3Width/2 - 0.25, 5, 0, wallMaterial3));
building3.add(createWallSection(0.5, 1.5, b3Depth, b3Width/2 - 0.25, b3Height - 0.75, 0, wallMaterial3));
b3SidePillars.forEach(z => {
  building3.add(createWallSection(0.5, b3Height, 1, b3Width/2 - 0.25, b3Height/2, z, wallMaterial3));
});
for (let floor = 0; floor < 2; floor++) {
  for (let i = 0; i < 3; i++) {
    const zPos = -9.5 + i * 9.5;
    const yPos = floor === 0 ? 2.75 : 7.25;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 2.5), glassMaterial);
    glass.position.set(b3Width/2 - 0.25, yPos, zPos);
    glass.rotation.y = Math.PI/2;
    building3.add(glass);
  }
}

building3.add(createWallSection(b3Width - 1, 0.3, b3Depth - 1, 0, 0.15, 0, wallMaterial3));

const door3 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.5), glassMaterial);
door3.position.set(0, 1.25, b3Depth/2 - 0.24);
building3.add(door3);

const roof3 = new THREE.Mesh(
  new THREE.BoxGeometry(b3Width + 0.5, 0.5, b3Depth + 0.5),
  new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
);
roof3.position.y = b3Height + 0.25;
roof3.castShadow = true;
building3.add(roof3);

building3.position.set(50, 0, 20);
building3.rotation.y = THREE.MathUtils.degToRad(90);
scene.add(building3);

//trees
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });

function createTree(x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 5),
    trunkMaterial,
  );
  trunk.position.y = 2.5;
  trunk.castShadow = true;
  tree.add(trunk);

  const leaves = new THREE.Mesh(new THREE.ConeGeometry(2, 6, 8), treeMaterial);
  leaves.position.y = 7;
  leaves.castShadow = true;
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

//lamps
function createLampPost(x, z) {
  const lampPost = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
  );
  pole.position.y = 4;
  pole.castShadow = true;
  lampPost.add(pole);

  const lampHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      emissive: 0xffff88,
      emissiveIntensity: 0.5
    })
  );
  lampHead.position.y = 8.5;
  lampPost.add(lampHead);

  const lampLight = new THREE.PointLight(0xffeecc, 0.5, 20);
  lampLight.position.y = 8.5;
  lampPost.add(lampLight);

  lampPost.position.set(x, 0, z);
  scene.add(lampPost);
}

const lampPositions = [
  { x: -80, z: 12 },
  { x: -40, z: 12 },
  { x: 0, z: 12 },
  { x: 40, z: 12 },
  { x: 80, z: 12 },
  { x: -80, z: -12 },
  { x: -40, z: -12 },
  { x: 0, z: -12 },
  { x: 40, z: -12 },
  { x: 80, z: -12 },
];
lampPositions.forEach(pos => createLampPost(pos.x, pos.z));

//benches gltf models
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  './models/Box.glb',
  (gltf) => {
    // Create benches from the box model
    const benchPositions = [
      { x: -30, z: 15 },
      { x: 30, z: 15 },
      { x: -30, z: -15 },
      { x: 30, z: -15 },
    ];
    benchPositions.forEach(pos => {
      const bench = gltf.scene.clone();
      bench.scale.set(3, 1, 1);
      bench.position.set(pos.x, 0.5, pos.z);
      bench.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
          });
        }
      });
      scene.add(bench);
    });
    console.log('Campus benches loaded!');
  },
  undefined,
  (error) => console.error('Error loading GLTF:', error)
);

//raycaster for mouse click and hover interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const building1Walls = building1.children.filter(child => child.material === wallMaterial1);
const building2Walls = building2.children.filter(child => child.material === wallMaterial2);
const building3Walls = building3.children.filter(child => child.material === wallMaterial3);
const allWalls = [...building1Walls, ...building2Walls, ...building3Walls];

//change building color on click
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(allWalls);

  if (intersects.length > 0) {
    const clickedWall = intersects[0].object;
    const material = clickedWall.material;
    material.color.setHex(Math.random() * 0xffffff);
  }
});

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(allWalls);
  document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  animatedLight.position.x = Math.cos(elapsedTime * 0.5) * 40;
  animatedLight.position.z = Math.sin(elapsedTime * 0.5) * 40;
  animatedLight.intensity = 1 + Math.sin(elapsedTime * 2) * 0.5;
  controls.update();
  renderer.render(scene, camera);
}
animate();

//instructions
const infoDiv = document.createElement('div');
infoDiv.style.cssText = 'position:fixed;top:10px;left:10px;color:white;font-family:Arial;font-size:14px;background:rgba(0,0,0,0.7);padding:10px;border-radius:5px;';
infoDiv.innerHTML = `
  <strong>Controls:</strong><br>
  • Click buildings to change color<br>
  • Mouse drag to rotate camera
`;
document.body.appendChild(infoDiv);
