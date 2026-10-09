<template>
    <TresGroup
        :position="[2.5, 0, -1.4]"
        :rotation="[0, 1, 0]"
    >
        <primitive v-if="state?.scene" :object="state.scene"/>
    </TresGroup>
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { shallowRef, watch } from 'vue';
import * as THREE from 'three';

const { state } = useGLTF('/3d/models/man.glb');

const mixer = shallowRef<THREE.AnimationMixer | null>(null);

// создаём микшер, когда модель загрузилась
watch(
    state,
    (gltf) => {
        if (!gltf?.scene) return;
        mixer.value = new THREE.AnimationMixer(gltf.scene);

        console.log('Available animations:', gltf.animations.map(a => a.name));

        // запускаем первую попавшуюся — для проверки
        if (gltf.animations.length > 0) {
            playAnimation(gltf.animations[0].name);
        }
    },
    { immediate: true },
);

// проигрывание клипа
const playAnimation = (name: string): void => {
    const m = mixer.value;
    const gltf = state.value;
    if (!m || !gltf) return;

    const clip = THREE.AnimationClip.findByName(gltf.animations, name);
    if (!clip) return;

    m.stopAllAction();
    const action = m.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);   // ← играть один раз
    action.clampWhenFinished = true;
    action.play();

};

// обновление микшера каждый кадр
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
    mixer.value?.update(delta);
});

// экспозим наружу для управления из родителя
defineExpose({ playAnimation });
</script>
