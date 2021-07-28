<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Arena - NUEVA</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 max-w-lg">
        <fieldset>
          <!-- <div class="input-block">
                  <label for="id" class=""> ID </label>
                  <div class="mt-1">
                      <input v-model.number="id" name="id" type="number"/>
                  </div>
              </div> -->
          <div class="input-block">
            <label for="type" class=""> Tipo </label>
            <div class="mt-1">
              <input v-model="type" name="type" type="text" placeholder="Tipo de arena" />
            </div>
          </div>
          <div class="input-block">
            <label for="description" class=""> Descripción </label>
            <div class="mt-1">
              <input v-model="description" name="description" type="text" placeholder="Ej: Resinada" />
            </div>
          </div>
          <div class="input-block">
            <label for="meshType" class=""> Tipo de Malla </label>
            <div class="mt-1">
              <input v-model="meshType" name="meshType" type="text" placeholder="Ej: 20" />
            </div>
          </div>
          <div class="input-block">
            <label for="grainType" class=""> Tipo de Grano </label>
            <div class="mt-1">
              <input v-model="grainType" name="grainType" type="text" placeholder="Ej: 50" />
            </div>
          </div>
          <div class="input-block">
            <label for="observations" class=""> Observaciones </label>
            <div class="mt-1">
              <input v-model="observations" name="observations" type="text" placeholder="Una observación ..." />
            </div>
          </div>
        </fieldset>
      </form>

      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section></section>
        <section class="space-x-6 flex items-center justify-end">
          <button @click="goToIndex">Cancelar</button>
          <!-- <GhostBtn class="btn__draft">
                <BookmarkIcon class="w-4 h-4" />
                <span @click="save"> Guardar Provisorio </span>
              </GhostBtn> -->
          <PrimaryBtn @click="save"> Finalizar </PrimaryBtn>
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
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import axios from 'axios';

  const api = import.meta.env.VITE_API_URL;

  export default {
    components: {
      BookmarkIcon: BookmarkIcon,
      CheckCircleIcon: CheckCircleIcon,
      PrimaryBtn: PrimaryBtn,
      GhostBtn: GhostBtn,
      Layout: Layout,
    },
    setup() {
      const router = useRouter();
      const store = useStore();

      const goToIndex = () => {
        router.push('/tipos-de-arena');
      };

      const newSand = reactive({
        type: '',
        description: '',
        meshType: '',
        grainType: '',
        observations: '',
      });

      const isFull = computed(() => {
        return !!(
          newSand.type.length > 0 &&
          newSand.description.length > 0 &&
          newSand.meshType.length > 0 &&
          newSand.grainType.length > 0 &&
          newSand.observations.length > 0
        );
      });

      const save = async () => {
        let sandDB = await axios
          .post(`${api}/sand`, newSand)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              return res.data;
            }
            return {};
          })
          .finally(() => {});

        store.dispatch('saveSand', newSand);
        router.push('/tipos-de-arena');
      };

      return {
        goToIndex,
        save,
        newSand,
        ...toRefs(newSand),
        isFull,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
      /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
    }
    &__add {
      @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
  .section-tab {
    @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
  }
  .section-tab[selected='true'] {
    @apply border-main-500 text-main-500;
  }
  .input-block select,
  .input-block input {
    @apply w-full rounded mb-3 p-2;
  }

  .pit-block {
    @apply flex mt-1 items-center w-full mb-3;
    & select,
    & input {
      @apply rounded p-2 max-w-md inline-block w-full;
    }
  }

  fieldset {
    @apply mb-6;
  }
  label {
    @apply text-sm;
  }
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }
</style>
