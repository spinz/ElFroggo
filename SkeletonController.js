export class SkeletonController {
    constructor(frogModel) {
        this.frogModel = frogModel;
        this.skeleton = null;
        this.currentAnimation = null;
        this.initSkeleton();
    }

    initSkeleton() {
        this.frogModel.model.traverse((child) => {
            if (child.isSkinnedMesh) {
                this.skeleton = child.skeleton;
                this.setupBoneControls();
            }
        });
    }

    setupBoneControls() {
        if (!this.skeleton) return;

        // Example bone controls (customize based on your model's skeleton)
        this.bones = {
            spine: this.skeleton.getBoneByName('Spine'),
            head: this.skeleton.getBoneByName('Head'),
            leftFrontLeg: this.skeleton.getBoneByName('LeftFrontLeg'),
            rightFrontLeg: this.skeleton.getBoneByName('RightFrontLeg'),
            leftHindLeg: this.skeleton.getBoneByName('LeftHindLeg'),
            rightHindLeg: this.skeleton.getBoneByName('RightHindLeg'),
            tongue: this.skeleton.getBoneByName('Tongue')
        };
    }

    playAnimation(name) {
        if (this.currentAnimation === name) return;

        this.currentAnimation = name;
        this.frogModel.animations.forEach((clip) => {
            const action = this.frogModel.mixer.clipAction(clip);
            if (clip.name === name) {
                action.reset().play();
            } else {
                action.fadeOut(0.5);
            }
        });
    }

    update(delta) {
        // Add any real-time skeleton adjustments here
        // Example: Breathing animation for idle state
        if (this.currentAnimation === 'Idle' && this.bones.spine) {
            this.bones.spine.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
    }

    // Add methods for manual joint control if needed
    // Example:
    // rotateBone(boneName, angle) {
    //     if (this.bones[boneName]) {
    //         this.bones[boneName].rotation.x = angle;
    //     }
    // }
}