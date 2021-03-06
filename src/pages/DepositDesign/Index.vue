<template>
    <Layout>
        <ABMHeader title="Depósitos" link="/diseno-de-deposito/nueva" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="id"
                placeholder="Seleccionar depósito"
                endpoint="/warehouse"
                :data="selectedDeposit"
                endpoint-key="id"
                @update:data="selectedDeposit = $event"
            />
        </div>
        <VTable
            class="mt-5"
            :columns="columns"
            :pagination="pagination"
            :items="filteredDeposits"
            :actions="actions"
            empty-text="No hay depósitos cargados"
        >
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="[item.clientCompany.name ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ item.clientCompany.name || 'Sin definir' }}
                </td>

                <td :class="[item.workOrder?.pad ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ item.workOrder?.pad || 'Sin definir' }}
                </td>

                <td :class="[formatDeposit(item.layout).col ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ formatDeposit(item.layout).col || 'Sin definir' }}
                </td>

                <td :class="[formatDeposit(item.layout).row ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ formatDeposit(item.layout).row || 'Sin definir' }}
                </td>

                <td :class="[formatDeposit(item.layout).floor ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ formatDeposit(item.layout).floor || 'Sin definir' }}
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.clientCompany.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Pozo: </span>{{ item.workOrder?.pad }}
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este depósito?"
            text="Una vez inhabilitado, no podrá utilizar este depósito en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <div class="mb-4">
                    <span class="font-bold text-xl">{{ selectedDeposit.clientCompany.name }}</span>
                </div>
                <div>
                    <span class="">Pozo: {{ selectedDeposit.pit.name }}</span>
                </div>
                <div>
                    <span class="">Columnas: {{ formatDeposit(selectedDeposit.layout).col }}</span>
                </div>
                <div>
                    <span class="">Filas: {{ formatDeposit(selectedDeposit.layout).row }}</span>
                </div>
                <div>
                    <span class="">Niveles: {{ formatDeposit(selectedDeposit.layout).floor }}</span>
                </div>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import ABMHeader from '@/components/ui/ABMHeader.vue';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { getWorkOrders } from '@/helpers/useGetEntities';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PencilAltIcon,
            TrashIcon,
            PrimaryBtn,
            UiTable,
            Modal,
            FieldSelect,
            VTable,
            Badge,
            Backdrop,
            GhostBtn,
            DisableModal,
            ABMHeader,
        },
        setup() {
            useTitle('Depósitos <> Sandflow');
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });
            const selectedDeposit = ref(-1);
            const showModal = ref(false);
            const router = useRouter();
            const showBackdrop = ref(false);

            const deposits = ref([]);

            const getDeposits = async () => {
                return await axios.get(`${apiUrl}/warehouse`).then((response) => {
                    deposits.value = response.data.data;
                });
            };

            const workOrders = ref([]);

            onMounted(async () => {
                await getDeposits();
                workOrders.value = await getWorkOrders();
                deposits.value = deposits.value.map((deposit) => {
                    deposit.workOrder = workOrders.value.find((workOrder) => workOrder.id === deposit.pitId) || {};

                    return deposit;
                });
            });

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
            });

            const columns = [
                { title: 'Cliente', key: 'clientCompany.name', sortable: true },
                { title: 'PAD', key: 'workOrder.pad', sortable: true },
                { title: 'Columnas', key: 'col' },
                { title: 'Filas', key: 'row' },
                { title: 'Niveles', key: 'floor' },
                { title: '', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedDeposit.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/diseno-de-deposito/${item.id}`);
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

            const openModalVisibility = async (client) => {
                selectedDeposit.value = client;

                if (client.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedDeposit.value);
            };

            const confirmModal = async () => {
                await update(selectedDeposit.value);
                showModal.value = false;
            };

            const update = async (deposit) => {
                const payload = {
                    ...deposit,
                    visible: !deposit.visible,
                };
                await store.dispatch('updateVisibilityDeposit', payload);
                await getDeposits();
            };

            const formatDeposit = (deposit) => {
                const dimensions = Object.keys(deposit).reduce(
                    (dims, currentCell) => {
                        const proxy = currentCell.split('|');
                        const [floor, row, col] = proxy;
                        dims.floor = Math.max(dims.floor, floor);
                        dims.row = Math.max(dims.row, row);
                        dims.col = Math.max(dims.col, col);

                        return dims;
                    },
                    { floor: 0, row: 0, col: 0 }
                );

                return dimensions;
            };

            const filteredDeposits = computed(() => {
                if (selectedDeposit.value > -1) {
                    return deposits.value.filter((singleDeposit) => singleDeposit.id == selectedDeposit.value);
                }

                return deposits.value;
            });

            const clearFilters = () => {
                selectedDeposit.value = -1;
            };

            const formatedDeposit = (deposit) => {
                const dimensions = Object.keys(deposit).reduce(
                    (dims, currentCell) => {
                        const proxy = currentCell.split('|');
                        const [floor, row, col] = proxy;
                        dims.floor = Math.max(dims.floor, floor);
                        dims.row = Math.max(dims.row, row);
                        dims.col = Math.max(dims.col, col);

                        return dims;
                    },
                    { floor: 0, row: 0, col: 0 }
                );
                dimensions.dimensions = `${dimensions.row} x ${dimensions.col}`;

                return dimensions;
            };
            const deleteDeposit = (id) => {
                const loading = ref(true);
                const { data } = useAxios('/warehouse/' + id, { method: 'DELETE' }, instance);
                store.dispatch('deleteDeposit', id);
                deposits.value = deposits.value.filter((pn) => {
                    return pn.id !== id;
                });
                loading.value = false;
            };

            return {
                deposits,
                formatedDeposit,
                deleteDeposit,
                filteredDeposits,
                selectedDeposit,
                showModal,
                showBackdrop,
                pagination,
                columns,
                actions,
                confirmModal,
                openModalVisibility,
                update,
                formatDeposit,
                clearFilters,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .notavailable {
        background: #f2f2f2;
        color: #898989;
    }
</style>
