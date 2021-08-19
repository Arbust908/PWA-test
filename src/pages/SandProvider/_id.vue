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
          <label class="col-span-full" for="name">
            <span>Nombre y Apellido / Razón Social</span>
            <input
              id="name"
              v-model="newSandProvider.name"
              class="input"
              type="text"
              name="name"
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
          <label class="col-span-full" for="address">
            <span>Domicilio</span>
            <input
              id="address"
              v-model="newSandProvider.address"
              class="input"
              type="text"
              name="address"
            />
          </label>
          <label class="col-span-full" for="meshType">
            <span>Tipo de malla</span>
            <div class="mb-4">
              <div class="flex  items-center" v-for="(singleMeshType,index) in newSandProvider.meshType" :key="index" >
                <input class="input readonly" type="text" :value="singleMeshType" readonly/>
                <Icon icon="Trash" type="outline" class="ml-3 w-5 h-5 cursor-pointer" @click="deleteMeshType(singleMeshType)" />
              </div> 
            </div>
            <div class="flex items-center">
              <input
              class="input"
              type="text"
              name="meshType"
              v-model="meshType"
              placeholder="Ingrese tipo de malla"
              />
            <Icon icon="Plus" type="outline" class="ml-3 w-5 h-5 cursor-pointer" @click="addMeshType(meshType)" />
            </div>
          </label>
          <label class="col-span-full" for="observations">
            <span>Observaciones<span class="italic text-gray-400"> (opcional)</span></span>
            <textarea
              id="observations"
              v-model="newSandProvider.observations"
              class="input resize-none"
              type="text"
              name="observations"
              placeholder="Observaciones..."
              rows="4"
            ></textarea>
          </label>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl flex justify-between items-end">
            <span> Contacto principal </span>
          </h2>
          <label class="col-span-full" for="nr-name">
            <span>Nombre y Apellido</span>
            <input
              id="nr-name"
              v-model="companyRepresentative.name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre y Apellido"
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
  import { ref, reactive, ComputedRef, Ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import Icon from '@/components/icon/TheAllIcon.vue';
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
      Icon
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const instance = axios.create({
        baseURL: apiUrl,
      });
      const sandProviders: Array<SandProvider> = JSON.parse(
        JSON.stringify(store.state.sandProviders.all)
      );
      const id = Number(route.params.id);

      const currentSandProvider: SandProvider = sandProviders.find((sp) => {
        return sp.id == id;
      });
      const newSandProvider: SandProvider = reactive({
        ...currentSandProvider,
      });

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
      
      let meshType = ref('')

      const addMeshType = (newMeshType: string) => {
        newSandProvider.meshType.push(newMeshType)
        meshType.value = ''
      }

      const deleteMeshType = (meshType: string) => {
        newSandProvider.meshType = newSandProvider.meshType.filter((element) => {
          return element !== meshType
        })
      }

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
            const { data: spData } = useAxios(
              `/sandProvider/${newSandProvider.id}`,
              { method: 'PUT', data: newSandProvider },
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
