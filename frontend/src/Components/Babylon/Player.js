import {
    TransformNode,
    ArcRotateCamera,
    Vector3,
    Quaternion, Ray
} from "@babylonjs/core";

export default class Player extends TransformNode {
    camera;

    scene;

    input;

    canvas;

    mesh;

    static PLAYER_SPEED = 0.4;

    static JUMP_FORCE = 0.80;

    static GRAVITY = -2.8;

    deltaTime = 0;

    h;

    v;

    gravity = new Vector3();

    lastGroundPos = Vector3.Zero();

    grounded;

    jumpCount;

    moveDirection = new Vector3();

    constructor(assets, scene, shadowGenerator, input, canvas) {
        super("player", scene);
        this.scene = scene;
        this.canvas = canvas
        this.setupPlayerCamera();

        this.mesh = assets.mesh;
        this.mesh.parent = this;

        shadowGenerator.addShadowCaster(assets.mesh);

        this.input = input;
    }

    updateFromControls() {
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

        this.moveDirection = Vector3.Zero();
        this.h = this.input.horizontal;
        this.v = this.input.vertical;

        if (this.h !== 0 || this.v !== 0) {

            const fwd = this.camera.getDirection(new Vector3(0, 0, 1));
            const correctedVertical = fwd.scaleInPlace(this.v);

            const right = this.camera.getDirection(new Vector3(1, 0, 0));
            const correctedHorizontal = right.scaleInPlace(this.h);

            const move = correctedHorizontal.addInPlace(correctedVertical);

            this.moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

            const angle = Math.atan2((move).normalize().x, (move).normalize().z);
            const targ = Quaternion.FromEulerAngles(0, angle, 0);
            this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this.deltaTime);
        }

        this.moveDirection = this.moveDirection.scaleInPlace(Player.PLAYER_SPEED);
    }

    floorRaycast(offsetx, offsetz, raycastlen) {
        const raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
        const ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

        const predicate = (mesh) => mesh.isPickable && mesh.isEnabled();

        const pick = this.scene.pickWithRay(ray, predicate);

        if (pick.hit)
            return pick.pickedPoint;

        return Vector3.Zero();
    }

    isGrounded() {
        return !this.floorRaycast(0, 0, 0.6).equals(Vector3.Zero());
    }

    updateGroundDetection() {
        if (!this.isGrounded()) {
            this.gravity = this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * Player.GRAVITY));
            this.grounded = false;
        }
        if (this.gravity.y < -Player.JUMP_FORCE) {
            this.gravity.y = -Player.JUMP_FORCE;
        }
        this.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));

        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.grounded = true;
            this.lastGroundPos.copyFrom(this.mesh.position);

            this.jumpCount = 1;
        }

        if (this.input.jumpKeyDown && this.jumpCount > 0) {
            this.gravity.y = Player.JUMP_FORCE;
            // eslint-disable-next-line
            this.jumpCount--;
        }
    }

    beforeRenderUpdate() {
        this.updateFromControls();
        this.updateGroundDetection();
    }

    activatePlayerCamera() {
        this.scene.registerBeforeRender(() => {
            this.beforeRenderUpdate();
        });
        return this.camera;
    }

    setupPlayerCamera() {
        this.camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), this.scene);

        this.camera.setPosition(new Vector3(0, 30, -20));

        this.camera.attachControl(this.canvas, true);

        this.camera.inputs.attached.keyboard.detachControl();

        return this.camera;
    }
}