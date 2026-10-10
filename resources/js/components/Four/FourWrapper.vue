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
                ref="cameraRef"
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
import { computed, ref, watch, watchEffect } from 'vue';
import ThreePerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourCharacter from "@/components/Four/FourCharacter.vue";
import FourLights from "@/components/Four/FourLights.vue";
import FourPerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourControls from "@/components/Four/Controls/FourControls.vue";
import { OrbitControls } from "@tresjs/cientos";
import FourCity from "@/components/Four/FourCity.vue";
import * as THREE from 'three';
import { CameraModeMap, cameraModes, cameraModesKeys } from "@/config/four/camera";
import * as cityConfig from "@/config/four/city";


const cameraRef = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);
const cityRef = ref<InstanceType<typeof FourCity> | null>(null);

const carObject = computed<THREE.Object3D | undefined>(() => {
    return cityRef.value?.carObject;
});

const objects = [
    carObject,
];

class ObjStore {
    protected static _instance: [];

    constructor(objects) {
        if (ObjStore._instance.length) {
            return ObjStore._instance;
        }

        ObjStore._instance.push(...objects);
    }

    get instance() {
        return ObjStore._instance;
    }
}

function init(objArr) {
    console.log(objArr);
    for (const obj of objArr) {
        if (!obj?.value || !(obj.value instanceof THREE.Object3D)) {
            return;
        }
    }

    const staticConfig = cityConfig.cameraMode.static;
    const forwardConfig = cityConfig.cameraMode.forward;

    const getForwardValues = (conf) => {
        const obj = objArr.find((value) => value.name === conf.modelName);

        if (!obj) {
            console.log(`FourWrapper.init(). Модель "${conf.modelName} не найдена"`);
        }

        return {
            ...conf,
            obj,
        };
    };

    const getStaticValues = (conf) => {
        return {
            ...conf,
        };
    };

    const arr = [
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.welcome),
        }),
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.one),
        }),
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.two),
        }),
        new cityConfig.CityViewForward({
            ...getForwardValues(forwardConfig.one),
        }),
    ];
}

watch(objects, init, { immediate: true });

const cameraMode = ref<CameraModeMap>(cameraModesKeys[0]);

const onRotateClick = (i, [x, y, z]): void => {
    toggleCameraPosition(i);
};


const toggleCameraPosition = (i: number): void => {
    cameraMode.value = cameraModesKeys[i];
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
