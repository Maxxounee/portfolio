<template>
    <div class="wrapper">
        <div ref="container" class="three-canvas"></div>
        <div class="toolbar">
            <button @click="rotate('y', -90)">← 90°</button>
            <button @click="rotate('y',  90)">→ 90°</button>
            <button @click="rotate('x', -40)">↑ 90°</button>
            <button @click="rotate('x',  90)">↓ 90°</button>
            <button @click="reset">Reset</button>
        </div>
        <p class="hint">Активных анимаций: {{ animationCount }}</p>
    </div>
</template>
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { Rotator } from '@/utils/four';
import { createBoxModel } from '@/utils/four';
import { useFour } from '@/composables/useFour';
import type { Axis } from '@/types/four';
import { easeInOutBack } from "@/utils/four/animation/easing";

const container = useTemplateRef<HTMLDivElement>('container');


const cube = createBoxModel(1.5, 0x42b883);
const rotator = new Rotator({ model: cube, easing: easeInOutBack });


const { animation } = useFour(container, {
    models: [cube],
    onFrame: () => {

    },
});

animation.value?.add(rotator);

/* ---------- действия ---------- */

const DEG2RAD = Math.PI / 180;


const reset = (): void => {
    rotator.cancel();
    cube.setRotation(0, 0, 0);
};

/* ---------- UI ---------- */

const animationCount = computed(() => animation.value?.sizeRef.value ?? 0);

const rotate = (axis: Axis, deg: number): void => {
    animation.value?.add(rotator);
    /* TODO убрать радианы ебаные */
    rotator.to(axis, deg * DEG2RAD, 1);
    console.log(animation.value?.size);
};
</script>
<style scoped>
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
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a3a 100%);
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
