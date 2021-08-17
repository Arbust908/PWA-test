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
        <FieldGroup class="max-w-2xl">
          <FieldSelect
            class="col-span-6"
            fieldName="client"
            title="Cliente"
            placeholder="Selecciona cliente"
            endpoint="/company"
            :data="companyClientId"
            @update:data="companyClientId = $event"
          />
          <FieldSelect
            class="col-span-6"
            fieldName="pit"
            title="Pozo"
            placeholder="Selecciona pozo"
            endpoint="/pit"
            :data="pitId"
            @update:data="pitId = $event"
          />
        </FieldGroup>
        <FieldGroup class="max-w-xl">
          <FieldLegend>Arena</FieldLegend>
          <FieldSelect
            class="col-span-8"
            fieldName="sandProvider"
            title="Proveedor"
            placeholder="Selecciona proveedor"
            endpoint="/sandProvider"
            :data="sandProviderId"
            @update:data="sandProviderId = $event"
          />
          <template v-for="(order, orderKey) in sandOrder" :key="orderKey">
            <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full" />
            <FieldSelect
              :title="orderKey === 0 ? 'Tipo' : ''"
              class="col-span-10"
              fieldName="sandType"
              placeholder="Seleccciona Tipo de Arena"
              endpoint="/sand"
              enpointKey="type"
              :data="order.sandTypeId"
              @update:data="order.sandTypeId = $event"
            />
            <div
              v-if="orderKey !== 0"
              class="col-span-2 flex justify-end items-end"
            >
              <CircularBtn
                class="btn__delete"
                size="sm"
                @click="removeOrder(order.id)"
              >
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
            <!-- TODO: Input con Frente o Fondo fijo ;D -->
            <label class="col-span-6" for="sandQuantity">
              <span>Cantidad</span>
              <div class="mt-1 flex rounded shadow-sm">
                <input
                  v-model="order.amount"
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
            <FieldInput
              class="col-span-6"
              fieldName="sandBoxId"
              placeholder="Ingrear ID de caja"
              title="ID de caja"
              mask="X*"
              :data="order.boxId"
              @update:data="order.boxId = $event"
            />
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
        </FieldGroup>
        <FieldGroup>
          <FieldLegend>Transporte</FieldLegend>
          <FieldSelect
            class="col-span-full"
            fieldName="transportProvider"
            title="Proveedor"
            placeholder="Selecciona proveedor"
            endpoint="/transportProvider"
            :data="transportProviderId"
            @update:data="transportProviderId = $event"
          />
          <!-- <FieldInput
            class="col-span-6"
            fieldName="transportId"
            placeholder="Patente del Transporte"
            title="Patente"
            mask="X*"
            :data="transportProvider.transportId"
            @update:data="transportProvider.transportId = $event"
          />
          <FieldInput
            class="col-span-6"
            fieldName="quantityBoxes"
            placeholder="Cantidad de cajas"
            title="Cantidad de cajas"
            mask="##"
            :data="transportProvider.boxQuantity"
            @update:data="transportProvider.boxQuantity = Number($event)"
          />
          <FieldInput
            class="col-span-full"
            fieldName="transportDescription"
            placeholder="Observaciones..."
            title="Observaciones"
            mask="X*"
            :data="transportProvider.observation"
            @update:data="transportProvider.observation = $event"
          /> -->
        </FieldGroup>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <NoneBtn @click.prevent="$router.push('/orden-de-pedido')">
          Cancelar
        </NoneBtn>
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
  import {
    ref,
    Ref,
    reactive,
    computed,
    ComputedRef,
    watch,
    watchEffect,
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useActions } from 'vuex-composition-helpers';

  import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import {
    Sand,
    SandOrder,
    SandProvider,
    PurchaseOrder,
    TransportProvider,
  } from '@/interfaces/sandflow';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      NoneBtn,
      BookmarkIcon,
      TrashIcon,
      PlusIcon,
      CircularBtn,
      PrimaryBtn,
      FieldGroup,
      FieldLegend,
      FieldInput,
      FieldSelect,
    },
    setup() {
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      // >> Init
      // :: Proveedores de Sand
      const sandProviders = ref([] as Array<SandProvider>);
      const { data: sandProvidersData } = useAxios('/sandProvider', instance);
      watch(sandProvidersData, (sPData, prevCount) => {
        if (sPData && sPData.data) {
          sandProviders.value = sPData.data;
        }
      });
      const sandProviderId: Ref<number> = ref(-1);
      const companyClientId: Ref<number> = ref(-1);
      const pitId: Ref<number> = ref(-1);
      // >> Proveedores de Sand
      // :: Ordenes de Sand
      const sandOrder: Ref<Array<any>> = ref([
        {
          id: 0,
          sandTypeId: -1,
          amount: null,
          boxId: '',
        },
      ]);
      // :: Ordenes de Sand
      const sandOrders = ref([] as Array<SandOrder>);
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
          sandTypeId: '',
          amount: null,
          boxId: '',
        });
      };
      // :: TransportProvider
      const transportProviders = ref([]);
      const { data: tPData } = useAxios('/transportProvider', instance);
      watch(tPData, (tPData, prevCount) => {
        if (tPData && tPData.data) {
          transportProviders.value = tPData.data;
        }
      });
      const transportProviderId: Ref<number> = ref(-1);
      const transportProvider: TransportProvider = reactive({
        id: 1,
        name: '',
        transportId: '',
        boxQuantity: null,
        observation: '',
        amount: null,
      });
      // >> TransportProvider
      const isFull: ComputedRef<boolean> = computed(() => {
        return !!(
          transportProviderId.value > -1 &&
          // transportProvider.transportId &&
          // transportProvider.boxQuantity &&
          // transportProvider.boxQuantity >= 0 &&
          sandProviderId.value > -1 &&
          sandOrder.value.length > 0 &&
          sandOrder.value.every((sO: SandOrder) => sO.amount > 0) &&
          sandOrder.value.every((sO: SandOrder) => sO.type !== '')
        );
      });
      const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
      const save = (): void => {
        if (isFull.value) {
          const purchaseOrder: PurchaseOrder = {
            sandProviderId: sandProviderId.value,
            transportProviderId: transportProviderId.value,
          };
          console.log(purchaseOrder);
          const { data: pODone } = useAxios(
            '/purchaseOrder',
            { method: 'POST', data: purchaseOrder },
            instance
          );
          const sOisDone = ref([]);
          watch(pODone, (newVal, _) => {
            if (newVal && newVal.data) {
              console.log(newVal.data);
              console.log(sandOrder.value);
              sandOrder.value.map((sO: SandOrder) => {
                console.log(sO);
                sO.purchaseOrderId = newVal.data.id;
                const { data: sODone } = useAxios(
                  '/sandOrder',
                  { method: 'POST', data: sO },
                  instance
                );
                watch(sODone, (newVal, _) => {
                  if (newVal && newVal.data) {
                    sOisDone.value.push(newVal.data);
                  }
                });
              });
            }
          });
          watchEffect(() => {
            if (sOisDone.value.length >= sandOrder.value.length) {
              const ordenDePedido = pODone.value.data;
              const pedidoDeArena = sOisDone.value;
              ordenDePedido.sandOrders = pedidoDeArena;
              savePurchaseOrder(ordenDePedido);
              router.push('/orden-de-pedido');
            }
          });
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
        companyClientId,
        pitId,
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
