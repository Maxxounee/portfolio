import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'

export const useCityStore = defineStore('city', () => {
    // state
    const cityViewObjects = ref([]);

    // actions
    function pushCityViewObjects(arr) {
        if (cityViewObjects.value.length) {
            console.log('City store. cityViewObjects уже заполнен')
            return;
        }

        cityViewObjects.value.push(...arr);
    }

    return { cityViewObjects, pushCityViewObjects }
})
