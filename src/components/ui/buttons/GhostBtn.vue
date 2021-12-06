<template>
    <BaseBtn btn="ghost">
        <slot>Fantasma</slot>
    </BaseBtn>
</template>

<script setup lang="ts">
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    defineProps({
        type: {
            type: String,
            default: 'button',
        },
        size: {
            type: String,
            default: 'md',
        },
        disabled: {
            type: [String, Boolean],
            default: false,
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
