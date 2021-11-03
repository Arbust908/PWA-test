<template>
    <component :is="heroIcons[name]" v-if="isLoaded" />
</template>
<script>
    import * as heroIcons from '@heroicons/vue/solid';
    export default {
        props: {
            name: String,
        },
        data() {
            return {
                isLoaded: false,
                heroIcons: heroIcons,
            };
        },
        mounted() {
            this.isLoaded = true;
        },
    };
</script>
