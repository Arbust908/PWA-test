<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 pr-3">
            <h2 class="text-2xl font-semibold text-second-900">Ordenes de Trabajo</h2>
            <router-link to="/orden-de-trabajo/nueva">
                <PrimaryBtn>Crear nueva</PrimaryBtn>
            </router-link>
        </header>
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2 mb-8">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
        </div>

        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="filteredWorkOrders" :actions="actions">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="[item.id ? null : 'empty', item.visible ? null : 'notallowed']">
                    {{ item.id || 'Sin definir' }}
                </td>

                <td :class="[item.clientName ? null : 'empty', item.visible ? null : 'notallowed']">
                    {{ item.clientName || 'Sin definir' }}
                </td>

                <td :class="[item.pits ? null : 'empty', item.visible ? null : 'notallowed']">
                    {{ listPits(item.pits) }}
                </td>

                <td class="text-center" :class="[item ? null : 'empty', item.visible ? null : 'notallowed']">
                    <Badge v-if="isEquipmentFull(item) > 0" text="Completo" classes="bg-green-500 text-white" />
                    <Badge v-else text="Incompleto" classes="bg-red-300 text-white" />
                </td>

                <td class="text-center" :class="[item ? null : 'empty', item.visible ? null : 'notallowed']">
                    <Badge v-if="item.crew.length > 0" text="Completo" classes="bg-green-500 text-white" />
                    <Badge v-else text="Incompleto" classes="bg-red-300 text-white" />
                </td>

                <tr v-if="workOrders && workOrders.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay clientes cargados</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.clientName }}
            </template>

            <template #mobileSubtitle="{ item }">
                <div class="flex items-center mt-1">
                    <Icon
                        :icon="isTotallyComplete(item) ? 'Check' : 'ExclamationCircle'"
                        :type="solid"
                        :class="isTotallyComplete(item) ? 'icon-complete' : 'icon-incomplete'"
                    />
                    <span class="font-bold">ID: </span>{{ item.id }} - <span class="font-bold"> Pozos: </span>
                    {{ listPits(item.pits) }}
                </div>
            </template>
        </VTable>

        <Modal title="¿Desea inhabilitar esta orden de trabajo?" type="error" :open="showModal">
            <template #body>
                <div>Una vez inhabilitada, no podrá utilizar este orden en ninguna otra sección de la aplicación</div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="!bg-red-700" @click="confirmModal">Inhabilitar cliente </PrimaryBtn>
                </div>
            </template>
        </Modal>

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <div class="flex items-center mt-1">
                    <Icon
                        :icon="isTotallyComplete(selectedWorkOrder) ? 'Check' : 'ExclamationCircle'"
                        :type="solid"
                        :class="isTotallyComplete(selectedWorkOrder) ? 'icon-complete' : 'icon-incomplete'"
                    /><span class="font-bold">{{ selectedWorkOrder.clientName }}</span>
                </div>
                <div><span class="font-bold">ID: </span>{{ selectedWorkOrder.id }}</div>
                <div><span class="font-bold">Pozos: </span>{{ listPits(selectedWorkOrder.pits) }}</div>
                <div>
                    <span class="font-bold">Equipamiento: </span
                    >{{ isEquipmentFull(selectedWorkOrder) ? 'Completo' : 'Incompleto' }}
                </div>
                <div>
                    <span class="font-bold">RRHH: </span
                    >{{ selectedWorkOrder.crew.length > 0 ? 'Completo' : 'Incompleto' }}
                </div>
            </template>
        </Backdrop>
    </Layout>
</template>

