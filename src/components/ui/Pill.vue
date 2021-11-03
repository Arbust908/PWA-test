<template>
    <span :class="type" class="pill">
        <slot></slot>
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'Pill',
        props: {
            type: {
                type: String,
                default: 'empty',
            },
        },
        setup(props) {},
    });
</script>

<style lang="scss" scoped>
    .pill {
        // w-28
        @apply inline-flex justify-center rounded-full text-white px-3;
        &.empty {
            @apply bg-gray-500;
        }
        &.idle {
            @apply bg-blue-500;
        }
        &.finished {
            @apply bg-green-500;
        }
    }
</style>
