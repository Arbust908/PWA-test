<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nuevo montacarga
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form
        method="POST"
        action="/"
        class="p-4 w-full flex flex-col lg:flex-row"
      >
        <fieldset class="flex flex-col w-full">
          <div class="input-block p-4">
            <label for="name" class="">Nombre</label>
            <div class="mt-1">
              <input
                v-model="newForklift.name"
                class="w-full rounded-md shadow"
                name="name"
                type="text"
                placeholder="Nombre"
              />
            </div>
          </div>
          <div class="p-4 d-flex">
            <label for="owned" class="">Asignada</label>
            <div class="mt-1">
              <div :class="['switch', newForklift.owned ? 'true' : '']" @click="handleSwitchClick">
                <div class="switch-circle"></div>
              </div>
            </div>
          </div>
          <div class="input-block p-4">
            <label for="ownerName" class="">
              Nombre del dueño
            </label>
            <div class="mt-1">
              <input
                v-model="newForklift.ownerName"
                class="w-full rounded-md shadow"
                name="ownerName"
                type="text"
                placeholder="Nombre"
              />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="ownerContact" class="">
              Contacto del dueño
            </label>
            <div class="mt-1">
              <input
                v-model="newForklift.ownerContact"
                class="w-full rounded-md shadow"
                name="ownerContact"
                type="text"
                placeholder="Nombre"
              />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="observations" class=""> Observaciones </label>
            <div class="mt-1">
              <textarea
                v-model="newForklift.observations"
                class="w-full rounded-md shadow px-3 py-2 focus:outline-none"
                rows="5"
                name="observations"
                type="text"
                placeholder="Observaciones"
              ></textarea>
            </div>
          </div>
        </fieldset>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <button @click.prevent="goToIndex">Cancelar</button>
          <GhostBtn class="btn__draft" @click="save()">
            <BookmarkIcon class="w-4 h-4" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn
            :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
            @click="isFull && save(true)"
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
  import { ref, onMounted, computed, reactive } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

  import axios from 'axios';
  import { Forklift } from '@/interfaces/Forklift';
  const api = import.meta.env.VITE_API_URL;

  export default {
    components: {
      Layout,
      GhostBtn,
      BookmarkIcon,
      TrashIcon,
      PlusIcon,
      CheckCircleIcon,
      CircularBtn,
      PrimaryBtn,
    },
    setup() {
      const store = useStore();
      const router = useRouter();

      const newForklift: Forklift = reactive({
        id: 0,
        name: '',
        owned: false,
        ownerName: '',
        ownerContact: '',
        observations: '',
      });

      const handleSwitchClick = () => {
        newForklift.owned = !newForklift.owned
      }

      const goToIndex = (): void => {
        router.push('/montacargas');
      };

      const isFull = computed(() => {
        return !!(
          newForklift.name !== '' &&
          newForklift.ownerName !== '' &&
          newForklift.ownerContact !== '' &&
          newForklift.observations !== ''
        );
      });

      const save = async () => {
        let tpDB = await axios
          .post(`${api}/forklift`, newForklift)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              newForklift.id = res.data.data.id;
              return res.data;
            }
            return {};
          })
          .finally(() => {});

        // Update Transport Provider
        store.dispatch('saveForklift', newForklift);
        router.push('/montacargas');
      };

      return {
        newForklift,
        goToIndex,
        save,
        isFull,
        handleSwitchClick
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
  .switch {
    @apply bg-gray-200;
    border: 2px solid rgb(175, 175, 175);
    border-radius: 20px;
    padding: 5px;
    width: 60px;
    cursor: pointer;
    transition: all 500ms ease-in-out;

    .switch-circle {
      height: 20px;
      width: 20px;
      border-radius: 100%;
      @apply bg-gray-400;
      transition: all 500ms ease-in-out;
    }
    
    &.true {
      transition: all 500ms ease-in-out;
      @apply bg-green-300;
      @apply border-green-500;
      
      .switch-circle {
        transition: all 500ms ease-in-out;
        transform: translateX(25px);
        @apply bg-green-500;
      }
    }
  }
</style>
