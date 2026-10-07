import * as THREE from 'three'
import type { IRenderer, IRendererArg, IWH } from '@/types/four'

export class Renderer implements IRenderer {
    public readonly instance: THREE.WebGLRenderer

    private readonly container: HTMLElement

    constructor(arg: IRendererArg) {
        this.container = arg.container

        this.instance = new THREE.WebGLRenderer({
            antialias: arg.antialias ?? true,
            alpha: arg.alpha ?? true,
        })

        this.instance.setClearColor(0x000000, 0)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.instance.setSize(arg.w, arg.h, false)

        this.instance.domElement.style.display = 'block'
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.container.appendChild(this.instance.domElement)
    }

    public resize(arg: IWH): void {
        if (arg.w === 0 || arg.h === 0) return
        this.instance.setSize(arg.w, arg.h, false)
    }

    public destroy(): void {
        this.instance.domElement.remove()
        this.instance.dispose()
        this.instance.forceContextLoss()
    }
}
