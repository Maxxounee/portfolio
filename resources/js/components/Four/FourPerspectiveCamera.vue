<template>
    <TresPerspectiveCamera
        ref="cameraRef"
        :fov="75"
        :near="0.1"
        :far="1000"
    />
</template>
<script setup lang="ts">
import { useLoop } from '@tresjs/core';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { TresInstance } from '@tresjs/core';
import {
    cameraModesStatic,
    cameraModesFollow,
    type CameraModeMap,
    cameraModes,
    isFollowModeObject, isStaticModeObject
} from "@/config/four/camera";
import * as cityConfig from "@/config/four/city";

/* ---------------- INIT  ---------------- */
const props = defineProps<{
    mode: CameraModeMap;
    carRef: THREE.Object3D | undefined
}>();

/* --------------- Instance --------------- */
const cameraRef = shallowRef<TresInstance | null>(null);

const camera = computed<THREE.PerspectiveCamera | null>(() => {
    const value: unknown = cameraRef.value;
    return value instanceof THREE.PerspectiveCamera ? value : null;
});

/* --------------- Camera Config --------------- */
const welcomeLookAt = cityConfig.cameraMode.static.welcome.angle;

const MODEL_SCALER = 0.1;

const followDistanceBack = MODEL_SCALER * 3;
const followHeight = MODEL_SCALER * 10;
const lookAtHeight = MODEL_SCALER * 0.5;
const dirSmoothing = 0.1;

/* ---------------- Параметры GSAP ---------------- */

const transitionDuration = 1.2;
const transitionEase = 'power2.inOut';

/* ---------------- Состояние перехода ---------------- */

const isTransitioning = ref(false);

/* ---------------- Переиспользуемые векторы ---------------- */

const carWorldPos = new THREE.Vector3();
const prevPos = new THREE.Vector3();
const movementDir = new THREE.Vector3(0, 0, -1);
const newDir = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();

let hasPrev = false;

/* ---------------- Утилита: плавный перелёт камеры ---------------- */

const flyTo = (
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    onComplete?: () => void,
): void => {
    const cam = camera.value;

    if (!cam) return;

    const tmp = new THREE.PerspectiveCamera();
    tmp.position.copy(targetPosition);
    tmp.lookAt(targetLookAt);

    gsap.to(cam.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: transitionDuration,
        ease: transitionEase,
    });

    gsap.to(cam.quaternion, {
        x: tmp.quaternion.x,
        y: tmp.quaternion.y,
        z: tmp.quaternion.z,
        w: tmp.quaternion.w,
        duration: transitionDuration,
        ease: transitionEase,
        onComplete: () => {
            onComplete?.();
        },
    });
};

/* ---------------- Применение режима ---------------- */

const applyMode = (key): void => {
    const mode = cameraModes[key];

    if (isStaticModeObject(mode)) {
        isTransitioning.value = true;
        flyTo(
            mode.pos,
            welcomeLookAt,
            () => {
                isTransitioning.value = false;
            });
    } else if (isFollowModeObject(mode)) {
        hasPrev = false;
        isTransitioning.value = false;
    }
};

/* ---------------- Жизненный цикл ---------------- */

onMounted(() => {
    if (props.mode !== 'follow1') {
        const cam = camera.value;
        if (cam) {
            cam.position.copy(cameraModesStatic[props.mode].pos);
            cam.lookAt(welcomeLookAt);
            cam.updateProjectionMatrix();
        }
    }
});

watch(
    () => props.mode,
    (key) => {
        applyMode(key);
    },
);

/* ---------------- Цикл отрисовки ---------------- */

const { onBeforeRender } = useLoop();
const positionLerp = 0.08;
const rotationLerp = 0.1;
onBeforeRender(() => {
    if (isTransitioning.value) return;

    const cam = camera.value;
    if (!cam) return;

    if (props.mode === 'follow1') {
        const car = props.carRef;
        if (!car) return;

        car.getWorldPosition(carWorldPos);

        if (hasPrev) {
            newDir.subVectors(carWorldPos, prevPos);
            if (newDir.lengthSq() > 1e-6) {
                newDir.normalize();
                movementDir.lerp(newDir, dirSmoothing).normalize();
            }
        }
        prevPos.copy(carWorldPos);
        hasPrev = true;

        desiredPosition.copy(carWorldPos);
        desiredPosition.addScaledVector(movementDir, -followDistanceBack);
        desiredPosition.y += followHeight;

        desiredLookAt.copy(carWorldPos);
        desiredLookAt.addScaledVector(movementDir, 1);
        desiredLookAt.y += lookAtHeight;

        // позиция — плавно догоняем
        cam.position.lerp(desiredPosition, positionLerp);

        // поворот — плавно через slerp
        const tmp = new THREE.PerspectiveCamera();
        tmp.position.copy(cam.position);
        tmp.lookAt(desiredLookAt);
        cam.quaternion.slerp(tmp.quaternion, rotationLerp);
    }
});
</script>
