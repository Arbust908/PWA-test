<template>
  <Layout>
    <header class="flex justify-between items-center mb-4 px-3">
      <h2 class="text-2xl font-semibold text-second-900">
        Notificaciones a Proveedores
      </h2>
      <router-link to="/notificaciones-a-proveedores/nueva">
        <UiBtn>Nueva Notificacion</UiBtn>
      </router-link>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-second-200
              sm:rounded-lg
            "
          >
            <table class="min-w-full divide-y divide-second-200">
              <thead class="bg-second-50">
                <tr>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-second-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Proveedor
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-second-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Ordenes
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-second-500
                      uppercase
                      tracking-wider
                    "
                    title="Cantidad de Arena"
                  >
                    C° Arena
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-second-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Transportes
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-second-500
                      uppercase
                      tracking-wider
                    "
                  >
                    C° de Camiones
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pn, Key) in ProviderNotifications"
                  :key="Key"
                  :class="Key % 2 === 0 ? 'bg-second-100' : 'bg-second-50'"
                  class="hover:bg-second-200"
                >
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-second-900
                    "
                  >
                    {{ pn.sandProvider.name }}
                  </td>
                  <td
                    class="text-second-500 px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {{ pn.sandOrder.amount }}t
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{
                      pn.transportProviders
                        ? pn.transportProviders.length
                        : 'No hay transporte'
                    }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{
                      pn.transportProviders
                        ? sumTransport(pn.transportProviders)
                        : '-'
                    }}
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
                    <div class="flex justify-end space-x-4">
                      <router-link
                        :to="`/notificaciones-a-proveedores/${pn.id}`"
                        class="flex text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilAltIcon class="w-5 h-5" />
                        <span> Editar </span>
                      </router-link>
                      <button
                        class="flex text-red-600 hover:text-red-900"
                        @click="deleteSP(pn.id)"
                      >
                        <TrashIcon class="w-5 h-5" />
                        <span> Eliminar </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="ProviderNotifications.length <= 0">
                  <td
                    colspan="5"
                    class="text-center text-xs text-second-500 px-6 py-4"
                  >
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
  import { ref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      Layout,
      PencilAltIcon,
      TrashIcon,
      UiBtn,
    },
    setup() {
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const ProviderNotifications = ref([]);
      const { data: pNData } = useAxios('/providerNotification', instance);
      watch(pNData, (pNData, prevCount) => {
        if (pNData && pNData.data) {
          ProviderNotifications.value = pNData.data;
          ProviderNotifications.value.forEach((pn) => {
            store.dispatch('saveProviderNotification', pn);
          });
        }
      });
      const sumQty = (sandOrder) => {
        return sandOrder.reduce((totalSum, sO) => {
          return totalSum + sO.amount;
        }, 0);
      };
      const sumTransport = (transportProviders) => {
        return transportProviders.reduce((totalSum, tP) => {
          return totalSum + tP.amount;
        }, 0);
      };
      const deletePN = (id) => {
        const loading = ref(true);
        const { data } = useAxios(
          '/providerNotification/' + id,
          { method: 'DELETE' },
          instance
        );
        store.dispatch('deleteProviderNotification', id);
        ProviderNotifications.value = ProviderNotifications.value.filter(
          (pn) => {
            return pn.id !== id;
          }
        );
        loading.value = false;
      };
      return {
        ProviderNotifications,
        deletePN,
        sumQty,
        sumTransport,
      };
    },
  };
</script>
