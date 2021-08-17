<template>
  <Layout>
    <input class="cajitaMagica" type="text" name="" id="" />
    <section class="grid grid-cols-8 gap-6">
      <p class="col-span-full">About page.</p>
      <p class="col-span-full">
        {{ storage.gipi.value }}
        {{ storage.gipi.get() }}
        {{ keys }}
      </p>
      <progress
        v-if="isLoading"
        class="fixed inset-x-0 top-0 z-50 w-full h-1 bg-green-500 shadow"
        :value="(progress * 100).toFixed(0)"
        max="100"
      >
        50%
      </progress>
      <b v-if="isLoading" class="ml-2 col-span-full"
        >{{ (progress * 100).toFixed(0) }}%</b
      >
      <button
        class="
          px-3
          py-1
          rounded
          bg-green-500
          text-green-100
          hover:bg-green-700 hover:shadow
          mb-1
          col-span-2
        "
        @click="initProgrss"
      >
        Load
      </button>
      <button
        class="
          px-3
          py-1
          rounded
          bg-green-500
          text-green-100
          hover:bg-green-700 hover:shadow
          mb-1
          col-span-2
        "
        @click="done"
      >
        Finish
      </button>
      <button
        class="
          px-3
          py-1
          rounded-lg
          bg-green-500
          text-green-100
          hover:bg-green-700 hover:shadow
          mb-1
          col-span-2
        "
        @click="start"
      >
        Start
      </button>
    </section>
  </Layout>
</template>

<script lang="ts">
  import Layout from '@/layouts/Main.vue';
  import { useLocalStorage } from '@/helpers/useLocalStorage';
  import { useNProgress } from '@vueuse/integrations/useNProgress';

  export default {
    components: {
      Layout,
    },
    setup() {
      const { storage, keys } = useLocalStorage(['user', 'gipi']);
      const { gipi } = storage;

      const { progress, isLoading, start, done } = useNProgress();

      const initProgrss = () => {
        if (progress.value === null) {
          progress.value = 0.0;
        }
        const loading = setInterval(() => {
          progress.value += 0.01;
          if (progress.value >= 1.0) {
            clearInterval(loading);
          }
        }, 100);
      };

      storage.gipi.set('Mintiti');

      return {
        storage,
        keys,
        progress,
        isLoading,
        initProgrss,
        start,
        done,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .cajitaMagica {
    @apply w-[58px]
        h-[58px]
        m-[58px]
        rounded
        shadow-md
        border-none
        bg-gradient-to-tr
        from-purple-500
        to-pink-500;
  }
  progress {
    @apply bg-green-500;
  }
  progress::-webkit-progress-bar {
    @apply bg-gray-500;
  }
  progress::-webkit-progress-value {
    @apply bg-green-500;
  }
  progress::-moz-progress-bar {
    @apply bg-green-500;
  }
</style>
