<template>
  <component :is="compo" :name="name" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import SolidIcons from '@/components/icon/SolidIcons.vue';
  import OutlineIcons from '@/components/icon/OutlineIcons.vue';
  export default defineComponent({
    props: {
      icon: {
        type: String,
        default: 'ShieldCheck',
      },
      type: {
        type: String,
        default: 'solid',
      },
    },
    setup(props) {
      const { icon, type } = props;
      const name = icon + 'Icon';
      const compo = type === 'solid' ? SolidIcons : OutlineIcons;
      return {
        compo,
        name,
      };
    },
  });
</script>
