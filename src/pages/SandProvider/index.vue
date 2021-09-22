<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-gray-900">Proveedores de arena</h2>
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
          v-for="(sandProvider, spKey) in sandProviders"
          :key="sandProvider.id"
          :class="spKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td :class="sandProvider.name ? null : 'empty'">
            {{ sandProvider.name || 'Sin nombre' }}
          </td>
          <td :class="sandProvider.address ? null : 'empty'">
            {{ sandProvider.address || 'Sin dirección' }}
          </td>
          <td :class="sandProvider.legalId ? null : 'empty'">
            {{ sandProvider.legalId || 'Sin CUIL/CUIT' }}
          </td>
          <td>
            <div class="btn-panel">
              <router-link :to="`/proveedores-de-arena/${sandProvider.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link>
              <button class="delete" @click="deleteSandProvider(sandProvider.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="sandProviders.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay proveedores de arena</p>
          </td>
        </tr>
      </template>
    </UiTable>
    <Modal
      type="off"
      :open="notificationModalvisible"
      @close="toggleNotificationModal"
    >
      <template #body>
        <p>{{ errorMessage }}</p>
        <button @click.prevent="toggleNotificationModal" class="closeButton">
          Cerrar
        </button>
      </template>
    </Modal>
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
  import { useStoreLogic } from '@/helpers/useStoreLogic';
  import Modal from '@/components/modal/General.vue';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
      Modal
    },
    setup() { 
      useTitle(`Proveedores de Arena <> Sandflow`);
      const sandProviders = ref([]);
      const store = useStore();
      const router = useRouter();
      const loading = ref(false);
      const notificationModalvisible = ref(false);
      const toggleNotificationModal = () =>
        (notificationModalvisible.value = !notificationModalvisible.value);
      const errorMessage = ref('');

      const deleteSandProvider = async (spID) => {
        await useStoreLogic(router, store, 'sandProvider', 'delete', spID).then((res) => {
          if (res.type == 'failed') {
            errorMessage.value = res.message;
            toggleNotificationModal();
          }
          if (res.type == 'success') sandProviders.value = store.getters['getSandProviders'];
        });
      };

      onMounted(async () => {
        loading.value = true;
        await useStoreLogic(router, store, 'sandProvider', 'getAll').then((res) => {
          if (res.type == 'failed') {
            errorMessage.value = res.message;
            toggleNotificationModal();
          }
          if (res.type == 'success') sandProviders.value = store.getters['getSandProviders'];
        });
        loading.value = false;
      });
      return {
        sandProviders,
        deleteSandProvider,
        loading,
        notificationModalvisible,
        toggleNotificationModal,
        errorMessage
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/table.scss';
</style>
