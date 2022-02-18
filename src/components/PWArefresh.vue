<template>
    <teleport to="#notification">
        <div v-if="offlineReady || needRefresh" class="flex flex-wrap absolute bottom-2 right-2" role="alert">
            <div class="message mt-1">
                <span v-if="offlineReady"> App ready to work offline </span>
                <span v-else>New content available, click on reload button to update.</span>
            </div>
            <div class="buttons flex align-middle mt-2 md:mt-0">
                <button v-if="needRefresh" class="button" @click="updateServiceWorker()">Reload</button>
                <button class="button" @click="close">Close</button>
            </div>
        </div>
        <div v-else class="absolute bottom-2 right-2">PWA</div>
    </teleport>
</template>
<script setup lang="ts">
    import { useRegisterSW } from 'virtual:pwa-register/vue';

    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    console.log('offlineReady', offlineReady.value);
    console.log('needRefresh', needRefresh.value);
    const close = async () => {
        offlineReady.value = false;
        needRefresh.value = false;
    };
    console.log('updateServiceWorker', updateServiceWorker);
    updateServiceWorker();
</script>
