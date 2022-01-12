<template>
    <Layout>
        <ABMHeader title="Ordenes de trabajo" link="/orden-de-trabajo/nueva" />
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
                <td :class="item.id ? null : 'empty'">
                    {{ item.id || 'Sin definir' }}
                </td>

                <td :class="item.clientName ? null : 'empty'">
                    {{ item.clientName || 'Sin definir' }}
                </td>

                <td :class="item.pits && item.pits.length ? null : 'empty'">
                    {{ listPits(item.pits) || 'Sin pozo' }}
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge v-if="isEquipmentFull(item)" text="Completo" classes="bg-[#1AA532] text-white" />
                    <Badge v-else text="Incompleto" classes="bg-[#BE1A3B] text-white" />
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge v-if="isCrewFull(item)" text="Completo" classes="bg-[#1AA532] text-white" />
                    <Badge v-else text="Incompleto" classes="bg-[#BE1A3B] text-white" />
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.clientName }}
            </template>

            <template #mobileSubtitle="{ item }">
                <div class="flex items-center mt-1">
                    <Icon
                        :icon="isTotallyComplete(item) ? 'CheckCircle' : 'ExclamationCircle'"
                        :class="isTotallyComplete(item) ? 'icon-complete' : 'icon-incomplete'"
                    />
                    <span class="font-bold">ID: </span>{{ item.id }} - <span class="font-bold"> Pozos: </span>
                    {{ listPits(item.pits) }}
                </div>
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar esta orden de trabajo?"
            text="Una vez inhabilitada, no podrá utilizar este orden en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />
        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <div class="flex items-center mt-1">
                    <Icon
                        :icon="isTotallyComplete(selectedWorkOrder) ? 'Check' : 'ExclamationCircle'"
                        type="solid"
                        :class="isTotallyComplete(selectedWorkOrder) ? 'icon-complete' : 'icon-incomplete'"
                    /><span class="font-bold">{{ selectedWorkOrder.clientName }}</span>
                </div>
                <div><span class="font-bold">ID: </span>{{ selectedWorkOrder.id }}</div>
                <div><span class="font-bold">Pozos: </span>{{ listPits(selectedWorkOrder.pits) }}</div>
                <div>
                    <span class="font-bold">Equipamiento: </span>
                    {{ isEquipmentFull(selectedWorkOrder) ? 'Completo' : 'Incompleto' }}
                </div>
                <div>
                    <span class="font-bold">RRHH: </span>
                    {{ selectedWorkOrder.crew.length > 0 ? 'Completo' : 'Incompleto' }}
                </div>
            </template>
        </Backdrop>
    </Layout>
</template>

<script lang="ts">
    import { WorkOrder, Pit } from '@/interfaces/sandflow';
    import axios from 'axios';

    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import Badge from '@/components/ui/Badge.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    import { validateOrder, validateEquipment, validateHumanResourses } from '@/helpers/useWorkOrder';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            ABMHeader,
            Backdrop,
            Badge,
            DisableModal,
            FieldSelect,
            Icon,
            Layout,
            VTable,
        },
        setup() {
            useTitle('Ordenes de Trabajo <> Sandflow');
            const store = useStore();
            const router = useRouter();
            const workOrders = ref([]);
            const companies = ref([]);
            const clientId = ref(-1);
            const selectedWorkOrder = ref({} as WorkOrder);
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
                { title: '', key: 'actions' },
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

            const openModalVisibility = async (workOrder: WorkOrder) => {
                selectedWorkOrder.value = workOrder;

                if (workOrder.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedWorkOrder.value);
            };

            const update = async (order: WorkOrder) => {
                const payload = {
                    ...order,
                    visible: !order.visible,
                };
                await axios.put(`${apiUrl}/workOrder/${order.id}`, payload);
                await getWorkOrders();
                workOrders.value = populateInfo(workOrders.value);
            };

            const confirmModal = async () => {
                await update(selectedWorkOrder.value);
                workOrders.value = populateInfo(workOrders.value);
                showModal.value = false;
            };

            const listPits = (pits: Array<Pit>) => {
                if (!pits || pits.length <= 0) {
                    return null;
                }

                return pits.reduce((list: string, pit: Pit) => {
                    let result = list;
                    result += list === '' ? pit.name : `, ${pit.name}`;

                    return result;
                }, '');
            };

            const storeToState = (wOs: Array<WorkOrder>) => {
                return wOs.map((wO) => {
                    store.dispatch('saveWorkOrder', wO);
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

            const isEquipmentFull = (order: WorkOrder) => {
                return validateEquipment(
                    parseInt(order.operativeCradle),
                    0,
                    parseInt(order.operativeForklift),
                    0,
                    order.traktors,
                    order.pickups
                );
            };

            const isCrewFull = ({ crew }: WorkOrder) => {
                return validateHumanResourses(crew);
            };

            const isTotallyComplete = (item: WorkOrder) => {
                return isEquipmentFull(item) && isCrewFull(item);
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
                if (isNaN(id) || id == -1) {
                    return null;
                }
                let firstCompany = companies.value.find((company) => {
                    return company.id == id;
                });

                return firstCompany.name;
            };

            const populateInfo = (items: WorkOrder[]) => {
                const things = items.map((workOrder: WorkOrder) => {
                    workOrder.clientName = idToName(parseInt(workOrder.client));
                    workOrder.operatorName = idToName(parseInt(workOrder.serviceCompany));

                    return workOrder;
                });

                return things;
            };

            onMounted(async () => {
                await getWorkOrders();
                await getCompanies();
                workOrders.value = await populateInfo(workOrders.value);
            });

            return {
                workOrders,
                listPits,
                pagination,
                columns,
                actions,
                filteredWorkOrders,
                clientId,
                isEquipmentFull,
                isCrewFull,
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
        @apply h-5 w-5 mr-1 bg-transparent rounded-full text-[#1AA532];
    }
    .icon-incomplete {
        @apply h-5 w-5 mr-1 bg-transparent rounded-full text-[#BE1A3B];
    }
</style>
