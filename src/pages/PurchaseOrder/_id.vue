<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Orden de Pedido
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-12 text-xl">Arena</h2>
          <label class="col-span-12" for="sandProvider">
            <span>Proveedor</span>
            <select
              id="sandProvider"
              v-model="sandProviderId"
              class="input"
              name="sandProvider"
            >
              <option selected disabled value="-1">
                Seleccciona Proveedor de Arena
              </option>
              <option
                v-for="sP in sandProviders"
                :key="sP.id + sP.name"
                :value="sP.id"
              >
                {{ sP.name }}
              </option>
            </select>
          </label>
          <template v-for="(order, orderKey) in sandOrder" :key="orderKey">
            <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label class="col-span-10" for="sandType">
              <span>Tipo</span>
              <select
                id="sandType"
                v-model="order.sandTypeId"
                class="input"
                name="sandType"
              >
                <option selected disabled value="">
                  Seleccciona Tipo de Arena
                </option>
                <option
                  v-for="sT in sandTypes"
                  :key="sT.id + sT.type"
                  :value="sT.id"
                >
                  {{ sT.type }}
                </option>
              </select>
            </label>
            <div class="col-span-2 flex justify-end items-end">
              <CircularBtn
                class="btn__delete"
                size="sm"
                @click="removeOrder(order.id)"
              >
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>

            <label class="col-span-6" for="sandQuantity">
              <span>Cantidad</span>
              <div class="mt-1 flex rounded shadow-sm">
                <input
                  v-model="order.quantity"
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
                    border-gray-300
                    sm:text-sm
                  "
                  placeholder="Cantidad de Arena"
                  list="sandQuantity"
                />
                <datalist id="sandQuantity">
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
                    border border-gray-300
                    bg-gray-50
                    text-gray-500
                    sm:text-sm
                  "
                  title="Peso en Toneladas"
                >
                  t
                </span>
              </div>
            </label>

            <label class="col-span-6" for="sandBoxId">
              <span>ID Caja</span>
              <input
                v-model="order.boxId"
                class="input"
                type="text"
                name="sandBoxId"
                list="sandBoxId"
                placeholder="Ingrear ID de caja"
              />
              <datalist id="sandBoxId">
                <option value="#123">#123</option>
                <option value="#856">#856</option>
              </datalist>
            </label>
          </template>
          <button
            class="col-span-full mt-1 flex items-center"
            @click.prevent="addOrder"
          >
            <CircularBtn class="btn__add" size="xs">
              <PlusIcon class="w-4 h-4" />
            </CircularBtn>
            <span class="font-bold text"> Agregar </span>
          </button>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Transporte</h2>
          <label class="col-span-full" for="transportProvider">
            <span>Proveedor</span>
            <select
              id="transportProvider"
              v-model="transportProviderId"
              class="input"
              name="transportProvider"
            >
              <option selected disabled value="-1">
                Proveedor de Transporte
              </option>
              <option
                v-for="tP in transportProviders"
                :key="tP.id + tP.name"
                :value="tP.id"
              >
                {{ tP.name }}
              </option>
            </select>
          </label>

          <label class="col-span-6" for="transportId">
            <span>Patente</span>
            <input
              v-model="transportProvider.transportId"
              class="input"
              type="text"
              name="transportId"
              list="transportId"
              placeholder="Patente del Transporte"
            />
            <datalist id="transportId">
              <option value="AC 245 WC">AC 245 WC</option>
              <option value="CC 345 ER">CC 345 ER</option>
            </datalist>
          </label>

          <label class="col-span-6" for="quantityBoxes">
            <span>Cantidad de cajas</span>
            <input
              v-model="transportProvider.boxQuantity"
              class="input"
              type="number"
              name="quantityBoxes"
              list="quantityBoxes"
              placeholder="Cantidad de cajas"
            />
            <datalist id="quantityBoxes">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </datalist>
          </label>

          <label class="col-span-full" for="transportDescription">
            <span>Observaciones</span>
            <input
              v-model="transportProvider.observation"
              class="input"
              type="text"
              name="transportDescription"
              list="transportDescription"
              placeholder="Chasis chico"
            />
            <datalist id="transportDescription">
              <option value="Chasis Grande">Chasis Grande</option>
              <option value="Chasis Chico">Chasis Chico</option>
            </datalist>
          </label>
        </fieldset>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="$router.push('/orden-de-pedido')">
          Cancelar
        </button>
        <PrimaryBtn
          type="submit"
          size="sm"
          class="p-4"
          :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
          :disabled="!isFull"
          @click.prevent="isFull && save()"
        >
          Crear Orden
        </PrimaryBtn>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, reactive, computed, ComputedRef, toRaw, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useState, useActions } from 'vuex-composition-helpers';

  import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import {
    PurchaseOrder,
    SandProvider,
    SandOrder,
    TransportProvider,
  } from '@/interfaces/PurchaseOrder.ts';
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import { SandProvider } from '@/interfaces/SandProvider';
  import { Sand, SandOrder } from '@/interfaces/sandflow.Types';
  const api = import.meta.env.VITE_API_URL;

  export default {
    components: {
      Layout,
      GhostBtn,
      BookmarkIcon,
      TrashIcon,
      PlusIcon,
      CircularBtn,
      PrimaryBtn,
    },
    setup() {
      // :: Init
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const instance = axios.create({
        baseURL: api,
      });

      const allPurchaseOrders = store.state.purchaseOrder.all;
      console.log(allPurchaseOrders);
      const currentPurchaseOrder = allPurchaseOrders.find((pO) => {
        console.log(pO.id);
        console.log(route.params.id);
        return pO.id == route.params.id;
      });
      console.log(currentPurchaseOrder);
      const {
        sandProviderId,
        sandOrders: sandOrder,
        transportProviderId,
        transportProvider,
      } = currentPurchaseOrder;
      // >> Init
      // :: Proveedores de Sand
      const sandProviders = ref([] as Array<SandProvider>);
      const { data: sandProvidersData } = useAxios('/sandProvider', instance);
      watch(sandProvidersData, (sPData, prevCount) => {
        if (sPData && sPData.data) {
          sandProviders.value = sPData.data;
        }
      });
      // const sandProviderId: Ref<number> = ref(-1);
      // >> Proveedores de Sand

      // :: Ordenes de Sand
      // const sandOrder: Ref<Array<any>> = ref([
      //   {
      //     id: 0,
      //     sandType: {},
      //     sandTypeId: '',
      //     quantity: null,
      //     boxId: '',
      //   },
      // ]);

      // :: Ordenes de Sand
      const sandOrders = ref([] as Array<SandOrder>);
      const { data: sandOrdersData } = useAxios('/sandOrder', instance);
      watch(sandOrdersData, (sOData, prevCount) => {
        if (sOData && sOData.data) {
          sandOrders.value = sOData.data;
        }
      });
      // >> Ordenes de Sand

      // :: Tipos de Sand
      const sandTypes = ref([] as Array<Sand>);
      const { data: sandTypesData } = useAxios('/sand', instance);
      watch(sandTypesData, (sOData, prevCount) => {
        if (sOData && sOData.data) {
          sandTypes.value = sOData.data;
        }
      });

      // >> Tipos de Sand

      const removeOrder = (id: number): void => {
        sandOrder.value = sandOrder.value.filter(
          (sandOrder: SandOrder) => sandOrder.id !== id
        );
      };
      const addOrder = (): void => {
        const lastSandOrder = sandOrder.value[sandOrder.value.length - 1];
        const newId = lastSandOrder.id + 1;
        sandOrder.value.push({
          id: newId,
          type: {},
          sandTypeId: '',
          quantity: null,
          boxId: '',
        });
      };

      // :: TransportProvider
      const transportProviders = ref([] as Array<Sand>);
      const { data: tPData } = useAxios('/transportProvider', instance);
      watch(tPData, (tPData, prevCount) => {
        if (tPData && tPData.data) {
          transportProviders.value = tPData.data;
        }
      });

      // const transportProviderId: Ref<number> = ref(-1);
      // const transportProvider: TransportProvider = reactive({
      //   id: 1,
      //   name: '',
      //   transportId: '',
      //   boxQuantity: null,
      //   observation: '',
      // });
      // >> TransportProvider

      const isFull: ComputedRef<boolean> = computed(() => {
        return !!(
          transportProviderId.value > -1 &&
          transportProvider.transportId &&
          transportProvider.boxQuantity &&
          transportProvider.boxQuantity >= 0 &&
          sandProviderId.value > -1 &&
          sandOrder.value.length > 0 &&
          sandOrder.value.every((sO: SandOrder) => sO.quantity > 0) &&
          sandOrder.value.every((sO: SandOrder) => sO.type !== '')
        );
      });
      const getTPbyId = (id: number): TransportProvider => {
        return transportProviders.value.find((tp) => tp.id === id);
      };
      const getSPbyId = (id: number): SandProvider => {
        return sandProviders.value.find((sp) => sp.id === id);
      };

      const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
      const save = (): void => {
        if (isFull.value) {
          const newTP = getTPbyId(transportProviderId.value);
          const trueTP = {
            ...transportProvider,
            id: newTP.id,
            name: newTP.name,
          };
          const purchaseOrder = {
            sandProviderId: sandProviderId.value,
            sandProvider: getSPbyId(sandProviderId.value),
            sandOrders: [...sandOrder.value],
            transportProviderId: transportProviderId.value,
            transportProvider: trueTP,
          } as PurchaseOrder;
          console.log(purchaseOrder);
          savePurchaseOrder(purchaseOrder);
          router.push('/orden-de-pedido');
        }
      };
      return {
        sandProviderId,
        sandOrder,
        removeOrder,
        addOrder,
        transportProvider,
        isFull,
        save,
        sandOrders,
        sandProviders,
        sandTypes,
        transportProviders,
        transportProviderId,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 mt-1 flex shadow-sm;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
  label {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  // Quizas hay que armar algo externo para los estilos de boton
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
</style>
