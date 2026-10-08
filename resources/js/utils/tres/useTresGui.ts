import { onMounted, shallowRef, watchEffect } from "vue";
import GUI from "lil-gui";
import { TresInstance } from "@tresjs/core";

const gui = new GUI({ title: 'Debug' });
let cameraRef = shallowRef<TresInstance | null>(null);

function registerCamera(ref) {
    cameraRef = ref;
}

onMounted(() => {
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


export {
    registerCamera
};
