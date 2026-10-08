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

const cameraRef = shallowRef<TresInstance | null>(null);

const orbitRadius = 5;
const orbitHeight = 2;
const currentAngle = ref(0);
const targetAngle = ref(0);

const cameraPosition = computed<[number, number, number]>(() => [
    Math.cos(currentAngle.value) * orbitRadius,
    orbitHeight,
    Math.sin(currentAngle.value) * orbitRadius,
]);


const toggleCamera = () => {
    targetAngle.value += 10 * Math.PI / 180;

    gsap.to(currentAngle, {
        value: targetAngle.value,
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
