import * as THREE from 'three';
import { Light } from './Light';
import { Model } from './Model';
import type { ILight, IModel } from '@/types/four';

export function createBoxModel(
    size = 1.5,
    color = 0x42b883
): IModel {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.4,
    });

    return new Model({
        instance: new THREE.Mesh(geometry, material),
        name: 'box',
    });
}

export function createDefaultLights(): ILight[] {
    return [
        new Light({
            kind: 'ambient',
            intensity: 0.6,
            name: 'ambient',
        }),
        new Light({
            kind: 'directional',
            intensity: 1.2,
            position: { x: 3, y: 3, z: 3 },
            name: 'key-light',
        }),
    ];
}

export function toModel(obj: THREE.Object3D, name?: string): IModel {
    return new Model({ instance: obj, name });
}