<script lang="ts">
    import { ref, computed, watch, defineComponent, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import axios from 'axios';
    import Modal from '@/components/modal/General.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import Badge from '@/components/ui/Badge.vue';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    import { useTitle } from '@vueuse/core';
    import { WorkOrder } from '@/interfaces/WorkOrder';

    export default defineComponent({
        components: {
            Layout,
            PrimaryBtn,
            UiTable,
            Icon,
            GhostBtn,
            FieldSelect,
            Modal,
            VTable,
            Badge,
            Backdrop,
        },
        setup() {
            useTitle('Ordenes de Trabajo <> Sandflow');
            const store = useStore();
            const router = useRouter();
            const workOrders = ref([]);
            const companies = ref([]);
            const clientId = ref(-1);
            const selectedWorkOrder = ref({});
            const showModal = ref(false);
            const showBackdrop = ref(false);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
            });

            const columns = [
                { title: 'N°', key: 'id', sortable: true },
                { title: 'Cliente', key: 'clientName', sortable: true },
                { title: 'Pozos', key: 'pits', sortable: false },
                { title: 'Equipamiento', key: 'cradle', sortable: false },
                { title: 'RRHH', key: 'crew', sortable: false },
                { title: 'Acciones', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedWorkOrder.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/orden-de-trabajo/${item.id}`);
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

            watch(workOrders, (newValue, _) => {
                if (newValue) {
                    storeToState(newValue);
                }
            });

            const openModalVisibility = async (workOrder) => {
                selectedWorkOrder.value = workOrder;

                if (workOrder.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedWorkOrder.value);
            };

            const update = async (order) => {
                const payload = {
                    ...order,
                    visible: !order.visible,
                };
                await axios.put(`${apiUrl}/workOrder/${order.id}`, payload);
                await getWorkOrders();
            };

            const confirmModal = async () => {
                await update(selectedWorkOrder.value);
                showModal.value = false;
            };

            const listPits = (pits: Array<Pit>) => {
                if (!pits || pits.length <= 0) {
                    return '-';
                }

                return pits.reduce((list, pit) => {
                    list += list === '' ? pit.name : `, ${pit.name}`;

                    return list;
                }, '');
            };

            const storeToState = (wOs: Array<WorkOrder>) => {
                return wOs.map((wO) => {
                    store.dispatch('saveWorkOrder', wO);
                });
            };

            const isTotallyComplete = (item) => {
                return isEquipmentFull(item) && item.crew.length > 0 ? true : false;
            };

            const deleteWorkOrder = async (woId) => {
                await axios.delete(`${apiUrl}/workOrder/${woId}`).then((res) => {
                    if (res.status == 200) {
                        store.dispatch('deleteWorkOrder', woId);
                        workOrders.value = workOrders.value.filter((woFromApi) => {
                            return woFromApi.id !== woId;
                        });
                    }
                });
            };

            const filteredWorkOrders = computed(() => {
                if (clientId.value > -1) {
                    return workOrders.value.filter((order) => {
                        if (parseInt(order.client) == clientId.value) {
                            return order;
                        }
                    });
                }

                return workOrders.value;
            });

            const isEquipmentFull = (order) => {
                return (
                    parseInt(order.operativeCradle) >= 0 &&
                    parseInt(order.operativeForklift) >= 0 &&
                    order.traktors.length > 0 &&
                    order.pickups.length > 0 &&
                    order.conex >= 0 &&
                    order.generators >= 0 &&
                    order.rigmats >= 0 &&
                    order.tower >= 0 &&
                    order.cabin >= 0
                );
            };

            const getWorkOrders = async () => {
                return await axios.get(`${apiUrl}/workOrder`).then((res) => {
                    workOrders.value = res.data.data;
                });
            };

            const getCompanies = async () => {
                return await axios.get(`${apiUrl}/company`).then((res) => {
                    companies.value = res.data.data;
                });
            };

            const idToName = (id: number) => {
                if (id == -1) {
                    return 'Sin operadora';
                }
                let company = companies.value.filter((company) => {
                    if (company.id == id) {
                        return company;
                    }
                })[0];

                return company.name;
            };

            onMounted(async () => {
                await getWorkOrders();
                await getCompanies();
                workOrders.value.forEach((workOrder) => {
                    workOrder.clientName = idToName(parseInt(workOrder.client));
                    workOrder.operatorName = idToName(parseInt(workOrder.serviceCompany));

                    return workOrder;
                });
            });

            return {
                workOrders,
                deleteWorkOrder,
                listPits,
                pagination,
                columns,
                actions,
                filteredWorkOrders,
                clientId,
                isEquipmentFull,
                isTotallyComplete,
                openModalVisibility,
                showModal,
                confirmModal,
                showBackdrop,
                selectedWorkOrder,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .icon-complete {
        @apply h-4 w-4 mr-1 bg-green-500 rounded-full text-white;
    }
    .icon-incomplete {
        @apply h-4 w-4 mr-1 bg-red-500 rounded-full text-white;
    }
</style>
