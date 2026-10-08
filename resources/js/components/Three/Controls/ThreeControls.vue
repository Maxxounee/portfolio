<template>
    <TresOrthographicCamera
        ref="cameraRef"
        :args="[
            -viewWidth / 2,
            viewWidth / 2,
            viewHeight / 2,
            -viewHeight / 2,
            0.1,
            1000,
        ]"
        :position="[0, 12, 0]"
        :look-at="[0,1, 0]"
        :up="[0, 0, -1]"
    />
    <TresAmbientLight :intensity="1"/>
    <ThreeMeshButton
        v-for="(pos, i) in buttonPositions"
        :key="i"
        :position="pos"
    />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ThreeMeshButton from '@/components/Three/ThreeMeshButton.vue';
import { useTresGui } from '@/utils/tres/useTresGui';

/* ---------------- Камера ---------------- */

const viewHeight = ref(6);
const aspect = ref(window.innerWidth / window.innerHeight);
const viewWidth = computed(() => viewHeight.value * aspect.value);

const cameraRef = ref();
useTresGui({ cameraRef });

/* ---------------- Позиционирование кнопок ---------------- */

const buttonCount = 3;
const buttonWidth = 2;
const gap = 0.3;
const bottomMarginPx = 90;

const unitsPerPixel = computed(() => viewHeight.value / window.innerHeight);
const bottomMargin = computed(() => bottomMarginPx * unitsPerPixel.value);

/**
 * ВАЖНО: камера смотрит сверху вниз.
 * На экране:
 *   X  → влево/вправо
 *   Z  → вверх/вниз (минус — вверх, плюс — вниз)
 *
 * Поэтому «низ экрана» = положительный Z.
 *   нижний край видимой области по Z = +viewHeight / 2
 */
const bottomZ = computed(() =>
    viewHeight.value / 2 - bottomMargin.value,
);

const totalWidth = buttonCount * buttonWidth + (buttonCount - 1) * gap;

const buttonPositions = computed<[number, number, number][]>(() =>
    Array.from({ length: buttonCount }, (_, i) => {
        const x = -totalWidth / 2 + buttonWidth / 2 + i * (buttonWidth + gap);
        return [x, 0, bottomZ.value];
    }),
);

/* ---------------- Ресайз ---------------- */

const updateAspect = (): void => {
    aspect.value = window.innerWidth / window.innerHeight;
};

onMounted(() => {
    window.addEventListener('resize', updateAspect);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateAspect);
});

/* ---------------- Клики ---------------- */

const onClick = (i: number): void => {
    console.log('button', i);
};
</script>
