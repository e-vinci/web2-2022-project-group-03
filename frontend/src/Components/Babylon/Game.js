/* eslint-disable */
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
    MeshBuilder,
    PointLight,
    Quaternion,
    Scene,
    SceneLoader,
    ShadowGenerator,
    Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import player from '../../models/playerBabylonDoc.glb';
import Environment from "./Environment";
import Player from "./Player";
import PlayerInput from "./inputController";
import Navigate from "../Router/Navigate";
import Hud from "./Hud";
import {getAuthenticatedUser} from "../../utils/auths";

export default class Game {
    stateEnum = {
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

    ui;

    constructor() {
        this.canvas = this.createCanvas();

        this.engine = new Engine(this.canvas, true);

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

        this.canvas = canvas;

        return this.canvas;
    }

    async main() {
        await this.goToStart();

        this.engine.runRenderLoop(() => {
            switch (this.state) {
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
        this.engine.displayLoadingUI();
        // eslint-disable-next-line
        let finishedLoading = false;
        await this.setUpGame().then(() => {
            this.goToGame();
            finishedLoading = true;
        });
    }

    async setUpGame() {
        const scene = new Scene(this.engine);
        this.scene = scene;

        this.environment = new Environment(scene);

        /*
        const response = await fetch('/api/users/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: getAuthenticatedUser().username,
            }),
        });

        const result = await response.json();
        */

        // await this.environment.load(parseInt(result.level, 10) || 1);

        await this.environment.load(1);
        
        await this.loadCharacterAssets(scene);
    }

    async loadCharacterAssets(scene){
        async function loadCharacter(){
            const outer = MeshBuilder.CreateBox("outer", { width: 1, depth: 1, height: 2 }, scene);
            outer.isVisible = false;
            outer.isPickable = false;
            outer.checkCollisions = true;

            outer.bakeTransformIntoVertices(Matrix.Translation(0, 1, 0))

            outer.ellipsoidOffset = new Vector3(0, 1, 0);

            outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);

            return SceneLoader.ImportMeshAsync(null, player).then((result) => {
                const body = result.meshes[0];
                body.parent = outer;
                body.isPickable = false;
                body.getChildMeshes().forEach(m => {
                    m.isPickable = false;
                });
                return {
                    mesh: outer,
                }
            });
        }
        return loadCharacter().then(assets => {
            this.assets = assets;
        });
    }

    async initializeGameAsync(scene) {
        // eslint-disable-next-line
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

        const light = new PointLight("sparklight", new Vector3(0, -1, 0), scene);
        light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
        light.intensity = 35;
        light.radius = 1;

        const shadowGenerator = new ShadowGenerator(1024, light);

        this.player = new Player(this.assets, scene, shadowGenerator, this.input, this.canvas);
        // eslint-disable-next-line
        const camera = this.player.activatePlayerCamera();
    }

    async goToGame() {
        document.querySelector("canvas").focus();
        this.scene.detachControl();
        const scene = this.scene;

        this.ui = new Hud(scene);

        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");

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
        });

        this.input = new PlayerInput(scene, this.ui);

        await this.initializeGameAsync(scene);
        await scene.whenReadyAsync();

        // scene.getMeshByName("outer").position = scene.getTransformNodeByName("startPosition").getAbsolutePosition();
        scene.getMeshByName("outer").position = new Vector3(0,4,0);
        this.ui.startTimer();

        setInterval(() => {
            this.ui.updateHud();
        }, 1000);

        this.state = this.stateEnum.GAME;
        this.scene = scene;
        this.engine.hideLoadingUI();
        this.scene.attachControl();
    }

    async goToLose() {
        this.engine.displayLoadingUI();

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
            Navigate('/');
        });

        await scene.whenReadyAsync();
        this.engine.hideLoadingUI();
        this.scene.dispose();
        this.scene = scene;
        this.state = this.stateEnum.LOSE;
    }
}