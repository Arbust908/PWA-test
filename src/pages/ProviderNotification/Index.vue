<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-second-900">
        Notificaciones a Proveedores
      </h2>
      <router-link to="/notificaciones-a-proveedores/nueva">
        <UiBtn>Nueva Notificacion</UiBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">Proveedor</th>
          <th scope="col">Ordenes</th>
          <th scope="col" title="Cantidad de Arena">C° Arena</th>
          <th scope="col">Transportes</th>
          <th scope="col">C° de Camiones</th>
          <!-- <th scope="col">
            <span class="sr-only">Actions</span>
          </th> -->
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(pn, Key) in ProviderNotifications"
          :key="Key"
          :class="Key % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td>
            {{ pn.sandProvider.name }}
          </td>
          <td>{{ pn.sandOrder.amount }}t</td>
          <td>
            {{
              pn.transportProviders
                ? pn.transportProviders.length
                : 'No hay transporte'
            }}
          </td>
          <td>
            {{
              pn.transportProviders ? sumTransport(pn.transportProviders) : '-'
            }}
          </td>
          <!-- <td>
            <div class="btn-panel">
              <router-link
                :to="`/notificaciones-a-proveedores/${pn.id}`"
                class="edit"
              >
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteSP(pn.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td> -->
        </tr>
        <tr v-if="ProviderNotifications.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay Notificaciones a Proveedores</p>
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
  import Icon from '@/components/icon/TheAllIcon.vue';

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
      Icon,
    },
    setup() {
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const ProviderNotifications = ref([]);
      const { data: pNData } = useAxios('/providerNotification', instance);
      watch(pNData, (pNData, prevCount) => {
        if (pNData && pNData.data) {
          ProviderNotifications.value = pNData.data;
          ProviderNotifications.value.forEach((pn) => {
            store.dispatch('saveProviderNotification', pn);
          });
        }
      });
      const sumQty = (sandOrder) => {
        return sandOrder.reduce((totalSum, sO) => {
          return totalSum + sO.amount;
        }, 0);
      };
      const sumTransport = (transportProviders) => {
        return transportProviders.reduce((totalSum, tP) => {
          return totalSum + tP.amount;
        }, 0);
      };
      const deletePN = (id) => {
        const loading = ref(true);
        const { data } = useAxios(
          '/providerNotification/' + id,
          { method: 'DELETE' },
          instance
        );
        store.dispatch('deleteProviderNotification', id);
        ProviderNotifications.value = ProviderNotifications.value.filter(
          (pn) => {
            return pn.id !== id;
          }
        );
        loading.value = false;
      };
      return {
        ProviderNotifications,
        deletePN,
        sumQty,
        sumTransport,
      };
    },
  };
</script>
