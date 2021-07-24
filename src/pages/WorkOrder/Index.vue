<template>
  <Layout>
    <progress
      v-if="loading"
      class="fixed inset-x-0 top-0 z-50 w-full h-2 shadow"
      :value="(progress * 100).toFixed(0)"
      max="100"
    ></progress>
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
                    title="Numero de Orden"
                  >
                    N°
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
                    :class="!wo.draft ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    <div class="flex space-x-2">
                      <ExclamationCircleIcon v-if="wo.draft === 'error'" class="w-5 h-5" />
                      <CheckCircleIcon v-if="!wo.draft" class="w-5 h-5" />
                      <InformationCircleIcon v-else class="w-5 h-5" />
                      <span>
                        {{ !wo.draft ? 'Completado' : 'Pendiente' }}
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

<script lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  TrashIcon,
  PencilAltIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { debouncedWatch } from '@vueuse/core';
import { WorkOrder } from '@/interfaces/WorkOrder';

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
    const instance = axios.create({
      baseURL: 'https://sandflow-qa.bitpatagonia.com/api/workOrder',
    });
    const store = useStore();
    const workOrders = store.state.workOrders.all;

    const { data, isFinished, isLoading, error } = useAxios('/', instance);
    const { progress, isLoading: loading, start, done } = useNProgress();
    watch(isLoading, (load, prevLoad) => {
      start();
    });
    const woDB: Ref<Array<WorkOrder>> = ref([] as Array<WorkOrder>);
    watch(data, (currentData, prevData) => {
      if (currentData) {
        woDB.value = currentData.data;
      }
    });

    debouncedWatch(
      isFinished,
      () => {
        if (isFinished.value) {
          const left = 1 - (progress.value || 0);
          const loading = setInterval(() => {
            progress.value += left / 10;
            if (progress.value >= 1) {
              clearInterval(loading);
            }
          }, 100);
        }
      },
      { debounce: 500 }
    );
    if (woDB.value && woDB.value.length > 0) {
      if (woDB.value.length > workOrders.value.length) {
        if (workOrders.value.length === 0) {
          woDB.value.forEach((wo) => {
            store.dispatch('saveWorkOrder', wo);
          });
        } else {
          const newWoDB = woDB.value.filter((woFromApi, key) => {
            return woFromApi.id && workOrders.value[key] && woFromApi.id !== workOrders.value[key].id;
          });
          newWoDB.forEach((wo) => {
            store.dispatch('saveWorkOrder', wo);
          });
        }
      }
    }
    const deleteWO = (woId) => {
      start();
      const { data, isFinished } = useAxios(`/${woId}`, { method: 'DELETE' }, instance);
      watch(isFinished, (load, prevLoad) => {
        store.dispatch('deleteWorkOrder', woId);
        woDB.value = woDB.value.filter((woFromApi) => {
          return woFromApi.id !== woId;
        });
        done();
      });
      return isFinished;
    };

    return {
      woDB,
      deleteWO,
      isFinished,
      progress,
      isLoading,
      start,
      done,
      error,
      loading,
    };
  },
};
</script>
