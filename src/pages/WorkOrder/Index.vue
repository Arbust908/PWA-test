<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Ordenes de Trabajo</h2>
      <router-link to="/orden-de-trabajo/nueva">
        <UiBtn>Nuevo</UiBtn>
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
                    Numero de Orden
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Empresa de Servicio
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
                  v-for="(wo, woKey) in workOrders"
                  :key="wo.id"
                  :class="woKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ wo.id }}
                  </td>
                  <td
                    :class="wo.client ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ wo.client || 'Sin cliente' }}
                  </td>
                  <td
                    :class="wo.service_co ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ wo.service_co || 'Sin empresa de servicio' }}
                  </td>
                  <td
                    :class="wo.isFull ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ wo.isFull ? 'Completado' : 'Pendiente' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link :to="`/orden-de-trabajo/${wo.id}`" class="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="workOrders.length <= 0">
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

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';
import axios from 'axios';
// import { WorkOrder } from '@/interfaces/WorkOrder';
const api = 'https://sandflow-qa.bitpatagonia.com/api';
export default {
  components: {
    Layout,
    UiBtn,
  },
  setup() {
    let woDB = [];
    onMounted(async () => {
      const loading = ref(true);
      woDB = await axios
        .get(`${api}/workOrder`)
        .catch((err) => {
          console.log(err);
        })
        .then(({ data }) => {
          return data;
        })
        .finally(() => {
          loading.value = false;
        });
      console.log(woDB);
    });
    const store = useStore();
    const workOrders = store.state.workOrders.all;
    if (woDB && woDB.lenth > 0) {
      if (woDB.length > workOrders.length) {
        // Set woDB to workOrders
        const newWoDB = woDB.filter((wo, key) => {
          return wo.id && wo.id !== workOrders[key].id;
        });
        newWoDB.forEach((wo, woKey) => {
          store.dispatch('saveWorkOrder', wo);
        });
      } else if (woDB.length < workOrders.length) {
        // Set workOrders to woDB
      }
    }
    return {
      workOrders,
    };
  },
};
</script>
