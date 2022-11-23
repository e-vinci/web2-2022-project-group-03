import { Mesh, Vector3 } from "@babylonjs/core";

export default class Environment {
    scene;

    constructor(scene) {
        this.scene = scene;
    }

    async load() {
        const ground = Mesh.CreateBox("ground", 24, this.scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}