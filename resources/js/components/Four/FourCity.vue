<template>
    <primitive v-if="cityState?.scene" :object="cityState.scene"/>
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { computed, markRaw, shallowRef, watch } from 'vue';
import * as THREE from 'three';

/* --------------------------------------- */

const { onBeforeRender } = useLoop();

const { state: cityState, nodes: cityNodes } = useGLTF('/3d/models/city.glb');
const carObject = computed(() => cityNodes.value?.Empty as THREE.Object3D | undefined);

const mixer = shallowRef<THREE.AnimationMixer | null>(null);

function startSceneAnimations(gltf) {
    if (!gltf?.scene) return;

    mixer.value = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
        const action = mixer.value!.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    });
}

watch(cityState, startSceneAnimations, { immediate: true });

onBeforeRender((ctx) => {
    mixer.value?.update(ctx.delta);
});

/* ------------------------------ */


defineExpose({ carObject: markRaw(carObject) });
</script>
