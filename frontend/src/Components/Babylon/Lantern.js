import { PBRMetallicRoughnessMaterial, Mesh, Scene, Vector3, AnimationGroup, PointLight, Color3 } from "@babylonjs/core";

export class Lantern {
    scene;

    mesh;
    isLit = false;
    lightSphere;
    lightmtl;

    constructor(lightmtl, mesh, scene, position, animationGroups) {
        this.scene = scene;
        this.lightmtl = lightmtl;

        const lightSphere = Mesh.CreateSphere("illum", 4, 20, this.scene);
        lightSphere.scaling.y = 2;
        lightSphere.setAbsolutePosition(position);
        lightSphere.parent = this.mesh;
        lightSphere.isVisible = false;
        lightSphere.isPickable = false;
        this.lightSphere = lightSphere;

        this.loadLantern(mesh, position);
    }

    loadLantern(mesh, position) {
        this.mesh = mesh;
        this.mesh.scaling = new Vector3(.8, .8, .8);
        this.mesh.setAbsolutePosition(position);
        this.mesh.isPickable = false;
    }

    setEmissiveTexture() {
        this.isLit = true;

        this.mesh.material = this.lightmtl;

        const light = new PointLight("lantern light", this.mesh.getAbsolutePosition(), this.scene);
        light.intensity = 30;
        light.radius = 2;
        light.diffuse = new Color3(0.45, 0.56, 0.80);
        this.findNearestMeshes(light);
    }

    findNearestMeshes(light) {
        this.scene.getMeshByName("__root__").getChildMeshes().forEach(m => {
            if (this.lightSphere.intersectsMesh(m)) {
                light.includedOnlyMeshes.push(m);
            }
        });

        this.lightSphere.dispose();
    }

}