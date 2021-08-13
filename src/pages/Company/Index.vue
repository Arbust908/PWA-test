<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Clientes</h2>
      <router-link to="/clientes/nuevo">
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
                  <th scope="col">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Razón social</th>
                  <th scope="col">CUIL/CUIT</th>
                  <th scope="col">Obersvaciones</th>
                  <th scope="col">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(client, cKey) in clDB"
                  :key="client.id"
                  :class="cKey % 2 === 0 ? 'even' : 'odd'"
                  class="body-row"
                >
                  <td class="">
                    {{ client.id }}
                  </td>
                  <td :class="client.name ? null : 'empty'">
                    {{ client.name || 'Sin definir' }}
                  </td>
                  <td :class="client.legalName ? null : 'empty'">
                    {{ client.legalName || 'Sin definir' }}
                  </td>
                  <td :class="client.legalId ? null : 'empty'">
                    {{ client.legalId || 'Sin definir' }}
                  </td>
                  <td :class="client.observations ? null : 'empty'">
                    {{ client.observations || 'Sin definir' }}
                  </td>
                  <td>
                    <div class="btn-panel">
                      <router-link :to="`/clientes/${client.id}`" class="edit">
                        <Icon icon="PencilAlt" class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button class="delete" @click="deleteFrom(client.id)">
                        <Icon icon="Trash" class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="clDB && clDB.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay clientes cargados</p>
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
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import { useClone } from '@/helpers/useClone';
  import '@/assets/table.scss';

  import { useStore } from 'vuex';
  import axios from 'axios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      UiBtn,
      Icon,
    },
    setup() {
      const store = useStore();
      const clDB = ref([]);
      const clStoreDB = useClone(store.state.client.all);
      const loading = ref(false);

      const getClients = async () => {
        loading.value = true;
        clDB.value = await axios
          .get(`${apiUrl}/company`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          });

        store.dispatch('setClients', clDB.value);
      };

      const deleteFrom = async (id) => {
        const loading = ref(true);
        let clStoreDB = await axios
          .delete(`${apiUrl}/company/${id}`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log('OK', id);
            return {};
          })
          .finally(() => {
            loading.value = false;
            clDB.value = clDB.value.filter((st) => st.id !== id);
          });
      };

      onMounted(async () => {
        loading.value = true;
        await getClients();
        loading.value = false;
      });
      return {
        clDB,
        deleteFrom,
        loading,
      };
    },
  };
</script>

<!-- <style lang="scss" scoped>
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
    @apply px-6 py-4 whitespace-nowrap text-sm font-medium text-second-700;
    &.empty {
      @apply text-second-400 italic;
    }
  }
  .btn-panel {
    @apply flex justify-end space-x-4;
    .edit {
      @apply flex items-center text-indigo-600 hover:text-indigo-800;
    }
    .delete {
      @apply flex items-center text-red-600 hover:text-red-800;
    }
  }
</style> -->
