<template>
    <primitive v-if="state?.scene" :object="state.scene"/>
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { computed, markRaw, onMounted, shallowRef, watch, watchEffect } from 'vue';
import * as THREE from 'three';

const { state, nodes } = useGLTF('/3d/models/city.glb');

const mixer = shallowRef<THREE.AnimationMixer | null>(null);

watchEffect(() => {
    if (!nodes.value) return;
    console.log('nodes:', Object.keys(nodes.value));
});

const carObject = computed(() => nodes.value?.Empty as THREE.Object3D | undefined);
console.log(carObject);
watch(
    state,
    (gltf) => {
        if (!gltf?.scene) return;

        // Создаём микшер для всей сцены
        mixer.value = new THREE.AnimationMixer(gltf.scene);

        console.log('Animations:', gltf.animations.map(a => a.name));

        // Запускаем все анимации (обычно их одна — движение машины)
        gltf.animations.forEach((clip) => {
            const action = mixer.value!.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
        });
    },
    { immediate: true },
);

watch(state, (gltf) => {
    if (!gltf?.scene) return;
    gltf.scene.traverse((obj) => {
        console.log(obj.name, obj.type, obj.position.toArray().map(n => +n.toFixed(2)));
    });
});

// Обновляем микшер каждый кадр
const { onBeforeRender } = useLoop();
const testNames = ['Empty']; // подставь свои

onBeforeRender(({ delta }) => {
    mixer.value?.update(delta);

    const gltf = state.value;
    // if (!gltf?.scene) return;
    // for (const name of testNames) {
    //     const obj = gltf.scene.getObjectByName(name);
    //     if (!obj) continue;
    //     const pos = new THREE.Vector3();
    //     obj.getWorldPosition(pos);
    //     console.log(name, pos.x.toFixed(2), pos.z.toFixed(2));
    // }
});

onMounted(() => {
    const box = new THREE.Box3().setFromObject(carObject);
    const size = box.getSize(new THREE.Vector3());
    console.log('Car size:', size.x, size.y, size.z);
});


defineExpose({ carObject: markRaw(carObject) });
</script>
