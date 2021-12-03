<template>
    <BaseBtn :btn="`warning ${btn}`" :type="type" :size="size" :disabled="disabled" :is-loading="isLoading">
        <slot>Error</slot>
    </BaseBtn>
</template>

<script>
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    export default {
        components: {
            BaseBtn,
        },
        props: {
            type: {
                type: String,
                default: 'button',
            },
            size: {
                type: String,
                default: 'md',
            },
            btn: {
                type: String,
                default: 'main',
            },
            disabled: {
                type: [String, Boolean],
                default: false,
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
