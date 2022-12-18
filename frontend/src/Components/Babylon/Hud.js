import {Vector3} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Rectangle, StackPanel, TextBlock, Image} from "@babylonjs/gui";
import Navigate from "../Router/Navigate";
import pauseMenuImage from '../../img/pauseMenuImage.png';


export default class Hud {
    time;

    gamePaused;

    playerUI;

    scene;

    engine;

    clockTime;

    pauseMenu;

    /**
     * Creates a fullsceen UI and adds the ingame timer
     * @param {Scene} scene The current scene
     * @param {Engine} engine The current engine
     */
    constructor(scene, engine) {
        this.scene = scene;
        this.engine = engine;

        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.playerUI = playerUI;
        this.playerUI.idealHeight = 720;

        const stackPanel = new StackPanel();
        stackPanel.height = "100%";
        stackPanel.width = "100%";
        stackPanel.top = "14px";
        stackPanel.verticalAlignment = 0;
        playerUI.addControl(stackPanel);

        const timer = new TextBlock();
        timer.name = "clock";
        timer.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        timer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        timer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        timer.fontSize = "30px";
        timer.color = "white";
        timer.height = "50px";
        timer.width = "50px";
        timer.fontFamily = "Viga";
        stackPanel.addControl(timer);
        this.clockTime = timer;

        this.createPauseMenu();
    }

    /**
     * Updates the ingame time
     */
    updateHud() {
        if (!this.gamePaused && this.time !== undefined) {
            this.time += 1;
            this.clockTime.text = this.time;
        }
    }

    /**
     * Starts the ingame time
     */
    startTimer() {
        this.time = 0;
    }

    /**
     * Creates the pause menu
     */
    createPauseMenu() {
        this.gamePaused = false;

        const pauseMenu = new Rectangle();
        pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        pauseMenu.height = 0.5;
        pauseMenu.width = 0.4;
        pauseMenu.thickness = 0;
        pauseMenu.isVisible = false;

        const image = new Image("camion", pauseMenuImage);
        pauseMenu.addControl(image);

        const stackPanel = new StackPanel();
        stackPanel.width = 1;
        pauseMenu.addControl(stackPanel);

        const resumeBtn = Button.CreateSimpleButton("resume", "RESUME");
        resumeBtn.width = 0.2;
        resumeBtn.height = "40px";
        resumeBtn.color = "black";
        resumeBtn.thickness = 0;
        stackPanel.addControl(resumeBtn);

        const retryBtn = Button.CreateSimpleButton("retry", "RETRY");
        retryBtn.width = 0.2;
        retryBtn.height = "40px";
        retryBtn.color = "black";
        retryBtn.thickness = 0;
        stackPanel.addControl(retryBtn);

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.2;
        quitBtn.height = "40px";
        quitBtn.color = "black";
        quitBtn.thickness = 0;
        stackPanel.addControl(quitBtn);

        this.pauseMenu = pauseMenu;

        resumeBtn.onPointerDownObservable.add(() => {
            this.pauseMenu.isVisible = false;
            this.playerUI.removeControl(pauseMenu);

            this.gamePaused = false;
        });

        retryBtn.onPointerDownObservable.add(() => {
            this.pauseMenu.isVisible = false;
            this.playerUI.removeControl(pauseMenu);

            this.gamePaused = false;

            this.scene.getMeshByName("outer").position = new Vector3(0,2,0);
            this.scene.getCameraByName("Camera").setPosition(new Vector3(-10, 5, 0));
        });

        quitBtn.onPointerDownObservable.add(() => {
            this.engine.dispose();
            this.engine = null;
            Navigate('/');
        });
    }
}