<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
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
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>

        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="filteredClients" :actions="actions">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item.name ? null : 'empty'">
                    {{ item.name || 'Sin definir' }}
                </td>

                <td :class="item.legalId ? null : 'empty'">
                    {{ item.legalId || 'Sin definir' }}
                </td>

                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.companyRepresentative.name || 'Sin definir' }}
                </td>

                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.companyRepresentative.phone || 'Sin definir' }}
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge v-if="item.isOperator" text="SI" classes="bg-gray-500 text-white px-5" />
                    <Badge v-else text="NO" classes="bg-gray-300 text-gray-600" />
                </td>

                <td v-if="false">
                    <div class="btn-panel">
                        <router-link :to="`/clientes/${item.id}`">
                            <Popper hover content="Editar">
                                <CircularBtn size="xs" class="btn__delete bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                </CircularBtn>
                            </Popper>
                        </router-link>

                        <Popper hover :content="item.visible ? 'Inhabilitar' : 'Habilitar'">
                            <CircularBtn
                                class="ml-4"
                                :class="item.visible ? 'bg-red-500' : 'bg-blue-500'"
                                size="xs"
                                @click="openModalVisibility(item)"
                            >
                                <Icon v-if="item.visible" icon="EyeOff" type="outlined" class="w-6 h-6 text-white" />
                                <Icon v-else icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>
                        </Popper>
                    </div>
                </td>

                <tr v-if="clDB && clDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay clientes cargados</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Domicilio: </span>{{ item.address }}
            </template>
        </VTable>

        <Modal title="¿Desea inhabilitar este cliente?" type="error" :open="showModal">
            <template #body>
                <div>Una vez inhabilitado, no podrá utilizar este cliente en ninguna otra sección de la aplicación</div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" @click="confirmModal">Inhabilitar cliente </PrimaryBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useTitle } from '@vueuse/core';
    import { useRouter } from 'vue-router';

    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import Popper from 'vue3-popper';

    import { useStore } from 'vuex';
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            CircularBtn,
            GhostBtn,
            Icon,
            FieldSelect,
            Badge,
            Modal,
            Popper,
            VTable,
        },
        setup() {
            useTitle('Clientes <> Sandflow');
            const store = useStore();
            const clDB = ref([]);
            const loading = ref(false);
            const clientId = ref(-1);
            const selectedClient = ref(null);
            const showModal = ref(false);
            const router = useRouter();

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Cliente', key: 'name', sortable: true },
                { title: 'CUIT', key: 'legalId', sortable: true },
                { title: 'Representante', key: 'companyRepresentative.name', sortable: true },
                { title: 'Teléfono', key: 'companyRepresentative.phone', sortable: true },
                { title: 'Operadora', key: 'operadora' },
                { title: 'Acciones', key: 'name' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    callback: () => {
                        console.log('Ver más');
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/clientes/${item.id}`);
                    },
                },
                {
                    label: 'Inhabilitar',
                    hide: (item) => {
                        return item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
                {
                    label: 'Habilitar',
                    hide: (item) => {
                        return !item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
            ];

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

            const openModalVisibility = async (client) => {
                selectedClient.value = client;

                if (client.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedClient.value);
            };

            const confirmModal = async () => {
                await update(selectedClient.value);
                showModal.value = false;
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
                loading,
                filteredClients,
                clientId,
                clearFilters,
                total,
                update,
                openModalVisibility,
                confirmModal,
                showModal,
                columns,
                pagination,
                actions,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .outline-none {
        outline: 0;
    }
</style>
