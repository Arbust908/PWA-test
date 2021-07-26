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
            <input
              id="sandProvider"
              v-model="sandProvider"
              class="input"
              type="text"
              name="sandProvider"
              list="sandProvider-list"
              placeholder="Proveedor de Arena"
            />
            <datalist id="sandProvider-list">
              <option value="San Luis">San Luis</option>
              <option value="San Lucio">San Lucio</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>
          <template v-for="(sO, Key) in sandOrder" :key="Key">
            <hr v-if="Key !== 0" class="mt-4 mb-2 col-span-full" />
            <label :class="sandOrder.length > 1 ? 'col-span-5' : 'col-span-6'" for="sandType">
              <span>Tipo</span>
              <input
                v-model="sO.sandType"
                class="input"
                type="text"
                name="sandType"
                list="sandType-list"
                placeholder="Tipo de Arena"
              />
              <datalist id="sandType-list">
                <option value="30/40"></option>
                <option value="50/100"></option>
              </datalist>
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
          <template v-for="(tP, tPKey) in transportProviders" :key="tPKey">
            <hr v-if="tPKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label
              :class="transportProviders.length > 1 ? 'col-span-10' : 'col-span-full'"
              :for="'transportProvider' + tP.id"
            >
              <span>Proveedor</span>
              <input
                :id="'transportProvider' + tP.id"
                v-model="tP.name"
                class="input"
                type="text"
                :name="'transportProvider' + tP.id"
                :list="'transportProvider' + tP.id + '-list'"
                placeholder="Proveedor de Transpore"
              />
              <datalist :id="'transportProvider' + tP.id + '-list'">
                <option value="San Luis">San Luis</option>
                <option value="Orange">Orange</option>
              </datalist>
            </label>
            <div v-if="transportProviders.length > 1" class="col-span-2 flex justify-end items-end">
              <CircularBtn class="btn__delete" size="sm" @click="removeTransportProvider(tP.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
            <label class="col-span-full" :for="'transportAmount' + tP.id">
              <span>Cantidad de camiones</span>
              <input
                :id="'transportAmount' + tP.id"
                v-model="tP.amount"
                class="input"
                type="text"
                :name="'transportAmount' + tP.id"
                :list="'transportAmount' + tP.id + '-list'"
                placeholder="Cantidad de camiones"
              />
              <datalist :id="'transportAmount' + tP.id + '-list'">
                <option value="1">1 Camion</option>
                <option value="2">2 Camiones</option>
                <option value="4">4 Camiones</option>
                <option value="6">6 Camiones</option>
                <option value="10">10 Camiones</option>
              </datalist>
            </label>

            <label class="col-span-full" :for="'transportObservations' + tP.id">
              <span>Observaciones</span>
              <input
                :id="'transportObservations' + tP.id"
                v-model.number="tP.observation"
                class="input"
                type="text"
                :name="'transportObservations' + tP.id"
                :list="'transportObservations' + tP.id + '-list'"
                placeholder="Observaciones"
              />
              <datalist :id="'transportObservations' + tP.id + '-list'">
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

  import axios from 'axios'
  import { useAxios } from '@vueuse/integrations/useAxios'
  const api = 'https://sandflow-qa.bitpatagonia.com/api';

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
    },
    setup() {
      const router = useRouter();
      const store = useStore();

      const pN: Ref<ProviderNotification> = ref({} as ProviderNotification);

      const sandProvider: Ref<string> = ref('');
      const sandOrder: Ref<Array<SandOrder>> = ref([]);
      const transportProviders: Ref<Array<TransportProvider>> = ref([]);

      const defaultSandOrder: SandOrder = {
        id: 0,
        sandType: null,
        amount: 0,
      };
      const addSandOrder = () => {
        const lastSandOrder = sandOrder.value[sandOrder.value.length - 1];
        const lastSandOrderId = lastSandOrder ? lastSandOrder.id : 0;
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
      };
      const addTransportProvider = () => {
        const lastTransportProvider = transportProviders.value[transportProviders.value.length - 1];
        const lastTransportProviderId = lastTransportProvider ? lastTransportProvider.id : 0;
        const newTransportProvider = { ...defaultTransportProvider };
        newTransportProvider.id = lastTransportProviderId + 1;
        transportProviders.value.push(newTransportProvider);
      };
      const removeTransportProvider = (tpId: number) => {
        transportProviders.value = transportProviders.value.filter((tp) => tp.id !== tpId);
      };
      if (transportProviders.value.length === 0) {
        addTransportProvider();
      }

      const isFull = computed(() => {
        return !!(
          sandProvider.value &&
          sandOrder.value &&
          sandOrder.value.every((so) => so.amount >= 0) &&
          sandOrder.value.every((so) => so.sandType) &&
          transportProviders.value &&
          transportProviders.value.every((tp) => tp.amount >= 0) &&
          transportProviders.value.every((tp) => tp.name)
        );
      });

      const showModal = ref(false);
      const toggleModal = useToggle(showModal);
      const save = async () => {
        toggleModal(true);
      };
      const confirm = async () => {
        pN.value = {
          sandProvider: sandProvider.value,
          sandOrder: sandOrder.value,
          transportProviders: transportProviders.value,
        };
        const newPN = await axios
          .post(`${api}/sand`, pN.value)
          .catch((err) => {
            console.log(err);
            return false;
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              return res.data;
            }
            return {};
          })
          .finally(() => {});
        toggleModal(false);
        store.dispatch('saveProviderNotification', pN.value);
        router.push('/notificaciones-a-proveedores');
      };

      return {
        sandProvider,
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
