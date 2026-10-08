import type { EasingFn } from '@/types/four';

export interface TweenOptions<T> {
    from: T;
    to: T;
    duration: number;
    easing: EasingFn;
    apply: (value: T) => void;
}

export class Tween<T> {
    private from: T;
    private to: T;
    private duration: number;
    private easing: EasingFn;
    private apply: (value: T) => void;

    private elapsed = 0;
    private active = true;

    constructor(opts: TweenOptions<T>) {
        this.from = opts.from;
        this.to = opts.to;
        this.duration = Math.max(opts.duration, 0);
        this.easing = opts.easing;
        this.apply = opts.apply;

        this.apply(this.from);
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
        const value = this.lerp(this.from, this.to, eased);

        this.apply(value);

        if (t >= 1) {
            this.active = false;
        }
    }

    public cancel(): void {
        this.active = false;
    }

    private lerp(a: T, b: T, t: number): T {
        if (typeof a === 'number' && typeof b === 'number') {
            return ( a + ( b - a ) * t ) as T;
        }
        if (typeof a === 'object' && a && typeof b === 'object' && b) {
            const result = {} as T;
            for (const key of Object.keys(a) as ( keyof T )[]) {
                const av = a[key] as unknown as number;
                const bv = b[key] as unknown as number
                ;( result[key] as unknown as number ) = av + ( bv - av ) * t;
            }
            return result;
        }
        throw new Error('Unsupported tween type');
    }
}
