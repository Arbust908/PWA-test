<template>
    <BaseBtn :btn="`secondary ${btn}`" :type="type" :size="size">
        <slot></slot>
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
                default: 'secondary',
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
