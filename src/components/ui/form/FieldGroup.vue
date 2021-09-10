<template>
  <fieldset class="max-w-mdW w-full py-2 grid-cols-12 gap-4">
    <slot>Campos!</slot>
  </fieldset>
</template>

<style lang="scss" scoped>
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
</style>
