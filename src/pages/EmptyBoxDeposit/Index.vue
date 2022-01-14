<template>
    <Layout>
        <ABMFormTitle title="Depósito de cajas vacias" />
        <FieldGroup class="max-w-4xl items-start mb-4">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
        </FieldGroup>
        <div class="flex flex-row justify-between">
            <section class="bg-white rounded-md mr-10 shadow-sm mb-14 max-w-4xl w-3/5 h-full">
                <ABMFormTitle title="Detalle" />
                <!-- <img v-if="clientId < 0 || pitId < 0" src="@/assets/imgs/cajasvacias.png" alt="" /> -->
                <div
                    v-show="activeSection === null"
                    class="p-6 m-6 rounded-lg border-2 border-dashed text-center border-"
                >
                    <p>Seleccione cliente o pozo para comenzar</p>
                </div>
                <PurchaseOrderForm
                    v-if="activeSection === 'PurchaseOrder'"
                    :company-client-id="clientId"
                    :pit-id="pitId"
                    :selectedBoxes="selectedBoxesForTrucks"
                />
                <DepositGrid
                    v-if="activeSection === 'Deposit'"
                    class="w-full flex flex-col gap-5"
                    :selected-box="choosedBox"
                    :boxes="selectedBoxesForDeposit"
                    :rows="row"
                    :cols="col"
                    :floor="floor"
                    :deposit="warehouse.layout || {}"
                />
            </section>

            <section class="bg-white rounded-md shadow-sm mb-14 w-2/5">
                <ABMFormTitle title="Cajas vacias" class="p-4" />
                <div class="px-10 py-6" v-if="clientId > 0 && pitId > 0">
                    <BoxCard
                        v-for="box in boxes"
                        :key="box.boxId"
                        :boxId="box.boxId"
                        :estacion="box.estacion"
                        :selectedBoxesForTrucks="selectedBoxesForTrucks"
                        :selectedBoxesForDeposit="selectedBoxesForDeposit"
                        @deposit="deposit(box)"
                        @truck="truck(box)"
                    />
                    <BoxCard
                        v-if="choosedBox.category !== ''"
                        :floor="choosedBox.floor"
                        :row="choosedBox.row"
                        :col="choosedBox.col"
                        :category="choosedBox.sandTypeId.toString()"
                        :choosed-box="choosedBox"
                    />
                </div>
                <div v-else class="flex flex-row bg-gray-100 m-4 p-4 rounded text-center text-sm text-black">
                    <Icon icon="ExclamationCircle" type="outline" class="w-5 h-5" />
                    <p class="ml-2">No hay cajas vacias por retirar</p>
                </div>
            </section>
        </div>
        <footer class="mt-8 space-x-3 flex justify-end">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/')">Cancelar</SecondaryBtn>
            <PrimaryBtn btn="wide" size="md"> Generar orden </PrimaryBtn>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import { useRouter, useRoute } from 'vue-router';
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/EmptyBox/EmptyBox.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
    import { formatDeposit, defaultBox, getInDepoBoxes } from '@/helpers/useWarehouse';
    import {
        getPurchaseOrders,
        getSandOrders,
        getWarehouses,
        getCradles,
        getWorkOrders,
        getSand,
    } from '@/helpers/useGetEntities';
    import { Warehouse } from '@/interfaces/sandflow';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            ABMFormTitle,
            ClientPitCombo,
            FieldGroup,
            PrimaryBtn,
            SecondaryBtn,
            DepositGrid,
            BoxCard,
            Icon,
            PurchaseOrderForm,
        },

        setup() {
            useTitle('Depósito de cajas vacias');

            let activeSection = ref(null);

            const router = useRouter();
            const route = useRoute();
            const store = useStore();

            const instance = axios.create({
                baseURL: apiUrl,
            });

            // :: CLIENT
            const clientId = ref(-1);
            const clients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);

            watch(companiesData, (companiesApi) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                }
            });

            const selectedClientName = computed(() => {
                return clientId.value >= 0 ? clients.value.find((pit) => pit.id === clientId.value).name : '';
            });
            // << CLIENT

            // :: PITS
            const pitId = ref(-1);
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);

            watch(pitsData, (pitApi) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                    activeSection.value = 'Deposit';
                }
            });

            const selectedPitName = computed(() => {
                return pitId.value >= 0 ? pits.value.find((pit) => pit.id === pitId.value).name : '';
            });
            const showPurchaseOrder = ref(false);
            const showDepositGrid = ref(false);
            // :: BOXES
            // let boxes = ref([]);
            const boxes = ref([
                {
                    id: 3,
                    amount: 200,
                    boxId: 'P-0001',
                    purchaseOrderId: 2,
                    sandProviderId: 3,
                    sandTypeId: 1,
                    status: 0,
                    location: '{"where":"warehouse","where_id":1,"floor":1,"row":2,"col":5}',
                    createdAt: '2022-01-13T13:48:39.000Z',
                    updatedAt: '2022-01-13T13:51:32.000Z',
                    deletedAt: null,
                    providerNotifications: [],
                    queueItems: [
                        {
                            id: 4,
                            sandOrderId: 3,
                            pitId: 4,
                            origin: 'Camion',
                            destination: 'Deposito',
                            status: 0,
                            order: 99,
                            createdAt: '2022-01-11T15:36:24.000Z',
                            updatedAt: '2022-01-11T15:36:24.000Z',
                            deletedAt: null,
                        },
                    ],
                    sandType: {
                        id: 1,
                        categoryId: null,
                        observations: '',
                        type: '100',
                        visible: true,
                        createdAt: '2022-01-13T13:25:55.000Z',
                        updatedAt: '2022-01-13T13:25:55.000Z',
                        deletedAt: null,
                    },
                    purchaseOrder: {
                        id: 2,
                        companyId: 4,
                        pitId: 2,
                        sandProviderId: 3,
                        transportProviderId: 1,
                        deliveryTime: '2022-05-22T12:00:00.000Z',
                        packageObservations: '',
                        driverId: 1,
                        isFullyAllocated: 1,
                        cancelled: false,
                        createdAt: '2022-01-13T13:48:38.000Z',
                        updatedAt: '2022-01-13T13:51:32.000Z',
                        deletedAt: null,
                    },
                    sandProvider: {
                        id: 3,
                        name: 'PanchoArenitas',
                        address: 'Panchinel 222',
                        legalId: 55356575459,
                        meshType: [
                            {
                                id: 1,
                                type: '100',
                            },
                            {
                                id: 2,
                                type: 'Fina',
                            },
                            {
                                id: 3,
                                type: 'Malla 4',
                            },
                            {
                                id: 4,
                                type: '70 / 40',
                            },
                            {
                                id: 5,
                                type: '250 / 99',
                            },
                        ],
                        observations: '',
                        companyRepresentativeId: 6,
                        visible: true,
                        createdAt: '2022-01-13T13:37:37.000Z',
                        updatedAt: '2022-01-13T13:37:37.000Z',
                        deletedAt: null,
                    },
                },
                {
                    id: 3,
                    amount: 200,
                    boxId: 'P-0002',
                    purchaseOrderId: 2,
                    sandProviderId: 3,
                    sandTypeId: 1,
                    status: 0,
                    location: '{"where":"warehouse","where_id":1,"floor":1,"row":2,"col":5}',
                    createdAt: '2022-01-13T13:48:39.000Z',
                    updatedAt: '2022-01-13T13:51:32.000Z',
                    deletedAt: null,
                    providerNotifications: [],
                    queueItems: [
                        {
                            id: 4,
                            sandOrderId: 3,
                            pitId: 4,
                            origin: 'Camion',
                            destination: 'Deposito',
                            status: 0,
                            order: 99,
                            createdAt: '2022-01-11T15:36:24.000Z',
                            updatedAt: '2022-01-11T15:36:24.000Z',
                            deletedAt: null,
                        },
                    ],
                    sandType: {
                        id: 1,
                        categoryId: null,
                        observations: '',
                        type: '100',
                        visible: true,
                        createdAt: '2022-01-13T13:25:55.000Z',
                        updatedAt: '2022-01-13T13:25:55.000Z',
                        deletedAt: null,
                    },
                    purchaseOrder: {
                        id: 2,
                        companyId: 4,
                        pitId: 2,
                        sandProviderId: 3,
                        transportProviderId: 1,
                        deliveryTime: '2022-05-22T12:00:00.000Z',
                        packageObservations: '',
                        driverId: 1,
                        isFullyAllocated: 1,
                        cancelled: false,
                        createdAt: '2022-01-13T13:48:38.000Z',
                        updatedAt: '2022-01-13T13:51:32.000Z',
                        deletedAt: null,
                    },
                    sandProvider: {
                        id: 3,
                        name: 'PanchoArenitas',
                        address: 'Panchinel 222',
                        legalId: 55356575459,
                        meshType: [
                            {
                                id: 1,
                                type: '100',
                            },
                            {
                                id: 2,
                                type: 'Fina',
                            },
                            {
                                id: 3,
                                type: 'Malla 4',
                            },
                            {
                                id: 4,
                                type: '70 / 40',
                            },
                            {
                                id: 5,
                                type: '250 / 99',
                            },
                        ],
                        observations: '',
                        companyRepresentativeId: 6,
                        visible: true,
                        createdAt: '2022-01-13T13:37:37.000Z',
                        updatedAt: '2022-01-13T13:37:37.000Z',
                        deletedAt: null,
                    },
                },
            ]);

            const selectedBoxesForTrucks = ref([]);
            const selectedBoxesForDeposit = ref([]);

            const deposit = (box) => {
                choosedBox.value = box;

                if (selectedBoxesForDeposit.value.filter((check) => check.boxId === box.boxId).length > 0) {
                    selectedBoxesForDeposit.value = selectedBoxesForDeposit.value.filter(
                        (check) => check.boxId !== box.boxId
                    );
                } else {
                    selectedBoxesForDeposit.value.push(box);
                }

                // if (selectedBoxesForDeposit.value.length > 0){
                //     activeSection.value = 'Deposit';
                // } else {
                //     activeSection.value = null;
                // }
                console.log(selectedBoxesForDeposit.value);
            };

            const truck = (box) => {
                if (selectedBoxesForTrucks.value.filter((check) => check.boxId === box.boxId).length > 0) {
                    selectedBoxesForTrucks.value = selectedBoxesForTrucks.value.filter(
                        (check) => check.boxId !== box.boxId
                    );
                } else {
                    selectedBoxesForTrucks.value.push(box);
                }

                // if (selectedBoxesForTrucks.value.length > 0){
                //     activeSection.value = 'PurchaseOrder';
                // } else {
                //     activeSection.value = null;
                // }
            };

            // :: DEPOSIT
            const warehouses = ref([]);
            const warehouse = ref({});

            const floor = ref(0);
            const row = ref(0);
            const col = ref(0);

            const choosedBox = ref({
                ...defaultBox,
            });

            const assingWareHouseValue = async () => {
                warehouse.value = await warehouses.value.find((singleWarehouse) => {
                    return (
                        parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                        parseInt(singleWarehouse.pitId) == pitId.value
                    );
                });
            };

            const assignDepositLayout = async () => {
                const { col: fCol, floor: fFloor, row: fRow } = await formatDeposit(warehouse.value?.layout);
                col.value = fCol;
                floor.value = fFloor;
                row.value = fRow;
            };

            watchEffect(async () => {
                if (clientId.value > 0 && pitId.value > 0) {
                    await assingWareHouseValue();
                    await assignDepositLayout();
                }

                boxes.value = boxes.value.map((box) => {
                    if (box.location && JSON.parse(box.location)) {
                        box.location = JSON.parse(box.location);
                        box.location.been_set = true;
                    }
                    return box;
                });
            });

            onMounted(async () => {
                warehouses.value = await getWarehouses();
            });

            return {
                clients,
                clientId,
                pitId,
                print,
                boxes,
                truck,
                deposit,
                showPurchaseOrder,
                showDepositGrid,
                selectedBoxesForTrucks,
                selectedBoxesForDeposit,
                floor,
                col,
                row,
                warehouse,
                choosedBox,
                activeSection,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
