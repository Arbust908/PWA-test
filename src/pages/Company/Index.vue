<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Clientes</h2>
            <router-link to="/clientes/nuevo">
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
                                ID
                            </th>
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
                                Razón social
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                CUIL/CUIT
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Obersvaciones
                            </th>
                            <th scope="col" colspan="2" class="relative px-6 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(client, cKey) in clDB"
                            :key="client.id"
                            :class="cKey % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                            class="hover:bg-gray-100"
                            >
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ client.id }}
                            </td>
                            <td
                                :class="client.name ? 'text-gray-500' : 'text-gray-400 italic'"
                                class="px-6 py-4 whitespace-nowrap text-sm"
                            >
                                {{ client.name || 'Sin definir' }}
                            </td>
                            <td
                                :class="client.legalName ? 'text-gray-500' : 'text-gray-400 italic'"
                                class="px-6 py-4 whitespace-nowrap text-sm"
                            >
                                {{ client.legalName || "Sin definir" }}
                            </td>
                            <td
                                :class="client.legalId ? 'text-green-500' : 'text-blue-500'"
                                class="px-6 py-4 whitespace-nowrap text-sm"
                            >
                                {{ client.legalId || 'Sin definir' }}
                            </td>
                            <td
                                :class="client.observations ? 'text-green-500' : 'text-blue-500'"
                                class="px-6 py-4 whitespace-nowrap text-sm"
                            >
                                {{ client.observations || 'Sin definir' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <span class="text-red-600 hover:text-red-900 cursor-pointer" @click="deleteFrom(client.id)">
                                Delete
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <router-link :to="`/clientes/${client.id}`" class="text-indigo-600 hover:text-indigo-900">
                                Editar
                                </router-link>
                            </td>
                            </tr>
                            <tr v-if="clDB.length <= 0">
                            <td colspan="5" class="text-center text-xs text-gray-500 px-6 py-4">
                                <p>No hay clientes cargados</p>
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
import Layout from '@/layouts/Main.vue';
import UiBtn from '@/components/ui/Button.vue';
import { useStore } from 'vuex';
import axios from 'axios';

const api = import.meta.env.VITE_API_URL;

export default {
    components: {
        Layout,
        UiBtn
    },
    setup() {
        const store = useStore();
        const clDB = ref([]);
        const clStoreDB = JSON.parse(JSON.stringify(store.state.client.all));

        onMounted(async () => {
        const loading = ref(true);
        clDB.value = await axios
            .get(`${api}/company`)
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
                loading.value = false;
            });

            if (clDB.value && clDB.value.length > 0) {
                if (clDB.value.length > clStoreDB.length) {
                    if (clStoreDB.length === 0) {
                        console.log(clDB.value, 'llega')
                        clDB.value.forEach((client, sKey) => {
                        store.dispatch('saveClient', client);
                    });
                } else {
                    const newsDB = clDB.value.filter((clFromApi, key) => {
                    return clFromApi.id && clStoreDB[key] && clFromApi.id !== clStoreDB[key].id;
                    });
                    newsDB.forEach((client, stKey) => {
                    store.dispatch('saveClient', client);
                    });
                }
                }
            }
            });

            const deleteFrom = async(id) => {
                const loading = ref(true);
                let clStoreDB = await axios
                    .delete(`${api}/company/${id}`)
                    .catch((err) => {
                    console.log(err);
                    })
                    .then((res) => {
                        console.log('OK', id)
                    return {};
                    })
                    .finally(() => {
                        loading.value = false;
                        clDB.value = clDB.value.filter(st => st.id !== id)
                    });
            }

        return {
            clDB,
            deleteFrom
        }
    }
}
</script>