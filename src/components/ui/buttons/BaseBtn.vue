<template>
    <component :is="type">
        <div class="btn" :class="classes" :type="type" :size="size" :disabled="disabled || isLoading">
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
                type: [String, Boolean],
                default: false,
            },
            btn: {
                type: String,
                default: null,
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            classes() {
                const { btn, isLoading } = this.$props;

                return {
                    [btn]: true,
                    'loading-spinner': isLoading,
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    button {
        @apply py-1 pl-1;
    }

    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-spinner {
        position: relative;
        overflow: hidden;
    }

    .loading-spinner:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        background-color: inherit;
        width: 100%;
        height: 100%;
        display: block;
        z-index: 1;
        top: 0;
        left: 0;
    }

    .loading-spinner:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.45);
        border-top-color: inherit;
        animation: spinner 0.6s linear infinite;
        z-index: 2;
    }
</style>
