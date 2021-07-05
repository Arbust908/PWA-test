<!-- This example requires Tailwind CSS v2.0+ -->
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
  @apply inline-flex items-center border border-transparent rounded-full shadow-sm
      text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
button[size='xs'] {
  @apply p-1;
}
button[size='sm'] {
  @apply p-1.5;
}
button[size='md'] {
  @apply p-2;
}
button[size='lg'] {
  @apply p-2;
}
button[size='xl'] {
  @apply p-3;
}
</style>
