import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type {
    ICamera,
} from '@/types/four';
import {
    ICameraControls, ICameraControlsArg
} from "@/types/four/controls";

export class CameraControls implements ICameraControls {
    public readonly instance: OrbitControls;

    constructor(arg: ICameraControlsArg) {
        this.instance = new OrbitControls(arg.camera.instance, arg.domElement);

        // точка вращения
        const t = arg.target ?? { x: 0, y: 0, z: 0 };
        this.instance.target.set(t.x, t.y, t.z);

        // инерция
        this.instance.enableDamping = arg.enableDamping ?? true;
        this.instance.dampingFactor = arg.dampingFactor ?? 0.05;

        // автовращение
        this.instance.autoRotate = arg.autoRotate ?? false;
        this.instance.autoRotateSpeed = arg.autoRotateSpeed ?? 2.0;

        // ограничения
        if (arg.minDistance !== undefined) this.instance.minDistance = arg.minDistance;
        if (arg.maxDistance !== undefined) this.instance.maxDistance = arg.maxDistance;

        // разрешения
        this.instance.enableRotate = arg.enableRotate ?? true;
        this.instance.enableZoom = arg.enableZoom ?? true;
        this.instance.enablePan = arg.enablePan ?? true;

        // обязательный первый update, чтобы target применился
        this.instance.update();
    }

    public update(): void {
        this.instance.update();
    }

    public setTarget(x: number, y: number, z: number): void {
        this.instance.target.set(x, y, z);
        this.instance.update();
    }

    public setAutoRotate(enabled: boolean): void {
        this.instance.autoRotate = enabled;
    }

    public destroy(): void {
        this.instance.dispose();
    }
}
