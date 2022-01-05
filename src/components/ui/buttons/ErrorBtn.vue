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
            ...BaseBtn.props,
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
</style>
