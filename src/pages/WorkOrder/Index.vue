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
                  v-for="(wo, woKey) in woDB"
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
                    :class="wo.serviceCompany ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ wo.serviceCompany || 'Sin empresa de servicio' }}
                  </td>
                  <td
                    :class="wo.isFull ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                  <div class="flex space-x-2">
                      <ExclamationCircleIcon v-if="wo.isFull === 'error'" class="w-5 h-5" />
                      <CheckCircleIcon v-if="wo.isFull" class="w-5 h-5" />
                      <InformationCircleIcon v-else class="w-5 h-5" />
                      <span>
                        {{ wo.isFull ? 'Completado' : 'Pendiente' }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-4">
                      <router-link
                        :to="`/orden-de-trabajo/${wo.id}`"
                        class="flex justify-between items-center text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button
                        @click="deleteWO(wo.id)"
                        class="flex justify-between items-center text-red-600 hover:text-red-900"
                      >
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="woDB.length <= 0">
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
import { TrashIcon, PencilAltIcon, InformationCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';
import axios from 'axios';
// import { WorkOrder } from '@/interfaces/WorkOrder';
const api = 'https://sandflow-qa.bitpatagonia.com/api';
export default {
  components: {
    Layout,
    UiBtn,
    TrashIcon,
    PencilAltIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
  },
  setup() {
    const loading = ref(false);
    const woDB = ref([]);
    const store = useStore();
    const workOrders = JSON.parse(JSON.stringify(store.state.workOrders.all));
    onMounted(async () => {
      const loading = ref(true);
      woDB.value = await axios
        .get(`${api}/workOrder`)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            return res.data.data;
          }
          return [];
        })
        .finally(() => {
          loading.value = false;
        });
      if (woDB.value && woDB.value.length > 0) {
        if (woDB.value.length > workOrders.length) {
          if (workOrders.length === 0) {
            woDB.value.forEach((wo) => {
              store.dispatch('saveWorkOrder', wo);
            });
          } else {
            const newWoDB = woDB.value.filter((woFromApi, key) => {
              return woFromApi.id && workOrders[key] && woFromApi.id !== workOrders[key].id;
            });
            newWoDB.forEach((wo) => {
              store.dispatch('saveWorkOrder', wo);
            });
          }
        }
      }
    });

    const deleteWO = async (woId) => {
      const deletedWO = await axios
        .delete(`${api}/workOrder/${woId}`)
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
        console.log(deletedWO);
        woDB.value = woDB.value.filter((woFromApi) => {
          return woFromApi.id !== woId;
        });
    };
    return {
      woDB,
      deleteWO
    };
  },
};
</script>
