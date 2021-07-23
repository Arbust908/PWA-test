<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Orden de Pedido - {{ id }}</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-12 text-xl">Arena</legend>
          <label class="col-span-12" for="sandProvider">
            <span>Proveedor</span>
            <input
              v-model="sandProvider.name"
              class="input"
              type="text"
              name="sandProvider"
              list="sandProvider"
              placeholder="Proveedor de Arena"
            />
            <datalist id="sandProvider">
              <option value="San Luis">San Luis</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>
          <template v-for="(order, orderKey) in sandProvider.sandOrders" :key="orderKey">
            <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label class="col-span-10" for="sandType">
              <span>Tipo</span>
              <input
                v-model="order.type"
                class="input"
                type="text"
                name="sandType"
                list="sandType"
                placeholder="arena-#30/40"
              />
              <datalist id="sandType">
                <option value="30/40">Arena #30/40</option>
                <option value="50/100">Arena #30/40</option>
              </datalist>
            </label>
            <div class="col-span-2 flex justify-end items-end">
              <CircularBtn class="btn__delete" size="sm" @click="removeOrder(order.id)">
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
                  placeholder="22"
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
                placeholder="Ingrear ID"
              />
              <datalist id="sandBoxId">
                <option value="#123">#123</option>
                <option value="#856">#856</option>
              </datalist>
            </label>
          </template>
          <button class="col-span-full mt-1 flex items-center" @click.prevent="addOrder">
            <CircularBtn class="btn__add" size="xs">
              <PlusIcon class="w-4 h-4" />
            </CircularBtn>
            <span class="font-bold text"> Agregar </span>
          </button>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-full text-xl">Transporte</legend>
          <label class="col-span-full" for="transportProvider">
            <span>Proveedor</span>
            <input
              v-model="transportProvider.name"
              class="input"
              type="text"
              name="transportProvider"
              list="transportProvider"
              placeholder="Proveedor de Transporte"
            />
            <datalist id="transportProvider">
              <option value="Logistica Rapida">Logistica Rapida</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>

          <label class="col-span-6" for="transportId">
            <span>Patente</span>
            <input
              v-model="transportProvider.transportId"
              class="input"
              type="text"
              name="transportId"
              list="transportId"
              placeholder="AC 245 XX"
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
              placeholder="0"
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
        <button @click.prevent="$router.push('/orden-de-pedido')">Cancelar</button>
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
import { ref, Ref, reactive, computed, ComputedRef, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useState, useActions, useGetters } = createNamespacedHelpers('purchaseOrder');

import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
import { PurchaseOrder, SandProvider, SandOrder, TransportProvider } from '@/interfaces/PurchaseOrder.ts';
import { useStore } from 'vuex';

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
    // Init
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    // ::
    // PurchaseOrder
    const purchaseOrder: PurchaseOrder = store.getters.getPurchaseOrder(id);
    console.log(purchaseOrder);
    // ::
    // SandProvider
    const { sandProvider }: SandProvider = purchaseOrder;
    console.log(sandProvider);
    const removeOrder = (id: number): void => {
      sandProvider.sandOrder = sandProvider.sandOrder.filter((sandOrder: SandOrder) => sandOrder.id !== id);
    };
    const addOrder = (): void => {
      const lastSandOrder = sandProvider.sandOrder[sandProvider.sandOrder.length - 1];
      const newId = lastSandOrder.id + 1;
      sandProvider.sandOrder.push({
        id: newId,
        type: '',
        quantity: null,
        boxId: '',
      });
    };
    const removeEmptySandOrders = (): void => {
      sandProvider.sandOrder = sandProvider.sandOrder
        .filter((sandOrder: SandOrder) => sandOrder.quantity > 0)
        .filter((sandOrder: SandOrder) => sandOrder.type !== '')
        .filter((sandOrder: SandOrder) => sandOrder.boxId !== '');
    };

    // ::
    // TransportProvider
    const { transportProvider }: TransportProvider = purchaseOrder;

    const isSandProviderFull: ComputedRef<boolean> = computed(() => {
      return !!(
        sandProvider.id &&
        sandProvider.name &&
        sandProvider.sandOrder.length &&
        sandProvider.sandOrder.every((sandOrder: SandOrder) => sandOrder.type !== '') &&
        sandProvider.sandOrder.every((sandOrder: SandOrder) => sandOrder.quantity > 0) &&
        sandProvider.sandOrder.every((sandOrder: SandOrder) => sandOrder.boxId !== '')
      );
    });
    const isTransportProviderFull: ComputedRef<boolean> = computed(() => {
      return !!(
        transportProvider.id &&
        transportProvider.name &&
        transportProvider.transportId &&
        transportProvider.boxQuantity
      );
    });
    const isFull: ComputedRef<boolean> = computed(() => {
      return isSandProviderFull.value && isTransportProviderFull.value;
    });
    const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
    const save = (): void => {
      removeEmptySandOrders();
      if (isFull.value) {
        sandProvider.sandOrder = toRaw(sandProvider.sandOrder);
        const purchaseOrder = {
          sandProvider: { ...sandProvider },
          transportProvider: { ...transportProvider },
        } as PurchaseOrder;
        savePurchaseOrder(purchaseOrder);
        router.push('/orden-de-pedido');
      }
    };
    return {
      id,
      sandProvider,
      removeOrder,
      addOrder,
      transportProvider,
      isFull,
      save,
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
