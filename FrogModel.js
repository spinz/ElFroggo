import { GLTFLoader } from './utils/GLTFLoader.js';

export class FrogModel {
    constructor() {
        this.model = null;
        this.animations = [];
        this.loader = new GLTFLoader();
        this.loadModel();
    }

    loadModel() {
        this.loader.load(
            '../assets/models/frog.fbx',
            (gltf) => {
                this.model = gltf.scene;
                this.animations = gltf.animations;
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.model.scale.set(0.5, 0.5, 0.5); // Adjust scale if needed
                this.model.position.y = 0.5; // Initial position
            },
            undefined,
            (error) => {
                console.error('Error loading frog model:', error);
            }
        );
    }
}