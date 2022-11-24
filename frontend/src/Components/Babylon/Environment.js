/* eslint-disable */
import laptop from '../../models/laptop.glb';
import environnement from '../../models/envSetting.glb';
import lanternMesh from '../../models/lantern.glb';
import {SceneLoader, TransformNode} from "@babylonjs/core";

export default class Environment {
    scene;
    lanternObjs;
    lightmtl;
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

        assets.lantern.isVisible = false;
        const lanternHolder = new TransformNode("lanternHolder", this.scene);
        for (let i = 0; i < 22; i++) {
            let lanternInstance = assets.lantern.clone("lantern" + i);
            lanternInstance.isVisible = true;
            lanternInstance.setParent(lanternHolder);

            let newLantern = new Lantern(
                this.lightmtl,
                lanternInstance,
                this.scene,
                assets.env
                    .getChildTransformNodes(false)
                    .find(m => m.name === "lantern " + i)
                    .getAbsolutePosition());
            
            this.lanternObjs.push(newLantern);
        }
        assets.lantern.dispose();
    }

    async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, environnement);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        const res = await SceneLoader.ImportMeshAsync(null, lanternMesh)
        let lantern = res.meshes[0].getChildren()[0];
        lantern.parent = null;
        res.meshes[0].dispose();

        return {
            env: env,
            allMeshes: allMeshes,
            lantern: lantern
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