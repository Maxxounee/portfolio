import type {
    ICamera, ILight,
    IRenderer,
} from '@/types/four';
import { ControlsOption, DebugOption, ICameraControls, IDebugGui } from "@/types/four/controls";
import { CameraControls, DebugGui } from "@/utils/four";

export function createControls(
    arg: {
        options: ControlsOption | undefined,
        camera: ICamera,
        renderer: IRenderer,
    }
): ICameraControls | null {
    if (!isFeatureEnabled(arg.options)) return null;

    const userOpts = typeof arg.options === 'object' ? arg.options : {};

    return new CameraControls({
        camera: arg.camera,
        domElement: arg.renderer.instance.domElement,
        ...userOpts,
    });
}

export function createDebug(
    arg: {
        options: DebugOption | undefined,
        camera: ICamera,
        controls: ICameraControls | null,
        lights: ILight[],
    }
): IDebugGui | null {
    if (!isFeatureEnabled(arg.options)) return null;

    const userOpts = typeof arg.options === 'object' ? arg.options : {};

    return new DebugGui({
        camera: arg.camera,
        controls: arg.controls,
        lights: arg.lights,
        ...userOpts,
    });
}

/* ---------- internal ---------- */

function isFeatureEnabled<T>(
    option: T | boolean | undefined,
): option is T | true {
    if (option === false || option === undefined) return false;
    if (option === true) return true;

    return typeof option === 'object' && option !== null;

}

