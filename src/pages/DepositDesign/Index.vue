<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-second-900">Depósitos</h2>
            <router-link to="/diseno-de-deposito/nueva">
                <PrimaryBtn>Nuevo Depósito</PrimaryBtn>
            </router-link>
        </header>
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
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
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

                <td :class="[item.pit ? null : 'empty', item.visible ? null : 'notavailable']">
                    {{ item.pit.name || 'Sin definir' }}
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

            <template #mobileSubtitle="{ item }"> <span class="font-bold">Pozo: </span>{{ item.pit.name }} </template>
        </VTable>

        <Modal title="¿Desea inhabilitar este depósito?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este depósito en ninguna otra sección de la aplicación
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn items-center">
                    <GhostBtn btn="!text-gray-500" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="!px-10 !bg-red-700" @click="confirmModal">Inhabilitar </PrimaryBtn>
                </div>
            </template>
        </Modal>

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
    import { ref, watch, computed, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { TrashIcon, PencilAltIcon } from '@heroicons/vue/solid';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';

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
            Modal,
            FieldSelect,
            VTable,
            Badge,
            Backdrop,
            GhostBtn,
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

            onMounted(async () => {
                await getDeposits();
            });

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
            });

            const columns = [
                { title: 'Cliente', key: 'clientCompany.name', sortable: true },
                { title: 'Pozos', key: 'pit.name', sortable: true },
                { title: 'Columnas', key: 'col' },
                { title: 'Filas', key: 'row' },
                { title: 'Niveles', key: 'floor' },
                { title: 'Acciones', key: 'name' },
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
