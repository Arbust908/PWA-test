<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">
        Proveedores de transporte
      </h2>
      <router-link to="/proveedores-de-transporte/nuevo">
        <UiBtn>Nuevo</UiBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Direccion</th>
          <th scope="col">Representante</th>
          <th scope="col">Observaciones</th>
          <th scope="col">
            <span>Actions</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(tp, tpKey) in tpDB"
          :key="tp.id"
          :class="tpKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td :class="tp.name ? null : 'empty'">
            {{ tp.name || 'Sin cliente' }}
          </td>
          <td :class="tp.address ? null : 'empty'">
            {{ tp.address || 'Sin Direccion' }}
          </td>
          <td :class="tp.companyRepresentative !== null ? null : 'empty'">
            {{ tp.companyRepresentative?.name || 'Sin Representante' }}
          </td>
          <td :class="tp.observations ? null : 'empty'">
            {{ tp.observations || 'Sin observaciones' }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link
                :to="`/proveedores-de-transporte/${tp.id}`"
                class="edit"
              >
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteTP(tp.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="tpDB.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay proveedores de transporte</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script>
  import { onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useTitle } from '@vueuse/core';
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import axios from 'axios';
  const api = import.meta.env.VITE_API_URL || '/api';

  import '@/assets/table.scss';

  export default {
    components: {
      Layout,
      UiBtn,
      UiTable,
      Icon,
    },
    setup() {
      const title = useTitle('Provedores de Transporte <> Sandflow');
      const tpDB = ref([]);
      const store = useStore();
      const transportProviders = JSON.parse(
        JSON.stringify(store.state.transportProviders.all)
      );
      const loading = ref(false);

      const getTP = async () => {
        loading.value = true;
        tpDB.value = await axios
          .get(`${api}/transportProvider`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          });
        store.dispatch('setTransportProviders', tpDB.value);
      };

      const deleteTP = async (tpID) => {
        let response = await axios
          .delete(`${api}/transportProvider/${tpID}`)

          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          })
          .catch((err) => {
            console.log(err);
            return;
          })
          .finally(() => {
            store.dispatch('deleteTransportProvider', tpID);
            getTP();
          });
        return {
          response,
        };
      };

      onMounted(async () => {
        loading.value = true;
        await getTP();
        loading.value = false;
      });
      return {
        tpDB,
        deleteTP,
        loading,
      };
    },
  };
</script>
