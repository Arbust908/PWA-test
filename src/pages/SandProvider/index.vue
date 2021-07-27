<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Proovedores de arena</h2>
      <router-link to="/proveedores-de-arena/nuevo">
        <UiBtn>Nuevo</UiBtn>
      </router-link>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Raz�n social
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tipo de malla
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    grains
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span >Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(sp, spKey) in spDB"
                  :key="sp.id"
                  :class="spKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  class="hover:bg-gray-100"
                >
                  <td
                    :class="sp.name ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sp.name || 'Sin cliente' }}
                  </td>
                  <td
                    :class="sp.legalName ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sp.legalName || 'Sin cliente' }}
                  </td>
                  <td
                    :class="sp.meshType ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sp.meshType || 'Sin empresa de servicio' }}
                  </td>
                  <td
                    :class="sp.grains ? 'text-gray-500' : 'text-gray-400 italic'"
                    class="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ sp.grains || 'Sin empresa de servicio' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span @click="deleteSP(sp.id)" class="text-red-600 hover:text-red-900 cursor-pointer">
                      Borrar
                    </span>
                    <router-link :to="`/proveedores-de-arena/${sp.id}`" class="ml-4 text-indigo-600 hover:text-indigo-900">
                      Editar
                    </router-link>
                  </td>
                </tr>
                <tr v-if="spDB.length <= 0">
                  <td colspan="5" class="text-center text-xs text-gray-500 px-6 py-4">
                    <p>No hay proveedores de arena</p>
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
const api = 'https://sandflow-qa.bitpatagonia.com/api';
export default {
  components: {
    Layout,
    UiBtn,
  },
  setup() {
    const spDB = ref([]);
    const store = useStore();
    const sandProviders = JSON.parse(JSON.stringify(store.state.sandProviders.all));
    const loading = ref(false)

    const getSP = async() => {
      loading.value = true;
      spDB.value = await axios
        .get(`${api}/sandProvider`)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.status === 200) {
            return res.data.data
          }
          return [];
        })
      
      store.dispatch('setSandProviders', spDB.value)
    }

    const deleteSP = async(spID) => {
      let response = await axios
      .delete(`${api}/sandProvider/${spID}`)
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res)
          return res.data.data
        }
        return [];
      })
      .finally(() => {
        store.dispatch('deleteSandProvider', spID);
        getSP()
      });


      return {
        response
      }
    }

    onMounted(async () => {
      loading.value = true
      await getSP()
      loading.value = false
    });
    return {
      spDB,
      deleteSP,
      loading
    };
  },
};
</script>