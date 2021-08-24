<template>
  <button :type="type" :size="size">
    <slot></slot>
  </button>
</template>

<script>
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
  };
</script>

<style lang="scss" scoped>
  button {
    @apply inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500 space-x-2 transition duration-150 ease-out;
  }
  button[size='xs'] {
    @apply text-xs rounded;
  }
  button[size='sm'],
  button[size='md'] {
    @apply text-sm leading-4 font-semibold rounded-md;
  }
  button[size='lg'],
  button[size='xl'] {
    @apply text-base leading-6 font-medium;
  }
  button[size='lg'] {
    @apply rounded-md;
  }
  button[size='xl'] {
    @apply rounded-lg;
  }
</style>
