<template>
  <section class="recover-card">
    <article class="recover-box">
      <header class="recover-box__header">
        <Logo class="recover-logo" />
        <!-- <h2>Cambiar contraseña</h2> -->
      </header>
      <form class="recover-box__form" action="#" method="POST">
        <div class="recover-form__input-block">
          <label for="password" class=""> Nueva Contraseña </label>
          <div class="mt-1">
            <input id="password" name="password" type="password" autocomplete="new-password" required />
            <p v-if="error.password"></p>
          </div>
        </div>

        <div class="recover-form__input-block">
          <label for="new-password"> Confirmar Nueva Contraseña </label>
          <div class="mt-1">
            <input id="new-password" name="new-password" type="password" autocomplete="new-password" required />
            <p v-if="error.new_password"></p>
          </div>
        </div>

        <div>
          <Button class="w-full"> Confirmar Nueva Contraseña </Button>
        </div>

        <div class="recover-back">
          <button @click.prevent="$emit('logback')">Volver al Login</button>
        </div>
      </form>
    </article>
  </section>
</template>

<script>
import Logo from '@/components/Logo.vue';
import Button from '@/components/ui/Button.vue';
export default {
  components: {
    Logo,
    Button,
  },
  data() {
    return {
      error: {
        username: false,
        password: false,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.recover {
  &-card {
    @apply sm:mx-auto sm:w-full sm:max-w-md sm:bg-gray-50 sm:shadow sm:rounded-lg flex overflow-hidden justify-center;
    &__image {
      @apply hidden md:block relative;
      &:after {
        content: '';
        @apply absolute inset-0 bg-gradient-to-t from-main-600 to-transparent;
      }
    }
  }
  &-box {
    @apply py-8 px-4 sm:px-8 flex-1 flex flex-col justify-center;
    &__header {
      @apply sm:mx-auto sm:w-full sm:max-w-sm mb-4;
      & > h2 {
        @apply mb-8 text-center text-3xl font-extrabold text-gray-900;
      }
    }
    &__form {
      @apply space-y-6 w-full sm:max-w-sm sm:mx-auto;
    }
  }
  &-logo {
    @apply mx-auto h-12 w-auto mb-8;
  }
  &-form {
    &__input-block {
      & > label {
        @apply block text-sm font-medium text-gray-700;
      }
      & input {
        @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main-500 focus:border-main-500 sm:text-sm;
      }
    }
  }
  &-back {
    @apply text-center;
    & button {
      @apply text-main-500 hover:text-main-300 hover:underline;
    }
  }
}
</style>
