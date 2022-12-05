import {
    TransformNode,
    ArcRotateCamera,
    Vector3,
    Quaternion, Ray, ActionManager, ExecuteCodeAction
} from "@babylonjs/core";
import { getAuthenticatedUser } from "../../utils/auths";
import Navigate from "../Router/Navigate";

export default class Player extends TransformNode {
    camera;

    scene;

    input;

    canvas;

    mesh;

    static PLAYER_SPEED = 0.8;

    static JUMP_FORCE = 1;

    static GRAVITY = -2.3;

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

        this.mesh.actionManager = new ActionManager(this.scene);

        this.camera.target = this.mesh;

        shadowGenerator.addShadowCaster(assets.mesh);

        this.input = input;

        this.mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.scene.getMeshByName("ramp"),
                },
                () => {
                    fetch('/users/set', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username
                        })
                    });
                    Navigate('/game');
                },
            ),
        );
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
            if(pick.pickedMesh.name.includes("ramp")) {
                return true;
            }
        } else if (pick2.hit && !pick2.getNormal().equals(Vector3.Up())) {
            if(pick2.pickedMesh.name.includes("ramp")) {
                return true;
            }
        }
        else if (pick3.hit && !pick3.getNormal().equals(Vector3.Up())) {
            if(pick3.pickedMesh.name.includes("ramp")) {
                return true;
            }
        }
        else if (pick4.hit && !pick4.getNormal().equals(Vector3.Up())) {
            if(pick4.pickedMesh.name.includes("ramp")) {
                return true;
            }
        }
        return false;
    }

    updateGroundDetection() {
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