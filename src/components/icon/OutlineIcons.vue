<template>
  <component v-if="isLoaded" :is="heroIcons[name]" />
</template>
<script>
  import * as heroIcons from '@heroicons/vue/outline';
  export default {
    data() {
      return {
        isLoaded: false,
        heroIcons: heroIcons,
      };
    },
    props: {
      name: String,
    },
    mounted() {
      this.isLoaded = true;
    },
  };
</script>
