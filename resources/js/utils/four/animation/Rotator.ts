import * as THREE from 'three';
import { Tween } from './Tween';
import * as ease from './easing';
import type {
    Axis,
    EasingFn,
    IModel,
    IRotator,
    IRotatorArg,
} from '@/types/four';
import { degToRad } from "@/utils/four/animation/utils";

export class Rotator implements IRotator {
    private readonly model: IModel;
    private readonly easing: EasingFn;
    private current: Tween<THREE.Vector3> | null = null;

    private readonly target = new THREE.Vector3(0, 0, 0);

    constructor(arg: IRotatorArg) {
        this.model = arg.model;
        this.easing = arg.easing ?? ease.easeInOutQuad;

        const r = this.model.instance.rotation;
        this.target.set(r.x, r.y, r.z);
    }

    public get isAnimating(): boolean {
        return this.current?.isAnimating ?? false;
    }


    public to(axis: Axis, degrees: number, duration = 0.4): void {
        this.target[axis] = degToRad(degrees);
        this.animateToTarget(duration);
    }


    public by(axis: Axis, degrees: number, duration = 0.4): void {
        this.target[axis] += degToRad(degrees);
        this.animateToTarget(duration);
    }

    public set(axis: Axis, degrees: number): void {
        /* TODO: доделать по всем осям одновременно */
        const radians = degToRad(degrees);
        this.cancel();
        this.target[axis] = radians;

        const r = this.model.instance.rotation;
        this.model.setRotation(
            axis === 'x' ? radians : r.x,
            axis === 'y' ? radians : r.y,
            axis === 'z' ? radians : r.z,
        );
    }

    public cancel(): void {
        this.current?.cancel();
        this.current = null;
    }

    public update(dt: number): void {
        this.current?.update(dt);
    }

    private animateToTarget(baseDuration: number): void {
        const r = this.model.instance.rotation;
        const from = new THREE.Vector3(r.x, r.y, r.z);
        const to = this.target.clone();

        if (from.equals(to)) {
            this.cancel();
            return;
        }
        this.cancel();

        const distance = from.distanceTo(to);
        const duration = baseDuration * ((distance ** 0.5) / (Math.PI / 2));

        this.current = new Tween<THREE.Vector3>({
            from,
            to,
            duration,
            easing: this.easing,
            apply: (v) => this.model.setRotation(v.x, v.y, v.z),
        });
    }
}
