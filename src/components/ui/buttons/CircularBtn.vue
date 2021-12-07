<template>
    <BaseBtn :btn="`circular ${btn}`" :type="type" :size="size" :disabled="disabled" :is-loading="isLoading">
        <slot>o</slot>
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
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
