<template>
    <component :is="type">
        <div :class="btn" class="btn" :type="type" :size="size" :disabled="disabled">
            <slot>Boton</slot>
        </div>
    </component>
</template>

<script>
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
            btn: {
                type: String,
                default: null,
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    button {
        @apply p-1;
    }
</style>
