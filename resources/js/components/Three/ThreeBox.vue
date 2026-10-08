<template>
    <!-- Камера -->
    <TresPerspectiveCamera
        ref="cameraRef"
        :position="[3, 3, 3]"
    />
    <!-- Контроллеры камеры (из Cientos, не требует extend) -->
    <OrbitControls/>
    <!-- Куб, к которому мы привязали ref -->
    <TresMesh ref="boxRef">
        <TresBoxGeometry :args="[1.5, 1.5, 1.5]"/>
        <TresMeshStandardMaterial
            color="#42b883"
            :metalness="0.3"
            :roughness="0.4"
        />
    </TresMesh>
    <!-- Свет -->
    <TresAmbientLight :intensity="0.6"/>
    <TresDirectionalLight
        :position="[3, 3, 3]"
        :intensity="1.2"
    />
</template>
<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, shallowRef, watch, watchEffect } from 'vue';
import { useLoop, useTres } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import type { TresInstance } from '@tresjs/core';
import { useTresGui } from "@/utils/tres/useTresGui";
import * as THREE from "three";

const props = defineProps<{
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
}>();

const boxRef = shallowRef<TresInstance | null>(null);
const cameraRef = shallowRef<TresInstance | null>(null);
useTresGui({ cameraRef });

watch(() => props.position, ([x, y, z]) => {
    if (!boxRef.value) return;

    gsap.to(
        boxRef.value.position,
        { x, y, z }
    );
});

watch(() => props.rotation, ([x, y, z]) => {
    if (!boxRef.value) return;
    console.log(x, y, z);
    gsap.to(
        boxRef.value.rotation,
        {
            x: x * Math.PI / 180,
            y: y * Math.PI / 180,
            z: z * Math.PI / 180
        }
    );
});

watch(() => props.color, (value) => {
    if (!boxRef.value) return;

    const material = boxRef.value.material as THREE.MeshStandardMaterial;
    const startColor = material.color.clone();
    const endColor = new THREE.Color(value);
    const progress = { value: 0 };

    gsap.to(progress, {
        value: 1,
        duration: 1,
        onUpdate: () => {
            material.color.lerpColors(startColor, endColor, progress.value);
        }
    });
});


onMounted(() => {
});


const { onBeforeRender } = useLoop();
// @ts-ignore
// onBeforeRender(({ delta, elapsed }) => {
//     if (boxRef.value) {
//         boxRef.value.rotation.y += delta * 1.5;
//         boxRef.value.rotation.z = elapsed * 0.2;
//     }
// });
</script>
<style scoped lang="scss">
.controls {
    display: flex;
    gap: 8px;
    padding: 12px;
}
</style>
