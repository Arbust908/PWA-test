<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-second-900">Ordenes de Trabajo</h2>
      <router-link to="/orden-de-trabajo/nueva">
        <PrimaryBtn>Crear nueva</PrimaryBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col" title="Numero de Orden">N°</th>
          <th scope="col">Cliente</th>
          <th scope="col">Operadora</th>
          <th scope="col">Estado</th>
          <th scope="col">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(wo, woKey) in woDB"
          :key="wo.id"
          :class="woKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td>
            {{ wo.id }}
          </td>
          <td :class="wo.client ? null : 'empty'">
            {{ wo.client || 'Sin cliente' }}
          </td>
          <td :class="wo.serviceCompany ? null : 'empty'">
            {{ wo.serviceCompany || 'Sin empresa de servicio' }}
          </td>
          <td :class="!wo.draft ? 'done' : 'idle'">
            <div class="flex space-x-2">
              <Icon
                icon="ExclamationCircle"
                v-if="wo.draft === 'error'"
                class="w-5 h-5"
              />
              <Icon icon="CheckCircle" v-if="!wo.draft" class="w-5 h-5" />
              <Icon icon="InformationCircle" v-else class="w-5 h-5" />
              <span>
                {{ !wo.draft ? 'Completado' : 'Pendiente' }}
              </span>
            </div>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <div class="btn-panel">
              <router-link :to="`/orden-de-trabajo/${wo.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteWO(wo.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="woDB.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay Ordenes de Trabajo</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, watch, defineComponent } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  import '@/assets/table.scss';

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import { useTitle } from '@vueuse/core';
  import { WorkOrder } from '@/interfaces/WorkOrder';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default defineComponent({
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
    },
    setup() {
      const title = useTitle('Ordenes de Trabajo <> Sandflow');
      const instance = axios.create({
        baseURL: api + '/workOrder',
      });
      const store = useStore();
      const workOrders = store.state.workOrders.all;

      const { data, isFinished, isLoading, error } = useAxios('/', instance);

      const woDB: Ref<Array<WorkOrder>> = ref([] as Array<WorkOrder>);
      watch(data, (currentData, prevData) => {
        if (currentData) {
          woDB.value = currentData.data;
          if (woDB.value && woDB.value.length > 0) {
            if (
              !workOrders.value ||
              woDB.value.length > workOrders.value.length
            ) {
              if (!workOrders.value || workOrders.value.length === 0) {
                woDB.value.forEach((wo) => {
                  store.dispatch('saveWorkOrder', wo);
                });
              } else {
                const newWoDB = woDB.value.filter((woFromApi, key) => {
                  return (
                    woFromApi.id &&
                    workOrders.value[key] &&
                    woFromApi.id !== workOrders.value[key].id
                  );
                });
                newWoDB.forEach((wo) => {
                  store.dispatch('saveWorkOrder', wo);
                });
              }
            }
          }
        }
      });

      const deleteWO = (woId) => {
        const { data, isFinished } = useAxios(
          `/${woId}`,
          { method: 'DELETE' },
          instance
        );
        watch(isFinished, (load, prevLoad) => {
          store.dispatch('deleteWorkOrder', woId);
          woDB.value = woDB.value.filter((woFromApi) => {
            return woFromApi.id !== woId;
          });
        });
        return isFinished;
      };

      return {
        woDB,
        deleteWO,
        isFinished,
        isLoading,
        error,
      };
    },
  });
</script>
