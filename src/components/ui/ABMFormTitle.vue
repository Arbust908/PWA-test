<script setup lang="ts">
    defineProps({
        title: {
            type: String,
            default: 'Titulo',
        },
    });
</script>

<template>
    <header>
        <h1>{{ title }}</h1>
    </header>
</template>

<style scoped>
    header {
        @apply flex flex-col md:flex-row md:justify-between items-center md:mb-4;
    }
    h1 {
        @apply font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0;
    }
</style>
