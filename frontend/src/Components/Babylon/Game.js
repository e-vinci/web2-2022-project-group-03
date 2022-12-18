import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
    ActionManager,
    Engine,
    ExecuteCodeAction,
    HemisphericLight,
    Matrix,
    MeshBuilder,
    Quaternion,
    Scene,
    SceneLoader,
    Vector3
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Image, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";

import player from '../../models/playerbabylontmp.glb';
import sierra from '../../models/sierra.glb';
import platformMesh from '../../models/plateform.glb';

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

    level;

    /**
     * Creates the canvas and engine and start the main method
     */
    constructor() {
        this.canvas = this.createCanvas();

        this.engine = new Engine(this.canvas, true);

        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
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

    /**
     * Creates the canvas
     * @returns the canvas
     */
    createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "renderCanvas"

        const main = document.querySelector("main");
        main.appendChild(canvas);

        this.canvas = canvas;

        return this.canvas;
    }

    /**
     * Starts the game, renders the game, and adds an event listner to resize the game
     */
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

    /**
     * Displays the loading UI, setups the game and goes to the game
     */
    async goToStart() {
        this.engine.displayLoadingUI();

        await this.setUpGame()
        await this.goToGame();
    }

    /**
     * Creates the scene and detachs control to avoid inputs during loading
     * Creates a new environment, gets the current level of the user and load the level
     * Loads the character mesh
     */
    async setUpGame() {
        const scene = new Scene(this.engine);
        this.scene = scene;
        this.scene.detachControl();

        this.environment = new Environment(scene);

        const response = await fetch(`${process.env.API_BASE_URL}/users/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getAuthenticatedUser().token
            }
        });

        const result = await response.json();
        this.level = result.level;

        await this.environment.load(parseInt(this.level, 10) || 1);

        await this.loadCharacterAssets(scene);
    }

    /**
     * Creates a hitbox, import the player mesh and merges the two
     * @param {Scene} scene The current scene
     * @returns The loaded mesh
     */
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
            body.scaling = new Vector3(0.6, 0.6, -0.6);
            body.parent = outer;
            body.isPickable = false;

            body.getChildMeshes().forEach(m => {
                const mesh = m;
                mesh.isPickable = false;
            });

            return {
                mesh: outer,
                animationGroups: result.animationGroups
            }
        }
        this.assets = await loadCharacter()

        return this.assets;
    }

    /**
     * Initializes the game, creates light, the player and a camera
     * @param {Scene} scene The current scene
     */
    async initializeGameAsync(scene) {
        // eslint-disable-next-line
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

        this.player = new Player(this.assets, scene, this.input, this.canvas, this.ui);
        // eslint-disable-next-line
        const camera = this.player.activatePlayerCamera();
    }

    /**
     * Creates the ingame UI and inputs
     * Initializes the game, places the mesh and starts the ingame timer
     * Starts the car animations
     * Hides the loading ui, gives back control and set state to GAME
     */
    async goToGame() {
        const { scene } = this;

        this.ui = new Hud(scene, this.engine);

        this.input = new PlayerInput(scene, this.ui);

        await this.initializeGameAsync(scene);
        await scene.whenReadyAsync();

        scene.getMeshByName("outer").position = new Vector3(0,2,0);
        this.ui.startTimer();

        this.timerInterval = setInterval(() => {
            this.ui.updateHud();
        }, 1000);

        await this.carAnim();
        if (this.level === 2)
            await this.platforms();

        this.createEndMenu();

        this.state = 'GAME';
        this.scene = scene;
        this.engine.hideLoadingUI();
        this.scene.attachControl();
    }

    /**
     * Creates the menus for end of level and end of game
     * Creates a trigger for the end of level
     */
    createEndMenu() {
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

            this.scene.dispose();
            this.goToStart();
        });

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.2;
        quitBtn.height = "40px";
        quitBtn.color = "black";
        quitBtn.thickness = 0;
        stackPanel.addControl(quitBtn);

        quitBtn.onPointerDownObservable.add(() => {
            endLevelMenu.isVisible = false;
            this.ui.gamePaused = false;
            this.engine.dispose();
            this.engine = null;
            Navigate('/');
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
        endText.text = "More coming soon !"
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

                    this.ui.gamePaused = true;

                    if (this.level < 6) {
                        endLevelUI.addControl(endLevelMenu);
                        endLevelMenu.isVisible = true;

                        await fetch(`${process.env.API_BASE_URL}/users/set`, {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                                Authorization: getAuthenticatedUser().token
                            }
                        });
                    } else {
                        endLevelUI.addControl(endGameMenu);
                        endGameMenu.isVisible = true;
                    }

                    await fetch(`${process.env.API_BASE_URL}/leaderboard/add`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            Authorization: getAuthenticatedUser().token
                        },
                        body: JSON.stringify({
                            username: getAuthenticatedUser().username,
                            level: this.level,
                            time: this.ui.time
                        })
                    });
                },
            ),
        );

        this.assets.mesh.actionManager.registerAction (
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.scene.getMeshByName("mort"),
                },
                async () => {
                    this.scene.getMeshByName("outer").position = new Vector3(0,2,0);
                    this.scene.getCameraByName("Camera").setPosition(new Vector3(-10, 5, 0));
                },
            ),
        );
    }

    /**
     * Creates multiple cars and start their animations
     */
    async carAnim() {
        if (this.level === 1) {
            const result = await SceneLoader.ImportMeshAsync(null, sierra);
            const car = result.meshes[0];

            // const animWheel = await Game.setupTireAnimation();

            car.getChildMeshes().forEach(m => {
                const mesh = m;
                mesh.checkCollisions = false;
                mesh.isPickable = false;

                if (mesh.name.includes("sierramur"))
                    mesh.isVisible = false;

                /*
                if (mesh.name.includes("wheels")) {
                    mesh.animations = [];
                    mesh.animations.push(animWheel);
                    console.log(mesh.animations)
                    this.scene.beginAnimation(mesh, 0, 30, true);
                    console.log(mesh.animations)
                }
                */
            });

            car.position = new Vector3(24.2, 3, -30);

            const car2 = car.clone("car2");
            car2.position = new Vector3(20.8, 3, 70);
            car2.rotation = new Vector3(0, Math.PI * 2, 0);

            const car3 = car.clone("car3");
            car3.position = new Vector3(10, 5.4, 60);
            car3.rotation = new Vector3(0, Math.PI / 2, 0);

            const car4 = car.clone("car4");
            car4.position = new Vector3(-180,5.4,56.5);
            car4.rotation = new Vector3(0, Math.PI * 1.5, 0);

            this.scene.onBeforeRenderObservable.add(() => {
                let step = 5;
                const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
                step *= deltaTime;

                if (Math.floor(car.position.z) > 90)
                    car.position = new Vector3(22.5, 3, -30);
                if (Math.floor(car2.position.z) < -25)
                    car2.position = new Vector3(22.5, 3, 70);
                if (Math.floor(car3.position.x) < -80)
                    car3.position = new Vector3(10, 5.4, 60);
                if (Math.floor(car4.position.x) > 22)
                    car4.position = new Vector3(-180,5.4,60);

                car.movePOV(0, 0, step);
                car2.movePOV(0,0, step);
                car3.movePOV(0,0, step);
                car4.movePOV(0,0, step);
            });
        } else if (this.level === 4) {
            const result = await SceneLoader.ImportMeshAsync(null, sierra);
            // eslint-disable-next-line
            const car = result.meshes[0];
            car.position = new Vector3(100,0,105);
            car.rotation = new Vector3(0,Math.PI * 1.5, 0);

            car.getChildMeshes().forEach(m => {
                const mesh = m;
                mesh.checkCollisions = true;
                mesh.isPickable = true;

                if (mesh.name.includes("sierramur"))
                    mesh.isVisible = false;
            });

            const leftLaneCars = [];
            setInterval(async () => {
                const carClone = car.clone("sierra");
                carClone.rotation = new Vector3(0, Math.PI / 2, 0);
                const randomInt = Math.floor(Math.random() * 2);
                if (randomInt === 0)
                    carClone.position = new Vector3(210, -4.1, -0.5);
                else
                    carClone.position = new Vector3(210, -4.1, 3);

                carClone.getChildMeshes().forEach(m => {
                    const mesh = m;
                    if (mesh.name.includes("sierramur")) {
                        mesh.actionManager = new ActionManager(this.scene);
                        this.assets.mesh.actionManager.registerAction(
                            new ExecuteCodeAction({trigger: ActionManager.OnIntersectionEnterTrigger, parameter: mesh}, () => {
                                this.scene.getMeshByName("outer").position = new Vector3(0,2,0);
                                this.scene.getCameraByName("Camera").setPosition(new Vector3(-10, 5, 0));
                            })
                        );
                    }
                });

                leftLaneCars.push(carClone);
            }, 1000);

            const rightLaneCars = [];
            setInterval(async () => {
                const carClone = car.clone("sierra");
                carClone.rotation = new Vector3(0, Math.PI * 1.3, 0);

                const randomInt = Math.floor(Math.random() * 2);
                if (randomInt === 0)
                    carClone.position = new Vector3(23, -52.5, -101);
                else
                    carClone.position = new Vector3(23, -52.5, -104.5);


                rightLaneCars.push(carClone);
            }, 2000);

            this.scene.onBeforeRenderObservable.add(() => {
                if (this.ui.gamePaused)
                    return
                let step = 30;
                let step2 = 10;
                const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
                step *= deltaTime;
                step2 *= deltaTime;

                leftLaneCars.forEach(sierraCar => {
                    if (sierraCar.position.x < 0) {
                        leftLaneCars.splice(leftLaneCars.indexOf(sierraCar), 1);
                        this.scene.meshes.splice(this.scene.meshes.indexOf(sierraCar), 1);
                        this.scene.removeMesh(sierraCar);
                        sierraCar.dispose();
                    }
                    sierraCar.movePOV(0, 0, step);
                });

                rightLaneCars.forEach(sierraCar => {
                    if (sierraCar.position.x > 140) {
                        rightLaneCars.splice(rightLaneCars.indexOf(sierraCar), 1);
                        this.scene.removeMesh(sierraCar);
                        sierraCar.dispose();
                    }
                    sierraCar.movePOV(0, 0, step);
                });

                if (car.position.x > 170)
                    car.position = new Vector3(100,0,105);
                car.movePOV(0,0, step2);
            });
        }
    }

    /*
    static setupTireAnimation() {
        const animWheel = new Animation("wheelAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

        const wheelKeys = [];

        wheelKeys.push({
            frame: 0,
            value: 0
        });

        wheelKeys.push({
            frame: 30,
            value: 2 * Math.PI
        });

        animWheel.setKeys(wheelKeys);
        return animWheel;
    }
    */

    async platforms() {
        const result = await SceneLoader.ImportMeshAsync(null, platformMesh);
        const platform = result.meshes[0];

        platform.getChildMeshes().forEach(m => {
            const mesh = m;
            mesh.checkCollisions = true;
            mesh.isPickable = true;
        });

        platform.position = new Vector3(-26, 0, 104);
        platform.rotation = new Vector3(0, Math.PI * 1.2, 0)

        const platform2 = platform.clone("platform2");
        platform2.position = new Vector3(-30, 0, 107);

        const platform3 = platform.clone("platform3");
        platform3.position = new Vector3(-34, 0, 110);
        platform3.rotation = new Vector3(0, Math.PI * 1.3, 0);

        const platform4 = platform.clone("platform4");
        platform4.position = new Vector3(-38, 0, 113);
        platform4.rotation = new Vector3(0, Math.PI * 1.3, 0);

        const platform5 = platform.clone("platform5");
        platform5.position = new Vector3(-37, 0, 135);
        platform5.rotation = new Vector3(0, Math.PI / 1.4, 0);

        const platform6 = platform.clone("platform6");
        platform6.position = new Vector3(-34, 0, 139);
        platform6.rotation = new Vector3(0, Math.PI / 1.4, 0);

        const platform7 = platform.clone("platform6");
        platform7.position = new Vector3(-31, 0, 144);
        platform7.rotation = new Vector3(0, Math.PI / 1.4, 0);

        let reverse = false;
        let reverse2 = false;
        let reverse3 = false;
        let reverse4 = false;
        let reverse5 = false;
        let reverse6 = false;
        let reverse7 = false;

        this.scene.onBeforeRenderObservable.add(() => {
            let step = 2;
            const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
            step *= deltaTime;

            if (platform.position.z < 102) reverse = true;
            if (platform.position.z > 108) reverse = false;

            if (platform2.position.z < 106) reverse2 = true;
            if (platform2.position.z > 111) reverse2 = false;

            if (platform3.position.z < 108) reverse3 = true;
            if (platform3.position.z > 113) reverse3 = false;

            if (platform4.position.z < 112) reverse4 = true;
            if (platform4.position.z > 118) reverse4 = false;

            if (platform5.position.z > 136) reverse5 = true;
            if (platform5.position.z < 131) reverse5 = false;

            if (platform6.position.z > 139) reverse6 = true;
            if (platform6.position.z < 135) reverse6 = false;

            if (platform7.position.z > 144) reverse7 = true;
            if (platform7.position.z < 139) reverse7 = false;

            if (reverse) platform.movePOV(0,0,step);
            else platform.movePOV(0,0,-step);

            if (reverse2) platform2.movePOV(0,0,step);
            else platform2.movePOV(0,0,-step);

            if (reverse3) platform3.movePOV(0,0,step);
            else platform3.movePOV(0,0,-step);

            if (reverse4) platform4.movePOV(0,0,step);
            else platform4.movePOV(0,0,-step);

            if (reverse5) platform5.movePOV(0,0,-step);
            else platform5.movePOV(0,0,step);

            if (reverse6) platform6.movePOV(0,0,-step);
            else platform6.movePOV(0,0,step);

            if (reverse7) platform7.movePOV(0,0,-step);
            else platform7.movePOV(0,0,step);
        });
    }
}
