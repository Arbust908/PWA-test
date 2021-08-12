<template>
  <NavLink v-if="isNotSection" v-bind="item" />
  <NavSection v-else v-bind="item" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import NavLink from '@/components/navigation/NavLink.vue';
  import NavSection from '@/components/navigation/NavSection.vue';

  export default defineComponent({
    components: {
      NavLink,
      NavSection,
    },
    props: {
      to: {
        type: String,
        default: null,
      },
      icon: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      subNav: {
        type: Array,
        default: null,
      },
    },
    setup(props) {
      const { subNav } = props;
      const isNotSection = subNav === null;
      return {
        item: props,
        isNotSection,
      };
    },
  });
</script>
