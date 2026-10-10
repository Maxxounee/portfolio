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
import { computed, ref, shallowRef, watch } from 'vue';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { TresInstance } from '@tresjs/core';
import * as cityConfig from "@/config/four/city";
import { useCityStore } from "@/store/city";


/* ----------------------------- */
const cameraRef = shallowRef<TresInstance | null>(null);
const camera = computed<THREE.PerspectiveCamera | null>(() => {
    const value: unknown = cameraRef.value;
    return value instanceof THREE.PerspectiveCamera ? value : null;
});

const cityStore = useCityStore();
const { onBeforeRender } = useLoop();

let isTransitioning = false;
const currentView = ref<cityConfig.CityViewStaticOrForward>();


watch(
    () => [cityStore.sceneIsReady, currentView.value],
    ([isReady, view]) => {
        if (!isReady) {
            return;
        }

        if (!view) {
            console.error('FourPerspectiveCamera.watch. Нет currentView');
            return;
        }

        handleView(currentView.value);
    },
);

/* ---------------- Летаем ---------------- */

const carWorldPos = new THREE.Vector3();
const prevPos = new THREE.Vector3();
const movementDir = new THREE.Vector3(0, 0, -1);
const newDir = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();

let hasPrev = false;

onBeforeRender(() => {
    if (isTransitioning) return;

    const cam = camera.value;
    const positionLerp = 0.05;
    const rotationLerp = 0.05;

    if (!cam) return;

    if (currentView.value instanceof cityConfig.CityViewForward) {
        const conf = currentView.value;
        const obj = conf.obj;

        if (!obj) {
            return;
        }

        obj.getWorldPosition(carWorldPos);

        if (hasPrev) {
            newDir.subVectors(carWorldPos, prevPos);
            if (newDir.lengthSq() > 1e-6) {
                newDir.normalize();
                movementDir.lerp(newDir, conf.dirSmoothing).normalize();
            }
        }

        prevPos.copy(carWorldPos);
        hasPrev = true;

        desiredPosition.copy(carWorldPos);
        desiredPosition.addScaledVector(movementDir, -conf.followDistance);
        desiredPosition.y += conf.followHeight;

        desiredLookAt.copy(carWorldPos);
        desiredLookAt.addScaledVector(movementDir, 1);
        desiredLookAt.y += conf.followHeight;

        cam.position.lerp(desiredPosition, positionLerp);

        const tmp = new THREE.PerspectiveCamera();
        tmp.position.copy(cam.position);
        tmp.lookAt(desiredLookAt);
        cam.quaternion.slerp(tmp.quaternion, rotationLerp);
    }
});

function flyTo(
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    onComplete?: () => void
): void {
    const cam = camera.value;
    const transitionDuration = 1.2;
    const transitionEase = 'power2.inOut';

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
}

function handleView(conf: cityConfig.CityViewStaticOrForward | undefined): void {
    if (conf instanceof cityConfig.CityViewStatic) {
        isTransitioning = true;
        flyTo(
            conf.pos,
            conf.lookAt,
            () => {
                isTransitioning = false;
            });
    } else if (cityConfig.CityViewForward) {
        hasPrev = false;
        isTransitioning = false;
    }
}

function setView(conf: cityConfig.CityViewStaticOrForward): void {
    currentView.value = conf;
}

defineExpose({
    setView
});
</script>
