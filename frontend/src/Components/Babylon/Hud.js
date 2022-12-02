import {AdvancedDynamicTexture, Button, Control, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";

export default class Hud {
    time;

    timeStopped;

    gamePaused;

    playerUI;

    scene;

    clockTime;

    pauseBtn;

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

        const clockTime = new TextBlock();
        clockTime.name = "clock";
        clockTime.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        clockTime.fontSize = "48px";
        clockTime.color = "white";
        clockTime.resizeToFit = true;
        clockTime.height = "96px";
        clockTime.width = "220px";
        clockTime.fontFamily = "Viga";
        stackPanel.addControl(clockTime);
        this.clockTime = clockTime;

        const pauseBtn = Button.CreateSimpleButton("pauseBtn", "PAUSE");
        pauseBtn.width = "48px";
        pauseBtn.height = "86px";
        pauseBtn.thickness = 0;
        pauseBtn.verticalAlignment = 0;
        pauseBtn.horizontalAlignment = 1;
        pauseBtn.top = "-16px";
        playerUI.addControl(pauseBtn);
        pauseBtn.zIndex = 10;
        this.pauseBtn = pauseBtn;

        pauseBtn.onPointerDownObservable.add(() => {
            this.pauseMenu.isVisible = true;
            playerUI.addControl(this.pauseMenu);
            this.pauseBtn.isHitTestVisible = false;

            this.gamePaused = true;
        });

        this.createPauseMenu();
    }

    updateHud() {
        if (!this.gamePaused && this.time != null && !this.timeStopped) {
            this.time += 1;
            this.clockTime.text = this.time;
        }
    }

    startTimer() {
        this.time = 0;
        this.timeStopped = false;
    }

    stopTimer() {
        this.timeStopped = true;
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
        resumeBtn.width = 0.18;
        resumeBtn.height = "44px";
        resumeBtn.color = "white";
        resumeBtn.fontFamily = "Viga";
        resumeBtn.paddingBottom = "14px";
        resumeBtn.cornerRadius = 14;
        resumeBtn.fontSize = "12px";
        resumeBtn.textBlock.resizeToFit = true;
        resumeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(resumeBtn);

        this.pauseMenu = pauseMenu;

        resumeBtn.onPointerDownObservable.add(() => {
            this.pauseMenu.isVisible = false;
            this.playerUI.removeControl(pauseMenu);
            this.pauseBtn.isHitTestVisible = true;

            this.gamePaused = false;
        });

        const quitBtn = Button.CreateSimpleButton("quit", "QUIT");
        quitBtn.width = 0.18;
        quitBtn.height = "44px";
        quitBtn.color = "white";
        quitBtn.fontFamily = "Viga";
        quitBtn.paddingBottom = "12px";
        quitBtn.cornerRadius = 14;
        quitBtn.fontSize = "12px";
        resumeBtn.textBlock.resizeToFit = true;
        quitBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        quitBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        stackPanel.addControl(quitBtn);
    }
}