<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-second-900 text-xl self-start mb-3 md:mb-0">
        Notificación a proveedores
      </h1>
    </header>
    <section class="bg-second-0 rounded-md shadow-sm">
      <!-- <FieldWithSides
              class="col-span-6"
              title="Cantidad"
              fieldName="sandQuantity"
              :data="sO.amount"
              @update:data="sO.amount = $event"
              :post="{ value: 't', title: 'Peso en Toneladas' }"
            /> -->
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <SandProviderPack
          :sandProviders="sandProviderIds"
          @update:sandProviders="sandProviderIds = $event"
        />
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Transporte</h2>
          <template v-for="(tO, tOKey) in transportOrder" :key="tOKey">
            <hr v-if="tOKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label
              :class="tOKey !== 0 ? 'col-span-10' : 'col-span-full'"
              :for="'transportProvider' + tO.id"
            >
              <span>Proveedor</span>
              <select
                :id="'transportProvider' + tO.id"
                v-model="tO.transportProviderId"
                class="input"
                :name="'transportProvider' + tO.id"
                @change="fillTransportType(tO.id)"
              >
                <option selected disabled value="-1">
                  Proveedor de Transporte
                </option>
                <option
                  v-for="(tP, tPKey) in transportProviders"
                  :key="tPKey"
                  :value="tP.id"
                >
                  {{ tP.name }}
                </option>
              </select>
            </label>
            <div
              v-if="tOKey !== 0"
              class="col-span-2 flex justify-end items-end"
            >
              <CircularBtn
                class="btn__delete"
                size="sm"
                @click="removeTransportProvider(tO.id)"
              >
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
                placeholder="Cantidad de camiones"
              />
            </label>
            <label class="col-span-full" :for="'transportObservations' + tO.id">
              <span>Observaciones</span>
              <input
                :id="'transportObservations' + tO.id"
                v-model="tO.observation"
                class="input"
                type="text"
                :name="'transportObservations' + tO.id"
                placeholder="Observaciones"
              />
            </label>
          </template>
          <div class="col-span-full mt-1 pb-4 mb-4">
            <button
              class="flex items-center p-1"
              @click.prevent="addTransportProvider"
            >
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold text"> Agregar transporte </span>
            </button>
          </div>
        </fieldset>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <NoneBtn @click.prevent="$router.push('/notificaciones-a-proveedores')">
          Cancelar
        </NoneBtn>
        <PrimaryBtn
          type="submit"
          size="sm"
          class="p-4"
          :class="
            isSandFull || isTransportFull
              ? null
              : 'opacity-50 cursor-not-allowed'
          "
          :disabled="!(isSandFull || isTransportFull)"
          @click.prevent="(isSandFull || isTransportFull) && save()"
        >
          Finalizar
        </PrimaryBtn>
      </footer>
    </section>
    <Modal
      title="Notificación a Proveedores"
      type="off"
      :open="showModal"
      @close="toggleModal"
    >
      <template #body>
        <div class="divide-y text-left">
          <section v-if="isSandFull" class="py-2 space-y-2">
            <h3 class="text-xl">Arena</h3>
            <article
              class="text-sm text-indigo-500"
              v-for="spi in sandProviderIds"
              :key="spi.innerId"
            >
              <header class="flex items-center gap-2">
                <BellIcon class="w-4 h-4" />
                <span>Notificación para {{ getSPName(spi.id) }}</span>
              </header>
              <ul class="list-disc pl-6 ml-2">
                <li v-for="sOli in spi.SandOrders" :key="sOli.id">
                  Tipo: {{ getSTName(sOli.sandTypeId) }}, {{ sOli.amount }}t
                </li>
              </ul>
            </article>
          </section>
          <section v-if="isTransportFull" class="py-2 space-y-2">
            <h3 class="text-xl">Transporte</h3>
            <template v-for="tPNot in transportOrder" :key="tPNot.id">
              <article class="text-sm text-indigo-500">
                <header class="flex items-center gap-2">
                  <BellIcon class="w-4 h-4" />
                  <span>Notificación para {{ tPNot.name }}</span>
                </header>
                <ul class="list-disc pl-6 ml-2">
                  <li v-for="tPNot in transportOrder" :key="tPNot.id">
                    Cantidad de camiones: {{ tPNot.amount }},
                    {{ tPNot.observation }}
                  </li>
                </ul>
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
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-red-500
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
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-main-500
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
  import {
    ref,
    Ref,
    computed,
    defineComponent,
    defineAsyncComponent,
    watch,
    watchEffect,
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  import { TrashIcon } from '@heroicons/vue/outline';
  import { PlusIcon, BellIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import {
    ProviderNotification,
    SandOrder,
    TransportProvider,
    SandProvider,
    Sand,
  } from '@/interfaces/sandflow';
  import { useToggle } from '@vueuse/core';
  //
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
  import SandProviderPack from '@/components/notifications/sandProviderPack.vue';
  import '@/assets/button.scss';

  const Modal = defineAsyncComponent(
    () => import('@/components/modal/General.vue')
  );

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default defineComponent({
    components: {
      BellIcon,
      CircularBtn,
      NoneBtn,
      Layout,
      Modal,
      PlusIcon,
      PrimaryBtn,
      TrashIcon,
      FieldGroup,
      FieldInput,
      FieldLegend,
      FieldSelect,
      FieldWithSides,
      SandProviderPack,
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const pN: Ref<ProviderNotification> = ref({} as ProviderNotification);

      const sandProviders = ref([] as Array<Sand>);
      const { data: sPData } = useAxios('/sandProvider', instance);
      watch(sPData, (sPData) => {
        if (sPData && sPData.data) {
          sandProviders.value = sPData.data;
        }
      });
      const getSPName = (spId: number) => {
        const sp = sandProviders.value.find((sp) => {
          return sp.id == spId;
        });
        return sp ? sp.name : '';
      };

      const sandTypes = ref([] as Array<Sand>);
      const { data: sData } = useAxios('/sand', instance);
      watch(sData, (sData) => {
        if (sData && sData.data) {
          sandTypes.value = sData.data;
        }
      });

      const getSTName = (stId: number) => {
        const st = sandTypes.value.find((st) => {
          return st.id == stId;
        });
        return st ? st.type : '';
      };

      interface sandProviderId {
        innerId: number;
        id?: number;
        sandOrders?: Array<SandOrder>;
      }
      const sandProviderIds: Ref<Array<sandProviderId>> = ref([]);

      const sandOrder: Ref<Array<SandOrder>> = ref([]);
      const fillSandType = (soId) => {
        const currSO = sandOrder.value.find((so) => so.id === soId);
        const currST = sandTypes.value.find(
          (st) => st.id === currSO?.sandTypeId
        );
        console.log(currST);
        currSO.sandType = currST;
      };

      const transportProviders = ref([]);
      const { data: tPData } = useAxios('/transportProvider', instance);
      watch(tPData, (tPData) => {
        if (tPData && tPData.data) {
          transportProviders.value = tPData.data;
        }
      });
      const transportOrder: Ref<Array<TransportProvider>> = ref([]);
      const fillTransportType = (tOId) => {
        const currTO = transportOrder.value.find((tO) => tO.id === tOId);
        const currTP = transportProviders.value.find((tP) => {
          return tP.id === currTO?.transportProviderId;
        });
        currTO.name = currTP.name;
      };

      const defaultTransportProvider: TransportProvider = {
        transportProviderId: -1,
        name: '',
        amount: null,
        observation: '',
      };
      const addTransportProvider = () => {
        const lastTransportProvider =
          transportOrder.value[transportOrder.value.length - 1];
        const lastTransportProviderId = lastTransportProvider
          ? lastTransportProvider.id
          : -2;
        const newTransportProvider = { ...defaultTransportProvider };
        newTransportProvider.id = lastTransportProviderId + 1;
        transportOrder.value.push(newTransportProvider);
      };
      const removeTransportProvider = (tpId: number) => {
        transportOrder.value = transportOrder.value.filter(
          (tp) => tp.id !== tpId
        );
      };
      if (transportOrder.value.length === 0) {
        addTransportProvider();
      }

      const isSandFull = computed(() => {
        return !!(
          sandProviderIds.value.length > 0 &&
          sandOrder.value &&
          sandOrder.value.every((so) => so.amount && so.amount > 0) &&
          sandOrder.value.every((so) => so.sandType && so.sandType.id > 0)
        );
      });

      const isTransportFull = computed(() => {
        return !!(
          transportOrder.value &&
          transportOrder.value.every((to) => to.amount && to.amount > 0)
        );
      });

      const showModal = ref(false);
      const toggleModal = useToggle(showModal);
      const save = async () => {
        console.log('jump');
        toggleModal(true);
      };
      const confirm = async () => {
        pN.value = {
          sandProviderIds: Number(sandProviderIds.value[0].id),
          sandOrderId: sandProviderIds.value[0].sandOrders[0].id,
          transportProviderId: Number(transportOrder.value[0].id),
        };
        const { data } = useAxios(
          '/ProviderNotification',
          { method: 'POST', data: pN.value },
          instance
        );
        toggleModal(false);
        store.dispatch('saveProviderNotification', pN.value);
        router.push('/notificaciones-a-proveedores');
      };

      const toCapitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      return {
        // sandProviderId,
        sandOrder,
        transportProviders,
        // addSandOrder,
        // removeSandOrder,
        addTransportProvider,
        removeTransportProvider,
        fillTransportType,
        save,
        showModal,
        toggleModal,
        isSandFull,
        isTransportFull,
        confirm,
        sandProviders,
        toCapitalize,
        sandTypes,
        transportOrder,
        // sandProvider,
        fillSandType,
        sandProviderIds,
        getSPName,
        getSTName,
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
