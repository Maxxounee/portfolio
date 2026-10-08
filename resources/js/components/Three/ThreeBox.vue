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
import { onMounted, shallowRef, watchEffect } from 'vue';
import { useLoop, useTres } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import type { TresInstance } from '@tresjs/core';
import GUI from 'lil-gui';

const boxRef = shallowRef<TresInstance | null>(null);
const cameraRef = shallowRef<TresInstance | null>(null);
const { onBeforeRender } = useLoop();

// Инициализация GUI
const gui = new GUI({ title: 'Debug' });

onMounted(() => {
    // Добавляем контролы для камеры, как только она появится
    watchEffect(() => {
        if (cameraRef.value) {
            const folder = gui.addFolder('Camera');
            folder.add(cameraRef.value.position, 'x', -10, 10, 0.1).name('Pos X').listen();
            folder.add(cameraRef.value.position, 'y', -10, 10, 0.1).name('Pos Y').listen();
            folder.add(cameraRef.value.position, 'z', -10, 10, 0.1).name('Pos Z').listen();
            folder.add(cameraRef.value, 'fov', 10, 120, 1).name('FOV').onChange(() => cameraRef.value?.updateProjectionMatrix());
        }
    });
});

// @ts-ignore
onBeforeRender(({ delta, elapsed }) => {
    if (boxRef.value) {
        // Вращение по Y и Z
        boxRef.value.rotation.y += delta * 1.5;
        boxRef.value.rotation.z = elapsed * 0.2;
    }
});
</script>
<style scoped lang="scss">
.ThreeCube {

}
</style>
