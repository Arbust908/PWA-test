<template>
    <Layout>
        <ABMHeader title="Proveedores de transporte" link="/proveedores-de-transporte/nuevo" />
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
                <td :class="item.name ? null : 'empty'">
                    {{ item.name || 'Sin cliente' }}
                </td>
                <td :class="item.address ? null : 'empty'">
                    {{ item.address || 'Sin Direccion' }}
                </td>
                <td :class="item.companyRepresentative !== null ? null : 'empty'">
                    {{ item.companyRepresentative?.name || 'Sin Representante' }}
                </td>
                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.companyRepresentative?.phone || 'Sin observaciones' }}
                </td>
                <tr v-if="filteredTransportProviders && filteredTransportProviders.length <= 0">
                    <td :colspan="columns.length" class="emptyState">
                        <p>No hay proveedores</p>
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

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este proveedor?"
            text="Una vez inhabilitado, no podrá utilizarlo en ninguna otra sección de la aplicación."
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <BackdropCard :info="bdInfo" />
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import axios from 'axios';

    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import BackdropCard from '@/components/transportProvider/BackdropCard.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    const api = import.meta.env.VITE_API_URL || '/api';
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));

    export default {
        components: {
            ABMHeader,
            Backdrop,
            BackdropCard,
            DisableModal,
            FieldSelect,
            Layout,
            VTable,
        },
        setup() {
            useTitle('Proveedores de Transporte <> Sandflow');
            const tpDB = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const transportProviderId = ref(-1);
            const selectedtransportProvider = ref(null);
            const showModal = ref(false);
            const showBD = ref(false);
            const bdInfo = ref(null);
            const toggleBD = () => (showBD.value = !showBD.value);
            const tableColumns = ['Proveedor', 'Domicilio', 'Representante', 'Teléfono'];

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Proveedor', key: 'name', sortable: true },
                { title: 'Domicilio', key: 'legalId', sortable: true },
                { title: 'Representante', key: 'companyRepresentative.name', sortable: true },
                { title: 'Teléfono', key: 'companyRepresentative.phone', sortable: true },
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
                        router.push(`/proveedores-de-transporte/${item.id}`);
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
                if (transportProviderId.value > -1) {
                    return tpDB.value.filter((tp) => tp.id == transportProviderId.value);
                }

                return tpDB.value;
            });

            const clearFilters = () => {
                transportProviderId.value = -1;
            };

            const getTP = async () => {
                const res = await axios.get(`${api}/transportProvider`).catch((err) => {
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
                selectedtransportProvider.value = transportProvider;

                if (transportProvider.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedtransportProvider.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedtransportProvider.value);
                showModal.value = false;
            };

            const updateVisibility = async (tp) => {
                const payload = {
                    ...tp,
                    visible: !tp.visible,
                };

                await store.dispatch('updateTransportProvider', payload);
            };

            return {
                tpDB,
                loading,
                filteredTransportProviders,
                clearFilters,
                transportProviderId,
                showModal,
                openModalVisibility,
                confirmModal,
                tableColumns,
                pagination,
                columns,
                actions,
                toggleBD,
                showBD,
                bdInfo,
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
