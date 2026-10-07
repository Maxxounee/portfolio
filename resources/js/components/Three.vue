<template>
    <div class="wrapper">
        <div ref="container" class="three-canvas"></div>
        <div class="toolbar">
            <button @click="rotate('y', -40)">← 90°</button>
            <button @click="rotate('y',  40)">→ 90°</button>
            <button @click="rotate('x', -40)">↑ 90°</button>
            <button @click="rotate('x',  40)">↓ 90°</button>
            <button @click="reset">Reset</button>
        </div>
        <div class="toolbar">
            <button @click="paint(0xff6b6b)">Красный</button>
            <button @click="paint(0x42b883)">Зелёный</button>
            <button @click="paint(0x4dabf7)">Синий</button>
            <button @click="paint('#8b5cf6')">Фиолетовый</button>
        </div>
        <div class="toolbar">
            <button @click="move(-1, 0)">←</button>
            <button @click="move(1, 0)">→</button>
            <button @click="move(0, 1)">↑</button>
            <button @click="move(0, -1)">↓</button>
        </div>
        <p class="hint">Активных анимаций: {{ animationCount }}</p>
    </div>
</template>
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { Colorist, Rotator, createBoxModel, Mover } from '@/utils/four';
import { useFour } from '@/composables/four/UseFour';
import type { Axis } from '@/types/four';
import * as ease from "@/utils/four/animation/easing";

const container = useTemplateRef<HTMLDivElement>('container');
const cube = createBoxModel(1.5, 0x42b883);
const rotator = new Rotator({ model: cube, easing: ease.easeInOutCubic });
const colorist = new Colorist({ model: cube });
const mover = new Mover({ model: cube });

const { animation } = useFour(container, {
    models: [cube],
    // controls: true,
    debug: true,
    camera: {
        fov: 53,
    }
});


const reset = (): void => {
    rotator.cancel();
    cube.setRotation(0, 0, 0);
};


const animationCount = computed(() => animation.value?.sizeRef.value ?? 0);

const rotate = (axis: Axis, deg: number): void => {
    animation.value?.add(rotator);
    rotator.by(axis, deg, 1);
};
const paint = (color: number | string): void => {
    animation.value?.add(colorist);
    colorist.to(color, 0.5);
};

const move = (v: number, h: number) => {
    animation.value?.add(mover);
    const mod = 0.2;
    mover.by(v * mod, h * mod, 0);
};
</script>
<style scoped lang="scss">
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.three-canvas {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    //background: linear-gradient(135deg, #1a1a1a 0%, #2a2a3a 100%);
}

.toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.hint {
    font-family: monospace;
    opacity: 0.7;
}
</style>
