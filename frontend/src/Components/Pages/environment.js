import { Mesh, Vector3 } from "@babylonjs/core";

export default class Environment {
    scene;

    constructor(scene) {
        this.scene = scene;
    }


    async load(level) {
        switch (level) {
            case 1: {
                const ground1 = Mesh.CreateBox("ground", 24, this.scene);
                ground1.scaling = new Vector3(1,.02,1);
                break;
            }

            case 2: {
                const ground2 = Mesh.CreateCylinder("body", 3, 20, 20, 0, 0, this.scene);
                ground2.scaling = new Vector3(1,.02,1);
                break;
            }
            default : {
                break;
            }
        }
    }
}