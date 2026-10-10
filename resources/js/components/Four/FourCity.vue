<template>
    <primitive
        v-if="cityState?.scene"
        :object="cityState.scene"
    />
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { shallowRef, watch } from 'vue';
import * as THREE from 'three';

/* --------------------------------------- */
const emit = defineEmits<{
    loaded: [
        model: {
            cityScene: THREE.Group;
            cityNodes: Record<string, THREE.Object3D>
        }
    ],
}>();

const { onBeforeRender } = useLoop();
const { state: cityState, nodes: cityNodes } = useGLTF('/3d/models/city.glb');
const mixer = shallowRef<THREE.AnimationMixer | null>(null);

function startSceneAnimations(gltf) {
    mixer.value = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
        const action = mixer.value!.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    });
}

watch(cityState, (gltf) => {
    if (!gltf?.scene) {
        return;
    }

    startSceneAnimations(gltf);

    emit('loaded', {
        cityScene: gltf.scene,
        cityNodes: cityNodes.value,
    });
});

onBeforeRender((ctx) => {
    mixer.value?.update(ctx.delta);
});
</script>
