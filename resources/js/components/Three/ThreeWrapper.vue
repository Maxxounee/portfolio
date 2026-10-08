<template>
    <div class="ThreeWrapper">
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
        >
            <ThreePerspectiveCamera ref="camera"/>
            <ThreeLights/>
            <ThreeBox :rotation="boxRotation"/>
        </TresCanvas>
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
        >
            <ThreeControls @click="onRotateClick"/>
        </TresCanvas>
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

const onRotateClick = ([x, y, z]): void => {
    x = x ?? boxRotation.value[0];
    y = y ?? boxRotation.value[1];
    z = z ?? boxRotation.value[2];

    boxRotation.value = [
        (boxRotation.value[0] + x),
        (boxRotation.value[1] + y),
        (boxRotation.value[2] + z),
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
