<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Forklift</h2>
      <router-link to="/forklift/nuevo">
        <PrimaryBtn>Nuevo</PrimaryBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">Nombre</th>
          <!-- <th scope="col">Asignación</th>
          <th scope="col">Nombre dueño</th>
          <th scope="col">Contacto dueño</th> -->
          <th scope="col">Observaciones</th>
          <th scope="col">
            <span class="sr-olny">Acciones</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(f, fKey) in fDB"
          :key="f.id"
          :class="fKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td :class="f.name ? null : 'empty'">
            {{ f.name || 'Sin nombre' }}
          </td>
          <!-- <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
            {{ f.owned ? 'Asignado' : 'Sin asignar' || 'Sin asignación' }}
          </td>
          <td :class="f.ownerName ? null : 'empty'">
            {{ f.ownerName || 'Sin dueño' }}
          </td>
          <td :class="f.ownerContact ? null : 'empty'">
            {{ f.ownerContact || 'Sin contacto' }}
          </td> -->
          <td :class="f.observations ? null : 'empty'">
            {{ f.observations || 'Sin observaciones' }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link :to="`/forklift/${f.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteTP(f.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="fDB.length <= 0">
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
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  import '@/assets/table.scss';

  import axios from 'axios';

  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  export default {
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
    },
    setup() {
      const fDB = ref([]);
      const store = useStore();
      const loading = ref(false);

      const getForklifts = async () => {
        loading.value = true;
        fDB.value = await axios
          .get(`${apiUrl}/forklift`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          });
        store.dispatch('setForklifts', fDB.value);
      };

      const deleteTP = async (tpID) => {
        let response = await axios
          .delete(`${apiUrl}/forklift/${tpID}`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          })
          .finally(() => {
            store.dispatch('deleteForklift', tpID);
            getForklifts();
          });

        return {
          response,
        };
      };

      onMounted(async () => {
        loading.value = true;
        await getForklifts();
        loading.value = false;
      });
      return {
        fDB,
        deleteTP,
        loading,
      };
    },
  };
</script>
