<template>
    <BaseBtn btn="main" :type="type" :size="size" :disabled="disabled">
        <slot></slot>
    </BaseBtn>
</template>

<script>
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    export default {
        props: {
            type: {
                type: String,
                default: 'button',
            },
            size: {
                type: String,
                default: 'md',
            },
            disabled: {
                type: String,
                default: '',
            },
        },
        components: {
            BaseBtn,
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
