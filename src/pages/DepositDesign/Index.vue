<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-second-900">Depositos</h2>
      <router-link to="/diseno-de-deposito/nueva">
        <UiBtn>Nuevo Deposito</UiBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Pozo</th>
          <th scope="col">Pisos</th>
          <th scope="col">Dimensiónes</th>
          <th scope="col">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(depo, Key) in Deposits"
          :key="Key"
          :class="Key % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td>
            {{ depo.clientCompany.name }}
          </td>
          <td>{{ depo.pit.name }}</td>
          <td>
            {{ formatedDeposit(depo.layout).floor }}
          </td>
          <td>
            {{ formatedDeposit(depo.layout).dimensions }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link :to="`/diseno-de-deposito/${depo.id}`" class="edit">
                <PencilAltIcon class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteDeposit(depo.id)">
                <TrashIcon class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="Deposits.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay Depositos</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script>
  import { ref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/buttons/BaseBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';

  import '@/assets/table.scss';

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      PencilAltIcon,
      TrashIcon,
      UiBtn,
      UiTable,
    },
    setup() {
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const Deposits = ref([]);
      const { data: dData } = useAxios('/warehouse', instance);
      watch(dData, (dData, prevCount) => {
        if (dData && dData.data) {
          Deposits.value = dData.data;
          store.dispatch('setDeposit', Deposits.value);
        }
      });

      const formatedDeposit = (deposit) => {
        const dimensions = Object.keys(deposit).reduce(
          (dims, currentCell) => {
            const proxy = currentCell.split('|');
            const [floor, row, col] = proxy;
            dims.floor = Math.max(dims.floor, floor);
            dims.row = Math.max(dims.row, row);
            dims.col = Math.max(dims.col, col);
            return dims;
          },
          { floor: 0, row: 0, col: 0 }
        );
        dimensions.dimensions = `${dimensions.row} x ${dimensions.col}`;
        return dimensions;
      };
      const deleteDeposit = (id) => {
        const loading = ref(true);
        const { data } = useAxios(
          '/warehouse/' + id,
          { method: 'DELETE' },
          instance
        );
        store.dispatch('deleteDeposit', id);
        Deposits.value = Deposits.value.filter((pn) => {
          return pn.id !== id;
        });
        loading.value = false;
      };
      return {
        Deposits,
        formatedDeposit,
        deleteDeposit,
      };
    },
  };
</script>

<style lang="scss" scoped>
  th {
    @apply px-6 py-3 text-left text-xs font-medium text-second-500 uppercase tracking-wider;
  }
  .body-row {
    @apply hover:bg-second-200;
    &.odd {
      @apply bg-second-50;
    }
    &.even {
      @apply bg-second-100;
    }
  }
  td {
    @apply px-6 py-4 whitespace-nowrap text-sm font-medium text-second-900;
    &.empty {
      @apply text-gray-400 italic;
    }
  }
  .btn-panel {
    @apply flex justify-end space-x-4;
  }
  td.emptyState {
    @apply text-center text-xs text-second-300 px-6 py-4;
  }
</style>
