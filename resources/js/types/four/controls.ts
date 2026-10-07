/* =========================================================
 *  CameraControls
 * =======================================================*/

import { ICamera, IDestroyable, ILight } from "@/types/four/index";

export type OptionalFeature<TArg, TOmitted extends keyof TArg> =
    | boolean
    | Omit<TArg, TOmitted>

export interface ICameraControlsArg {
    camera: ICamera;
    domElement: HTMLElement;
    target?: { x: number; y: number; z: number };
    enableDamping?: boolean;
    dampingFactor?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    minDistance?: number;
    maxDistance?: number;
    enableRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
}

export interface ICameraControls extends IDestroyable {
    readonly instance: import('three/addons/controls/OrbitControls.js').OrbitControls;

    update(): void;

    setTarget(x: number, y: number, z: number): void;

    setAutoRotate(enabled: boolean): void;
}

export interface ICameraControlsCtor {
    new(arg: ICameraControlsArg): ICameraControls;
}

/* =========================================================
 *  DebugGui
 * =======================================================*/

export interface IDebugGuiArg {
    camera: ICamera;
    controls?: ICameraControls | null;
    lights?: ILight[];
    showFps?: boolean;
    title?: string;
    open?: boolean;
}

export interface IDebugGui extends IDestroyable {
    setVisible(visible: boolean): void;

    update(dt: number): void;

    toggle(): void;
}

export interface IDebugGuiCtor {
    new(arg: IDebugGuiArg): IDebugGui;
}

export type ControlsOption = OptionalFeature<ICameraControlsArg, 'camera' | 'domElement'>
export type DebugOption = OptionalFeature<IDebugGuiArg, 'camera' | 'controls'>
