<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nuevo proovedor de transporte
      </h1>
    </header>
    <section class="bg-white rounded-md max-w-2xl shadow-sm">
      <form method="POST" action="/" class="p-4 max-w-lg">
        <FieldGroup>
          <FieldLegend>Proveedor</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="name"
            placeholder="Nombre"
            title="Nombre"
            :data="newTransportProvider.name"
            @update:data="newTransportProvider.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="observations"
            placeholder="Observaciones..."
            title="Observaciones"
            :data="newTransportProvider.observations"
            @update:data="newTransportProvider.observations = $event"
          />
        </FieldGroup>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')">
            Cancelar
          </NoneBtn>
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
  import { computed, reactive, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
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
      const instance = axios.create({
        baseURL: api,
      });

      const newTransportProvider: TransportProvider = reactive({
        name: '',
        amount: 0,
        observations: '',
        providerNotificationId: -1,
      });

      const isFull = computed(() => {
        return !!(newTransportProvider.name !== '');
      });

      const save = async () => {
        const { data } = useAxios(
          '/transportProvider',
          { method: 'POST', data: newTransportProvider },
          instance
        );
        watch(data, (newData, _) => {
          if (newData && newData.data) {
            store.dispatch('saveTransportProvider', newData.data);
            router.push('/proveedores-de-transporte');
          }
        });
      };

      return {
        newTransportProvider,
        isFull,
        save,
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
</style>
