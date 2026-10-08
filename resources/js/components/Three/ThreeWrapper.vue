<template>
    <div class="ThreeWrapper">
        <TresCanvas
            alpha
            :clear-alpha="0"
            window-size
        >
            <ThreeBox
                :position="boxPosition"
                :color="boxColor"
                :rotation="boxRotation"
            />
        </TresCanvas>
        <div class="controls">
            <button @click="onMoveClick([1, 0, 0])">Сдвинуть вправо</button>
            <button @click="onMoveClick([-1, 0, 0])">Сдвинуть влево</button>
            <button @click="onRotateClick(90)">Повернуть на 90°</button>
            <button @click="onColorClick('#ff6b6b')">Красный</button>
            <button @click="onColorClick('#4dabf7')">Синий</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import ThreeBox from "@/components/Three/ThreeBox.vue";
import { ref } from "vue";

const boxPosition = ref([0, 0, 0]);
const boxRotation = ref([0, 0, 0]);
const boxColor = ref("#424242");
const onMoveClick = (val: [number, number, number]) => {
    boxPosition.value = val;
};
const onColorClick = (val) => {
    boxColor.value = val;
};
const onRotateClick = (val) => {
    boxRotation.value = [
        0,
        (boxRotation.value[1] + val) % 360,
        0
    ];
};
</script>
<style scoped lang="scss">
.ThreeWrapper {

    @include div100();
    background: var(--ccc);

    .controls {
        position: fixed;
        display: flex;
        left: 0;
        bottom: 0;
        width: 100px;
        gap: 10px;
    }
}
</style>
