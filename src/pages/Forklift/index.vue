<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Forklift</h2>
      <router-link to="/forklift/nuevo">
        <PrimaryBtn>Nuevo</PrimaryBtn>
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
    <Modal
      type="off"
      :open="notificationModalvisible"
      @close="toggleNotificationModal"
    >
    <template #body>
      <p>{{errorMessage}}</p>
      <button @click.prevent="toggleNotificationModal" class="closeButton">Cerrar</button>
    </template>
    </Modal>
  </Layout>

</template>

<script>
  import { onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  import axios from 'axios';
  import {useStoreLogic} from '@/helpers/useStoreLogic'
  import { useRouter } from 'vue-router';
  import Modal from '@/components/modal/General.vue';

  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  export default {
    components: {
      Layout,
      UiBtn,
      Modal
    },
    setup() {
      const fDB = ref([]);
      const store = useStore();
      const router = useRouter()
      const loading = ref(false);
      const notificationModalvisible = ref(false)
      const toggleNotificationModal = () => notificationModalvisible.value = !notificationModalvisible.value
      const errorMessage = ref("")

      const deleteTP = async (tpID) => {
        await useStoreLogic(router, store, 'forklift','delete',tpID)
        .then((res) => {
          if(res.type == 'failed') {
            errorMessage.value = res.message
            toggleNotificationModal();
          }
          if(res.type == 'success') fDB.value = store.getters['getForklifts']
        })
      };

      onMounted(async () => {
        loading.value = true;
        await useStoreLogic(router, store, 'forklift','getAll')
        .then((res) => {
          if(res.type == 'failed') {
            errorMessage.value = res.message
            toggleNotificationModal();
          }
          if(res.type == 'success') fDB.value = res.res
        })
        loading.value = false;
      });
      return {
        fDB,
        deleteTP,
        loading,
        notificationModalvisible,
        toggleNotificationModal,
        errorMessage
      };
    },
  };
</script>

<style lang="scss" scoped>
.closeButton {
  @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
}
</style>
