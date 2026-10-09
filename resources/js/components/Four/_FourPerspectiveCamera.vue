<template>
    <TresPerspectiveCamera
        ref="cameraRef"
        :position="cameraPosition"
        :look-at="[0,0,0]"
    />
</template>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from "vue";
import { gsap } from "gsap";
import { TresInstance } from "@tresjs/core";
import { useTresGui } from "@/utils/tres/useTresGui";
import * as THREE from 'three';

const cameraRef = shallowRef<TresInstance | null>(null);

const orbitRadius = 5;
const currentHeight = ref(2);
const targetHeight = ref(currentHeight.value);
const currentAngle = ref(0);
const targetAngle = ref(currentAngle.value);

useTresGui({ cameraRef });

const props = defineProps<{
    carRef: THREE.Object3D | undefined;
}>();

const cameraPosition = computed<[number, number, number]>(() => [
    Math.cos(currentAngle.value) * orbitRadius,
    currentHeight.value,
    Math.sin(currentAngle.value) * orbitRadius,
]);


const toggleCamera = (angle, height) => {
    targetAngle.value = angle * Math.PI / 180;
    targetHeight.value = height;


    gsap.to(currentAngle, {
        value: targetAngle.value,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
            nextTick(() => {
                // cameraRef.value?.lookAt(0, 0, 0);
            });
        }
    });

    gsap.to(currentHeight, {
        value: targetHeight.value,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
            nextTick(() => {
                cameraRef.value?.lookAt(0, 0, 0);
            });
        }
    });
};

defineExpose({ toggleCamera });
</script>
<style scoped lang="scss">
.ThreePerspectiveCamera {

}
</style>
