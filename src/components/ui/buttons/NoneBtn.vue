<template>
  <BaseBtn btn="none" :type="type" :size="size">
    <slot> Nada </slot>
  </BaseBtn>
</template>

<script>
  import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
  export default {
    props: {
      type: {
        type: String,
        default: 'button',
      },
      size: {
        type: String,
        default: 'md',
      },
    },
    components: {
      BaseBtn,
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/button.scss';
</style>
