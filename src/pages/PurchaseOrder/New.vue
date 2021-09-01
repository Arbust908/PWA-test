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
          <ClientPitCombo
            :clientId="companyClientId"
            :pitId="pitId"
            @update:clientId="companyClientId = $event"
            @update:pitId="pitId = $event"
          />
        </FieldGroup>
        <FieldLegend>Arena</FieldLegend>
        <div
          v-for="(providerId, sandProvidersKey) in sandProvidersIds"
          :key="sandProvidersKey"
          class="border-b pb-6"
        >
          <FieldGroup class="grid border-none max-w-full">
            <FieldSelect
              class="col-span-4"
              fieldName="sandProvider"
              title="Proveedor"
              placeholder="Selecciona proveedor"
              endpoint="/sandProvider"
              :data="providerId.id"
              @update:data="providerId.id = $event"
            />
          </FieldGroup>
          <FieldGroup class="grid items-center max-w-full">
            <template
              v-for="(order, orderKey) in providerId.sandOrders"
              :key="orderKey"
              class="border-none"
            >
              <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full" />
              <FieldSelect
                :title="orderKey === 0 ? 'Tipo' : ''"
                class="col-span-4"
                fieldName="sandType"
                placeholder="Seleccciona Tipo de Arena"
                endpoint="/sand"
                endpointKey="type"
                :data="order.sandTypeId"
                @update:data="order.sandTypeId = $event"
              />
              <!-- TODO: Input con Frente o Fondo fijo ;D -->
              <label class="col-span-3" for="sandQuantity">
                <span v-if="orderKey === 0">Cantidad</span>
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
                :title="orderKey === 0 ? 'ID de caja' : ''"
                class="col-span-3"
                fieldName="sandBoxId"
                placeholder="Ingresar ID de caja"
                :data="order.boxId"
                @update:data="order.boxId = $event"
              />
              <Icon
                v-if="providerId.sandOrders.length > 1"
                icon="Trash"
                type="outline"
                class="w-5 mt-5 h-5 items-center cursor-pointer"
                @click="removeOrder(order.id, providerId.innerId)"
              />
              <Icon
                icon="Plus"
                v-if="providerId.sandOrders.length - 1 == orderKey"
                type="outline"
                class="icon w-5 h-5 mt-5 items-center cursor-pointer"
                @click.prevent="addOrder(providerId.innerId)"
              />
            </template>
            <div class="flex items-center col-span-12">
              <div
                class="icon-button"
                v-if="sandProvidersIds.length > 1"
                @click.prevent="removeSandProvider(providerId.innerId)"
              >
                <Icon
                  icon="Trash"
                  type="outline"
                  class="w-5 h-5 items-center"
                />
                Borrar proveedor
              </div>
              <div
                :class="[
                  'icon-button',
                  sandProvidersIds.length - 1 !== sandProvidersKey
                    ? ''
                    : 'ml-3',
                ]"
                v-if="sandProvidersIds.length - 1 == sandProvidersKey"
                @click.prevent="addSandProvider"
              >
                <Icon
                  icon="Plus"
                  type="outline"
                  class="icon w-5 h-5 items-center"
                />
                Agregar proveedor
              </div>
            </div>
          </FieldGroup>
        </div>
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
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
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
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      NoneBtn,
      CircularBtn,
      PrimaryBtn,
      FieldGroup,
      FieldLegend,
      FieldInput,
      FieldSelect,
      ClientPitCombo,
      Icon,
    },
    setup() {
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      // >> Init
      // :: Proveedores de Sand
      const sandProvidersIds = ref([
        {
          innerId: 0,
          id: -1,
          sandOrders: [
            {
              id: 0,
              sandTypeId: -1,
              amount: null,
              boxId: '',
            },
          ],
        },
      ] as Array<Object>);

      const addSandProvider = () => {
        const lastSPIndex = sandProvidersIds.value.length - 1;
        const lastSP = sandProvidersIds.value[lastSPIndex];
        const lastIndex = lastSP.innerId;
        const newInnerId = lastIndex >= 0 ? lastIndex + 1 : 0;
        sandProvidersIds.value.push({
          innerId: newInnerId,
          id: -1,
          sandOrders: [
            {
              id: 0,
              sandTypeId: -1,
              amount: null,
              boxId: '',
            },
          ],
        });
      };

      const removeSandProvider = (providerId: number) => {
        sandProvidersIds.value = sandProvidersIds.value.filter(
          (sandProvider: SandProvider) => {
            return sandProvider.innerId !== providerId;
          }
        );
      };

      const sandProviders = ref([] as Array<SandProvider>);
      const { data: sandProvidersData } = useAxios('/sandProvider', instance);
      watch(sandProvidersData, (sPData, prevCount) => {
        if (sPData && sPData.data) {
          sandProviders.value = sPData.data;
        }
      });
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
      const removeOrder = (id: number, providerOrderId): void => {
        const currentSPI = sandProvidersIds.value.find(
          (spi) => spi.innerId === providerOrderId
        );
        currentSPI.sandOrders = currentSPI.sandOrders.filter(
          (order) => order.id !== id
        );
      };
      const addOrder = (providerOrderId: number): void => {
        const currentSPI = sandProvidersIds.value.find(
          (spi) => spi.innerId === providerOrderId
        );
        const sandOrder = currentSPI.sandOrders;
        const lastSandOrder = sandOrder[sandOrder.length - 1];
        const newId = lastSandOrder.id + 1;
        sandOrder.push({
          id: newId,
          sandTypeId: -1,
          amount: null,
          boxId: '',
        });
        console.log(sandProvidersIds.value);
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
        const hasPit = pitId.value >= 0;
        const hasClient = companyClientId.value >= 0;
        const validSandProviderIds =
          sandProvidersIds.value &&
          sandProvidersIds.value.every((spi) => {
            return spi.id >= 0;
          });
        const validSandOrders =
          sandProvidersIds.value &&
          sandProvidersIds.value.every((spi) => {
            return (
              spi.sandOrders &&
              spi.sandOrders.every((so) => {
                return so.sandTypeId >= 0 && so.amount > 0 && so.boxId !== '';
              })
            );
          });
        const hasTransport = transportProviderId.value >= 0;
        return !!(
          hasPit &&
          hasClient &&
          validSandProviderIds &&
          validSandOrders &&
          hasTransport
        );
      });
      // const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
      const save = (): void => {
        console.table({
          companyId: companyClientId.value,
          companyClientId: companyClientId.value,
          pitId: pitId.value,
          sandProviderId: sandProvidersIds.value[0].id,
          transportProviderId: transportProviderId.value,
        });
        if (isFull.value) {
          // Formateamos la orden de pedido
          const purchaseOrder: PurchaseOrder = {
            companyId: companyClientId.value,
            companyClientId: companyClientId.value,
            pitId: pitId.value,
            sandProviderId: sandProvidersIds.value[0].id,
            transportProviderId: transportProviderId.value,
          };
          console.log(purchaseOrder);
          // Creamos via API la orden de pedido
          const { data: pODone } = useAxios(
            '/purchaseOrder',
            { method: 'POST', data: purchaseOrder },
            instance
          );
          const sOisDone = ref([]);
          watch(pODone, (newVal, _) => {
            if (newVal && newVal.data) {
              console.log('PO data', newVal.data);
              console.log('SPIs', sandProvidersIds.value);
              // Recorremos los proveedores de sand
              sandProvidersIds.value.map((spI) => {
                console.log('SPI', spI.sandOrders);
                // Guradamos via api las ordenes de sand
                spI.sandOrders.map((sO: SandOrder) => {
                  console.log('SO', sO);
                  sO.purchaseOrderId = newVal.data.id;
                  sO.sandProviderId = spI.id;
                  const { data: sODone } = useAxios(
                    '/sandOrder',
                    { method: 'POST', data: sO },
                    instance
                  );
                  watch(sODone, async (newVal, _) => {
                    if (newVal && newVal.data) {
                      await sOisDone.value.push(newVal.data);
                      const ordenDePedido = pODone.value.data;
                      const pedidoDeArena = sOisDone.value;
                      ordenDePedido.sandOrders = pedidoDeArena;
                      console.log('salimo');
                      router.push('/orden-de-pedido');
                    }
                  });
                });
              });
            }
          });
        }
      };
      return {
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
        sandProvidersIds,
        addSandProvider,
        removeSandProvider,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .icon-button {
    @apply font-bold flex items-center col-span-12 cursor-pointer;
  }
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
