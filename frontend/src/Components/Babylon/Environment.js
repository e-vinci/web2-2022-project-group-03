import { Color3, PointLight, SceneLoader, Sound, StandardMaterial, Vector3 } from "@babylonjs/core";
import level1 from '../../models/seinecourt1.glb';
import level2 from '../../models/seineplateform1.glb';
import level3 from '../../models/seinecourt2.glb';
import level4 from '../../models/seineplateform2.glb';
import level5 from '../../models/seinecourt3.glb';
import level6 from '../../models/seinefin.glb';

import music2 from  '../../sounds/music2.mp3';
import music3 from  '../../sounds/music3.mp3';
import music4 from  '../../sounds/music4.mp3';
import music5 from  '../../sounds/music5.mp3';
import music6 from  '../../sounds/music6.mp3';

export default class Environment {
    scene;

    /**
     * Gets the scene
     * @param {Scene} scene the current scene
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Loads the level and sets appropriate properties to meshes
     * @param {int} level The current level of the user
     */
    async load(level) {
        let assets
        switch (level) {
            case 1:
                assets = await Environment.loadAssetLevel1();
                break;
            case 2:
                assets = await Environment.loadAssetLevel2();
                break;
            case 3:
                assets = await Environment.loadAssetLevel3();
                break;
            case 4:
                assets = await Environment.loadAssetLevel4();
                break;
            case 5:
                assets = await Environment.loadAssetLevel5();
                break;
            case 6:
                assets = await Environment.loadAssetLevel6();
                break;
            default:
                assets = await Environment.loadAssetLevel1();
                break;
        }

        assets.allMeshes.forEach(m => {
            const mesh = m;
            mesh.checkCollisions = true;

            if (mesh.name.includes("stairs")) {
                mesh.checkCollisions = false;
                mesh.isPickable = false;
            }

            if (mesh.name.includes("fin") || mesh.name.includes("mort")) {
                mesh.checkCollisions = false;
                mesh.isPickable = false;
                mesh.isVisible = false;
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

    /**
     * loads the mesh for the first level
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel1() {
        const result = await SceneLoader.ImportMeshAsync(null, level1);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music5", music5, this.scene, null, { loop: true, autoplay: true });

        return {
            env,
            allMeshes
        }
    }

    /**
     * loads the mesh for the second level
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel2() {
        const result = await SceneLoader.ImportMeshAsync(null, level2);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music2", music2, this.scene, null, { loop: true, autoplay: true });


        return {
            env,
            allMeshes
        }
    }

    /**
     * loads the mesh for the thrid level
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel3() {
        const result = await SceneLoader.ImportMeshAsync(null, level3);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music3", music3, this.scene, null, { loop: true, autoplay: true });

        return {
            env,
            allMeshes
        }
    }

    /**
     * loads the mesh for the fourth
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel4() {
        const result = await SceneLoader.ImportMeshAsync(null, level4);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music4", music4, this.scene, null, { loop: true, autoplay: true });

        return {
            env,
            allMeshes
        }
    }

    /**
     * loads the mesh for the fifth
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel5() {
        const result = await SceneLoader.ImportMeshAsync(null, level5);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music5", music5, this.scene, null, { loop: true, autoplay: true });

        return {
            env,
            allMeshes
        }
    }

    /**
     * loads the mesh for the sixth
     * @returns the environment and all the meshes
     */
    static async loadAssetLevel6() {
        const result = await SceneLoader.ImportMeshAsync(null, level6);
        const env = result.meshes[0];
        const allMeshes = env.getChildMeshes();

        // eslint-disable-next-line
        new Sound("music6", music6, this.scene, null, { loop: true, autoplay: true });

        return {
            env,
            allMeshes
        }
    }
}