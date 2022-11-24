/* eslint-disable */
import laptop from '../../models/laptop.glb';
import player from '../../models/player.glb';
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
        });
    }

    async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, laptop);

        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }

    async loadAssetLevel2() {
        const result = await SceneLoader.ImportMeshAsync(null, player);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }
}