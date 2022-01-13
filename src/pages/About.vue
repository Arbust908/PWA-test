<template>
    <Layout>
        <input id="" class="cajitaMagica" type="text" name="" />
        <section class="flex flex-col gap-6">
            <p class="col-span-full">About page.</p>
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

<script setup lang="ts">
    import Backdrop from '@/components/modal/Backdrop.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import { getOrder } from '@/helpers/useQueueItem';
    import { QueueItem } from '@/interfaces/sandflow';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    const queue: Array<QueueItem> = ref([] as Array<QueueItem>);
    const title = useTitle(`  About <> Sandflow  `);
    const showBD = ref(false);
    const toggleBD = () => {
        showBD.value = !showBD.value;
    };

    setInterval(() => {
        // Shift title string
        title.value = title.value.substring(1) + title.value.substring(0, 1);
    }, 300);
    onMounted(async () => {
        const response = await axios.get(`${api}/queueItem`).catch((err) => {
            console.log(err);

            return false;
        });
        queue.value = response.data.data;
    });
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
