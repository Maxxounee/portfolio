import {
    onBeforeUnmount,
    onMounted,
    shallowRef,
    triggerRef,
    type Ref,
} from 'vue';
import * as FOUR from '@/utils/four';
import type {
    FrameCallback, IAnimationManager,
    ICamera,
    IDirector,
    ILight,
    IModel,
    IModelManager,
    IRenderer,
    IScene,
} from '@/types/four';
import { ControlsOption, DebugOption, ICameraControls, IDebugGui } from "@/types/four/controls";

export interface UseFourOptions {
    models?: IModel[];
    lights?: ILight[];
    onFrame?: FrameCallback;
    camera?: { fov?: number; near?: number; far?: number };
    controls?: ControlsOption;
    debug?: DebugOption;
}

export interface UseFourReturn {
    director: Ref<IDirector | null>;
    scene: Ref<IScene | null>;
    camera: Ref<ICamera | null>;
    renderer: Ref<IRenderer | null>;
    manager: Ref<IModelManager | null>;
    animation: Ref<IAnimationManager | null>;
    controls: Ref<ICameraControls | null>;
    debug: Ref<IDebugGui | null>;
    models: Ref<readonly IModel[]>;
    lights: Ref<readonly ILight[]>;

    syncModels(): void;
}

export function useFour(
    containerRef: Ref<HTMLElement | null>,
    options: UseFourOptions = {},
): UseFourReturn {
    const director = shallowRef<IDirector | null>(null);
    const scene = shallowRef<IScene | null>(null);
    const camera = shallowRef<ICamera | null>(null);
    const renderer = shallowRef<IRenderer | null>(null);
    const manager = shallowRef<IModelManager | null>(null);
    const animation = shallowRef<IAnimationManager | null>(null);
    const controls = shallowRef<ICameraControls | null>(null);
    const debug = shallowRef<IDebugGui | null>(null);
    const models = shallowRef<readonly IModel[]>([]);
    const lights = shallowRef<readonly ILight[]>([]);

    let resizeObserver: ResizeObserver | null = null;

    const syncModels = (): void => {
        if (!manager.value) return;
        models.value = manager.value.models;
        triggerRef(models);
    };

    onMounted(() => {
        const container = containerRef.value;
        if (!container) return;

        const { clientWidth: width, clientHeight: height } = container;

        const fourLights = options.lights ?? FOUR.createDefaultLights();

        const fourScene = new FOUR.Scene({ models: [], lights: fourLights });

        const fourCamera = new FOUR.Camera({
            w: width,
            h: height,
            fov: options.camera?.fov,
            near: options.camera?.near,
            far: options.camera?.far,
        });

        const fourRenderer = new FOUR.Renderer({
            w: width,
            h: height,
            container,
        });

        const fourManager = new FOUR.ModelManager({
            scene: fourScene,
            models: options.models ?? [FOUR.createBoxModel()],
        });

        const fourAnimation = new FOUR.AnimationManager();

        const fourControls = FOUR.createControls(
            {
                options: options.controls,
                camera: fourCamera,
                renderer: fourRenderer,
            }
        );

        const fourDebug = FOUR.createDebug(
            {
                options: options.debug,
                camera: fourCamera,
                controls: fourControls,
                lights: fourLights,
            }
        );

        const fourDirector = new FOUR.Director({
            scene: fourScene,
            camera: fourCamera,
            renderer: fourRenderer,
            modelManager: fourManager,
            animation: fourAnimation,
            lights: fourLights,
            controls: fourControls ?? undefined,
            debug: fourDebug ?? undefined,
            onFrame: options.onFrame,
        });

        scene.value = fourScene;
        camera.value = fourCamera;
        renderer.value = fourRenderer;
        manager.value = fourManager;
        animation.value = fourAnimation;
        controls.value = fourControls;
        debug.value = fourDebug;
        director.value = fourDirector;
        lights.value = fourLights;

        syncModels();

        resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const { width: w, height: h } = entry.contentRect;
            fourDirector.resize({ w, h });
        });
        resizeObserver.observe(container);

        fourDirector.start();
    });

    onBeforeUnmount(() => {
        resizeObserver?.disconnect();
        resizeObserver = null;

        director.value?.destroy(); // внутри вызовет controls.destroy() и debug.destroy()

        director.value = null;
        scene.value = null;
        camera.value = null;
        renderer.value = null;
        manager.value = null;
        animation.value = null;
        controls.value = null;
        debug.value = null;
        models.value = [];
        lights.value = [];
    });

    return {
        director,
        scene,
        camera,
        renderer,
        manager,
        animation,
        controls,
        debug,
        models,
        lights,
        syncModels,
    };
}
