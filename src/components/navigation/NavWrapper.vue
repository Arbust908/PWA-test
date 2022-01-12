<template>
    <NavLine v-if="isLine" v-bind="item" />
    <NavLink v-else-if="isNotSection" v-bind="item" :mode="mode" />
    <NavSection v-else v-bind="item" :mode="mode" />
</template>
<script setup lang="ts">
    import NavLine from '@/components/navigation/NavLine.vue';
    import NavLink from '@/components/navigation/NavLink.vue';
    import NavSection from '@/components/navigation/NavSection.vue';

    const props = defineProps({
        to: {
            type: String,
            default: null,
        },
        icon: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        subNav: {
            type: Array,
            default: null,
        },
        mode: {
            type: String,
            default: '',
        },
    });
    const isNotSection = props.subNav === null;
    const isLine = props.name === 'LINE';
    const item = props;
</script>
