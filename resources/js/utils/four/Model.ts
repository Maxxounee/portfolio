import * as THREE from 'three';
import type { IModel, IModelArg } from '@/types/four';

export class Model implements IModel {
    public readonly instance: THREE.Object3D;
    public name: string;

    constructor(arg: IModelArg) {
        this.instance = arg.instance;
        this.name = arg.name ?? arg.instance.name ?? 'model';
        this.instance.name = this.name;
    }

    public setVisible(visible: boolean): void {
        this.instance.visible = visible;
    }

    public setPosition(x: number, y: number, z: number): void {
        this.instance.position.set(x, y, z);
    }

    public setRotation(x: number, y: number, z: number): void {
        this.instance.rotation.set(x, y, z);
    }

    public setScale(x: number, y: number, z: number): void {
        this.instance.scale.set(x, y, z);
    }

    public setName(name: string): void {
        this.name = name;
    }

    public destroy(): void {
        // 1. освободить GPU-ресурсы всех мешей
        this.instance.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry?.dispose();

                const material = obj.material;
                const materials = Array.isArray(material) ? material : [material];

                for (const m of materials) {
                    if (!m) continue;

                    // текстуры материала
                    for (const key of Object.keys(m)) {
                        const value = ( m as unknown as Record<string, unknown> )[key];
                        if (value instanceof THREE.Texture) {
                            value.dispose();
                        }
                    }

                    m.dispose();
                }
            }
        });

        // 2. убрать из родителя
        this.instance.removeFromParent();
        this.instance.clear();
    }
}
