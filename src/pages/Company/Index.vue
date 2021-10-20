<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Clientes</h2>
            <router-link to="/clientes/nuevo">
                <PrimaryBtn size="sm"
                    >Crear
                    <Icon icon="PlusCircle" class="ml-1 w-4 h-4" />
                </PrimaryBtn>
            </router-link>
        </header>
        <hr />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-4"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <UiTable class="mt-5">
            <template #header>
                <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">CUIT</th>
                    <th scope="col">Contacto</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Operadora</th>
                    <th scope="col">
                        <span class="sr-only">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(client, cKey) in filteredClients"
                    :key="client.id"
                    :class="cKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="client.name ? null : 'empty'">
                        {{ client.name || 'Sin definir' }}
                    </td>
                    <td :class="client.legalId ? null : 'empty'">
                        {{ client.legalId || 'Sin definir' }}
                    </td>
                    <td :class="client.companyRepresentative ? null : 'empty'">
                        {{ client.companyRepresentative.name || 'Sin definir' }}
                    </td>
                    <td :class="client.companyRepresentative ? null : 'empty'">
                        {{ client.companyRepresentative.phone || 'Sin definir' }}
                    </td>

                    <td class="text-center" :class="client ? null : 'empty'">
                        <Badge v-if="client.isOperator" text="SI" classes="bg-gray-500 text-white" />
                        <Badge v-else text="NO" classes="bg-gray-300 text-gray-600" />
                    </td>

                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/clientes/${client.id}`">
                                <CircularBtn size="xs" class="btn__delete bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                </CircularBtn>
                            </router-link>

                            <CircularBtn size="xs" :class="client.visible ? 'bg-red-500' : 'bg-blue-500'">
                                <Icon
                                    :icon="client.visible ? 'EyeOff' : 'Eye'"
                                    type="outlined"
                                    class="w-6 h-6 text-white"
                                    @click="update(client)"
                                />
                            </CircularBtn>
                        </div>
                    </td>
                </tr>
                <tr v-if="clDB && clDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay clientes cargados</p>
                    </td>
                </tr>
            </template>
        </UiTable>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import { useClone } from '@/helpers/useClone';

    import { useStore } from 'vuex';
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            CircularBtn,
            GhostBtn,
            UiTable,
            Icon,
            FieldSelect,
            Badge,
        },
        setup() {
            useTitle('Clientes <> Sandflow');
            const store = useStore();
            const clDB = ref([]);
            const clStoreDB = useClone(store.state.client.all);
            const loading = ref(false);
            const clientId = ref(-1);

            const headers = {
                'Content-Type': 'Application/JSON',
            };

            const total = computed(() => {
                return clientId.value;
            });

            const filteredClients = computed(() => {
                if (clientId.value > -1) {
                    return clDB.value.filter((client) => client.id == clientId.value);
                }

                return clDB.value;
            });

            const getClients = async () => {
                loading.value = true;

                const res = await axios.get(`${apiUrl}/company`, headers).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    clDB.value = res.data.data;
                }
                store.dispatch('setClients', clDB.value);

                loading.value = false;
            };

            const deleteFrom = async (id) => {
                const loading = ref(true);
                let clStoreDB = await axios
                    .delete(`${apiUrl}/company/${id}`)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        console.log('OK', id);

                        return {};
                    })
                    .finally(() => {
                        loading.value = false;
                        clDB.value = clDB.value.filter((st) => st.id !== id);
                    });
            };

            const update = async (client) => {
                const payload = {
                    ...client,
                    visible: !client.visible,
                };
                await store.dispatch('updateVisibilityClient', payload);
                await getClients();
            };

            onMounted(async () => {
                await getClients();
            });

            const clearFilters = () => {
                clientId.value = -1;
            };

            return {
                clDB,
                deleteFrom,
                loading,
                filteredClients,
                clientId,
                clearFilters,
                total,
                update,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
