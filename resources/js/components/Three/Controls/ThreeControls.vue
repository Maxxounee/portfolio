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
        v-for="(val, i) in buttonPositions"
        :key="i"
        :position="val.pos"
        @click="val.cb"
    />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ThreeMeshButton from '@/components/Three/ThreeMeshButton.vue';
import { useTresGui } from '@/utils/tres/useTresGui';

/* ---------------- Камера ---------------- */

const viewHeight = ref(20);
const aspect = ref(window.innerWidth / window.innerHeight);
const viewWidth = computed(() => viewHeight.value * aspect.value);

const cameraRef = ref();
useTresGui({ cameraRef });

/* ---------------- Позиционирование кнопок ---------------- */

const buttonCount = 3;
const buttonWidth = 2;
const gap = 0.3;
const bottomMarginPx = 0;

const unitsPerPixel = computed(() => viewHeight.value / window.innerHeight);
const bottomMargin = computed(() => bottomMarginPx * unitsPerPixel.value);

const bottomZ = computed(() =>
    viewHeight.value / 2 - 1.4,
);

const totalWidth = buttonCount * buttonWidth + (buttonCount - 1) * gap;

// const buttonPositions = computed(() =>
//
//     Array.from({ length: buttonCount }, (_, i) => {
//         const x = -totalWidth / 2 + buttonWidth / 2 + i * (buttonWidth + gap);
//         return {
//             pos: [x, 0, bottomZ.value],
//             cb: () => emit('click', -50),
//         };
//     }),
// );
const buttonPositions = computed(() => {
        return [
            { pos: undefined, rot: [0, -30, 0] },
            { pos: undefined, rot: [0, 0, 30] },
            { pos: undefined, rot: [0, 30, 0] },
        ].map((val, i) => {
            const x = -totalWidth / 2 + buttonWidth / 2 + i * (buttonWidth + gap);

            return {
                pos: [x, 0, bottomZ.value],
                cb: () => emit('click', val.rot),
            };
        });
    }
);


const updateAspect = (): void => {
    aspect.value = window.innerWidth / window.innerHeight;
};

onMounted(() => {
    window.addEventListener('resize', updateAspect);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateAspect);
});

const emit = defineEmits(['click']);
const onClick = (i: number): void => {
    console.log('button', i);
    emit('click');
};
</script>
