<template>
    <BaseBtn :btn="`secondary ${btn}`" :type="type" :size="size" :disabled="disabled" :is-loading="isLoading">
        <slot>Second</slot>
    </BaseBtn>
</template>

<script>
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    export default {
        components: {
            BaseBtn,
        },
        props: {
            ...BaseBtn.props,
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
