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
          <th scope="col">Pozos</th>
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
            {{ clientIdToName(wo.client) }}
          </td>
          <td :class="wo.serviceCompany ? null : 'empty'">
            {{ clientIdToName(wo.serviceCompany) }}
          </td>
          <td>
            {{ listPits(wo.pits) }}
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
        console.log('Work Orders', newValue);
        if (newValue) {
          storeToState(newValue);
        }
      });
      const { read: getCompanies } = useApi('/company');
      const companies = getCompanies();
      const clientIdToName = (id: number) => {
        if (typeof id === 'string' && Number.isNaN(Number(id))) {
          return id;
        }
        if (!companies && !companies.value) {
          return '-';
        }
        const client = companies.value.find((c) => {
          return c.id === id;
        });
        return client ? client.name : 'Sin cliente';
      };
      const listPits = (pits: Array<Pit>) => {
        if (!pits || pits.length <= 0) {
          return '-';
        }
        return pits.reduce((list, pit) => {
          list += list === '' ? pit.name : `, ${pit.name}`;
          return list;
        }, '');
      };
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
        clientIdToName,
        listPits,
      };
    },
  });
</script>
