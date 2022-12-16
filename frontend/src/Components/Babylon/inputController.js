import {ActionManager, ExecuteCodeAction, Scalar} from "@babylonjs/core";

export default class PlayerInput {
    inputMap;

    horizontal = 0;

    vertical = 0;

    horizontalAxis = 0;

    verticalAxis = 0;

    jumpKeyDown;

    ui;

    scene;

    pauseMenuVisible = false;

    constructor(scene, ui) {
        this.scene = scene;
        this.ui = ui;

        this.scene.actionManager = new ActionManager(scene);

        this.inputMap = {};
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {

            if (evt.sourceEvent.key === "Escape" && this.pauseMenuVisible) {
                this.pauseMenuVisible = false;
                this.ui.gamePaused = false;
                this.ui.pauseMenu.isVisible = false;
                this.ui.playerUI.removeControl(this.ui.pauseMenu);
            } else if (evt.sourceEvent.key === "Escape") {
                this.pauseMenuVisible = true;
            }

            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));

        scene.onBeforeRenderObservable.add(() => {
            this.updateFromKeyboard();
        });
    }

    updateFromKeyboard() {
        if (this.inputMap.z && !this.ui.gamePaused) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.verticalAxis = 1;

        } else if (this.inputMap.s && !this.ui.gamePaused) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        if (this.inputMap.q && !this.ui.gamePaused) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;

        } else if (this.inputMap.d && !this.ui.gamePaused) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }

        if (this.inputMap[" "]  && !this.ui.gamePaused) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }

        if (this.inputMap.Escape && !this.ui.gamePaused) {
            this.ui.gamePaused = true;
            this.ui.pauseMenu.isVisible = true;
            this.ui.playerUI.addControl(this.ui.pauseMenu);
        }

        /*
        if (this.inputMap.c && !this.ui.gamePaused) {
            const player = this.scene.getMeshByName("outer");
            player.firstPersonView();
        }
        */
    }
}