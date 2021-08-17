<template>
  <button type="submit">
    <slot> Boton </slot>
  </button>
</template>

<script></script>

<style lang="scss" scoped>
  button {
    @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-main-600 hover:bg-main-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500;
  }
</style>
