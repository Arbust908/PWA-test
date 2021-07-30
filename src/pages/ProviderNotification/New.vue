<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-second-900 text-xl self-start mb-3 md:mb-0">Notificación a proveedores</h1>
    </header>
    <section class="bg-second-50 rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Arena</h2>
          <label class="col-span-full" for="sandProvider">
            <span>Proveedor</span>
            <select
              id="sandProvider"
              v-model="sandProviderId"
              :class="sP_end ? null : 'loading'"
              class="input"
              name="sandProvider"
            >
              <option selected disabled value="">Seleccionar Proveedor de Arena</option>
              <option v-for="sP in sandProviders.data" :key="sP.id" :value="sP.id">{{ toCapitalize(sP.name) }}</option>
            </select>
          </label>

          <template v-for="(sO, Key) in sandOrder" :key="Key">
            <hr v-if="Key !== 0" class="mt-4 mb-2 col-span-full" />
            <label :class="sandOrder.length > 1 ? 'col-span-5' : 'col-span-6'" for="sandType">
              <span>Tipo</span>
              <select
                id="sandProvider"
                v-model="sO.sandType.id"
                :class="s_end ? null : 'loading'"
                class="input"
                name="sandProvider"
              >
                <option selected disabled value="">Seleccionar Tipo de Arena</option>
                <option v-for="sT in sandTypes.data" :key="sT.id" :value="sT.id">{{ toCapitalize(sT.type) }}</option>
              </select>
            </label>
            <label :class="sandOrder.length > 1 ? 'col-span-5' : 'col-span-6'" for="sandQuantity">
              <span>Cantidad</span>
              <div class="mt-1 flex rounded shadow-sm">
                <input
                  v-model.number="sO.amount"
                  type="number"
                  name="sandQuantity"
                  class="
                    flex-1
                    min-w-0
                    block
                    w-full
                    px-3
                    py-2
                    rounded-none
                    border-r-0
                    rounded-l
                    focus:ring-indigo-500 focus:border-indigo-500
                    border-second-300
                    sm:text-sm
                  "
                  placeholder="22"
                  list="sandQuantity-list"
                />
                <datalist id="sandQuantity-list">
                  <option value="12">12</option>
                  <option value="22">22</option>
                  <option value="44">44</option>
                  <option value="88">88</option>
                </datalist>
                <span
                  class="
                    inline-flex
                    items-center
                    px-3
                    rounded-r
                    border border-second-300
                    bg-second-50
                    text-second-500
                    sm:text-sm
                  "
                  title="Peso en Toneladas"
                >
                  t
                </span>
              </div>
            </label>
            <div v-if="sandOrder.length > 1" class="col-span-2 flex justify-end items-end">
              <CircularBtn class="btn__delete" size="sm" @click="removeSandOrder(sO.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </template>
          <div class="col-span-full mt-1 pb-4 mb-4">
            <button class="flex items-center p-1" @click.prevent="addSandOrder">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold text"> Agregar arena </span>
            </button>
          </div>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Transporte</h2>
          <template v-for="(tO, tOKey) in transportOrder" :key="tOKey">
            <hr v-if="tOKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label
              :class="transportProviders && transportProviders.length > 1 ? 'col-span-10' : 'col-span-full'"
              :for="'transportProvider' + tO.id"
            >
              <span>Proveedor</span>
              <select
                :id="'transportProvider' + tO.id"
                v-model="tO.id"
                class="input"
                :name="'transportProvider' + tO.id"
              >
                <option selected disabled value="-1">Proveedor de Transpore</option>
                <option v-for="(tP, tPKey) in transportProviders.data" :key="tPKey" :value="tP.id">
                  {{ tP.name }}
                </option>
              </select>
            </label>
            <div
              v-if="transportProviders && transportProviders.length > 1"
              class="col-span-2 flex justify-end items-end"
            >
              <CircularBtn class="btn__delete" size="sm" @click="removeTransportProvider(tO.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
            <label class="col-span-full" :for="'transportAmount' + tO.id">
              <span>Cantidad de camiones</span>
              <input
                :id="'transportAmount' + tO.id"
                v-model.number="tO.amount"
                class="input"
                type="text"
                :name="'transportAmount' + tO.id"
                :list="'transportAmount' + tO.id + '-list'"
                placeholder="Cantidad de camiones"
              />
              <datalist :id="'transportAmount' + tO.id + '-list'">
                <option value="1">1 Camion</option>
                <option value="2">2 Camiones</option>
                <option value="4">4 Camiones</option>
                <option value="6">6 Camiones</option>
                <option value="10">10 Camiones</option>
              </datalist>
            </label>

            <label class="col-span-full" :for="'transportObservations' + tO.id">
              <span>Observaciones</span>
              <input
                :id="'transportObservations' + tO.id"
                v-model="tO.observation"
                class="input"
                type="text"
                :name="'transportObservations' + tO.id"
                :list="'transportObservations' + tO.id + '-list'"
                placeholder="Observaciones"
              />
              <datalist :id="'transportObservations' + tO.id + '-list'">
                <option value="Chasis Grande">Chasis Grande</option>
                <option value="Chasis Chico">Chasis Chico</option>
                <option value="Doble Carga">Doble Carga</option>
                <option value="Extra Largo">Extra Largo</option>
              </datalist>
            </label>
          </template>
          <div class="col-span-full mt-1 pb-4 mb-4">
            <button class="flex items-center p-1" @click.prevent="addTransportProvider">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold text"> Agregar transporte </span>
            </button>
          </div>
        </fieldset>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <GhostBtn @click.prevent="$router.push('/notificaciones-a-proveedores')">Cancelar</GhostBtn>
        <PrimaryBtn
          type="submit"
          size="sm"
          class="p-4"
          :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
          :disabled="!isFull"
          @click.prevent="isFull && save()"
        >
          Cargar Planificacíon
        </PrimaryBtn>
        <PrimaryBtn type="submit" size="sm" class="p-4" @click.prevent="save()"> nificacíon </PrimaryBtn>
      </footer>
    </section>
    <Modal title="Notificación a Proveedores" type="off" :open="showModal" @close="toggleModal">
      <template #body>
        <div class="divide-y text-left">
          <section class="py-2 space-y-2">
            <h3 class="text-xl">Arena</h3>
            <article class="text-sm text-indigo-500">
              <header class="flex items-center gap-2">
                <BellIcon class="w-4 h-4" />
                <span>Notificación para {{ sandProvider }}</span>
              </header>
              <ul class="list-disc pl-6 ml-2">
                <li v-for="sOli in sandOrder" :key="sOli.id">Tipo {{ sOli.sandType }}, {{ sOli.amount }}</li>
              </ul>
            </article>
          </section>
          <section class="py-2 space-y-2">
            <h3 class="text-xl">Transporte</h3>
            <template v-for="tPNot in transportProviders" :key="tPNot.id">
              <article class="text-sm text-indigo-500">
                <header class="flex items-center gap-2">
                  <BellIcon class="w-4 h-4" />
                  <span> Notificación para {{ tPNot.name }}, {{ tPNot.amount }}U, {{ tPNot.observation }} </span>
                </header>
              </article>
            </template>
          </section>
        </div>
      </template>
      <template #btn>
        <div class="flex gap-4">
          <button
            type="button"
            class="
              inline-flex
              justify-center
              w-full
              rounded-md
              border border-transparent
              shadow-sm
              px-4
              py-2
              bg-transparent
              text-base
              font-medium
              text-second-400
              hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
              sm:text-sm
            "
            @click.prevent="toggleModal"
          >
            Volver
          </button>
          <button
            type="button"
            class="
              inline-flex
              justify-center
              w-full
              rounded-md
              border border-transparent
              shadow-sm
              px-4
              py-2
              bg-main-600
              text-base
              font-medium
              text-second-50
              hover:bg-main-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500
              sm:text-sm
            "
            @click.prevent="confirm"
          >
            Confirmar
          </button>
        </div>
      </template>
    </Modal>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, computed, defineComponent, defineAsyncComponent } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  import { TrashIcon } from '@heroicons/vue/outline';
  import { PlusIcon, BellIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import { ProviderNotification, SandOrder, TransportProvider } from '@/interfaces/ProviderNotification.ts';
  import { useToggle } from '@vueuse/core';

  const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import { SandProvider } from '@/interfaces/SandProvider';
  import { Sand } from '@/interfaces/SandType';
  import SelectList from '@/components/ui/SelectList.vue';
  const apiUrl = import.meta.env.VITE_API_URL;

  export default defineComponent({
    components: {
      BellIcon,
      CircularBtn,
      GhostBtn,
      Layout,
      Modal,
      PlusIcon,
      PrimaryBtn,
      TrashIcon,
      SelectList,
    },
    setup() {
      const router = useRouter();
      const store = useStore();

      const pN: Ref<ProviderNotification> = ref({} as ProviderNotification);

      const api = axios.create({
        baseURL: apiUrl,
      });
      const { data: sPData, isFinished: sP_end } = useAxios('/sandProvider', api);
      const sandProviders: Ref<Array<SandProvider> | null> = ref(sPData);

      const { data: sData, isFinished: s_end } = useAxios('/sand', api);
      const sandTypes: Ref<Array<Sand> | null> = ref(sData);

      const { data: tPData, isFinished: tP_end } = useAxios('/transportProvider', api);
      const transportProviders: Ref<Array<TransportProvider> | null> = ref(tPData);

      const sandProviderId: Ref<string> = ref('');
      const sandOrder: Ref<Array<SandOrder>> = ref([]);
      const transportOrder: Ref<Array<TransportProvider>> = ref([]);

      const defaultSandOrder: SandOrder = {
        id: 0,
        sandTypeId: 0,
        sandType: { id: '', type: '', description: '', meshType: '', grainType: '', observations: '' },
        amount: 0,
      };
      const addSandOrder = () => {
        const lastSandOrder = sandOrder.value[sandOrder.value.length - 1];
        const lastSandOrderId = lastSandOrder ? lastSandOrder.id : -1;
        const newSandOrder = { ...defaultSandOrder };
        newSandOrder.id = lastSandOrderId + 1;
        sandOrder.value.push(newSandOrder);
      };
      const removeSandOrder = (soId: number) => {
        sandOrder.value = sandOrder.value.filter((so) => so.id !== soId);
      };
      if (sandOrder.value.length === 0) {
        addSandOrder();
      }
      const defaultTransportProvider: TransportProvider = {
        id: 0,
        name: '',
        amount: 0,
        observation: '',
        providerNotificationId: 0,
        providerNotification: { id: 0, sandProviderId: 0, sandOrderId: 0 },
      };
      const addTransportProvider = () => {
        const lastTransportProvider = transportOrder.value[transportOrder.value.length - 1];
        const lastTransportProviderId = lastTransportProvider ? lastTransportProvider.id : -2;
        const newTransportProvider = { ...defaultTransportProvider };
        newTransportProvider.id = lastTransportProviderId + 1;
        transportOrder.value.push(newTransportProvider);
      };
      const removeTransportProvider = (tpId: number) => {
        transportOrder.value = transportOrder.value.filter((tp) => tp.id !== tpId);
      };
      if (transportOrder.value.length === 0) {
        addTransportProvider();
      }

      const isFull = computed(() => {
        return !!(
          sandProviderId.value &&
          sandOrder.value &&
          sandOrder.value.every((so) => so.amount >= 0) &&
          sandOrder.value.every((so) => so.sandType) &&
          transportProviders.value &&
          transportProviders.value?.data.every((tp) => tp.amount >= 0) &&
          transportProviders.value?.data.every((tp) => tp.name)
        );
      });

      const showModal = ref(false);
      const toggleModal = useToggle(showModal);
      const save = async () => {
        console.log(sandProviderId.value, sandOrder.value, transportProviders.value.data);
        console.log({
          sandProviderId: sandProviderId.value,
          sandOrder: sandOrder.value,
        });
        // toggleModal(true);
      };
      // const confirm = async () => {
      //   pN.value = {
      //     sandProvider: sandProvider.value,
      //     sandOrder: sandOrder.value,
      //     transportProviders: transportProviders.value,
      //   };

      //   toggleModal(false);
      //   store.dispatch('saveProviderNotification', pN.value);
      //   router.push('/notificaciones-a-proveedores');
      // };

      const toCapitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      return {
        sandProviderId,
        sandOrder,
        transportProviders,
        addSandOrder,
        removeSandOrder,
        addTransportProvider,
        removeTransportProvider,
        save,
        showModal,
        toggleModal,
        isFull,
        confirm,
        sandProviders,
        sP_end,
        toCapitalize,
        s_end,
        sandTypes,
        tP_end,
        transportOrder,
      };
    },
  });
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
