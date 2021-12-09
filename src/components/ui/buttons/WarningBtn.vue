<template>
    <BaseBtn :btn="`warning ${btn}`" :type="type" :size="size" :disabled="disabled" :is-loading="isLoading">
        <slot>Warning</slot>
    </BaseBtn>
</template>

<script setup lang="ts">
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    defineProps({
        ...BaseBtn.props,
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
