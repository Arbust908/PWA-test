<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Proovedores de arena</h2>
      <router-link to="/proveedores-de-arena/nuevo">
        <PrimaryBtn>Nuevo</PrimaryBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">Nombre y Apellido / Razón Social</th>
          <th scope="col">Domicilio</th>
          <th scope="col">CUIL/CUIT</th>
          <th scope="col">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(sp, spKey) in spDB"
          :key="sp.id"
          :class="spKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td :class="sp.name ? null : 'empty'">
            {{ sp.name || 'Sin nombre' }}
          </td>
          <td :class="sp.address ? null : 'empty'">
            {{ sp.address || 'Sin dirección' }}
          </td>
          <td :class="sp.legalId ? null : 'empty'">
            {{ sp.legalId || 'Sin CUIL/CUIT' }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link :to="`/proveedores-de-arena/${sp.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteSP(sp.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="spDB.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay proveedores de arena</p>
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
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import axios from 'axios';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
    },
    setup() {
      useTitle(`Proveedores de Arena <> Sandflow`);
      const spDB = ref([]);
      const store = useStore();
      const sandProviders = JSON.parse(
        JSON.stringify(store.state.sandProviders.all)
      );
      const loading = ref(false);

      const getSP = async () => {
        loading.value = true;
        spDB.value = await axios
          .get(`${api}/sandProvider`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          });

        store.dispatch('setSandProviders', spDB.value);
      };

      const deleteSP = async (spID) => {
        let response = await axios
          .delete(`${api}/sandProvider/${spID}`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              return res.data.data;
            }
            return [];
          })
          .finally(() => {
            store.dispatch('deleteSandProvider', spID);
            getSP();
          });

        return {
          response,
        };
      };

      onMounted(async () => {
        loading.value = true;
        await getSP();
        loading.value = false;
      });
      return {
        spDB,
        deleteSP,
        loading,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/table.scss';
</style>
