import type * as THREE from 'three';
import { type Ref } from 'vue';
import { ICameraControls, IDebugGui } from "@/types/four/controls";

/* =========================================================
 *  Common
 * =======================================================*/

export interface IWH {
    w: number;
    h: number;
}

export interface IResizable {
    resize(arg: IWH): void;
}

export interface IDestroyable {
    destroy(): void;
}

/* =========================================================
 *  Model
 * =======================================================*/

export interface IModelArg {
    /** Готовая модель (загруженная или собранная вручную). */
    instance: THREE.Object3D;
    /** Опциональный «человеческий» id для поиска. */
    name?: string;
}

export interface IModel extends IDestroyable {
    readonly instance: THREE.Object3D;
    readonly name: string;

    setVisible(visible: boolean): void;

    setPosition(x: number, y: number, z: number): void;

    setRotation(x: number, y: number, z: number): void;

    setScale(x: number, y: number, z: number): void;

    setName(name: string): void;
}

export interface IModelCtor {
    new(arg: IModelArg): IModel;
}

/* =========================================================
 *  Light
 * =======================================================*/

export type LightKind =
    | 'ambient'
    | 'directional'
    | 'point'
    | 'spot'
    | 'hemisphere'

export interface ILightArg {
    kind: LightKind;
    color?: number | string;
    intensity?: number;
    position?: { x: number; y: number; z: number };
    /** Для point / spot — дистанция действия. */
    distance?: number;
    /** Для spot — угол конуса (радианы). */
    angle?: number;
    /** Для spot — мягкость края (0..1). */
    penumbra?: number;
    name?: string;
}

export interface ILight extends IDestroyable {
    readonly instance: THREE.Light;
    readonly kind: LightKind;
    readonly name: string;

    setIntensity(value: number): void;

    setColor(color: number | string): void;

    setVisible(visible: boolean): void;
}

export interface ILightCtor {
    new(arg: ILightArg): ILight;
}

/* =========================================================
 *  Camera
 * =======================================================*/

export interface ICameraArg extends IWH {
    fov?: number;
    near?: number;
    far?: number;
}

export interface ICamera extends IResizable, IDestroyable {
    readonly instance: THREE.PerspectiveCamera;
}

export interface ICameraCtor {
    new(arg: ICameraArg): ICamera;
}

/* =========================================================
 *  Scene
 * =======================================================*/

export interface ISceneArg {
    models: IModel[];
    lights: ILight[];
}

export interface IScene extends IDestroyable {
    readonly instance: THREE.Scene;

    addModel(model: IModel): void;

    removeModel(model: IModel): void;

    addLight(light: ILight): void;

    removeLight(light: ILight): void;
}

export interface ISceneCtor {
    new(arg: ISceneArg): IScene;
}

/* =========================================================
 *  Renderer
 * =======================================================*/

export interface IRendererArg extends IWH {
    container: HTMLElement;
    antialias?: boolean;
    alpha?: boolean;
}

export interface IRenderer extends IResizable, IDestroyable {
    readonly instance: THREE.WebGLRenderer;
}

export interface IRendererCtor {
    new(arg: IRendererArg): IRenderer;
}

/* =========================================================
 *  Director
 * =======================================================*/

export type FrameCallback = (dt: number, elapsed: number) => void

export interface IDirectorArg {
    renderer: IRenderer;
    scene: IScene;
    camera: ICamera;
    modelManager: IModelManager;
    animation: IAnimationManager;
    lights: ILight[];
    controls?: ICameraControls;
    debug?: IDebugGui;
    onFrame?: FrameCallback;
}

export interface IDirector extends IDestroyable {
    readonly isRunning: boolean;
    readonly models: IModelManager;
    readonly controls: ICameraControls | null;

    start(): void;

    stop(): void;

    setOnFrame(onFrame: FrameCallback | undefined): void;

    resize(arg: IWH): void;
}

export interface IDirectorCtor {
    new(arg: IDirectorArg): IDirector;
}

/* =========================================================
 *  ModelManager
 * =======================================================*/

export type ModelVisitor = (model: IModel) => void

export interface IModelManager extends IDestroyable {
    readonly models: readonly IModel[];

    add(model: IModel): void;

    remove(model: IModel): void;

    removeByName(name: string): boolean;

    clear(): void;

    find(name: string): IModel | undefined;

    has(name: string): boolean;

    forEach(visitor: ModelVisitor): void;

    readonly size: number;
}

export interface IModelManagerArg {
    scene: IScene;
    models?: IModel[];
}

export interface IModelManagerCtor {
    new(arg: IModelManagerArg): IModelManager;
}

/* =========================================================
 *  Animation
 * =======================================================*/

export type EasingFn = (t: number) => number

export interface IAnimatable {
    update(dt: number): void;

    readonly isAnimating: boolean;

    cancel(): void;
}

export interface IAnimationManager extends IDestroyable {
    readonly size: number;
    readonly sizeRef: Ref<number>;

    add(item: IAnimatable): void;

    remove(item: IAnimatable): void;

    update(dt: number): void;

    cancelAll(): void;
}

/* =========================================================
 *  Rotator
 * =======================================================*/

export type Axis = 'x' | 'y' | 'z'

export interface IRotator extends IAnimatable {
    to(axis: Axis, radians: number, duration?: number): void;

    by(axis: Axis, radians: number, duration?: number): void;

    set(axis: Axis, radians: number): void;
}

export interface IRotatorArg {
    model: IModel;
    easing?: EasingFn;
}

export interface IRotatorCtor {
    new(arg: IRotatorArg): IRotator;
}

/* =========================================================
 *  Colorist
 * =======================================================*/

export type ColorLike = number | string | THREE.Color

export interface IColorist extends IAnimatable {
    to(color: ColorLike, duration?: number): void;

    set(color: ColorLike): void;
}

export interface IColoristArg {
    model: IModel;
    easing?: EasingFn;
    /**
     * Какой материал красить.
     * - 'all' (по умолчанию) — все материалы модели
     * - число — индекс материала в каждом меше
     */
    materialIndex?: number | 'all';
}

export interface IColoristCtor {
    new(arg: IColoristArg): IColorist;
}

/* =========================================================
 *  Mover
 * =======================================================*/

export interface IMover extends IAnimatable {
    to(x: number, y: number, z: number, duration?: number): void;

    by(dx: number, dy: number, dz: number, duration?: number): void;

    set(x: number, y: number, z: number): void;
}

export interface IMoverArg {
    model: IModel;
    easing?: EasingFn;
}
