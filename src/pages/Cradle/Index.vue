<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Grúas</h2>
      <router-link to="/cradle/nuevo">
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
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Observaciones
                  </th>
                  <th scope="col" colspan="2" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(cr, sKey) in crDB"
                  :key="cr.id"
                  :class="sKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-gray-900
                    "
                  >
                    {{ cr.id }}
                  </td>
                  <td
                    :class="cr.name ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ cr.name || 'Sin definir' }}
                  </td>
                  <td
                    :class="
                      cr.observations ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ cr.observations || 'Sin definir' }}
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-right text-sm
                      font-medium
                    "
                  >
                    <span
                      class="text-red-600 hover:text-red-900 cursor-pointer"
                      @click="deleteFrom(cr.id)"
                    >
                      Delete
                    </span>
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-right text-sm
                      font-medium
                    "
                  >
                    <router-link
                      :to="`/cradle/${cr.id}`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="crDB.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay grúas cargadas</p>
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
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import { TrashIcon } from '@heroicons/vue/outline';
  import axios from 'axios';

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      UiBtn,
      TrashIcon: TrashIcon,
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
