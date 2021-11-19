<template>
    <Layout>
        <input id="" class="cajitaMagica" type="text" name="" />
        <section class="flex flex-col gap-6">
            <p class="col-span-full">About page.</p>
            <p class="col-span-full">
                {{ storage.gipi.value }}
                {{ storage.gipi.get() }}
                {{ keys }}
            </p>
            <nav class="flex gap-4">
                <GhostBtn>Ghost</GhostBtn>
                <SecondaryBtn>Secondary</SecondaryBtn>
                <PrimaryBtn @click="toggleBD()">Primary</PrimaryBtn>
            </nav>
        </section>
        <Backdrop :open="showBD" title="Backdrop" @close="toggleBD()">
            <template #body> </template>
            <template #btn> </template>
        </Backdrop>
    </Layout>
</template>

<script lang="ts">
    import { ref } from 'vue';
    import { useNProgress } from '@vueuse/integrations/useNProgress';
    import { useTitle } from '@vueuse/core';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import { useLocalStorage } from '@/helpers/useLocalStorage';

    export default {
        components: {
            Layout,
            GhostBtn,
            SecondaryBtn,
            PrimaryBtn,
            Backdrop,
        },
        setup() {
            const { storage, keys } = useLocalStorage(['user', 'gipi']);
            const { gipi } = storage;
            const { progress, isLoading, start, done } = useNProgress();
            const title = useTitle(`  About <> Sandflow  `);
            const showBD = ref(false);
            const toggleBD = () => {
                console.log('show BD', showBD.value);
                showBD.value = !showBD.value;
                console.log('show BD', showBD.value);
            };

            setInterval(() => {
                // Shift title string
                title.value = title.value.substr(1) + title.value.substr(0, 1);
            }, 300);

            const initProgrss = () => {
                if (progress.value === null) {
                    progress.value = 0.0;
                }
                const loading = setInterval(() => {
                    progress.value += 0.01;

                    if (progress.value >= 1.0) {
                        clearInterval(loading);
                    }
                }, 100);
            };

            storage.gipi.set('Mintiti');

            return {
                storage,
                keys,
                progress,
                isLoading,
                initProgrss,
                start,
                done,
                showBD,
                toggleBD,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .cajitaMagica {
        @apply w-[58px]
        h-[58px]
        m-[58px]
        rounded
        shadow-md
        border-none
        bg-gradient-to-tr
        from-purple-500
        to-pink-500;
    }
    progress {
        @apply bg-green-500;
    }
    progress::-webkit-progress-bar {
        @apply bg-gray-500;
    }
    progress::-webkit-progress-value {
        @apply bg-green-500;
    }
    progress::-moz-progress-bar {
        @apply bg-green-500;
    }
</style>
