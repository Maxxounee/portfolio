<template>
    <primitive
        v-if="state?.scene"
        :object="state.scene"
        @click="press"
    />
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { computed, onMounted, watchEffect } from "vue";

const { state, nodes } = useGLTF('/3d/models/button.glb');
import { gsap } from 'gsap';

const props = defineProps<{
    position: [number, number, number]
}>();

watchEffect(() => {
    const root = state.value?.scene;
    if (!root || !props.position) return;
    root.position.set(...props.position);
    root.rotation.set(-45 * Math.PI / 180, 0, 0);
});

const press = (): void => {
    const top = nodes.value?.top;
    if (!top) return;

    const startY = top.position.y;
    const mat = (top as any).material;

    gsap.timeline()
        .to(top.position, { y: startY - 0.05, duration: 0.08 })
        .to(top.position, { y: startY, duration: 1, ease: 'elastic.out(1, 0.4)', });


    gsap.timeline()
        .to(mat, { emissiveIntensity: 1.5, duration: 0.08 }, 0)
        .to(mat, { emissiveIntensity: 0, duration: 0.3 }, 0.1);
};

onMounted(() => {

});
</script>
<style scoped lang="scss">
.ThreeMeshButton {

}
</style>
