<template>
    <div class="ThreeWrapper">
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
        >
            <ThreePerspectiveCamera ref="camera"/>
            <ThreeLights/>
        </TresCanvas>
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
        >
            <ThreeControls/>
        </TresCanvas>
        <div class="controls">
            <button @click="onMoveClick([1, 0, 0])">Сдвинуть вправо</button>
            <button @click="onMoveClick([-1, 0, 0])">Сдвинуть влево</button>
            <button @click="onRotateClick(90)">Повернуть на 90°</button>
            <button @click="onColorClick('#ff6b6b')">Красный</button>
            <button @click="onColorClick('#4dabf7')">Синий</button>
            <button @click="toggleCameraPosition">Камера</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { ref } from 'vue';
import ThreeBox from '@/components/Three/ThreeBox.vue';
import ThreeMeshButton from "@/components/Three/ThreeMeshButton.vue";
import ThreePerspectiveCamera from "@/components/Three/ThreePerspectiveCamera.vue";
import ThreeLights from "@/components/Three/ThreeLights.vue";
import ThreeControls from "@/components/Three/Controls/ThreeControls.vue";

type Vec3 = [number, number, number];


const boxPosition = ref<Vec3>([0, 0, 0]);
const boxRotation = ref<Vec3>([0, 0, 0]);
const boxColor = ref('#424242');

const camera = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);


const onMoveClick = (val: Vec3): void => {
    boxPosition.value = val;
};

const onColorClick = (val: string): void => {
    boxColor.value = val;
};

const onRotateClick = (deg: number): void => {
    boxRotation.value = [
        boxRotation.value[0],
        (boxRotation.value[1] + deg) % 360,
        boxRotation.value[2],
    ];
};

const toggleCameraPosition = (): void => {
    camera.value?.toggleCamera();
};
</script>
<style scoped lang="scss">
.ThreeWrapper {
    @include div100();
    background: var(--ccc);

    .controls {
        position: fixed;
        display: flex;
        left: 0;
        bottom: 0;
        width: 100px;
        gap: 10px;
    }
}
</style>
