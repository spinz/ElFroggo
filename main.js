import { FrogModel } from './FrogModel.js';
import { SkeletonController } from './SkeletonController.js';
import { OrbitControls } from './utils/OrbitControls.js';

let camera, scene, renderer;
let frogModel;
let skeletonController;
let mixer;
const clock = new THREE.Clock();

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background

    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Frog model
    frogModel = new FrogModel();
    scene.add(frogModel.model);

    // Skeleton controller
    skeletonController = new SkeletonController(frogModel);

    // Animation mixer
    mixer = new THREE.AnimationMixer(frogModel.model);
    frogModel.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    // Environment
    createEnvironment();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    setupUI();
}

function createEnvironment() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: 0x556b2f, // Forest green
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Water plane (simple representation)
    const waterGeometry = new THREE.CircleGeometry(5, 32);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x00BFFF, // Deep sky blue
        transparent: true,
        opacity: 0.7
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(5, 0.1, 0);
    scene.add(water);
}

function setupUI() {
    document.getElementById('idle-btn').addEventListener('click', () => 
        skeletonController.playAnimation('Idle'));
    document.getElementById('jump-btn').addEventListener('click', () => 
        skeletonController.playAnimation('Jump'));
    document.getElementById('swim-btn').addEventListener('click', () => 
        skeletonController.playAnimation('Swim'));
    document.getElementById('walk-btn').addEventListener('click', () => 
        skeletonController.playAnimation('Walk'));
    document.getElementById('catch-btn').addEventListener('click', () => 
        skeletonController.playAnimation('Catch'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);
    skeletonController.update(delta);
    renderer.render(scene, camera);
}