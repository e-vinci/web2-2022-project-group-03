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
import mcqueen from '../../models/mcqueen.glb';

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

    /**
     * Creates the canvas and engine and start the main method
     */
    constructor() {
        this.canvas = this.createCanvas();

        this.engine = new Engine(this.canvas, true);

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

        await this.environment.load(parseInt(result.level, 10) || 1);

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

                    this.ui.gamePaused = true;

                    const response = await fetch(`${process.env.API_BASE_URL}/users/get`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            Authorization: getAuthenticatedUser().token
                        }
                    });

                    const { level } = await response.json();

                    if (level < 2) {
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
                            level,
                            time: this.ui.time
                        })
                    });
                },
            ),
        );
    }

    /**
     * Creates multiple cars and start their animations
     */
    async carAnim() {
        const result = await SceneLoader.ImportMeshAsync(null, mcqueen);
        const car = result.meshes[0];
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

            if (Math.floor(car.position.z) === 90)
                car.position = new Vector3(22.5, 3, -30);
            if (Math.floor(car2.position.z) === -25)
                car2.position = new Vector3(22.5, 3, 70);
            if (Math.floor(car3.position.x) === -80)
                car3.position = new Vector3(10, 5.4, 60);
            if (Math.floor(car4.position.x) === 22)
                car4.position = new Vector3(-180,5.4,60);

            car.movePOV(0, 0, step);
            car2.movePOV(0,0, step);
            car3.movePOV(0,0, step);
            car4.movePOV(0,0, step);
        });
    }
}
