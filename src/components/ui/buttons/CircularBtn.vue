<template>
  <button class="circular" :type="type" :size="size">
    <slot></slot>
  </button>
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
    .circular {
      @apply inline-flex items-center border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-out;
        @apply rounded-full;
    }
  .circular[size='xs'] {
    @apply text-xs p-1;
  }
  .circular[size='sm'],
  .circular[size='md'] {
    @apply text-sm leading-4 font-semibold;
  }
  .circular[size='sm'] {
    @apply p-1.5;
  }
  .circular[size='md'] {
    @apply p-2;
  }
  .circular[size='lg'],
  .circular[size='xl'] {
    @apply text-base leading-6 font-medium;
  }
  .circular[size='lg'] {
    @apply p-2;
  }
  .circular[size='xl'] {
    @apply p-3;
  }
</style>
