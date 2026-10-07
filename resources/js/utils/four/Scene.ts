import * as THREE from 'three';
import type { ILight, IModel, IScene, ISceneArg } from '@/types/four';

export class Scene implements IScene {
    public readonly instance: THREE.Scene;

    constructor(arg: ISceneArg) {
        this.instance = new THREE.Scene();
        this.instance.background = null; // прозрачный фон

        for (const model of arg.models) {
            this.instance.add(model.instance);
        }
        for (const light of arg.lights) {
            this.instance.add(light.instance);
        }
    }

    public addModel(model: IModel): void {
        this.instance.add(model.instance);
    }

    public removeModel(model: IModel): void {
        this.instance.remove(model.instance);
    }

    public addLight(light: ILight): void {
        this.instance.add(light.instance);
    }

    public removeLight(light: ILight): void {
        this.instance.remove(light.instance);
    }

    public destroy(): void {
        this.instance.clear();
    }
}
