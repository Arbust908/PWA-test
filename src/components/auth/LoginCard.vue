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
        <div :class="{ hasError: formWithError || usernameError }" class="login-form__input-block">
          <label for="username" class=""> Usuario </label>
          <div class="mt-1">
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              placeholder="Nombre de Usuario"
              @blur="validate"
            />
            <p v-if="formWithError"></p>
            <p v-else-if="usernameError">El usuario tiene que tener mas de 3 caracteres</p>
          </div>
        </div>

        <div :class="{ hasError: formWithError || passwordError }" class="login-form__input-block">
          <label for="password"> Contraseña </label>
          <div class="mt-1">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="Contraseña"
              @blur="validate"
            />
            <p v-if="formWithError">Los datos no coinciden</p>
            <p v-else-if="passwordError">La contraseña deber tener mas de 5 caracteres</p>
          </div>
        </div>

        <div class="login-form__options">
          <div class="flex items-center">
            <input v-model="shouldRemember" id="remember_me" name="remember_me" type="checkbox" />
            <label for="remember_me" class="ml-2 block text-sm text-gray-900"> Recordarme </label>
          </div>
          <!-- <div class="text-sm">
            <button class="login-form__fogeti" @click.prevent="$emit('recover')">Olvidaste tu contraseña</button>
          </div> -->
        </div>

        <div>
          <Button class="mx-auto px-6" @click.prevent="formValidation"> Iniciar Sesión </Button>
        </div>
      </form>
    </article>
  </section>
</template>

<script lang="ts">
import { ref, Ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useActions } from 'vuex-composition-helpers';
import { Role } from '@/interfaces/User';

const Logo = defineAsyncComponent(() => import('@/components/Logo.vue'));
const Button = defineAsyncComponent(() => import('@/components/ui/Button.vue'));

import axios from 'axios';
const api = 'https://sandflow-qa.bitpatagonia.com/api';

export default {
  components: {
    Logo,
    Button,
  },
  setup() {
    const usernameError: Ref<boolean> = ref(false);
    const passwordError: Ref<boolean> = ref(false);
    const formWithError: Ref<boolean | null> = ref(null);

    const username: Ref<string> = ref('');
    const password: Ref<string> = ref('');
    const shouldRemember: Ref<boolean> = ref(true);

    const validate = (event: any) => {
      const name: string = event.target.name;
      const isLong: boolean = event.target.value.length >= 3;
      if (!isLong) {
        if (name === 'username') {
          usernameError.value = true;
        } else if (name === 'password') {
          passwordError.value = true;
        }
      }
    };
    const router = useRouter();
    const { setUser } = useActions(['setUser']);
    const formValidation = () => {
      usernameError.value = username.value.length <= 3;
      passwordError.value = password.value.length <= 3;
      formWithError.value = usernameError.value || passwordError.value;
      if (!formWithError.value) {
        login();
      }
    };

    const login = async () => {
      const loading = ref(true);
      const email = username.value.indexOf('@') > -1 ? username.value : `${username.value}@testmail.com`;
      // const loggedUser: User = { id: 99, username: username.value, role: Role.Logged };
      const loggedUser = { email, password: password.value };
      // let fullUser = {};
      let fullUser = await axios
        .post(`${api}/auth/login`, loggedUser)
        .catch((err) => {
          console.log(err);
          alert('Error al iniciar sesión');
        })
        .then((res) => {
          if (res.status === 200) {
            return res.data.data.token || res.data.token;
          }
          return {};
        })
        .finally(() => {
          loading.value = false;
        });
      fullUser = { id: 99, username: username.value, role: Role.Logged, token: fullUser };
      if (shouldRemember.value) {
        localStorage.setItem('user', JSON.stringify(fullUser));
      }
      setUser(fullUser);
      router.push('/orden-de-trabajo');
    };

    return {
      formWithError,
      username,
      password,
      shouldRemember,
      validate,
      formValidation,
      usernameError,
      passwordError,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  &-card {
    @apply sm:w-full sm:max-w-3xl sm:bg-gray-50 sm:shadow sm:rounded-lg flex overflow-hidden justify-center;
    &__image {
      @apply hidden md:block relative max-h-[30rem] max-w-[17rem];
      &:after {
        content: '';
        @apply absolute inset-0 bg-gradient-to-t from-main-600 to-transparent;
      }
    }
  }
  &-box {
    @apply p-4 flex-1 flex flex-col justify-center;
    &__header {
      @apply sm:mx-auto sm:w-full sm:max-w-lg mb-4;
      & > h2 {
        @apply mb-3 text-center text-3xl font-extrabold text-gray-900 sr-only;
      }
    }
    &__form {
      @apply space-y-6 w-full sm:max-w-sm sm:mx-auto;
      & .hasError {
        @apply text-red-500;
        input {
          @apply bg-red-200 border-red-700;
        }
        p {
          @apply text-xs font-bold pt-1 pl-1;
        }
      }
    }
  }
  &-logo {
    @apply mx-auto h-12 w-auto mb-3;
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
