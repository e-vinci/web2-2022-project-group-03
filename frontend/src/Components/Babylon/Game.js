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
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";

import player from '../../models/playerbabylontmp.glb';
import mcqueen from '../../models/mcqueen.glb'

import Environment from "./Environment";
import Player from "./Player";
import PlayerInput from "./inputController";
import Hud from "./Hud";
import Navigate from "../Router/Navigate";
import { getAuthenticatedUser } from "../../utils/auths";
import pauseMenuImage from "../../img/pauseMenuImage.png";

export default class Game {
    state;

    scene;

    canvas;

    engine;

    assets;

    input;

    environment;

    player;

    ui;

    timerInterval;

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
            if (this.state === 'GAME')
                this.scene.render();
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

            const result = await SceneLoader.ImportMeshAsync(null, player);

            const body = result.meshes[0];
            body.scaling = new Vector3(0.7, 0.7, -0.7);
            body.parent = outer;
            body.isPickable = false;

            body.getChildMeshes().forEach(m => {
                m.isPickable = false;
            });

            return {
                mesh: outer,
                animationGroups: result.animationGroups
            }

        }
        const assets = await loadCharacter()

        return this.assets = assets;
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

        this.timerInterval = setInterval(() => {
            this.ui.updateHud();
        }, 1000);

        await this.carAnim();

        this.createEndLevelMenu();

        this.state = 'GAME';
        this.scene = scene;
        this.engine.hideLoadingUI();
        this.scene.attachControl();
    }

    createEndLevelMenu() {
        const endLevelUI = AdvancedDynamicTexture.CreateFullscreenUI("EndUI");
        endLevelUI.idealHeight = 720;

        const endLevelMenu = new Rectangle();
        endLevelMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        endLevelMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        endLevelMenu.height = 0.5;
        endLevelMenu.width = 0.4;
        endLevelMenu.thickness = 0;
        endLevelMenu.isVisible = false;

        const image = new Image("camion", pauseMenuImage);
        endLevelMenu.addControl(image);

        const stackPanel = new StackPanel();
        stackPanel.width = 1;
        endLevelMenu.addControl(stackPanel);

        const nextBtn = Button.CreateSimpleButton("next", "NEXT LEVEL");
        nextBtn.width = 0.3;
        nextBtn.height = "40px";
        nextBtn.color = "black";
        nextBtn.thickness = 0;
        stackPanel.addControl(nextBtn);

        nextBtn.onPointerDownObservable.add(() => {
            endLevelMenu.isVisible = false;
            this.ui.gamePaused = false;
            this.state = '';

            clearInterval(this.timerInterval);

            this.goToStart();
        });

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.2;
        quitBtn.height = "40px";
        quitBtn.color = "black";
        quitBtn.thickness = 0;
        stackPanel.addControl(quitBtn);

        quitBtn.onPointerDownObservable.add(() => {
            Navigate('/');
            endLevelMenu.isVisible = false;
            this.ui.gamePaused = false;
        });

        const endGameMenu = new Rectangle();
        endGameMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        endGameMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        endGameMenu.height = 0.5;
        endGameMenu.width = 0.4;
        endGameMenu.thickness = 0;
        endGameMenu.isVisible = false;

        endGameMenu.addControl(image);

        const stackPanelEnd = new StackPanel();
        stackPanelEnd.width = 1;
        endGameMenu.addControl(stackPanelEnd);

        const endText = new TextBlock();
        endText.text = "Thank you for playing !"
        endText.width = 0.3;
        endText.height = "40px";
        endText.color = "black";
        stackPanelEnd.addControl(endText)

        stackPanelEnd.addControl(quitBtn);

        this.assets.mesh.actionManager.registerAction (
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.scene.getMeshByName("fin"),
                },
                async () => {

                    const response = await fetch('/api/users/get', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username
                        })
                    });

                    const { level } = await response.json();

                    if (level < 2) {
                        endLevelUI.addControl(endLevelMenu);
                        endLevelMenu.isVisible = true;
                        this.ui.gamePaused = true;
                    }

                    if (level === 2) {
                        endLevelUI.addControl(endGameMenu);
                        endGameMenu.isVisible = true;
                    } else {
                        await fetch('/api/users/set', {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json"
                            },
                            body: JSON.stringify({
                                username: getAuthenticatedUser().token
                            })
                        });
                    }

                    await fetch('/api/leaderboard/add', {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().token,
                            level: level,
                            time: this.ui.time
                        })
                    });
                },
            ),
        );
    }

    async carAnim() {
        const result = await SceneLoader.ImportMeshAsync(null, mcqueen);
        const car = result.meshes[0];
        car.position = new Vector3(22.5, 3, -30);

        /*
        const slide = function (turn, dist) { //after covering dist apply turn
            this.turn = turn;
            this.dist = dist;
        }

        const track = [];
        track.push(new slide(Math.PI / 2, 4));
        track.push(new slide(3 * Math.PI / 4, 8));
        track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2)));

        let distance = 0;
        let step = 0.05;
        let p = 0;

        scene.onBeforeRenderObservable.add(() => {
            sphere.movePOV(0, 0, step);
            distance += step;

            if (distance > track[p].dist) {
                sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
                p +=1;
                p %= track.length;
                if (p === 0) {
                    distance = 0;
                    sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
                    sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
                }
            }
        });
        */
    }
}
