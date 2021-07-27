<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-second-900">Notificaciones a Proveedores</h2>
      <router-link to="/notificaciones-a-proveedores/nueva">
        <UiBtn>Nueva Notificacion</UiBtn>
      </router-link>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-second-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-second-200">
              <thead class="bg-second-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-second-500 uppercase tracking-wider"
                  >
                    Proveedor
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-second-500 uppercase tracking-wider"
                  >
                    Ordenes
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-second-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-second-500 uppercase tracking-wider"
                  >
                    Transportes
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pn, Key) in pNs"
                  :key="Key"
                  :class="Key % 2 === 0 ? 'bg-second-100' : 'bg-second-50'"
                  class="hover:bg-second-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-second-900">
                    {{ pn.sandProvider }}
                  </td>
                  <td class="text-second-500 px-6 py-4 whitespace-nowrap text-sm">
                    {{ pn.sandOrder.length }}
                  </td>
                  <td class="text-second-500 px-6 py-4 whitespace-nowrap text-sm">{{ sumQty(pn.sandOrder) }}t</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ pn.transportProviders.length }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-4">
                      <router-link
                        :to="`/centro-de-carga-de-arena/${pn.id}`"
                        class="flex text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button @click="deleteSP(pn.id)" class="flex text-red-600 hover:text-red-900">
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="pNs.length <= 0">
                  <td colspan="5" class="text-center text-xs text-second-500 px-6 py-4">
                    <p>No hay Notificaciones a Proveedores</p>
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
import { ref } from 'vue';
import { useStore } from 'vuex';
import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';

export default {
  components: {
    Layout,
    PencilAltIcon,
    TrashIcon,
    UiBtn,
  },
  setup() {
    const pNs = ref([]);
    const store = useStore();
    const allproviderNotifications = JSON.parse(JSON.stringify(store.state.providerNotification.all));
    pNs.value = allproviderNotifications;
    const sumQty = (sandOrder) => {
      return sandOrder.reduce((totalSum, sO) => {
        return totalSum + sO.amount;
      }, 0);
    };
    const deletePN = (id) => {
      const loading = ref(true);
      pNs.value = pNs.value.filter((pn) => {
        return pn.id !== id;
      });
      loading.value = false;
    };
    return {
      pNs,
      deletePN,
      sumQty,
    };
  },
};
</script>
