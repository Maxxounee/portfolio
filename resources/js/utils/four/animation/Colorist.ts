import * as THREE from 'three';
import { ColorTween } from './ColorTween';
import * as ease from './easing';
import type {
    ColorLike,
    EasingFn,
    IColorist,
    IColoristArg,
    IModel,
} from '@/types/four';

export class Colorist implements IColorist {
    private readonly model: IModel;
    private readonly easing: EasingFn;
    private readonly targetMaterials: THREE.Material[];

    private current: ColorTween | null = null;

    constructor(arg: IColoristArg) {
        this.model = arg.model;
        this.easing = arg.easing ?? ease.linear;
        this.targetMaterials = this.collectMaterials(
            arg.model,
            arg.materialIndex ?? 'all'
        );

        if (this.targetMaterials.length === 0) {
            console.warn('[Colorist] No materials found on model:', arg.model.name);
        }
    }

    public get isAnimating(): boolean {
        return this.current?.isAnimating ?? false;
    }

    public to(color: ColorLike, duration = 0.4): void {
        const from = this.readCurrentColor();
        const to = new THREE.Color(color as THREE.ColorRepresentation);

        this.current = new ColorTween({
            from,
            to,
            duration,
            easing: this.easing,
            apply: (c) => this.applyToMaterials(c),
        });
    }

    public set(color: ColorLike): void {
        this.cancel();
        const c = new THREE.Color(color as THREE.ColorRepresentation);
        this.applyToMaterials(c);
    }

    public cancel(): void {
        this.current?.cancel();
        this.current = null;
    }

    public update(dt: number): void {
        this.current?.update(dt);
    }

    /* ---------- internal ---------- */

    private collectMaterials(
        model: IModel,
        index: number | 'all'
    ): THREE.Material[] {
        const result: THREE.Material[] = [];

        model.instance.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;

            const materials = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];

            if (index === 'all') {
                result.push(...materials);
            } else {
                const mat = materials[index];
                if (mat) result.push(mat);
            }
        });

        return result;
    }

    private readCurrentColor(): THREE.Color {
        const first = this.targetMaterials[0];
        const c = this.getMaterialColor(first);
        return c ? c.clone() : new THREE.Color(0xffffff);
    }

    private getMaterialColor(mat?: THREE.Material): THREE.Color | null {
        if (!mat) return null;
        const anyMat = mat as THREE.Material & { color?: THREE.Color };
        return anyMat.color ?? null;
    }

    private applyToMaterials(color: THREE.Color): void {
        for (const mat of this.targetMaterials) {
            const anyMat = mat as THREE.Material & { color?: THREE.Color };
            if (anyMat.color) {
                anyMat.color.copy(color);
            }
        }
    }
}
