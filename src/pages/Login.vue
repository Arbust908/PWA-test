<template>
    <main class="relative">
        <aside v-if="false" class="space-x-4 absolute top-0 right-0 m-8">
            <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('login')">
                login
            </button>
            <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('recover')">
                recover
            </button>
            <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('success')">
                success
            </button>
            <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('error')">
                error
            </button>
        </aside>
        <LoginCard v-if="selected_card === 'login'" @recover="selectedCard('recover')" />
        <PassRecover v-else-if="selected_card === 'recover'" @logback="selectedCard('login')" />
        <Success v-else-if="selected_card === 'success'" />
        <Error v-else-if="selected_card === 'error'" />
    </main>
</template>

<script lang="ts">
    import LoginCard from '@/components/auth/LoginCard.vue';
    import PassRecover from '@/components/auth/PassRecover.vue';
    import Success from '@/components/auth/Success.vue';
    import Error from '@/components/auth/Error.vue';
    export default defineComponent({
        components: {
            LoginCard,
            PassRecover,
            Success,
            Error,
        },
        setup() {
            useTitle('Login <> Sandflow');
            const selected_card = ref('login');
            const selectedCard = (card: string) => {
                selected_card.value = card;
                // Implementar cambio de titulo
            };

            return {
                selected_card,
                selectedCard,
            };
        },
    });
</script>

<style lang="scss" scoped>
    main {
        @apply min-h-screen bg-white flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8;
    }
</style>
