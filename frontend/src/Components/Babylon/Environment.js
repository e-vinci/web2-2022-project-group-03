/* eslint-disable */
import laptop from '../../models/laptop.glb';
import environnement from '../../models/envSetting.glb';
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


            if (m.name === "ground") {
                m.checkCollisions = false;
                m.isPickable = false;
            }
            if (m.name.includes("stairs") || m.name === "cityentranceground" || m.name === "fishingground.001" || m.name.includes("lilyflwr")) {
                m.checkCollisions = false;
                m.isPickable = false;
            }
            if (m.name.includes("collision")) {
                m.isVisible = false;
                m.isPickable = true;
            }
            if (m.name.includes("Trigger")) {
                m.isVisible = false;
                m.isPickable = false;
                m.checkCollisions = false;
            }
        });
    }

    async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, environnement);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }

    async loadAssetLevel2() {
        const result = await SceneLoader.ImportMeshAsync(null, laptop);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return {
            env: env,
            allMeshes: allMeshes
        }
    }
}