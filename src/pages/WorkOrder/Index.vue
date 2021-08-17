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
          v-for="(wo, woKey) in workOrders"
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
          <td>
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
        <tr v-if="workOrders.length <= 0">
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

  import { useApi } from '@/helpers/useApi';

  import { useTitle } from '@vueuse/core';
  import { WorkOrder } from '@/interfaces/WorkOrder';

  export default defineComponent({
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
    },
    setup() {
      const title = useTitle('Ordenes de Trabajo <> Sandflow');
      const store = useStore();

      const { read, destroy } = useApi('/workOrder');
      const workOrders = read();
      watch(workOrders, (newValue, _) => {
        if (newValue) {
          storeToState(newValue);
        }
      });
      const storeToState = (wOs: Array<WorkOrder>) => {
        return wOs.map((wO) => {
          store.dispatch('saveWorkOrder', wO);
        });
      };
      const deleteWO = (woId) => {
        const data = destroy(woId);
        watch(data, (_, __) => {
          store.dispatch('deleteWorkOrder', woId);
          workOrders.value = workOrders.value.filter((woFromApi) => {
            return woFromApi.id !== woId;
          });
        });
      };

      return {
        workOrders,
        deleteWO,
      };
    },
  });
</script>
