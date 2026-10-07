import * as THREE from 'three';
import { Tween } from './Tween';
import * as ease from './easing';
import type {
    Axis,
    EasingFn,
    IAnimatable,
    IModel,
    IRotator,
    IRotatorArg,
} from '@/types/four';

export class Rotator implements IRotator {
    private readonly model: IModel;
    private readonly easing: EasingFn;
    private current: Tween<THREE.Vector3> | null = null;

    constructor(arg: IRotatorArg) {
        this.model = arg.model;

        this.easing = arg.easing ?? ease.easeInOutQuad;

    }

    public get isAnimating(): boolean {
        return this.current?.isAnimating ?? false;
    }

    public to(axis: Axis, radians: number, duration = 0.4): void {
        const r = this.model.instance.rotation;

        const from = new THREE.Vector3(r.x, r.y, r.z);
        const to = from.clone();
        to[axis] = radians;

        this.current = new Tween<THREE.Vector3>({
            from,
            to,
            duration,
            easing: this.easing,
            apply: (v) => this.model.setRotation(v.x, v.y, v.z),
        });
    }

    public by(axis: Axis, radians: number, duration = 0.4): void {
        const r = this.model.instance.rotation;
        const from = new THREE.Vector3(r.x, r.y, r.z);
        const to = from.clone();
        to[axis] += radians;

        this.current = new Tween<THREE.Vector3>({
            from,
            to,
            duration,
            easing: this.easing,
            apply: (v) => this.model.setRotation(v.x, v.y, v.z),
        });
    }

    public set(axis: Axis, radians: number): void {
        this.cancel();
        const r = this.model.instance.rotation;
        this.model.setRotation(
            axis === 'x' ? radians : r.x,
            axis === 'y' ? radians : r.y,
            axis === 'z' ? radians : r.z
        );
    }

    public cancel(): void {
        this.current?.cancel();
        this.current = null;
    }

    public update(dt: number): void {
        this.current?.update(dt);
    }
}
