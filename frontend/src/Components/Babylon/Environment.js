import {Color3, PointLight, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core";
import damien from '../../models/seinecourt1.glb';

export default class Environment {
    scene;

    constructor(scene) {
        this.scene = scene;
    }

    async load(level) {
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
            mesh.checkCollisions = true;

            if (mesh.name.includes("stairs") || mesh.name.includes("fin")) {
                mesh.checkCollisions = false;
                mesh.isPickable = false;
            }

            if (mesh.name.includes("ramp") || mesh.name.includes("MUR")) {
                mesh.isVisible = false;
            }

            if (mesh.name.includes("leaves")
                || mesh.name.includes("aspirateur")
                || mesh.name.includes("air")
                || mesh.name.includes("bark")
                || mesh.name.includes("sky")) {
                mesh.checkCollisions = false;
            }

            if (mesh.name.includes("bulb")) {
                const whiteMat = new StandardMaterial("whiteMat");
                whiteMat.emissiveColor = Color3.White();
                whiteMat.alpha = 0.8;

                const light = new PointLight("sparklight", new Vector3(0, -1, 0), this.scene);
                light.intensity = 35;
                light.diffuse = Color3.White();
                mesh.material = whiteMat;
                light.parent = mesh;
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