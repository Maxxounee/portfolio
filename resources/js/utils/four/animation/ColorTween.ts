import * as THREE from 'three';
import type { EasingFn } from '@/types/four';

export interface ColorTweenOptions {
    from: THREE.Color;
    to: THREE.Color;
    duration: number;
    easing: EasingFn;
    apply: (color: THREE.Color) => void;
}

export class ColorTween {
    private readonly from: THREE.Color;
    private readonly to: THREE.Color;
    private readonly duration: number;
    private readonly easing: EasingFn;
    private readonly apply: (color: THREE.Color) => void;

    private readonly tmp = new THREE.Color();

    private elapsed = 0;
    private active = true;

    constructor(opts: ColorTweenOptions) {
        this.from = opts.from.clone();
        this.to = opts.to.clone();
        this.duration = Math.max(opts.duration, 0);
        this.easing = opts.easing;
        this.apply = opts.apply;

        this.apply(this.from.clone());
    }

    public get isAnimating(): boolean {
        return this.active;
    }

    public update(dt: number): void {
        if (!this.active) return;

        this.elapsed += dt;

        const t = this.duration === 0
            ? 1
            : Math.min(this.elapsed / this.duration, 1);

        const eased = this.easing(t);

        this.tmp.lerpColors(this.from, this.to, eased);
        this.apply(this.tmp);

        if (t >= 1) {
            this.active = false;
        }
    }

    public cancel(): void {
        this.active = false;
    }
}
