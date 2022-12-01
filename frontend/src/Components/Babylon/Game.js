import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
    Color3,
    Color4,
    Engine,
    FreeCamera,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder,
    PointLight,
    Quaternion,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import Environment from "./environment";
import Player from "./Player";
import PlayerInput from "./inputController";

export default class Game {
    stateEnum = {
        START: 0,
        GAME: 1,
        LOSE: 2
    }

    state;

    scene;

    canvas;

    engine;

    assets;

    input;

    environment;

    player;

    gamescene;

    constructor() {
        this.canvas = this.createCanvas();

        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);

        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });

        this.main();
    }

    createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "renderCanvas"

        const main = document.querySelector("main");
        main.appendChild(canvas);

        this.canvas = document.getElementById("renderCanvas");

        return this.canvas;
    }

    async main() {
        await this.goToStart();

        this.engine.runRenderLoop(() => {
            switch (this.state) {
                case this.stateEnum.START:
                    this.scene.render();
                    break;
                case this.stateEnum.GAME:
                    this.scene.render();
                    break;
                case this.stateEnum.LOSE:
                    this.scene.render();
                    break;
                default: break;
            }
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    async goToStart() {
        // eslint-disable-next-line
        let finishedLoading = false;
        await this.setUpGame().then(() => {
            this.goToGame();
            finishedLoading = true;
        });
    }

    async setUpGame() {
        const scene = new Scene(this.engine);
        this.gamescene = scene;

        this.environment = new Environment(scene);
        const { level } = this.getQueryParams(window.location.href);
        await this.environment.load(parseInt(level, 10) || 1);
        await this.loadCharacterAssets(scene);
    }

    async loadCharacterAssets(scene){
        async function loadCharacter(){
            const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
            outer.isVisible = false;
            outer.isPickable = false;
            outer.checkCollisions = true;

            outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

            outer.ellipsoid = new Vector3(1, 1.5, 1);
            outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

            outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);

            const box = MeshBuilder.CreateBox("Small1", {
                width: 0.5,
                depth: 0.5,
                height: 0.25,
                faceColors: [
                    new Color4(0, 0, 0, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(0, 0, 0, 1)
                ]
            }, scene);

            box.position.y = 1.5;
            box.position.z = 1;

            const body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
            const bodymtl = new StandardMaterial("red", scene);
            bodymtl.diffuseColor = new Color3(.8,.5,.5);
            body.material = bodymtl;
            body.isPickable = false;
            body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

            box.parent = body;
            body.parent = outer;

            return { mesh: outer };
        }
        return loadCharacter().then(assets => {
            this.assets = assets;
        });
    }

    async initializeGameAsync(scene) {
        // eslint-disable-next-line
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

        const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
        light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
        light.intensity = 35;
        light.radius = 1;

        const shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.darkness = 0.4;

        this.player = new Player(this.assets, scene, shadowGenerator, this.input, this.canvas);
        // eslint-disable-next-line
        const camera = this.player.activatePlayerCamera();
    }

    async goToGame() {
        this.scene.detachControl();
        const scene = this.gamescene;
        scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098);

        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        scene.detachControl();

        const loseBtn = Button.CreateSimpleButton("lose", "LOSE");
        loseBtn.width = 0.2;
        loseBtn.height = "40px";
        loseBtn.color = "white";
        loseBtn.top = "-14px";
        loseBtn.thickness = 0;
        loseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        playerUI.addControl(loseBtn);

        loseBtn.onPointerDownObservable.add(() => {
            this.goToLose();
            scene.detachControl();
        });

        this.input = new PlayerInput(scene);

        await this.initializeGameAsync(scene);

        await scene.whenReadyAsync();
        scene.getMeshByName("outer").position = new Vector3(0,3,0);
        this.scene.dispose();
        this.state = this.stateEnum.GAME;
        this.scene = scene;
        this.engine.hideLoadingUI();
        this.scene.attachControl();
    }

    async goToLose() {
        this.engine.displayLoadingUI();

        this.scene.detachControl();
        const scene = new Scene(this.engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        const camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const mainBtn = Button.CreateSimpleButton("mainmenu", "MAIN MENU");
        mainBtn.width = 0.2;
        mainBtn.height = "40px";
        mainBtn.color = "white";
        guiMenu.addControl(mainBtn);
        mainBtn.onPointerUpObservable.add(() => {
            this.goToStart();
        });

        await scene.whenReadyAsync();
        this.engine.hideLoadingUI();
        this.scene.dispose();
        this.scene = scene;
        this.state = this.stateEnum.LOSE;
    }

    // eslint-disable-next-line class-methods-use-this
    getQueryParams(url) {
        const paramArr = url.slice(url.indexOf('?') + 1).split('&');
        const params = {};
        // eslint-disable-next-line array-callback-return
        paramArr.map(param => {
            const [key, val] = param.split('=');
            params[key] = decodeURIComponent(val);
        })
        return params;
    }
}
