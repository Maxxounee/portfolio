<template>
    <div class="FourWrapper">
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
            class="FourWrapper__scene"
        >
            <FourPerspectiveCamera
                :carRef="carObject"
                :mode="cameraMode"
                ref="camera"
            />
            <FourLights/>
            <!--            <FourBox :rotation="boxRotation"/>-->
            <FourCity ref="cityRef"/>
            <FourCharacter ref="character"/>
            <!--            <OrbitControls/>-->
        </TresCanvas>
        <TresCanvas
            alpha
            :clear-alpha="0"
            class="FourWrapper__ui"
        >
            <FourControls
                @click="onRotateClick"
            />
        </TresCanvas>
    </div>
</template>
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { computed, ref } from 'vue';
import ThreePerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourCharacter from "@/components/Four/FourCharacter.vue";
import FourLights from "@/components/Four/FourLights.vue";
import FourPerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourControls from "@/components/Four/Controls/FourControls.vue";
import { OrbitControls } from "@tresjs/cientos";
import FourCity from "@/components/Four/FourCity.vue";
import * as THREE from 'three';

type Vec3 = [number, number, number];


const boxRotation = ref<Vec3>([0, 0, 0]);
const camera = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);
const character = ref();
const cityRef = ref<InstanceType<typeof FourCity> | null>(null);

const carObject = computed<THREE.Object3D | undefined>(() => {
    return cityRef.value?.carObject;
});


const onRotateClick = (i, [x, y, z]): void => {
    x = x ?? boxRotation.value[0];
    y = y ?? boxRotation.value[1];
    z = z ?? boxRotation.value[2];

    boxRotation.value = [
        (boxRotation.value[0] + x),
        (boxRotation.value[1] + y),
        (boxRotation.value[2] + z),
    ];

    character.value.playAnimation('Jump_Full_Short');
    toggleCameraPosition(i);
};
type arg = [angle: number, height: number];

type CameraMode = 'static-1' | 'static-2' | 'follow'

const modes: CameraMode[] = [
    'static-1',
    'static-2',
    'follow'
];

const cameraMode = ref<CameraMode>(modes[0]);

const toggleCameraPosition = (i: number): void => {
    // const pos: arg[] = [
    //     [0, 2],
    //     [-140, 5],
    //     [-70, 1],
    // ];


    cameraMode.value = modes[i];
};
</script>
<style scoped lang="scss">
.FourWrapper {
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

    &__scene {

    }

    &__ui {
        pointer-events: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 140px;
    }
}
</style>
