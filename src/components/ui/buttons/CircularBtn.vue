<template>
  <button :type="type" :size="size">
    <div :class="btnClass" class="circular">
      <slot></slot>
    </div>
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
      btnClass: {
        type: String,
        default: '',
      }
    },
    components: {
      BaseBtn,
    },
  };
</script>

<style lang="scss" scoped>
  .circular {
    @apply inline-flex justify-center items-center transition duration-150 ease-out rounded-full m-auto;
    &:hover {
      @apply bg-opacity-75 shadow-lg
    }
  }
  button {
    @apply inline-flex justify-center items-center rounded-full focus:outline-none transition duration-150 ease-out;
    &:focus .circular {
      @apply outline-none ring-2 ring-offset-2 ring-indigo-500
    }
  }
  button[size='xs'] {
    @apply w-8 h-8;
  }
  button[size='sm'] {
    @apply w-10 h-10;
  }
  button[size='md'] {
    @apply w-12 h-12;
  }
  button[size='lg'] {
    @apply w-14 h-14;
  }
  button[size='xl'] {
    @apply w-16 h-16;
  }
</style>
