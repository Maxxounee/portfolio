import type { IAnimatable, IAnimationManager } from '@/types/four';
import { ref, type Ref } from 'vue';

export class AnimationManager implements IAnimationManager {
    private items = new Set<IAnimatable>();
    private readonly _size = ref(0);
    public get size(): number {
        return this.items.size;
    }

    public get sizeRef(): Ref<number> {
        return this._size;

    }

    public add(item: IAnimatable): void {
        this.items.add(item);
        this._size.value = this.items.size;
    }

    public remove(item: IAnimatable): void {
        if (this.items.delete(item)) {
            this._size.value = this.items.size;
        }
    }

    public update(dt: number): void {
        let changed = false;
        for (const item of this.items) {
            if (!item.isAnimating) {
                this.items.delete(item);
                changed = true;
                continue;
            }
            item.update(dt);
        }
        if (changed) this._size.value = this.items.size;
    }

    public cancelAll(): void {
        for (const item of this.items) {
            item.cancel();
        }
        this.items.clear();
        this._size.value = 0;
    }

    public destroy(): void {
        this.cancelAll();
    }
}
