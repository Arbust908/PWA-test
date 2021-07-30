<template>
  <article class="error-box">
    <h2>Contraseña no Actualizada</h2>
    <XCircleIcon class="error-logo" />
    <p>Tu contraseña no ha sido actualizada. Ocurrio un error</p>
    <Button class="mx-auto px-6"> Volver Atras </Button>
  </article>
</template>

<script>
  import { XCircleIcon } from '@heroicons/vue/solid';
  import Button from '@/components/ui/Button.vue';
  export default {
    components: {
      XCircleIcon,
      Button,
    },
  };
</script>

<style lang="scss" scoped>
  .error {
    &-box {
      @apply py-8 px-4 sm:px-8 flex-1 flex flex-col justify-center max-w-xs mx-auto text-center space-y-8;
      & > h2 {
        @apply text-center text-3xl font-extrabold text-gray-900;
      }
    }
    &-logo {
      @apply mx-auto h-28 w-auto text-red-600;
    }
  }
</style>
