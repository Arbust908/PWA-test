<template>
  <Layout>
    <header class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-900">Ordenes de Pedido</h2>
      <router-link to="/orden-de-pedido/nueva">
        <UiBtn>Crear nueva</UiBtn>
      </router-link>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
            "
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                    title="Numero de Pedido"
                  >
                    N°
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Proveedor de arena
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Estado
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pO, poKey) in PurchaseOrders"
                  :key="pO.id"
                  :class="poKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-gray-900
                    "
                  >
                    {{ pO.id }}
                  </td>
                  <td
                    :class="
                      pO.sandProvider ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{
                      (pO.sandProvider && pO.sandProvider.name) ||
                      'Sin proveedor'
                    }}
                  </td>
                  <td
                    :class="
                      pO.sandOrder ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ pO.sandOrder.amount }}
                  </td>
                  <td
                    :class="
                      pO.transportProvider
                        ? 'text-gray-500'
                        : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{
                      (pO.transportProvider && pO.transportProvider.name) ||
                      'Sin proveedor'
                    }}
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-right text-sm
                      font-medium
                    "
                  >
                    <div class="flex justify-end space-x-4">
                      <router-link
                        :to="`/orden-de-pedido/${pO.id}`"
                        class="
                          flex
                          justify-between
                          items-center
                          text-indigo-600
                          hover:text-indigo-900
                        "
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button
                        @click="deletePO(pO.id)"
                        class="
                          flex
                          justify-between
                          items-center
                          text-red-600
                          hover:text-red-900
                        "
                      >
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="PurchaseOrders.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay Ordenes de Pedidos</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
  import { ref, watch } from 'vue';
  import { createNamespacedHelpers } from 'vuex-composition-helpers';
  const { useState, useActions } = createNamespacedHelpers('PurchaseOrders');
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import {
    TrashIcon,
    PencilAltIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/solid';
  import { PurchaseOrder } from '@/interfaces/sandflow.Types';

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  export default {
    components: {
      ExclamationCircleIcon,
      CheckCircleIcon,
      UiBtn,
      TrashIcon,
      PencilAltIcon,
      Layout,
      InformationCircleIcon,
    },
    setup() {
      const instance = axios.create({
        baseURL: apiUrl,
      });
      const { all } = useState(['all']);

      const PurchaseOrders = ref([]);
      const { data: pOData } = useAxios('/purchaseOrder', instance);
      watch(pOData, (pOData, prevCount) => {
        if (pOData && pOData.data) {
          console.log('PurchaseOrders', pOData.data);
          PurchaseOrders.value = pOData.data;
          const diff = useDiffArray(all.value, pOData.data);
          if (diff.length > 0) {
            storeToState(diff);
          }
        }
      });

      const useDiffArray = (state: PurchaseOrder[], api: PurchaseOrder[]) => {
        const diff: PurchaseOrder[] = [];
        const prev = state.map((s) => s.id);
        api.map((a) => {
          if (prev.indexOf(a.id) === -1) {
            diff.push(a);
          }
        });
        return diff;
      };

      const storeToState = (pOs: PurchaseOrder[]) => {
        const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
        return pOs.map((pO) => {
          savePurchaseOrder(pO);
        });
      };

      const deletePO = async (poId: number) => {
        PurchaseOrders.value = PurchaseOrders.value.filter(
          (pO: PurchaseOrders) => {
            return pO.id !== poId;
          }
        );
        const { deletePurchaseOrder } = useActions(['deletePurchaseOrder']);
        const { data: pOData } = useAxios(
          `/purchaseOrder/${poId}`,
          { method: 'DELETE' },
          instance
        );
        deletePurchaseOrder(poId);
      };

      return {
        PurchaseOrders,
        deletePO,
      };
    },
  };
</script>
