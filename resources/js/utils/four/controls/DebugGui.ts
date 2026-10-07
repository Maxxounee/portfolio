import * as THREE from 'three';
import GUI from 'lil-gui';
import type {
    ICamera,
    ILight,
} from '@/types/four';
import { ICameraControls, IDebugGui, IDebugGuiArg } from "@/types/four/controls";

const DEG = 180 / Math.PI;

export class DebugGui implements IDebugGui {
    private readonly gui: GUI;

    private readonly camera: ICamera;
    private readonly controls: ICameraControls | null;
    private readonly lights: ILight[];
    private readonly showFps: boolean;

    /** Реактивный (для lil-gui) снимок значений камеры. */
    private readonly state: {
        posX: number
        posY: number
        posZ: number
        rotX: number
        rotY: number
        rotZ: number
        fov: number
        near: number
        far: number
        targetX: number
        targetY: number
        targetZ: number
        autoRotate: boolean
        autoRotateSpeed: number
        fps: number
    };

    /** Прокси цветов света: lil-gui не умеет listen() на addColor. */
    private readonly lightColorProxies = new Map<THREE.Light, { color: string }>();

    /** Для усреднения FPS. */
    private fpsAccumulator = 0;
    private fpsFrames = 0;

    constructor(arg: IDebugGuiArg) {
        this.camera = arg.camera;
        this.controls = arg.controls ?? null;
        this.lights = arg.lights ?? [];
        this.showFps = arg.showFps ?? true;

        const cam = this.camera.instance;

        this.state = {
            posX: cam.position.x,
            posY: cam.position.y,
            posZ: cam.position.z,

            rotX: cam.rotation.x * DEG,
            rotY: cam.rotation.y * DEG,
            rotZ: cam.rotation.z * DEG,

            fov: cam.fov,
            near: cam.near,
            far: cam.far,

            targetX: this.controls?.instance.target.x ?? 0,
            targetY: this.controls?.instance.target.y ?? 0,
            targetZ: this.controls?.instance.target.z ?? 0,

            autoRotate: this.controls?.instance.autoRotate ?? false,
            autoRotateSpeed: this.controls?.instance.autoRotateSpeed ?? 2,

            fps: 0,
        };

        this.gui = new GUI({
            title: arg.title ?? 'Camera',
            width: 320,
        });

        if (arg.open === false) {
            this.gui.close();
        }

        this.buildPositionFolder();
        this.buildRotationFolder();
        this.buildProjectionFolder();

        if (this.controls) {
            this.buildControlsFolder();
        }

        if (this.lights.length > 0) {
            this.buildLightsFolder();
        }

        if (this.showFps) {
            this.buildFpsFolder();
        }
    }

    /* =========================================================
     *  Camera folders
     * =======================================================*/

    private buildPositionFolder(): void {
        const folder = this.gui.addFolder('Position');
        const cam = this.camera.instance;

        folder
            .add(this.state, 'posX', -50, 50, 0.01)
            .name('X')
            .listen()
            .onChange((v: number) => {
                cam.position.x = v;
            });

        folder
            .add(this.state, 'posY', -50, 50, 0.01)
            .name('Y')
            .listen()
            .onChange((v: number) => {
                cam.position.y = v;
            });

        folder
            .add(this.state, 'posZ', -50, 50, 0.01)
            .name('Z')
            .listen()
            .onChange((v: number) => {
                cam.position.z = v;
            });
    }

    private buildRotationFolder(): void {
        const folder = this.gui.addFolder('Rotation (°)');
        const cam = this.camera.instance;

        const applyRot = (): void => {
            cam.rotation.set(
                this.state.rotX / DEG,
                this.state.rotY / DEG,
                this.state.rotZ / DEG,
            );
        };

        folder.add(this.state, 'rotX', -180, 180, 1).name('X').listen().onChange(applyRot);
        folder.add(this.state, 'rotY', -180, 180, 1).name('Y').listen().onChange(applyRot);
        folder.add(this.state, 'rotZ', -180, 180, 1).name('Z').listen().onChange(applyRot);
    }

    private buildProjectionFolder(): void {
        const folder = this.gui.addFolder('Projection');
        const cam = this.camera.instance;

        folder
            .add(this.state, 'fov', 10, 120, 1)
            .listen()
            .onChange((v: number) => {
                cam.fov = v;
                cam.updateProjectionMatrix();
            });

        folder
            .add(this.state, 'near', 0.01, 10, 0.01)
            .listen()
            .onChange((v: number) => {
                cam.near = v;
                cam.updateProjectionMatrix();
            });

        folder
            .add(this.state, 'far', 10, 5000, 1)
            .listen()
            .onChange((v: number) => {
                cam.far = v;
                cam.updateProjectionMatrix();
            });
    }

    /* =========================================================
     *  OrbitControls folder
     * =======================================================*/

