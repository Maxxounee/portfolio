import type {
    FrameCallback,
    IDirector,
    IDirectorArg,
    ILight,
    IModelManager,
    IAnimationManager,
    IWH,
} from '@/types/four';

export class Director implements IDirector {
    private readonly renderer;
    private readonly scene;
    private readonly camera;
    private readonly manager: IModelManager;
    private readonly lights: ILight[];
    private readonly animation: IAnimationManager;

    private animationId = 0;
    private running = false;
    private startedAt = 0;
    private onFrame: FrameCallback | undefined;

    constructor(arg: IDirectorArg) {
        this.renderer = arg.renderer;
        this.scene = arg.scene;
        this.camera = arg.camera;
        this.manager = arg.modelManager;
        this.lights = arg.lights;
        this.onFrame = arg.onFrame;
        this.animation = arg.animation;
    }

    public get isRunning(): boolean {
        return this.running;
    }


    public start(): void {
        if (this.running) return;

        this.running = true;
        this.startedAt = performance.now();

        let last = this.startedAt;

        const loop = (now: number): void => {
            if (!this.running) return;

            const dt = ( now - last ) / 1000;
            const elapsed = ( now - this.startedAt ) / 1000;
            last = now;

            this.animation.update(dt);

            this.onFrame?.(dt, elapsed);

            this.renderer.instance.render(
                this.scene.instance,
                this.camera.instance
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

    public destroy(): void {
        this.stop();
        this.onFrame = undefined;

        this.animation.destroy();
        this.manager.destroy();

        for (const light of this.lights) {
            light.destroy();
        }

        this.renderer.destroy();
        this.scene.destroy();
        this.camera.destroy();
    }
}
