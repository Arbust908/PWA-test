<template>
  <fieldset>
    <slot>Campos!</slot>
  </fieldset>
</template>

<style lang="scss" scoped>
  fieldset {
    @apply py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
</style>
