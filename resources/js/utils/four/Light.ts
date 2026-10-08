import * as THREE from 'three';
import type { ILight, ILightArg, LightKind } from '@/types/four';

function createLight(arg: ILightArg): THREE.Light {
    const color = arg.color ?? 0xffffff;
    const intensity = arg.intensity ?? 1;
    const pos = arg.position;

    let light: THREE.Light;

    switch (arg.kind) {
        case 'ambient':
            light = new THREE.AmbientLight(color, intensity);
            break;

        case 'directional':
            light = new THREE.DirectionalLight(color, intensity);
            break;

        case 'point':
            light = new THREE.PointLight(color, intensity, arg.distance ?? 0);
            break;

        case 'spot':
            light = new THREE.SpotLight(
                color,
                intensity,
                arg.distance ?? 0,
                arg.angle ?? Math.PI / 3,
                arg.penumbra ?? 0
            );
            break;

        case 'hemisphere':
            light = new THREE.HemisphereLight(color, 0x000000, intensity);
            break;

        default: {
            // exhaustive check
            const _exhaustive: never = arg.kind;
            throw new Error(`Unknown light kind: ${_exhaustive}`);
        }
    }

    if (pos) {
        light.position.set(pos.x, pos.y, pos.z);
    }

    return light;
}

export class Light implements ILight {
    public readonly instance: THREE.Light;
    public readonly kind: LightKind;
    public readonly name: string;

    constructor(arg: ILightArg) {
        this.kind = arg.kind;
        this.instance = createLight(arg);
        this.name = arg.name ?? `${arg.kind}-light`;
        this.instance.name = this.name;
    }

    public setIntensity(value: number): void {
        this.instance.intensity = value;
    }

    public setColor(color: number | string): void {
        this.instance.color = new THREE.Color(color);
    }

    public setVisible(visible: boolean): void {
        this.instance.visible = visible;
    }

    public destroy(): void {
        // у светильников нет GPU-ресурсов, но
        // если когда-нибудь добавишь shadow map — dispose тут:
        const light = this.instance as THREE.Light & {
            shadow?: { map?: THREE.Texture | null }
        };
        light.shadow?.map?.dispose();

        this.instance.removeFromParent();
    }
}
