import { SceneLoader } from "@babylonjs/core";
import damien from '../../models/seinecourt1test.glb';

export default class Environment {
    scene;

    constructor(scene) {
        this.scene = scene;
    }

    static async load(level) {
        let assets
        switch (level) {
            case 1:
                assets = await Environment.loadAssetLevel1();
                break;
            case 2:
                assets = await Environment.loadAssetLevel2()
                break;
            default :
                assets = await Environment.loadAssetLevel1();
                break;
        }

        assets.allMeshes.forEach(m => {
            const mesh = m;
            mesh.receiveShadows = true;
            mesh.checkCollisions = true;


            if (mesh.name.includes("stairs")) {
                mesh.checkCollisions = false;
                mesh.isPickable = false;
            }

            if (mesh.name.includes("ramp")) {
                mesh.isVisible = false;
            }
        });
    }

    static async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, damien);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        return {
            env,
            allMeshes
        }
    }

    static async loadAssetLevel2() {
        const result = await SceneLoader.ImportMeshAsync(null, damien);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        return {
            env,
            allMeshes
        }
    }
}