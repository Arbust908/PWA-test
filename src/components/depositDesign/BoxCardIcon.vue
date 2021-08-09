<template>
  <EmptyIcon v-if="category === '' || category === 'empty'" />
  <AisleIcon v-else-if="category === 'aisle'" />
  <BoxIcon v-else />
</template>

<script lang="ts">
  import { defineComponent, defineAsyncComponent, toRefs } from 'vue';

  const EmptyIcon = defineAsyncComponent(
    () => import('@/components/depositDesign/EmptyIcon.vue')
  );
  const BoxIcon = defineAsyncComponent(
    () => import('@/components/depositDesign/BoxIcon.vue')
  );
  const AisleIcon = defineAsyncComponent(
    () => import('@/components/depositDesign/AisleIcon.vue')
  );

  export default defineComponent({
    name: 'BoxCardIcon',
    props: {
      category: {
        type: String,
        required: true,
      },
    },
    components: {
      BoxIcon,
      EmptyIcon,
      AisleIcon,
    },
    setup(props) {
      return {
        ...toRefs(props),
      };
    },
  });
</script>
