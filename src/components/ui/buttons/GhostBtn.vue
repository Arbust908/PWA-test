<template>
  <BaseBtn class="ghost" :type="type" :size="size">
    <slot>Fantasma</slot>
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
  button {
    @apply border shadow-sm;
  }
  button[size='xs'] {
    @apply px-2.5 py-1.5;
  }
  button[size='sm'] {
    @apply px-3 py-2;
  }
  button[size='md'] {
    @apply px-4 py-2;
  }
  button[size='lg'] {
    @apply px-4 py-2;
  }
  button[size='xl'] {
    @apply px-6 py-3;
  }
</style>
