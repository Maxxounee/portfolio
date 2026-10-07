import type { EasingFn } from '@/types/four';

export const linear: EasingFn = (t) => t;

export const easeInQuad: EasingFn = (t) => t * t;
export const easeOutQuad: EasingFn = (t) => 1 - ( 1 - t ) * ( 1 - t );
export const easeInOutQuad: EasingFn = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const easeOutCubic: EasingFn = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic: EasingFn = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* BACK */
export const easeInOutBack: EasingFn = (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return t < 0.5
        ? ( Math.pow(2 * t, 2) * ( ( c2 + 1 ) * 2 * t - c2 ) ) / 2
        : ( Math.pow(2 * t - 2, 2) * ( ( c2 + 1 ) * ( t * 2 - 2 ) + c2 ) + 2 ) / 2;
};
