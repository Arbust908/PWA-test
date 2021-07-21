<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Ordenes de Pedido</h2>
      <router-link to="/orden-de-pedido/nueva">
        <UiBtn>Crear Nueva</UiBtn>
      </router-link>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Numero de Pedido
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Proveedor de arena
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  v-for="(po, poKey) in poDB"
                  :key="po.id"
                  :class="poKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ po.id }}
                  </td>
                  <td
                    :class="po.sandProvider?.name ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ po.sandProvider.name || 'Sin proveedor' }}
                  </td>
                  <td
                    :class="po.sandProvider.sandOrders ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ po.sandProvider.sandOrders.length > 0 ? sumTotalSand(po.sandProvider.sandOrders) + 't' : 'Sin orden de arena' }}
                  </td>
                  <td
                    :class="po.draft ? 'text-blue-500' : 'text-green-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    <div class="flex space-x-2">
                      <ExclamationCircleIcon v-if="po.draft === 'error'" class="w-5 h-5" />
                      <InformationCircleIcon v-if="po.draft" class="w-5 h-5" />
                      <CheckCircleIcon v-else class="w-5 h-5" />
                      <span>
                        {{ po.draft ? 'Pendiente' : 'Completado' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-4">
                      <router-link
                        :to="`/orden-de-trabajo/${po.id}`"
                        class="flex justify-between items-center text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button
                        @click="deletePO(po.id)"
                        class="flex justify-between items-center text-red-600 hover:text-red-900"
                      >
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="poDB.length <= 0">
                  <td colspan="5" class="text-center text-xs text-gray-500 px-6 py-4">
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
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';
import axios from 'axios';
import { TrashIcon, PencilAltIcon, InformationCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/vue/solid';
import { PurchaseOrder, SandOrder } from '@/interfaces/PurchaseOrder.ts';
const api = 'https://sandflow-qa.bitpatagonia.com/api';
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
    const poDB = ref([]);
    const store = useStore();
    const purchaseOrder: Array<PurchaseOrder> = JSON.parse(JSON.stringify(store.state.purchaseOrder.all));
      console.log(purchaseOrder)
    onMounted(async () => {
      const loading = ref(true);
      // poDB.value = await axios
      //   .get(`${api}/purchaseOrder`)
      //   .catch((err) => {
      //     console.log(err);
      //   })
      //   .then((res) => {
      //     if (res.status === 200) {
      //       return res.data.data.purchaseOrder || res.data.purchaseOrder;
      //     }
      //     return [];
      //   })
      //   .finally(() => {
      //     loading.value = false;
      //   });
      console.log('PO PO PO PO');
      console.log('API DB', poDB.value);
      console.log('State', purchaseOrder);
      console.log('API DB', poDB.value.length);
      if (poDB.value && poDB.value.length > 0) {
        console.log(poDB.value.length);
        if (poDB.value.length > purchaseOrder.length) {
          console.log(poDB.value.length, purchaseOrder.length);
          if (purchaseOrder.length === 0) {
            poDB.value.forEach((wo, woKey) => {
              store.dispatch('savePurchaseOrder', wo);
            });
          } else {
            const newWoDB = poDB.value.filter((woFromApi, key) => {
              return woFromApi.id && purchaseOrder[key] && woFromApi.id !== purchaseOrder[key].id;
            });
            console.log(newWoDB);
            newWoDB.forEach((wo, woKey) => {
              store.dispatch('savePurchaseOrder', wo);
            });
          }
        } else {
          poDB.value = purchaseOrder;
        }
      } else {
          poDB.value = purchaseOrder;
        }
    });
    const sumTotalSand = (sandOrders: Array<SandOrder>) => {
      return sandOrders.reduce((totalSand, order) => {
        return totalSand + order.quantity;
      }, 0);
    };

    const deletePO = async (poId) => {
      const deleted = await axios
        .delete(`${api}/purchaseOrder/${poId}`)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            return res;
          }
          return [];
        })
        .finally(() => {
          loading.value = false;
        });
      console.log(deleted);
    };
    return {
      poDB,
      deletePO,
      sumTotalSand,
    };
  },
};
</script>
