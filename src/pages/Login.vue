<template>
  <main class="relative">
    <aside class="space-x-4 absolute top-0 right-0 m-8">
      <button
        class="px-4 py-1 rounded bg-second-500 text-second-100"
        @click="selectedCard('login')"
      >
        login
      </button>
      <button
        class="px-4 py-1 rounded bg-second-500 text-second-100"
        @click="selectedCard('recover')"
      >
        recover
      </button>
      <button
        class="px-4 py-1 rounded bg-second-500 text-second-100"
        @click="selectedCard('success')"
      >
        success
      </button>
      <button
        class="px-4 py-1 rounded bg-second-500 text-second-100"
        @click="selectedCard('error')"
      >
        error
      </button>
    </aside>
    <LoginCard v-if="selected_card === 'login'" />
    <PassRecover v-else-if="selected_card === 'recover'" />
    <Success v-else-if="selected_card === 'success'" />
    <Error v-else-if="selected_card === 'error'" />
  </main>
</template>

<script>
import LoginCard from "@/components/auth/LoginCard.vue";
import PassRecover from "@/components/auth/PassRecover.vue";
import Success from "@/components/auth/Success.vue";
import Error from "@/components/auth/Error.vue";
export default {
  components: {
    LoginCard,
    PassRecover,
    Success,
    Error,
  },
  data() {
    return {
      selected_card: "login",
    };
  },
  methods: {
    selectedCard(card) {
      this.selected_card = card;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  @apply min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8;
}
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
