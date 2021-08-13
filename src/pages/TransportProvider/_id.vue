<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Proveedor de Transporte - ID {{ id }}
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form
        method="POST"
        action="/"
        class="p-4 w-full flex flex-col lg:flex-row"
      >
        <FieldGroup>
          <FieldLegend>Proveedor</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="name"
            placeholder="Nombre"
            title="Nombre"
            :data="currentTransportProvider.name"
            @update:data="currentTransportProvider.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="observations"
            placeholder="Observaciones..."
            title="Observaciones"
            :data="currentTransportProvider.observations"
            @update:data="currentTransportProvider.observations = $event"
          />
        </FieldGroup>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')">
            Cancelar
          </NoneBtn>
          <PrimaryBtn @click="update()"> Finalizar </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const api = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import { TransportProvider } from '@/interfaces/sandflow';

  export default {
    components: {
      Layout,
      NoneBtn,
      BookmarkIcon,
      TrashIcon,
      PlusIcon,
      CheckCircleIcon,
      CircularBtn,
      PrimaryBtn,
      FieldGroup,
      FieldInput,
      FieldLegend,
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const instance = axios.create({
        baseURL: api,
      });
      const id = Number(route.params.id);

      const transportProviders: Array<TransportProvider> = JSON.parse(
        JSON.stringify(store.state.transportProviders.all)
      );

      const currentTransportProvider: TransportProvider =
        transportProviders.find((sp) => {
          return sp.id == id;
        });

      const isFull = computed(() => {
        return !!(currentTransportProvider.name !== '');
      });

      const update = async () => {
        const { data } = useAxios(
          `/transportProvider/${id}`,
          { method: 'PUT', data: currentTransportProvider },
          instance
        );
        watch(data, (newData, _) => {
          if (newData && newData.data) {
            store.dispatch('updateTransportProvider', newData.data);
            router.push('/proveedores-de-transporte');
          }
        });
      };

      return {
        id,
        currentTransportProvider,
        update,
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
