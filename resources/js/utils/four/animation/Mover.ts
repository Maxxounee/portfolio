import * as THREE from 'three';
import { Tween } from './Tween';
import { easeInOutQuad } from './easing';
import type { EasingFn, IMover, IMoverArg, IModel } from '@/types/four';

export class Mover implements IMover {
    private readonly model: IModel;
    private readonly easing: EasingFn;
    private current: Tween<THREE.Vector3> | null = null;
    private readonly target = new THREE.Vector3();

    constructor(arg: IMoverArg) {
        this.model = arg.model;
        this.easing = arg.easing ?? easeInOutQuad;
        const p = this.model.instance.position;
        this.target.set(p.x, p.y, p.z);
    }

    public get isAnimating(): boolean {
        return this.current?.isAnimating ?? false;
    }

    public to(x: number, y: number, z: number, duration = 0.4): void {
        this.target.set(x, y, z);
        this.animateToTarget(duration);
    }

    public by(dx: number, dy: number, dz: number, duration = 0.4): void {
        this.target.x += dx;
        this.target.y += dy;
        this.target.z += dz;
        this.animateToTarget(duration);
    }

    private animateToTarget(duration: number): void {
        const p = this.model.instance.position;
        const from = new THREE.Vector3(p.x, p.y, p.z);
        const to = this.target.clone();
        if (from.equals(to)) {
            this.cancel();
            return;
        }
        this.cancel();

        this.current = new Tween<THREE.Vector3>({
            from, to, duration,
            easing: this.easing,
            apply: (v) => this.model.setPosition(v.x, v.y, v.z),
        });
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
