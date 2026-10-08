<template>
    <div class="ThreeWrapper">
        <TresCanvas
            clear-color="#82DBC5"
            window-size
        >
            <ThreeBox/>
        </TresCanvas>
    </div>
</template>
<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import ThreeBox from "@/components/Three/ThreeBox.vue";
</script>
<style scoped lang="scss">
.ThreeWrapper {

}
</style>
