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
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Proveedor</h2>
          <label class="col-span-full" for="name">
            <span>Nombre</span>
            <input
              id="name"
              v-model="newSandProvider.name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre del proveedor"
            />
          </label>
          <label class="col-span-full" for="legalName">
            <span>Razón Social</span>
            <input
              id="legalName"
              v-model="newSandProvider.legalName"
              class="input"
              type="text"
              name="legalName"
              placeholder="Razón Social"
            />
          </label>
          <label class="col-span-full" for="legalId">
            <span>CUIT / CUIL</span>
            <input
              id="legalId"
              v-model.number="newSandProvider.legalId"
              v-maska="'###########'"
              class="input"
              type="text"
              name="legalId"
              placeholder="CUIT / CUIL"
            />
          </label>
          <label class="col-span-full" for="observations">
            <span>Observaciones</span>
            <input
              id="observations"
              v-model="newSandProvider.observations"
              class="input"
              type="text"
              name="observations"
              placeholder="Observaciones..."
            />
          </label>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl flex justify-between items-end">
            <span> Representante </span>
            <!-- <span>
              <label class="toggle text-sm" for="is-new-rep">
                <input
                  id="is-new-rep"
                  type="checkbox"
                  @click="toggleRepStatus"
                  :checked="isNewRep"
                  class="form-checkbox bg-transparent rounded-sm"
                  name="is-new-rep"
                />
                <span class="text-second-600">Es nuevo</span>
              </label>
            </span> -->
          </h2>
          <label class="col-span-full" for="nr-name">
            <span>Nombre Legal</span>
            <input
              id="nr-name"
              v-model="companyRepresentative.name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre de representante"
            />
            <!-- <input
              v-if="isNewRep"
              id="nr-name"
              v-model="companyRepresentative.name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre de representante"
            />
            <select
              v-else
              id="nr-name"
              name="nr-name"
              v-model="companyRepresentativeId"
              class="input"
            >
              <option disabled value="-1">Seleccionar Representante</option>
              <option
                v-for="corpoRep in companyRepresentatives"
                :key="corpoRep.id"
                :value="corpoRep.id"
              >
                {{ corpoRep.name }}
              </option>
            </select> -->
          </label>

          <label class="col-span-full" for="nr-legalId">
            <span>CUIL/CUIT</span>
            <input
              id="nr-legalId"
              :read-only="!isNewRep"
              v-maska="'###########'"
              v-model.number="companyRepresentative.legalId"
              class="input"
              type="text"
              name="legalId"
              placeholder="CUIL / CUIT"
            />
          </label>
          <label class="col-span-full" for="phone">
            <span>Teléfono</span>
            <input
              id="nr-phone"
              :read-only="!isNewRep"
              v-maska="'##-####-####'"
              v-model="companyRepresentative.phone"
              class="input"
              type="text"
              name="phone"
              placeholder="+11 1234 5678"
            />
          </label>
          <label class="col-span-full" for="email">
            <span>Email</span>
            <input
              id="nr-email"
              :read-only="!isNewRep"
              v-model="companyRepresentative.email"
              class="input"
              type="text"
              name="email"
              placeholder="empresa@mail.com"
            />
          </label>
        </fieldset>
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
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import { useToggle } from '@vueuse/core';
  import { maska } from 'maska';
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';

  export default {
    directives: { maska },
    components: {
      Layout,
      NoneBtn,
      PrimaryBtn,
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const isNewRep: Ref<boolean> = ref(false);
      const toggleRepStatus = useToggle(isNewRep);
      const companyRepresentative: CompanyRepresentative = reactive({
        name: '',
        legalId: null,
        phone: '',
        email: '',
      });

      // const companyRepresentativeId = ref(-1);
      // const companyRepresentatives = ref([] as Array<CompanyRepresentative>);
      // const { data: corpoRepData } = useAxios('/company', instance);
      // watch(corpoRepData, (corpoRepApi, prevCount) => {
      //   if (corpoRepApi && corpoRepApi.data) {
      //     companyRepresentatives.value = corpoRepApi.data;
      //   }
      // });

      const newSandProvider: SandProvider = reactive({
        name: '',
        legalName: '',
        legalId: null,
        meshType: '',
        grains: '',
        observations: '',
        companyRepresentativeId: -1,
      });

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
          companyRepresentative.legalId >= 0 &&
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
