import type {
    FrameCallback,
    IDirector,
    IDirectorArg,
    ILight,
    IModelManager,
    IAnimationManager,
    IWH,
} from '@/types/four';
import { ICameraControls, IDebugGui } from "@/types/four/controls";

export class Director implements IDirector {
    private readonly renderer;
    private readonly scene;
    private readonly camera;
    private readonly manager: IModelManager;
    private readonly animation: IAnimationManager;
    private readonly lights: ILight[];

    private readonly _controls: ICameraControls | null;
    private readonly _debug: IDebugGui | null;

    private animationId = 0;
    private running = false;
    private startedAt = 0;
    private onFrame: FrameCallback | undefined;

    constructor(arg: IDirectorArg) {
        this.renderer = arg.renderer;
        this.scene = arg.scene;
        this.camera = arg.camera;
        this.manager = arg.modelManager;
        this.animation = arg.animation;
        this.lights = arg.lights;

        this._controls = arg.controls ?? null;
        this._debug = arg.debug ?? null;

        this.onFrame = arg.onFrame;
    }

    public get isRunning(): boolean {
        return this.running;
    }

    public get models(): IModelManager {
        return this.manager;
    }

    public get controls(): ICameraControls | null {
        return this._controls;
    }

    public get debug(): IDebugGui | null {
        return this._debug;
    }

    /* =========================================================
     *  Loop
     * =======================================================*/

    public start(): void {
        if (this.running) return;

        this.running = true;
        this.startedAt = performance.now();

        let last = this.startedAt;

        const loop = (now: number): void => {
            if (!this.running) return;

            const dt = (now - last) / 1000;
            const elapsed = (now - this.startedAt) / 1000;
            last = now;

            // 1. камера (damping / autoRotate)
            this._controls?.update();

            // 2. анимации моделей и материалов
            this.animation.update(dt);

            // 3. отладочная панель (только синхронизация значений)
            this._debug?.update(dt);

            // 4. пользовательский колбэк
            this.onFrame?.(dt, elapsed);

            // 5. рендер
            this.renderer.instance.render(
                this.scene.instance,
                this.camera.instance,
            );

            this.animationId = requestAnimationFrame(loop);
        };

        this.animationId = requestAnimationFrame(loop);
    }

    public stop(): void {
        if (!this.running) return;
        this.running = false;
        cancelAnimationFrame(this.animationId);
        this.animationId = 0;
    }

    public setOnFrame(onFrame: FrameCallback | undefined): void {
        this.onFrame = onFrame;
    }

    public resize(arg: IWH): void {
        this.camera.resize(arg);
        this.renderer.resize(arg);
    }

    /* =========================================================
     *  Destroy
     * =======================================================*/

    public destroy(): void {
        this.stop();
        this.onFrame = undefined;

        this._debug?.destroy();
        this._controls?.destroy();
        this.animation.destroy();
        this.manager.destroy();

        for (const light of this.lights) {
            light.destroy();
        }

        // 6. обвязка Three.js
        this.renderer.destroy();
        this.scene.destroy();
        this.camera.destroy();
    }
}
