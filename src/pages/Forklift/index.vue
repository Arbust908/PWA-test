<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">
        Montacargas
      </h2>
      <router-link to="/montacargas/nuevo">
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
                    Asignación
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
                    Nombre dueño
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
                    Contacto dueño
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
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-right text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(f, fKey) in fDB"
                  :key="f.id"
                  :class="fKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td
                    :class="f.name ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ f.name || 'Sin nombre' }}
                  </td>
                  <td
                    class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ f.owned ? "Asignado" : "Sin asignar" || 'Sin asignación' }}
                  </td>
                  <td
                    :class="
                      f.ownerName ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ f.ownerName || 'Sin dueño' }}
                  </td>
                  <td
                    :class="
                      f.ownerContact ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ f.ownerContact || 'Sin contacto' }}
                  </td>
                  <td
                    :class="
                      f.observations ? 'text-gray-500' : 'text-gray-400 italic'
                    "
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ f.observations || 'Sin observaciones' }}
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
                      @click="deleteTP(f.id)"
                      class="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Borrar
                    </span>
                    <router-link
                      :to="`/montacargas/${f.id}`"
                      class="ml-4 text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="fDB.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-gray-500 px-6 py-4"
                  >
                    <p>No hay proveedores de transporte</p>
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
  import axios from 'axios';

  const api = import.meta.env.VITE_API_URL;
  export default {
    components: {
      Layout,
      UiBtn,
    },
    setup() {
      const fDB = ref([]);
      const store = useStore();
      const loading = ref(false);

      const getForklifts = async () => {
        loading.value = true;
        fDB.value = await axios
          .get(`${api}/forklift`)
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
          .delete(`${api}/forklift/${tpID}`)
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
