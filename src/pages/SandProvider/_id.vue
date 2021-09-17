<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Proveedor de arena - {{ id }}
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
  import { ref, reactive, ComputedRef, Ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useTitle } from '@vueuse/core';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
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
      const route = useRoute();
      const id = Number(route.params.id);
      useTitle(`Proveedor de Arena ${id} <> Sandflow`);
      const instance = axios.create({
        baseURL: apiUrl,
      });
      const sandProviders: Array<SandProvider> = JSON.parse(
        JSON.stringify(store.state.sandProviders.all)
      );

      const currentSandProvider: SandProvider = sandProviders.find((sp) => {
        return sp.id == id;
      });
      console.log(currentSandProvider);
      const newSandProvider: SandProvider = reactive({
        address: currentSandProvider.address,
        companyRepresentative: currentSandProvider.companyRepresentative,
        companyRepresentativeId: currentSandProvider.companyRepresentativeId,
        id: currentSandProvider.id,
        legalId: currentSandProvider.legalId,
        meshType: currentSandProvider.meshType,
        name: currentSandProvider.name,
        observations: currentSandProvider.observations,
      });
      console.log(currentSandProvider);

      const isNewRep: Ref<boolean> = ref(false);
      const toggleRepStatus = useToggle(isNewRep);
      const companyRepresentative: CompanyRepresentative = reactive({
        name: '',
        legalId: null,
        phone: '',
        email: '',
      });
      if (newSandProvider.companyRepresentativeId) {
        const repId = newSandProvider.companyRepresentativeId;
        const { data } = useAxios(
          `/companyRepresentative/${repId}`,
          { method: 'get' },
          instance
        );
        watch(data, (newVal, _) => {
          if (newVal && newVal.data) {
            companyRepresentative.name = newVal.data.name;
            companyRepresentative.legalId = newVal.data.legalId;
            companyRepresentative.phone = newVal.data.phone;
            companyRepresentative.email = newVal.data.email;
          }
        });
      }

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
          newSandProvider.legalName !== '' &&
          newSandProvider.legalId >= 0
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
        const repId = newSandProvider.companyRepresentativeId;
        const { data } = useAxios(
          `/companyRepresentative/${repId}`,
          { method: 'PUT', data: companyRepresentative },
          instance
        );
        watch(data, (newData, _) => {
          if (newData && newData.data) {
            const compRep = newData.data;
            companyRepresentative.id = compRep.id;
            newSandProvider.companyRepresentativeId = compRep.id;
            let sandProviderData = {
              address: newSandProvider.address,
              companyRepresentativeId: newSandProvider.companyRepresentativeId,
              id: newSandProvider.id,
              legalId: newSandProvider.legalId,
              meshType: newSandProvider.meshType,
              name: newSandProvider.name,
              observations: newSandProvider.observations,
            };
            if (meshType.value !== '') {
              newSandProvider.meshType.push(meshType.value);
            }
            const { data: spData } = useAxios(
              `/sandProvider/${id}`,
              { method: 'PUT', data: sandProviderData },
              instance
            );
            watch(spData, (newData, _) => {
              if (newData && newData.data) {
                store.dispatch('updateSandProvider', newSandProvider);
                router.push('/proveedores-de-arena');
              }
            });
          }
        });
      };

      return {
        id,
        isNewRep,
        toggleRepStatus,
        // companyRepresentativeId,
        companyRepresentative,
        newSandProvider,
        Icon,
        isFull,
        save,
        meshType,
        addMeshType,
        deleteMeshType,
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
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }
</style>
