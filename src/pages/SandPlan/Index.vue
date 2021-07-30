<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">
        Planificacónes de arenas
      </h2>
      <router-link to="/planificacion-de-arena/nueva">
        <UiBtn>Nuevo</UiBtn>
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
                  >
                    Cliente
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
                    Pozo
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
                    Etapas
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
                    Total
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
                  v-for="(sp, Key) in sandPlans"
                  :key="Key"
                  :class="Key % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
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
                    {{ sp?.company?.name || '-' }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                    {{ sp?.pit?.name || '-' }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                    {{ sp?.stagesAmount || 0 }}
                  </td>
                  <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                    {{ sumQty(sp?.stages) || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ sp?.state || '-' }}
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
                        :to="`/planificacion-de-arena/${sp.id}`"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button
                        @click="deleteSP(sp.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="sandPlans.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
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
  import { watch, ref } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import {
    TrashIcon,
    PencilAltIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/solid';
  import UiBtn from '@/components/ui/Button.vue';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import axios from 'axios';
  // import { Sand } from '@/interfaces/sandflow.Types.ts';

  const api = import.meta.env.VITE_API_URL;
  export default {
    components: {
      Layout,
      UiBtn,
      TrashIcon,
      PencilAltIcon,
    },
    setup() {
      const instance = axios.create({
        baseURL: api,
      });

      const store = useStore();

      const sandPlans = ref([]);
      const { data: sPData } = useAxios('/sandPlan', instance);
      watch(sPData, (sPData, prevCount) => {
        if (sPData && sPData.data) {
          sandPlans.value = sPData.data;
          sandPlans.value.map((sp) => {
            storeToVuex(sp);
          });
        }
      });

      const storeToVuex = (sandPlan) => {
        store.dispatch('saveSandPlan', sandPlan);
      };

      const sumQty = (sandStages) => {
        return sandStages.reduce((totalSum, ss) => {
          return totalSum + ss.quantity;
        }, 0);
      };
      const deleteSP = (id) => {
        const loading = ref(true);
        const { data } = useAxios(
          '/sandPlan/' + id,
          { method: 'POST' },
          instance
        );
        store.dispatch('updateSandPlan', id);
        sandPlans.value = sandPlans.value.filter((sp) => {
          return sp.id !== id;
        });
        loading.value = false;
      };
      return {
        sandPlans,
        deleteSP,
        sumQty,
      };
    },
  };
</script>
