import * as THREE from 'three';
import { Tween } from './Tween';
import { easeInOutQuad } from './easing';
import type { EasingFn, IMover, IMoverArg, IModel } from '@/types/four';

export class Mover implements IMover {
    private readonly model: IModel;
    private readonly easing: EasingFn;
    private current: Tween<THREE.Vector3> | null = null;

    constructor(arg: IMoverArg) {
        this.model = arg.model;
        this.easing = arg.easing ?? easeInOutQuad;
    }

    public get isAnimating(): boolean {
        return this.current?.isAnimating ?? false;
    }

    public to(x: number, y: number, z: number, duration = 0.4): void {
        const p = this.model.instance.position;
        this.current = new Tween<THREE.Vector3>({
            from: new THREE.Vector3(p.x, p.y, p.z),
            to: new THREE.Vector3(x, y, z),
            duration,
            easing: this.easing,
            apply: (v) => this.model.setPosition(v.x, v.y, v.z),
        });
    }

    public by(dx: number, dy: number, dz: number, duration = 0.4): void {
        const p = this.model.instance.position;
        this.to(p.x + dx, p.y + dy, p.z + dz, duration);
    }

    public set(x: number, y: number, z: number): void {
        this.cancel();
        this.model.setPosition(x, y, z);
    }

    public cancel(): void {
        this.current?.cancel();
        this.current = null;
    }

    public update(dt: number): void {
        this.current?.update(dt);
    }
}
