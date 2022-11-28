export default class Hud {

    time;

    timeStopped;

    startTime;

    prevTime;

    constructor() {

    }

    updateHud() {
        if (!this.timeStopped && this.startTime != null) {
            this.time = Math.floor((new Date().getTime() - this.startTime) / 1000) + this.prevTime; //keeps track of the total time elapsed in seconds
        }
    }

    startTimer() {
        this.startTime = new Date().getTime();
        this.timeStopped = false;
    }

    stopTimer() {
        this.stopTimer = true;
    }
}