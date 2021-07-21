<template>
  <Layout>
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Panel de Control</h2>
    <section class="grid grid-cols-4 gap-4">
      <router-link to="/orden-de-trabajo" class="nav__card">
        <h3>Orden de Trabajo</h3>
        <BookmarkIcon class="nav__pic" />
        <button>
          Ver Mas
        </button>
      </router-link>
      <router-link to="/orden-de-pedido" class="nav__card">
        <h3>Orden de Pedido</h3>
        <BookmarkIcon class="nav__pic" />
        <button>
          Ver Mas
        </button>
      </router-link>
    </section>
  </Layout>
</template>

<script lang="ts">
import Layout from '@/layouts/Main.vue';
import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
export default {
  components: {
    Layout,
    BookmarkIcon,
  },
};
</script>

<style lang="scss" scoped>
.nav {
  &__card {
    @apply p-2 rounded-lg bg-gray-200 shadow-sm hover:bg-white hover:shadow-lg transition duration-150 ease-out space-y-2;
    button {
      @apply ml-auto mr-1 px-2 rounded bg-main-300 text-white hover:bg-main-500 hover:shadow transition duration-150 ease-out
    }
  }
  &__pic {
    @apply w-10 h-10 text-main-600;
  }
}
</style>