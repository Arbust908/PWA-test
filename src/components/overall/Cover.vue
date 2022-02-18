<template>
    <teleport to="#overall">
        <Presence>
            <Motion
                v-if="isLoading"
                class="bg-green-600/20 backdrop-blur-md z-50 fixed inset-0 flex flex-col items-center justify-center"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
            >
                <TheAllIcon icon="Refresh" class="h-8 w-8 animate-spin-reverse" />
                <p class="text-xl font-bold">loading</p>
            </Motion>
        </Presence>
    </teleport>
</template>

<script setup lang="ts">
    import TheAllIcon from '@/components/icon/TheAllIcon.vue';
    import { Motion, Presence } from 'motion/vue';
    import { useGlobalStore } from '@/store/global.pinia';
    import { storeToRefs } from 'pinia';

    const globalStore = useGlobalStore();
    const { isLoading } = storeToRefs(globalStore);
</script>

<style scoped>
    .animate-spin-reverse {
        animation: spin-reverse 1s linear infinite;
    }

    @keyframes spin-reverse {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(-360deg);
        }
    }
</style>
