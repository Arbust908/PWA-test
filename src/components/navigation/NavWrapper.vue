<template>
  <NavLine v-if="isLine" v-bind="item" />
  <NavLink v-else-if="isNotSection" v-bind="item" />
  <NavSection v-else v-bind="item" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import NavLine from '@/components/navigation/NavLine.vue';
  import NavLink from '@/components/navigation/NavLink.vue';
  import NavSection from '@/components/navigation/NavSection.vue';

  export default defineComponent({
    components: {
      NavLine,
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
    },
    setup(props) {
      const { subNav, name } = props;
      const isNotSection = subNav === null;
      const isLine = name === 'LINE';
      return {
        item: props,
        isNotSection,
        isLine,
      };
    },
  });
</script>
