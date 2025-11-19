import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("texture_pics/untitled3.png");

const geometry = new THREE.CircleGeometry(1, 32);
const material = new THREE.MeshBasicMaterial({ map: texture });
const circle = new THREE.Mesh(geometry, material);
scene.add(circle);

function animate(){
  requestAnimationFrame(animate);
  circle.rotation.z += 0.01;
  renderer.render(scene, camera);
}

animate();