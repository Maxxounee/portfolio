<template>
    <TresPerspectiveCamera
        ref="cameraComponentRef"
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

/* ---------------- Props ---------------- */

const props = defineProps<{
    mode: 'static-1' | 'static-2' | 'follow'
    carRef: THREE.Object3D | undefined
}>();

/* ---------------- Ссылка на камеру ---------------- */

const cameraComponentRef = shallowRef<TresInstance | null>(null);

const camera = computed<THREE.PerspectiveCamera | null>(() => {
    const ref = cameraComponentRef.value;
    return ref instanceof THREE.PerspectiveCamera ? ref : null;
});

/* ---------------- Статические позиции ---------------- */

const staticPositions: Record<'static-1' | 'static-2', THREE.Vector3> = {
    'static-1': new THREE.Vector3(10, 10, 10),
    'static-2': new THREE.Vector3(-10, 8, -5),
};

const staticLookAt = new THREE.Vector3(0, 0, 0);

/* ---------------- Параметры follow-режима ---------------- */

const carLength = 0.1;
const followDistanceBack = carLength * 3;
const followHeight = carLength * 2;
const lookAheadDistance = carLength * 4;
const lookAtHeight = carLength * 0.5;
const dirSmoothing = 0.3;

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

    // вычисляем целевой кватернион через временную камеру
    const tmp = new THREE.PerspectiveCamera();
    tmp.position.copy(targetPosition);
    tmp.lookAt(targetLookAt);

    // анимируем позицию
    gsap.to(cam.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: transitionDuration,
        ease: transitionEase,
    });

    // анимируем поворот через кватернион
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

const applyMode = (mode: 'static-1' | 'static-2' | 'follow'): void => {
    if (mode === 'follow') {
        // для follow просто ждём следующий кадр — там камера сама начнёт следовать
        hasPrev = false;
        isTransitioning.value = false;
        return;
    }

    isTransitioning.value = true;
    flyTo(staticPositions[mode], staticLookAt, () => {
        isTransitioning.value = false;
    });
};

/* ---------------- Жизненный цикл ---------------- */

onMounted(() => {
    if (props.mode !== 'follow') {
        // при монтировании — сразу ставим камеру, без анимации
        const cam = camera.value;
        if (cam) {
            cam.position.copy(staticPositions[props.mode]);
            cam.lookAt(staticLookAt);
            cam.updateProjectionMatrix();
        }
    }
});

watch(
    () => props.mode,
    (mode) => {
        applyMode(mode);
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

    if (props.mode === 'follow') {
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
        desiredLookAt.addScaledVector(movementDir, lookAheadDistance);
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
