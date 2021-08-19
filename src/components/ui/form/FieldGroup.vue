<template>
  <fieldset class="max-w-md grid w-full">
    <slot>Campos!</slot>
  </fieldset>
</template>

<style lang="scss" scoped>
  fieldset {
    @apply py-2 grid-cols-12 gap-4 md:gap-6;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
</style>
