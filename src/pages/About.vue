<template>
  <main-layout>
    <p>About page.</p>
    {{ storage.gipi.value }}
    {{ storage.gipi.get() }}
    {{ keys }}
  </main-layout>
</template>

<script lang="ts">
import MainLayout from '@/layouts/Main.vue';
import { useLocalStorage } from '@/helpers/useLocalStorage';

export default {
  components: {
    MainLayout,
  },
  setup() {
    const { storage, keys } = useLocalStorage(['user', 'gipi']);
    const { gipi } = storage;

    storage.gipi.set('Mintiti');

    return {
      storage,
      keys,
    };
  },
};
</script>
