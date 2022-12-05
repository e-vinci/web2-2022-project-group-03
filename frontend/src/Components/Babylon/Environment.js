/* eslint-disable */
import damien from '../../models/TEST2.glb';
import { SceneLoader } from "@babylonjs/core";

export default class Environment {
    scene;

    constructor(scene) {
        this.scene = scene;
    }

    async load(level) {
        let assets
        switch (level) {
            case 1:
                assets = await this.loadAssetLevel1();
                break;
            case 2:
                assets = await this.loadAssetLevel2()
                break;
        }

        assets.allMeshes.forEach(m => {
            m.receiveShadows = true;
            m.checkCollisions = true;


            if (m.name.includes("stairs")) {
                m.checkCollisions = false;
                m.isPickable = false;
            }

            if (m.name.includes("ramp")) {
                m.isVisible = false;
            }
        });
    }

    async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, damien);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }

    async loadAssetLevel2() {
        const result = await SceneLoader.ImportMeshAsync(null, damien);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }
}