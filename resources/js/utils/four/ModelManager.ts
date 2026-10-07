import type {
    IModel,
    IModelManager,
    IModelManagerArg,
    IScene,
    ModelVisitor,
} from '@/types/four';

export class ModelManager implements IModelManager {
    private readonly scene: IScene;
    private readonly registry = new Map<string, IModel>();

    constructor(arg: IModelManagerArg) {
        this.scene = arg.scene;

        if (arg.models) {
            for (const model of arg.models) {
                this.add(model);
            }
        }
    }

    public get models(): readonly IModel[] {
        return Array.from(this.registry.values());
    }

    public get size(): number {
        return this.registry.size;
    }

    public add(model: IModel): void {
        if (this.registry.has(model.name)) {
            console.warn(
                `[ModelManager] Model with name "${model.name}" already exists. Skipping.`
            );
            return;
        }

        this.registry.set(model.name, model);
        this.scene.addModel(model);
    }

    public remove(model: IModel): void {
        if (!this.registry.has(model.name)) return;

        this.scene.removeModel(model);
        this.registry.delete(model.name);
        model.destroy();
    }

    public removeByName(name: string): boolean {
        const model = this.registry.get(name);
        if (!model) return false;

        this.remove(model);
        return true;
    }

    public clear(): void {
        for (const model of this.registry.values()) {
            this.scene.removeModel(model);
            model.destroy();
        }
        this.registry.clear();
    }

    public find(name: string): IModel | undefined {
        return this.registry.get(name);
    }

    public has(name: string): boolean {
        return this.registry.has(name);
    }

    public forEach(visitor: ModelVisitor): void {
        for (const model of this.registry.values()) {
            visitor(model);
        }
    }

    public destroy(): void {
        this.clear();
    }
}
