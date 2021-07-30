<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Tipos de Arena</h2>
      <router-link to="/tipos-de-arena/nueva">
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
                    Tipo
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
                    Descripción
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
                    Malla
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
                    Granaje
                  </th>
                  <th scope="col" colspan="2" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(st, sKey) in stDB"
                  :key="st.id"
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
                    {{ st.id }}
                  </td>
                  <td
                    :class="st.type ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ st.type || 'Sin definir' }}
                  </td>
                  <td
                    :class="
                      st.description ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ st.description || 'Sin definir' }}
                  </td>
                  <td
                    :class="st.meshType ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ st.meshType || 'Sin definir' }}
                  </td>
                  <td
                    :class="st.grainType ? 'text-green-500' : 'text-blue-500'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ st.grainType || 'Sin definir' }}
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
                      @click="deleteFrom(st.id)"
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
                      :to="`/tipos-de-arena/${st.id}`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="stDB.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay arenas cargadas</p>
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
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      UiBtn,
      TrashIcon: TrashIcon,
    },
    setup() {
      const store = useStore();
      const stDB = ref([]);
      const sandDB = JSON.parse(JSON.stringify(store.state.sand.all));

      onMounted(async () => {
        const loading = ref(true);
        stDB.value = await axios
          .get(`${api}/sand`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              // console.log('data', res.data.data)
              return res.data.data;
            }
            return [];
          })
          .finally(() => {
            loading.value = false;
          });

        if (stDB.value && stDB.value.length > 0) {
          if (stDB.value.length > sandDB.length) {
            if (sandDB.length === 0) {
              stDB.value.forEach((st, sKey) => {
                store.dispatch('saveSand', st);
              });
            } else {
              const newsDB = stDB.value.filter((stFromApi, key) => {
                return (
                  stFromApi.id && sandDB[key] && stFromApi.id !== sandDB[key].id
                );
              });
              newsDB.forEach((st, stKey) => {
                store.dispatch('saveSand', st);
              });
            }
          }
        }
      });

      const deleteFrom = async (id) => {
        const loading = ref(true);
        let sandDB = await axios
          .delete(`${api}/sand/${id}`)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              console.log('OK', id);
              return res.data;
            }
            return {};
          })
          .finally(() => {
            loading.value = false;
            stDB.value = stDB.value.filter((st) => st.id !== id);
          });
      };

      return {
        stDB,
        deleteFrom,
      };
    },
  };
</script>