    private buildControlsFolder(): void {
        const folder = this.gui.addFolder('OrbitControls');
        const ctrl = this.controls!.instance;

        folder
            .add(this.state, 'targetX', -50, 50, 0.01)
            .name('Target X')
            .listen()
            .onChange((v: number) => {
                ctrl.target.x = v;
            });

        folder
            .add(this.state, 'targetY', -50, 50, 0.01)
            .name('Target Y')
            .listen()
            .onChange((v: number) => {
                ctrl.target.y = v;
            });

        folder
            .add(this.state, 'targetZ', -50, 50, 0.01)
            .name('Target Z')
            .listen()
            .onChange((v: number) => {
                ctrl.target.z = v;
            });

        folder
            .add(this.state, 'autoRotate')
            .name('Auto rotate')
            .onChange((v: boolean) => {
                ctrl.autoRotate = v;
            });

        folder
            .add(this.state, 'autoRotateSpeed', 0.5, 10, 0.1)
            .name('Speed')
            .onChange((v: number) => {
                ctrl.autoRotateSpeed = v;
            });
    }

    /* =========================================================
     *  Lights folder
     * =======================================================*/

    private buildLightsFolder(): void {
        const folder = this.gui.addFolder('Lights');

        this.lights.forEach((light, index) => {
            const inst = light.instance;
            const name = light.name || `${light.kind}-${index}`;
            const lightFolder = folder.addFolder(name);

            // --- intensity ---
            lightFolder
                .add(inst, 'intensity', 0, 10, 0.01)
                .name('Intensity')
                .listen();

            const colorProxy = { color: '#' + inst.color.getHexString() };
            this.lightColorProxies.set(inst, colorProxy);

            lightFolder
                .addColor(colorProxy, 'color')
                .name('Color')
                .onChange((hex: string) => {
                    inst.color.set(hex);
                });

            if (light.kind !== 'ambient' && light.kind !== 'hemisphere') {
                const posFolder = lightFolder.addFolder('Position');

                posFolder
                    .add(inst.position, 'x', -20, 20, 0.1)
                    .name('X')
                    .listen();

                posFolder
                    .add(inst.position, 'y', -20, 20, 0.1)
                    .name('Y')
                    .listen();

                posFolder
                    .add(inst.position, 'z', -20, 20, 0.1)
                    .name('Z')
                    .listen();
            }

            if (inst instanceof THREE.SpotLight) {
                lightFolder
                    .add(inst, 'angle', 0.1, Math.PI / 2, 0.01)
                    .name('Angle')
                    .listen();

                lightFolder
                    .add(inst, 'penumbra', 0, 1, 0.01)
                    .name('Penumbra')
                    .listen();
            }

            // --- point/spot: distance ---
            if (inst instanceof THREE.PointLight || inst instanceof THREE.SpotLight) {
                lightFolder
                    .add(inst, 'distance', 0, 100, 0.1)
                    .name('Distance')
                    .listen();
            }

            // --- visible ---
            lightFolder
                .add(inst, 'visible')
                .name('Visible')
                .listen();

            lightFolder.close();
        });

        folder.close();
    }

    /* =========================================================
     *  FPS folder
     * =======================================================*/

    private buildFpsFolder(): void {
        const folder = this.gui.addFolder('Stats');
        folder
            .add(this.state, 'fps')
            .name('FPS')
            .disable()
            .listen();
    }

    /* =========================================================
     *  Public API
     * =======================================================*/

    public setVisible(visible: boolean): void {
        if (visible) this.gui.show();
        else this.gui.hide();
    }

    public toggle(): void {
        // lil-gui: gui._closed — внутреннее поле; пользуемся open/close
        if ((this.gui as unknown as { _closed: boolean })._closed) {
            this.gui.open();
        } else {
            this.gui.close();
        }
    }

    public update(dt: number): void {
        const cam = this.camera.instance;

        // --- camera ---
        this.state.posX = cam.position.x;
        this.state.posY = cam.position.y;
        this.state.posZ = cam.position.z;

        this.state.rotX = cam.rotation.x * DEG;
        this.state.rotY = cam.rotation.y * DEG;
        this.state.rotZ = cam.rotation.z * DEG;

        this.state.fov = cam.fov;
        this.state.near = cam.near;
        this.state.far = cam.far;

        // --- controls ---
        if (this.controls) {
            const ctrl = this.controls.instance;
            this.state.targetX = ctrl.target.x;
            this.state.targetY = ctrl.target.y;
            this.state.targetZ = ctrl.target.z;
            this.state.autoRotate = ctrl.autoRotate;
            this.state.autoRotateSpeed = ctrl.autoRotateSpeed;
        }

        // --- lights (только цвет, т.к. addColor не умеет listen) ---
        for (const light of this.lights) {
            const inst = light.instance;
            const proxy = this.lightColorProxies.get(inst);
            if (proxy) {
                proxy.color = '#' + inst.color.getHexString();
            }
        }

        // --- fps ---
        if (this.showFps) {
            this.fpsAccumulator += dt;
            this.fpsFrames += 1;
            if (this.fpsAccumulator >= 0.5) {
                this.state.fps = Math.round(this.fpsFrames / this.fpsAccumulator);
                this.fpsAccumulator = 0;
                this.fpsFrames = 0;
            }
        }
    }

    public destroy(): void {
        this.lightColorProxies.clear();
        this.gui.destroy();
    }
}
