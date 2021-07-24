<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Centros de arena</h2>
      <router-link to="/centro-de-carga-de-arena/nueva">
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
                    Proveedor
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad de Cajas 
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
                  v-for="(sc, Key) in sandCenter"
                  :key="Key"
                  :class="Key % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ sc.provider }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm" >
                    {{ sc.sandCarge.length }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm" >
                    {{ sumQty(sc.sandCarge) }}t
                  </td>
                  <td
                    :class="sc.loaded ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sc.loaded ? 'Cargado' : 'No cargado' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-4">
                      <router-link :to="`/centro-de-carga-de-arena/${sc.id}`" class="flex text-indigo-600 hover:text-indigo-900">
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button @click="deleteSP(sc.id)" class="flex text-red-600 hover:text-red-900">
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="sandCenter.length <= 0">
                  <td colspan="5" class="text-center text-xs text-gray-500 px-6 py-4">
                    <p>No hay Planificacion de Arena</p>
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
  },
  setup() {
    const sandCenter = ref([]);
    const store = useStore();
    const allSandCenters = JSON.parse(JSON.stringify(store.state.sandCenter.all));
    // onMounted(async () => {
    //   const loading = ref(true);
    //   sandPlans.value = await axios
    //     .get(`${api}/sandPlan`)
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     .then((res) => {
    //       if (res.status === 200) {
    //         console.log(res);
    //         // return res.data.data.workOrders || res.data.workOrders;
    //       }
    //       return [];
    //     })
    //     .finally(() => {
    //       loading.value = false;
    //     });
    //   if (sandPlans.value && sandPlans.value.length > 0) {
    //     if (sandPlans.value.length > allSandPlans.length) {
    //       if (allSandPlans.length === 0) {
    //         sandPlans.value.forEach((sp) => {
    //           store.dispatch('saveSandPlan', sp);
    //         });
    //       } else {
    //         const newSpDB = sandPlans.value.filter((spFromApi, key) => {
    //           return spFromApi.id && allSandPlans[key] && spFromApi.id !== allSandPlans[key].id;
    //         });
    //         newSpDB.forEach((sp) => {
    //           store.dispatch('saveSandPlan', sp);
    //         });
    //       }
    //     }
    //   }
    // });
    sandCenter.value = allSandCenters;
    const sumQty = (sandStages) => {
      return sandStages.reduce((totalSum, ss) => {
        return totalSum + ss.quantity;
      }, 0);
    }
    const deleteSP = (id) => {
      const loading = ref(true);
      sandCenter.value = sandCenter.value.filter((sp) => {
        return sp.id !== id;
      });
      loading.value = false;
    }
    return {
      sandCenter,
      deleteSP,
      sumQty,
    };
  },
};
</script>
