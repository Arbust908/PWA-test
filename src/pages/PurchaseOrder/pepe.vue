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
                  v-for="(po, poKey) in all"
                  :key="po.id"
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
                    {{ po.id }}
                  </td>
                  <td
                    :class="
                      po.sandProvider && po.sandProvider.name
                        ? 'text-gray-500'
                        : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ po.sandProvider.name || 'Sin proveedor' }}
                  </td>
                  <td
                    :class="
                      po.sandProvider && po.sandProvider.sandOrders
                        ? 'text-gray-500'
                        : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  ></td>
                  <td
                    :class="
                      po.sandProvider && po.sandProvider.transportProvider
                        ? 'text-gray-500'
                        : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  ></td>
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
                        :to="`/orden-de-pedido/${po.id}`"
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
                        @click="deletePO(po.id)"
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
                <tr v-if="all.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay Ordenes de Trabajo</p>
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
  import { onMounted, ref, Ref, watch } from 'vue';
  import { createNamespacedHelpers } from 'vuex-composition-helpers';
  const { useState, useActions } = createNamespacedHelpers('purchaseOrder');
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import axios from 'axios';
  import {
    TrashIcon,
    PencilAltIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/solid';
  import { PurchaseOrder, SandOrder } from '@/interfaces/PurchaseOrder.ts';
  const api = import.meta.env.VITE_API_URL;
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
    // { "sandProviderId": "2", "sandProvider": { "id": "2", "name": "sand provider", "legalName": "sand provider legalName", "legalId": "234444444", "meshType": "mesh type", "grains": "grains", "observations": null, "companyRepresentativeId": null, "companyRepresentative": null }, "sandOrders": [ { "id": 0, "sandType": {}, "sandTypeId": "1", "quantity": "22", "boxId": "" } ], "transportProviderId": "5", "transportProvider": { "id": "5", "name": "Transportes Firulais", "transportId": "AC 245 WC", "boxQuantity": "2", "observation": "" }, "id": 1 }
    setup() {
      const { all } = useState(['all']);
      const { savePurchaseOrder } = useActions(['savePurchaseOrder']);

      const sumTotalSand = (sandOrders: Array<SandOrder>) => {
        return sandOrders.reduce((totalSand, order) => {
          return totalSand + order.quantity;
        }, 0);
      };

      const deletePO = async (poId: number) => {
        poDB.value = poDB.value.filter((wo) => {
          return wo.id !== poId;
        });
      };

      return {
        all,
        deletePO,
        sumTotalSand,
      };
    },
  };
</script>
