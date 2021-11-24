<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Notificaciones a Proveedores</h2>
            <router-link to="/proveedores-de-transporte/nuevo">
                <PrimaryBtn size="sm">
                    <span> Crear </span>
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
                placeholder="Seleccionar proveedor"
                endpoint="/transportProvider"
                :data="transportProviderId"
                @update:data="transportProviderId = $event"
            />
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <VTable
            class="mt-5"
            :columns="columns"
            :pagination="pagination"
            :items="filteredTransportProviders"
            :actions="actions"
        >
            <!-- Desktop -->
            <template #item="{ item }">
                <td :class="item.sandProvider.name ? null : 'empty'">
                    {{ item.sandProvider.name || 'Sin cliente' }}
                </td>
                <td :class="item.sandOrder.amount ? null : 'empty'">
                    {{ item.sandOrder.amount || 'Sin arena' }}
                </td>
                <td :class="item.transportProviders ? null : 'empty'">
                    {{ item.transportProviders ? item.transportProviders.length : 'No hay transporte' }}
                </td>
                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.transportProviders ? sumTransport(item.transportProviders) : '-' }}
                </td>
                <td>ESTADO</td>
                <tr v-if="filteredTransportProviders && filteredTransportProviders.length <= 0">
                    <td :colspan="columns.length" class="emptyState">
                        <p>No hay Notificaciones a Proveedores</p>
                    </td>
                </tr>
            </template>
            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.sandProvider.name || 'Sin cliente' }}
            </template>
            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Domicilio: </span>{{ item.address }}
            </template>
        </VTable>
        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <BackdropCard :info="bdInfo" />
            </template>
        </Backdrop>
        <Modal title="¿Desea inhabilitar este proveedor de transporte?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este proveedor de transporte en ninguna otra sección de la
                    aplicación
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <ErrorBtn @click="confirmModal">Inhabilitar proveedor </ErrorBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed, defineAsyncComponent } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import { useRouter } from 'vue-router';

    import BackdropCard from '@/components/transportProvider/BackdropCard.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const ErrorBtn = defineAsyncComponent(() => import('@/components/ui/buttons/ErrorBtn.vue'));

    export default {
        components: {
            Backdrop,
            BackdropCard,
            FieldSelect,
            GhostBtn,
            Icon,
            Layout,
            Modal,
            PrimaryBtn,
            VTable,
            ErrorBtn,
        },
        setup() {
            useTitle('Notificaciones a Proveedores <> Sandflow');
            const tpDB = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const notificationId = ref(-1);
            const selectedNotification = ref(null);
            const showModal = ref(false);
            const showBD = ref(false);
            const bdInfo = ref(null);
            const toggleBD = () => (showBD.value = !showBD.value);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Crto. de carga', key: 'name', sortable: true },
                { title: 'Arena', key: 'legalId', sortable: true },
                { title: 'Transporte', key: 'companyRepresentative.name', sortable: true },
                { title: 'Camiones', key: 'companyRepresentative.phone', sortable: true },
                { title: 'Estado', key: 'companyRepresentative.phone', sortable: true },
                { title: 'Acciones', key: 'name' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        bdInfo.value = item;
                        showBD.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/notificaciones-a-proveedores/${item.id}`);
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

            const filteredTransportProviders = computed(() => {
                if (notificationId.value > -1) {
                    return tpDB.value.filter((tp) => tp.id == notificationId.value);
                }

                return tpDB.value;
            });

            const clearFilters = () => {
                notificationId.value = -1;
            };

            const getTP = async () => {
                const res = await axios.get(`${api}/providerNotification`).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    tpDB.value = res.data.data;
                }

                store.dispatch('setTransportProviders', tpDB.value);
            };

            onMounted(async () => {
                loading.value = true;
                await getTP();
                loading.value = false;
            });

            const openModalVisibility = async (transportProvider) => {
                selectedNotification.value = transportProvider;

                if (transportProvider.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedNotification.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedNotification.value);
                showModal.value = false;
            };

            const updateVisibility = async (tp) => {
                const payload = {
                    ...tp,
                    visible: !tp.visible,
                };

                await store.dispatch('updateProviderNotification', payload);
            };

            return {
                actions,
                bdInfo,
                clearFilters,
                columns,
                confirmModal,
                filteredTransportProviders,
                loading,
                notificationId,
                openModalVisibility,
                pagination,
                selectedNotification,
                showBD,
                showModal,
                toggleBD,
                tpDB,
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

<!-- <script>
    import { ref, watch } from 'vue';
    import { useStore } from 'vuex';
    import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PencilAltIcon,
            TrashIcon,
            PrimaryBtn,
            UiTable,
            Icon,
        },
        setup() {
            useTitle('Notificaciones a Proveedores <> Sandflow');
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
                const { data } = useAxios('/providerNotification/' + id, { method: 'DELETE' }, instance);
                store.dispatch('deleteProviderNotification', id);
                ProviderNotifications.value = ProviderNotifications.value.filter((pn) => {
                    return pn.id !== id;
                });
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
</script> -->
