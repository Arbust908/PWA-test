<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Grúas</h2>
      <router-link to="/cradle/nuevo">
        <UiBtn>Nuevo</UiBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Observaciónes</th>
          <th scope="col">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(cr, sKey) in crDB"
          :key="cr.id"
          :class="sKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td>
            {{ cr.id }}
          </td>
          <td :class="cr.name ? null : 'empty'">
            {{ cr.name || 'Sin definir' }}
          </td>
          <td :class="cr.observations ? null : 'empty'">
            {{ cr.observations || 'Sin definir' }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link :to="`/cradle/${cr.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteFrom(cr.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="crDB.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay grúas cargadas</p>
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
  import UiBtn from '@/components/ui/Button.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  import '@/assets/table.scss';

  import axios from 'axios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      UiBtn,
      Icon,
      UiTable,
    },
    setup() {
      const store = useStore();
      const crDB = ref([]);
      const cradleDB = JSON.parse(JSON.stringify(store.state.cradle.all));

      const loading = ref(false);

      const getCradles = async () => {
        loading.value = true;
        crDB.value = await axios
          .get(`${apiUrl}/cradle`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data.data;
            }
            return [];
          });

        store.dispatch('setCradles', crDB.value);
      };

      const deleteFrom = async (id) => {
        const loading = ref(true);
        let cradleDB = await axios
          .delete(`${apiUrl}/cradle/${id}`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log('OK', id);
            return {};
          })
          .finally(() => {
            loading.value = false;
            crDB.value = crDB.value.filter((st) => st.id !== id);
          });
      };

      onMounted(async () => {
        loading.value = true;
        await getCradles();
        loading.value = false;
      });

      return {
        crDB,
        deleteFrom,
      };
    },
  };
</script>
