<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Orden de Pedido</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form vmethod="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-4"></form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="goToShowAll">Cancelar</button>
        <PrimaryBtn v-if="!isLastSection()" @click="nextSection"> Siguiente </PrimaryBtn>
        <PrimaryBtn v-else @click="save(true)"> Finalizar </PrimaryBtn>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { ref, Ref } from 'vue';

import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon,
    PlusIcon,
    CircularBtn,
    PrimaryBtn,
    WOOrder,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
