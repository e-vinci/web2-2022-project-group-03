/* eslint-disable */
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
    ActionManager,
    Color3,
    Engine,
    ExecuteCodeAction,
    HemisphericLight,
    Matrix,
    MeshBuilder,
    PointLight,
    Quaternion,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Rectangle, StackPanel} from "@babylonjs/gui";
import player from '../../models/playerBabylonDoc.glb';
import mcqueen from '../../models/mcqueen.glb'
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

        await this.environment.load(parseInt(result.level, 10) || 1);

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
                    animationGroups: result.animationGroups
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

        this.player = new Player(this.assets, scene, this.input, this.canvas, this.ui);
        // eslint-disable-next-line
        const camera = this.player.activatePlayerCamera();
    }

    async goToGame() {
        this.scene.detachControl();
        const scene = this.scene;

        this.ui = new Hud(scene);

        this.input = new PlayerInput(scene, this.ui);

        await this.initializeGameAsync(scene);
        await scene.whenReadyAsync();

        // scene.getMeshByName("outer").position = scene.getTransformNodeByName("startPosition").getAbsolutePosition();
        scene.getMeshByName("outer").position = new Vector3(0,4,0);
        this.ui.startTimer();

        setInterval(() => {
            this.ui.updateHud();
        }, 1000);

        // await this.carAnim();

        this.createEndLevelMenu();

        this.state = this.stateEnum.GAME;
        this.scene = scene;
        this.engine.hideLoadingUI();
        this.scene.attachControl();
    }

    createEndLevelMenu() {
        const endLevelUI = AdvancedDynamicTexture.CreateFullscreenUI("EndUI");
        endLevelUI.idealHeight = 720;

        const stackPanel = new StackPanel();
        stackPanel.width = .83;

        const endLevelMenu = new Rectangle();
        endLevelMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        endLevelMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        endLevelMenu.height = 0.8;
        endLevelMenu.width = 0.5;
        endLevelMenu.thickness = 0;
        endLevelMenu.isVisible = false;
        stackPanel.addControl(endLevelMenu);

        const nextBtn = Button.CreateSimpleButton("next", "NEXT LEVEL");
        nextBtn.width = 0.2;
        nextBtn.height = "40px";
        nextBtn.color = "white";
        nextBtn.top = "-14px";
        nextBtn.thickness = 0;
        nextBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(nextBtn);

        nextBtn.onPointerDownObservable.add(() => {
            this.engine.displayLoadingUI();
            endLevelMenu.isVisible = false;
            this.ui.gamePaused = false;

            document.location.reload();
        });

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.2;
        quitBtn.height = "40px";
        quitBtn.color = "white";
        quitBtn.top = "-14px";
        quitBtn.thickness = 0;
        quitBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(quitBtn);

        quitBtn.onPointerDownObservable.add(() => {
            endLevelMenu.isVisible = false;
            this.ui.gamePaused = false;

            Navigate('/');
        });

        this.assets.mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.scene.getMeshByName("house1"),
                },
                async () => {
                    endLevelUI.addControl(stackPanel);
                    endLevelMenu.isVisible = true;
                    this.ui.gamePaused = true;

                    await fetch('/api/users/set', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username
                        })
                    });

                    const response = await fetch('/api/users/get', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username
                        })
                    });

                    const { level } = response.json();

                    await fetch('/api/leaderboard/add', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username,
                            level,
                            time: this.ui.time
                        })
                    });
                },
            ),
        );
    }

    /*
    async carAnim() {
        const walk = function (turn, dist) {
            this.turn = turn;
            this.dist = dist;
        }

        const track = [];
        track.push(new walk(86, 7));
        track.push(new walk(-85, 14.8));
        track.push(new walk(-93, 16.5));
        track.push(new walk(48, 25.5));
        track.push(new walk(-112, 30.5));
        track.push(new walk(-72, 33.2));
        track.push(new walk(42, 37.5));
        track.push(new walk(-98, 45.2));
        track.push(new walk(0, 47))

        SceneLoader.ImportMeshAsync(null, mcqueen).then((result) => {
            const car = result.meshes[0];

            let distance = 0;
            let step = 0.015;
            let p = 0;

            this.scene.onBeforeRenderObservable.add(() => {
                car.movePOV(0, 0, step);
                distance += step;

                if (distance > track[p].dist) {
                    p += 1;
                    p %= track.length;
                    if (p === 0) {
                        distance = 0;
                        car.position = new Vector3(-6, 0, 0);
                    }
                }
            })
        });
    }
    */
}
