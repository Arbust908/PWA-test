<template>
    <p>
        {{ title }}
        <span v-if="isOptional" class="optional">(Opcional)</span>
    </p>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'FieldTitle',
        props: {
            title: {
                type: [String, null],
                default: null,
            },
            isOptional: {
                type: Boolean,
                default: false,
            },
        },
    });
</script>

<style lang="scss" scoped>
    .optional {
        @apply opacity-75 ml-1 italic;
    }
</style>
