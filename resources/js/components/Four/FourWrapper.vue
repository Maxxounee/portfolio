<template>
    <div class="FourWrapper">
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
            class="FourWrapper__scene"
            shadows
        >
            <FourPerspectiveCamera
                ref="cameraRef"
            />
            <FourCity
                @loaded="({ cityNodes }) => init(cityNodes)"
            />
            <FourBuildingTest/>
            <FourCharacter ref="character"/>
            <Suspense>
                <FourLights/>
            </Suspense>
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
import { ref, } from 'vue';
import ThreePerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourCharacter from "@/components/Four/FourCharacter.vue";
import FourLights from "@/components/Four/FourLights.vue";
import FourPerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourControls from "@/components/Four/Controls/FourControls.vue";
import { OrbitControls } from "@tresjs/cientos";
import FourCity from "@/components/Four/FourCity.vue";
import * as cityConfig from "@/config/four/city";
import { useCityStore } from "@/store/city";
import FourBuildingTest from "@/components/Four/FourBuildingTest.vue";

const cityStore = useCityStore();
const cameraRef = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);

function init(cityNodes) {
    if (!cityNodes || !Object.keys(cityNodes).length) {
        console.error('FourWrapper.init()');
        return;
    }

    const staticConfig = cityConfig.cameraMode.static;
    const forwardConfig = cityConfig.cameraMode.forward;


    const getStaticValues = (conf): cityConfig.CityViewStaticArg => {
        return { ...conf };
    };

    const getForwardValues = (conf): cityConfig.CityViewForwardArg => {
        const obj = cityNodes[conf.modelName];

        if (!obj) {
            console.error(`FourWrapper.init(). Модель "${conf.modelName} не найдена"`);
        }

        return { ...conf, obj };
    };

    const arr: cityConfig.CityViewStaticOrForward[] = [
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

    cityStore.pushCityViewObjects(arr);
    cameraRef.value.setView(arr[0]);
}


/* TODO кнопкес. Обращаться к камере вместо пропсов  */
const onRotateClick = (i): void => {
    toggleCameraPosition(i);
};


const toggleCameraPosition = (i: number): void => {
    cameraRef.value.setView(cityStore.cityViewObjects[i]);

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
