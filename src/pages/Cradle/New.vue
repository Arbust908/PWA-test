<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Grúa - Nuevo
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <label class="col-span-12" for="name">
            <span>Nombre</span>
            <input
              id="name"
              v-model="name"
              class="input"
              type="text"
              name="name"
              placeholder="Ej: MXH-123"
            />
          </label>
          <label class="col-span-12" for="observations">
            <span>Observaciones</span>
            <input
              id="observations"
              v-model="observations"
              class="input"
              type="text"
              name="observations"
              placeholder="Observaciones ..."
            />
          </label>
        </fieldset>
      </form>
      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section></section>
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click="goToIndex">Cancelar</NoneBtn>
          <PrimaryBtn
            :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
            @click="isFull && save()"
            :disabled="!isFull"
          >
            Finalizar
          </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { reactive, toRefs, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import axios from 'axios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      BookmarkIcon,
      CheckCircleIcon,
      PrimaryBtn,
      NoneBtn,
      Layout,
    },
    setup() {
      const router = useRouter();
      const store = useStore();

      const goToIndex = () => {
        router.push('/cradle');
      };

      const newCradle = reactive({
        name: '',
        observations: '',
      });
      const isFull = computed(() => {
        return !!(newCradle.name && newCradle.name.length > 3);
      });

      const save = async () => {
        let sandDB = await axios
          .post(`${apiUrl}/cradle`, newCradle)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              return res.data.data;
            }
            return {};
          })
          .finally(() => {});

        store.dispatch('saveCradle', newCradle);
        router.push('/cradle');
      };

      return {
        goToIndex,
        save,
        newCradle,
        isFull,
        ...toRefs(newCradle),
      };
    },
  };
</script>

<style lang="scss" scoped>
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  input:read-only {
    @apply bg-second-200 border cursor-not-allowed;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
  label:not(.toggle) {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  .toggle {
    @apply flex space-x-3 items-center;
  }
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
    }
    &__options {
      @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
    }
    &__add {
      @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
</style>
