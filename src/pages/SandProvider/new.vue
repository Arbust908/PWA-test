<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nuevo proveedor de arena
      </h1>
    </header>
    <section class="bg-white rounded-md max-w-2xl shadow-sm">
      <form method="POST" action="/" class="p-4 max-w-lg">
        <SandProviderForm
          :spName="newSandProvider.name"
          :spLegalId="newSandProvider.legalId"
          :spAddress="newSandProvider.address"
          :spMeshTypes="newSandProvider.meshType"
          :spObs="newSandProvider.observations"
          :spMesh="meshType"
          @update:spName="newSandProvider.name = $event"
          @update:spLegalId="newSandProvider.legalId = $event"
          @update:spAddress="newSandProvider.address = $event"
          @update:spMeshTypes="newSandProvider.meshType = $event"
          @update:spObs="newSandProvider.observations = $event"
          @update:spMesh="meshType = $event"
        />
        <SandProviderRep
          :repName="companyRepresentative.name"
          :repPhone="companyRepresentative.phone"
          :repEmail="companyRepresentative.email"
          @update:repName="companyRepresentative.name = $event"
          @update:repPhone="companyRepresentative.phone = $event"
          @update:repEmail="companyRepresentative.email = $event"
        />
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/proveedores-de-arena')">
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
  import { ref, Ref, computed, reactive, watch, ComputedRef } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useTitle } from '@vueuse/core';
  import Layout from '@/layouts/Main.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import { useToggle } from '@vueuse/core';
  import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
  import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';

  export default {
    components: {
      Layout,
      NoneBtn,
      PrimaryBtn,
      Icon,
      SandProviderForm,
      SandProviderRep,
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const title = useTitle(`Nuevo Proveedor de Arena <> Sandflow`);
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const isNewRep: Ref<boolean> = ref(false);
      const toggleRepStatus = useToggle(isNewRep);
      const companyRepresentative: CompanyRepresentative = reactive({
        name: '',
        phone: '',
        email: '',
      });

      const newSandProvider: SandProvider = reactive({
        name: '',
        address: '',
        legalId: null,
        meshType: [],
        observations: '',
        companyRepresentativeId: -1,
      });

      let meshType = ref('');

      const addMeshType = (newMeshType: string) => {
        newSandProvider.meshType.push(newMeshType);
        meshType.value = '';
      };

      const deleteMeshType = (meshType: string) => {
        newSandProvider.meshType = newSandProvider.meshType.filter(
          (element) => {
            return element !== meshType;
          }
        );
      };

      const providerFull: ComputedRef<boolean> = computed(() => {
        return !!(
          newSandProvider.name !== '' &&
          newSandProvider.address !== '0' &&
          newSandProvider.legalId >= 0 &&
          // (newSandProvider.meshType.length > 0 || meshType.value !== '')
        );
      });

      const repFull: ComputedRef<boolean> = computed(() => {
        return !!(
          companyRepresentative.name !== '' &&
          companyRepresentative.phone !== '' &&
          companyRepresentative.email !== ''
        );
      });

      const isFull: ComputedRef<boolean> = computed(() => {
        return providerFull.value && repFull.value;
      });

      const save = async () => {
        const { data } = useAxios(
          '/companyRepresentative',
          { method: 'POST', data: companyRepresentative },
          instance
        );
        watch(data, (newData, _) => {
          if (newData && newData.data) {
            const compRep = newData.data;
            companyRepresentative.id = compRep.id;
            newSandProvider.companyRepresentativeId = compRep.id;
            if (meshType.value !== '') {
              newSandProvider.meshType.push(meshType.value);
            }
            const { data: spData } = useAxios(
              '/sandProvider',
              { method: 'POST', data: newSandProvider },
              instance
            );
            watch(spData, (newData, _) => {
              if (newData && newData.data) {
                store.dispatch('saveSandProvider', newSandProvider);
                router.push('/proveedores-de-arena');
              }
            });
          }
        });
      };

      return {
        isNewRep,
        toggleRepStatus,
        // companyRepresentativeId,
        companyRepresentative,
        newSandProvider,
        // companyRepresentatives,
        isFull,
        save,
        deleteMeshType,
        addMeshType,
        meshType,
        Icon,
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
  .input {
    &.readonly:read-only {
      @apply bg-white;
    }
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  input:read-only {
    @apply bg-second-200 border cursor-not-allowed;
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
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }
</style>
