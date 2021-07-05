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
  @apply inline-flex items-center border border-gray-300 shadow-sm font-medium  text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 space-x-2;
}
button[size='xs'] {
  @apply px-2.5 py-1.5 text-xs rounded;
}
button[size='sm'] {
  @apply px-3 py-2 text-sm leading-4 rounded-md font-medium;
}
button[size='md'] {
  @apply px-4 py-2 text-sm leading-4 font-medium rounded-md;
}
button[size='lg'] {
  @apply px-4 py-2 text-base leading-6 font-medium rounded-md;
}
button[size='xl'] {
  @apply px-6 py-3 text-base leading-6 font-medium rounded-md;
}
</style>
