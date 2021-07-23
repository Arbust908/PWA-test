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
                    Pozo
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Etapas 
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
                  v-for="(sp, Key) in sandPlans"
                  :key="Key"
                  :class="Key % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ sp.pit }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm" >
                    {{ sp.stages }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm" >
                    {{ sumQty(sp.sandStage) }}t
                  </td>
                  <td
                    :class="sp.draft ?  'text-blue-500' : 'text-green-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sp.draft ? 'Pendiente' : 'Completado' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div>
                      <router-link :to="`/orden-de-trabajo/${sp.id}`" class="text-indigo-600 hover:text-indigo-900">
                        Editar
                      </router-link>
                      <button @click="deleteSP(sp.id)" class="text-red-600 hover:text-red-900">
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="sandPlans.length <= 0">
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
    const sandPlans = ref([]);
    const store = useStore();
    const allSandPlans = JSON.parse(JSON.stringify(store.state.sandPlan.all));
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
    sandPlans.value = allSandPlans;

    const sumQty = (sandStage) => {
      return sandStage.reduce((totalSum, ss) => {
        return totalSum + ss.quantity;
      }, 0);
    }
    const deleteSP = (id) => {
      const loading = ref(true);
      // delete from DB
    }
    return {
      sandPlans,
      deleteSP,
      sumQty,
    };
  },
};
</script>
