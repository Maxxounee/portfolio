<template>
    <Merged v-if="meshes1" :meshes="meshes1">
        <Instance
            v-for="(pos, i) in positions1"
            :key="`b1-${i}`"
            :batch="'building_A'"
            :position="pos"
        />
    </Merged>
    <Merged v-if="meshes2" :meshes="meshes2">
        <Instance
            v-for="(pos, i) in positions2"
            :key="`b2-${i}`"
            :batch="'building_B'"
            :position="pos"
        />
    </Merged>
    <Merged v-if="meshes3" :meshes="meshes3">
        <Instance
            v-for="(pos, i) in positions3"
            :key="`b3-${i}`"
            :batch="'building_C'"
            :position="pos"
        />
    </Merged>
</template>
<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import * as THREE from 'three';
import { Merged, Instance, useGLTF } from '@tresjs/cientos';
import { useTres } from "@tresjs/core";

const { nodes: nodes1 } = useGLTF('/3d/models/building/building_A.glb');
const { nodes: nodes2 } = useGLTF('/3d/models/building/building_B.glb');
const { nodes: nodes3 } = useGLTF('/3d/models/building/building_C.glb');

/* ---------------- Безопасный computed ---------------- */

function pickMesh(nodes: Record<string, THREE.Object3D> | undefined, name: string,
): Record<string, THREE.Mesh> | null {
    const mesh = nodes?.[name];
    /*TODO: парсить по Buildng_N */
    console.log(nodes);

    if (!mesh || !('isMesh' in mesh) || !(mesh as THREE.Mesh).isMesh) {
        return null;
    }

    return { [name]: mesh as THREE.Mesh };
}

const meshes1 = computed(() => pickMesh(nodes1.value, 'building_A'));
const meshes2 = computed(() => pickMesh(nodes2.value, 'building_B'));
const meshes3 = computed(() => pickMesh(nodes3.value, 'building_C'));

/* ---------------- Позиции ---------------- */

type Vec3 = [number, number, number]

interface GridOptions {
    gridSize: number;
    spacing: number;
    jitter: number;
}

function generateGrid({ gridSize, spacing, jitter }: GridOptions): Vec3[] {
    const result: Vec3[] = [];
    const offset = ((gridSize - 1) * spacing) / 2;

    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const jx = (Math.random() - 0.5) * jitter;
            const jz = (Math.random() - 0.5) * jitter;

            result.push([
                x * spacing - offset + jx,
                0,
                z * spacing - offset + jz,
            ]);
        }
    }
    return result;
}

const allPositions = generateGrid({ gridSize: 15, spacing: 3.5, jitter: 1.5 });

const positions1 = computed<Vec3[]>(() => allPositions.filter((_, i) => i % 3 === 0));
const positions2 = computed<Vec3[]>(() => allPositions.filter((_, i) => i % 3 === 1));
const positions3 = computed<Vec3[]>(() => allPositions.filter((_, i) => i % 3 === 2));


const { scene } = useTres();

const applyShadows = async () => {
    await nextTick();
    await nextTick();

    scene.value?.traverse((obj) => {
        if (obj instanceof THREE.InstancedMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });
};

watch([meshes1, meshes2, meshes3], ([m1, m2, m3]) => {
    if (m1 && m2 && m3) {
        applyShadows();
    }
});
</script>
