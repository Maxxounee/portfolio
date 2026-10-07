import * as THREE from 'three'
import type { ICamera, ICameraArg, IWH } from '@/types/four'

export class Camera implements ICamera {
    public readonly instance: THREE.PerspectiveCamera

    constructor(arg: ICameraArg) {
        const aspect = arg.h === 0 ? 1 : arg.w / arg.h

        this.instance = new THREE.PerspectiveCamera(
            arg.fov ?? 75,
            aspect,
            arg.near ?? 0.1,
            arg.far ?? 1000
        )

        this.instance.position.set(0, 0, 3)
        this.instance.updateProjectionMatrix()
    }

    public resize(arg: IWH): void {
        if (arg.w === 0 || arg.h === 0) return

        this.instance.aspect = arg.w / arg.h
        this.instance.updateProjectionMatrix()
    }

    public destroy(): void {
        this.instance.clearViewOffset()
    }
}
