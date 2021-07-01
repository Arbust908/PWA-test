<template>
  <section class="login-card">
    <aside class="login-card__image">
      <img src="@/assets/imgs/login_side.png" alt="" />
    </aside>
    <article class="login-box">
      <header class="login-box__header">
        <Logo class="login-logo" />
        <h2>Inicia sesión</h2>
      </header>
      <form class="login-box__form" action="#" method="POST">
        <div class="login-form__input-block">
          <label for="username" class=""> Usuario </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
            />
            <p v-if="error.username"></p>
          </div>
        </div>

        <div class="login-form__input-block">
          <label for="password"> Contraseña </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            />
            <p v-if="error.password"></p>
          </div>
        </div>

        <div class="login-form__options">
          <div class="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              checked
            />
            <label for="remember_me" class="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="login-form__forgeti">
              Olvidaste tu contraseña
            </a>
          </div>
        </div>

        <div>
          <Button class="w-full"> Iniciar Sesión </Button>
        </div>
      </form>
    </article>
  </section>
</template>

<script>
import Logo from "@/components/Logo.vue";
import Button from "@/components/ui/Button.vue";
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
.login {
  &-card {
    @apply sm:mx-auto sm:w-full sm:max-w-4xl sm:bg-gray-50 sm:shadow sm:rounded-lg flex overflow-hidden justify-center;
    &__image {
      @apply hidden md:block relative;
      &:after {
        content: "";
        @apply absolute inset-0 bg-gradient-to-t from-main-600 to-transparent;
      }
    }
  }
  &-box {
    @apply py-8 px-4 sm:px-8 flex-1 flex flex-col justify-center;
    &__header {
      @apply sm:mx-auto sm:w-full sm:max-w-md mb-4;
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
    &__options {
      @apply flex items-center justify-between;
      & input {
        @apply h-4 w-4 text-main-600 focus:ring-main-500 border-gray-300 rounded;
      }
    }
    &__fogeti {
      @apply font-medium text-main-600 hover:text-main-500;
    }
  }
}
</style>
