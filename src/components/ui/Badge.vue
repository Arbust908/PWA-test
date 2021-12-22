<template>
    <span :class="classes" class="badge px-4 font-medium rounded-md py-1">
        {{ text }}
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'Badge',
        props: {
            text: {
                type: String,
                default: 'badgeText',
            },
            classes: {
                type: String,
                default: 'bg-gray-500 text-white',
            },
        },
    });
</script>

<style lang="scss" scoped></style>
