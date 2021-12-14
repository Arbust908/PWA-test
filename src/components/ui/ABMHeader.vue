<script setup lang="ts">
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    defineProps({
        title: {
            type: String,
            default: 'ABM',
        },
        link: {
            type: String,
            default: '#',
        },
        icon: {
            type: String,
            default: 'PlusCircle',
        },
        btnText: {
            type: String,
            default: 'Crear',
        },
    });
</script>

<template>
    <header>
        <h2>{{ title }}</h2>
        <router-link :to="link">
            <PrimaryBtn size="sm">
                <span> {{ btnText }} </span>
                <Icon :icon="icon" class="ml-1 w-4 h-4" />
            </PrimaryBtn>
        </router-link>
    </header>
    <hr class="mb-4 border-gray-300" />
</template>

<style scoped>
    header {
        @apply flex justify-start space-x-4 items-center mb-4;
    }
    h2 {
        @apply text-2xl font-semibold text-gray-900;
    }
</style>
