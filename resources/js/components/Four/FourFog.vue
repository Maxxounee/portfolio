<template>
    <Precipitation
        :count="2000"
        :speed="5.3"
        :randomness="0"
        :size="0.06"
        :area="[30, 30, 30]"
        color="#aaccff"
        :opacity="0.6"
    />
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { useLoop, useTres } from "@tresjs/core";
import * as cityConfig from "@/config/four/city";
import { Precipitation } from "@tresjs/cientos";

const { scene, camera } = useTres();
const { onBeforeRender } = useLoop();

const baseFogFar = 1;
const fog = new THREE.Fog(cityConfig.colors.background, 0, baseFogFar);
scene.value.fog = fog;

onBeforeRender((ctx) => {
    if (!camera.value?.position) return;

    const heightFactor = camera.value.position.y;
    fog.far = baseFogFar + heightFactor * 5;
});
</script>
<style lang="scss" scoped>
</style>
