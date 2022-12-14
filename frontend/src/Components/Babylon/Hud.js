import {AdvancedDynamicTexture, Button, Control, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import Navigate from "../Router/Navigate";

export default class Hud {
    time;

    gamePaused;

    playerUI;

    scene;

    clockTime;

    pauseMenu;

    constructor(scene) {
        this.scene = scene;

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

    updateHud() {
        if (!this.gamePaused && this.time !== undefined) {
            this.time += 1;
            this.clockTime.text = this.time;
        }
    }

    startTimer() {
        this.time = 0;
    }

    createPauseMenu() {
        this.gamePaused = false;

        const pauseMenu = new Rectangle();
        pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        pauseMenu.height = 0.8;
        pauseMenu.width = 0.5;
        pauseMenu.thickness = 0;
        pauseMenu.isVisible = false;

        const stackPanel = new StackPanel();
        stackPanel.width = .83;
        pauseMenu.addControl(stackPanel);

        const resumeBtn = Button.CreateSimpleButton("resume", "RESUME");
        resumeBtn.width = 0.2;
        resumeBtn.height = "40px";
        resumeBtn.color = "white";
        resumeBtn.top = "-14px";
        resumeBtn.thickness = 0;
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(resumeBtn);

        this.pauseMenu = pauseMenu;

        resumeBtn.onPointerDownObservable.add(() => {
            this.pauseMenu.isVisible = false;
            this.playerUI.removeControl(pauseMenu);

            this.gamePaused = false;
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
            Navigate('/');
        });
    }
}