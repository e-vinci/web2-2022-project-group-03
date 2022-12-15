import {
    ArcRotateCamera,
    Vector3,
    Quaternion,
    Ray,
    ActionManager,
    TransformNode, Vector2
} from "@babylonjs/core";

export default class Player extends TransformNode {
    camera;

    scene;

    input;

    canvas;

    ui;

    mesh;

    run;

    idle;

    jump;

    land;

    currentAnim = null;

    prevAnim;

    isFalling = false;

    jumped = false;

    static PLAYER_SPEED = 10;

    static JUMP_FORCE = 0.4;

    static GRAVITY = -1.3;

    deltaTime;

    h;

    v;

    gravity = new Vector3();

    lastGroundPos = Vector3.Zero();

    grounded;

    jumpCount;

    moveDirection = new Vector3();

    constructor(assets, scene, input, canvas, ui) {
        super("player", scene);
        [,this.idle, this.jump, this.land, this.run] = assets.animationGroups;

        this.scene = scene;
        this.input = input;
        this.canvas = canvas
        this.ui = ui;

        this.setupPlayerCamera();
        this.setUpAnimations();

        this.mesh = assets.mesh;
        this.mesh.parent = this;
        this.mesh.actionManager = new ActionManager(this.scene);

        this.camera.target = this.mesh;
        this.camera.targetScreenOffset = new Vector2(0, -3);
    }

    updateFromControls() {
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

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
    }

    setUpAnimations() {
        this.scene.stopAllAnimations();
        this.run.loopAnimation = true;
        this.idle.loopAnimation = true;

        this.currentAnim = this.idle;
        this.prevAnim = this.land;
    }

    animatePlayer() {
        if (!this.ui.gamePaused) {
            if (!this.isFalling && !this.jumped && (this.input.inputMap.z || this.input.inputMap.s || this.input.inputMap.q || this.input.inputMap.d)) {
                this.currentAnim = this.run;
            } else if (this.jumped && !this.isFalling) {
                this.currentAnim = this.jump;
            } else if (!this.isFalling && this.grounded) {
                this.currentAnim = this.idle;
            } else if (this.isFalling) {
                this.currentAnim = this.land;
            }
        } else {
            this.currentAnim = this.idle;
        }

        if (this.currentAnim != null && this.prevAnim !== this.currentAnim){
            this.prevAnim.stop();
            this.currentAnim.play(this.currentAnim.loopAnimation);
            this.prevAnim = this.currentAnim;
        }
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

    checkSlope() {
        const predicate = (mesh) => mesh.isPickable && mesh.isEnabled();

        const raycast = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z + .25);
        const ray = new Ray(raycast, Vector3.Up().scale(-1), 1.5);
        const pick = this.scene.pickWithRay(ray, predicate);

        const raycast2 = new Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z - .25);
        const ray2 = new Ray(raycast2, Vector3.Up().scale(-1), 1.5);
        const pick2 = this.scene.pickWithRay(ray2, predicate);

        const raycast3 = new Vector3(this.mesh.position.x + .25, this.mesh.position.y + 0.5, this.mesh.position.z);
        const ray3 = new Ray(raycast3, Vector3.Up().scale(-1), 1.5);
        const pick3 = this.scene.pickWithRay(ray3, predicate);

        const raycast4 = new Vector3(this.mesh.position.x - .25, this.mesh.position.y + 0.5, this.mesh.position.z);
        const ray4 = new Ray(raycast4, Vector3.Up().scale(-1), 1.5);
        const pick4 = this.scene.pickWithRay(ray4, predicate);

        if (pick.hit) {
            if(pick.pickedMesh.name.includes("ramp")) return true;
        } else if (pick2.hit && !pick2.getNormal().equals(Vector3.Up())) {
            if(pick2.pickedMesh.name.includes("ramp")) return true;
        }
        else if (pick3.hit && !pick3.getNormal().equals(Vector3.Up())) {
            if(pick3.pickedMesh.name.includes("ramp")) return true;
        }
        else if (pick4.hit && !pick4.getNormal().equals(Vector3.Up())) {
            if(pick4.pickedMesh.name.includes("ramp")) return true;
        }
        return false;
    }

    updateGroundDetection() {
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

        if (!this.isGrounded()) {
            if (this.checkSlope() && this.gravity.y <= 0) {
                this.gravity.y = 0;
                this.jumpCount = 1;
                this.grounded = true;
            } else {
                this.gravity = this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * Player.GRAVITY));
                this.grounded = false;
            }
        }
        if (this.gravity.y < -Player.JUMP_FORCE) {
            this.gravity.y = -Player.JUMP_FORCE;
        }

        if (this.gravity.y < 0 && this.jumped) {
            this.isFalling = true;
        }

        this.moveDirection = this.moveDirection.scaleInPlace(Player.PLAYER_SPEED * this.deltaTime);
        this.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));

        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.grounded = true;
            this.lastGroundPos.copyFrom(this.mesh.position);

            this.jumpCount = 1;

            this.jumped = false;
            this.isFalling = false;
        }

        if (this.input.jumpKeyDown && this.jumpCount > 0) {
            this.gravity.y = Player.JUMP_FORCE;
            // eslint-disable-next-line
            this.jumpCount--;

            this.jumped = true;
            this.isFalling = false;
        }
    }

    beforeRenderUpdate() {
        this.updateFromControls();
        this.updateGroundDetection();
        this.animatePlayer();
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

        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 10;

        this.camera.checkCollisions = true;
        this.camera.collisionRadius = new Vector3(0.1, 0.1, 0.1);

        this.camera.attachControl(this.canvas, true);

        this.camera.inputs.attached.keyboard.detachControl();

        return this.camera;
    }
}
