<template>
    <Layout>
        <ABMFormTitle title="Destino de cajas vacias" />
        <FieldGroup class="max-w-4xl items-start mb-4">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
        </FieldGroup>
        <div class="flex gap-x-6">
            <section class="bg-white rounded-md shadow-sm min-w-[308px] max-h-[620px] overflow-y-auto">
                <h2 class="p-6 pb-0 font-bold text-2xl">Cajas Vacias</h2>
                <div v-if="clientId > 0 && pitId > 0" class="px-6 py-5 space-y-5">
                    <BoxCard
                        v-for="box in boxes"
                        :key="box.sandOrder.boxId"
                        :box-id="box.sandOrder.boxId"
                        :estacion="box.origin"
                        :selected-boxes-for-trucks="selectedBoxesForTrucks"
                        :selected-boxes-for-deposit="selectedBoxesForDeposit"
                        @deposit="deposit(box)"
                        @truck="truck(box)"
                    />
                </div>
                <div v-else class="flex flex-row bg-gray-100 m-4 p-4 rounded text-center text-sm text-black">
                    <Icon icon="ExclamationCircle" type="outline" class="w-5 h-5" />
                    <p class="ml-2">No hay cajas vacias por retirar</p>
                </div>
            </section>

            <section class="bg-white rounded-md shadow-sm max-w-4xl p-4 grow">
                <ABMFormTitle title="Detalle" />
                <img v-if="clientId < 0 || pitId < 0" class="mx-auto" src="@/assets/imgs/cajasvacias.png" alt="" />
                <div
                    v-show="clientId >= 0 && pitId >= 0 && activeSection === null"
                    class="p-6 m-6 rounded-lg border-2 text-center"
                >
                    <p>Seleccione depósito ó camión para comenzar</p>
                </div>
                <PurchaseOrderForm
                    v-if="activeSection === 'PurchaseOrder'"
                    :company-client-id="clientId"
                    :pit-id="pitId"
                    :selected-boxes="selectedBoxesForTrucks"
                    :confirm-purchase-order="confirmPurchaseOrder"
                    @updateQueueItem="updateQueueItem()"
                />
                <DepositGrid
                    v-if="activeSection === 'Deposit'"
                    class="w-full flex flex-col gap-5"
                    :selected-box="choosedBox"
                    :boxes="inDepoBoxes"
                    :rows="row"
                    :cols="col"
                    :floor="floor"
                    :deposit="warehouse.layout || {}"
                    :is-destination="true"
                    @select-box="selectBox"
                />
            </section>
        </div>
        <footer class="mt-8 space-x-3 flex justify-end max-w-4xl xl:ml-[328px]">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/')">Cancelar</SecondaryBtn>
            <PrimaryBtn btn="wide" size="md" @click.prevent="confirm()"> Confirmar </PrimaryBtn>
        </footer>

        <SuccessModal
            :open="openSuccess"
            title="¡Perfecto!"
            text="Enviamos la orden de trabajo correspondiente."
            @main="closeModalAndReset()"
        />
    </Layout>
</template>

<script lang="ts">
    import { Ref } from 'vue';
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
    import {
        formatDeposit,
        defaultBox,
        getInDepoBoxes,
        searchInDepoBoxes,
        formatBoxLocation,
    } from '@/helpers/useWarehouse';
    import {
        getPurchaseOrders,
        getSandOrders,
        getWarehouses,
        getCradles,
        getWorkOrders,
        getSand,
    } from '@/helpers/useGetEntities';
    import { QueueItem, Warehouse } from '@/interfaces/sandflow';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));

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
            SuccessModal,
        },

        setup() {
            useTitle('Destino de cajas vacias');

            const instance = axios.create({
                baseURL: apiUrl,
            });
            const router = useRouter();

            //MODALS
            const openSuccess = ref(false);

            // :: CLIENT
            const clientId = ref(-1);
            const clients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);
            watch(companiesData, (companiesApi) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                    boxes.value = [];
                }
            });
            // :: PITS
            const pitId = ref(-1);
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);
            watch(pitsData, (pitApi) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                }
            });

            const showPurchaseOrder = ref(false);
            const showDepositGrid = ref(false);

            // :: BOXES
            // let boxes = ref([]);
            const getQueueItem = async () => {
                boxes.value = [];
                boxes.value = await axios
                    .get(`${apiUrl}/queueitem?status=10&pitId=${pitId.value}`)
                    .then((res) => {
                        return res.data.data;
                    })
                    .catch((err) => console.error(err));
                boxes.value = boxes.value.filter((box) => box.sandOrder);
            };

            const updateQueueItem = () => {
                if (selectedQueueForTrucks.value.length > 0) {
                    selectedQueueForTrucks.value.forEach((queueItem) => {
                        queueItem.status = 0;
                        console.log(queueItem);
                        useAxios('/queueItem/' + queueItem.id, { method: 'PUT', data: queueItem }, instance);
                    });
                }

                if (selectedQueueForDeposit.value.length > 0) {
                    selectedQueueForDeposit.value.forEach((queueItem) => {
                        queueItem.status = 0;
                        console.log('QueItem a guardar', queueItem);
                        useAxios('/queueItem/' + queueItem.id, { method: 'PUT', data: queueItem }, instance);
                    });
                }
            };

            const boxes = ref([]);
            const confirmPurchaseOrder = ref(false);

            const selectedBoxesForTrucks = ref([]);
            const selectedBoxesForDeposit = ref([]);
            // const selectedBoxForDeposit = ref({})

            const selectedQueueForTrucks = ref([]);
            const selectedQueueForDeposit = ref([]);

            const activeSection = computed(() => {
                if (selectedBoxesForDeposit.value.length > 0) {
                    return 'Deposit';
                }

                if (selectedBoxesForTrucks.value.length > 0) {
                    return 'PurchaseOrder';
                }

                return null;
            });

            const deposit = (box: QueueItem) => {
                choosedBox.value = box.sandOrder;

                const boxWasSelected = selectedBoxesForDeposit.value.find(
                    (check) => check.boxId === box.sandOrder.boxId
                );

                if (boxWasSelected) {
                    // Si la caja estaba seleccionad la borramos de la lista
                    selectedBoxesForDeposit.value = selectedBoxesForDeposit.value.filter(
                        (check) => check.boxId !== box.sandOrder.boxId
                    );
                    selectedQueueForDeposit.value = selectedQueueForDeposit.value.filter(
                        (check) => check.id !== box.id
                    );
                    // Hay que Vaciar la location de la caja
                    choosedBox.value.location = '';
                    // ...
                    // BoxInDeposit map chequear el que tenga el mimo id y le remplazamos la location
                } else {
                    // Sino la agregamos a la lista
                    selectedBoxesForDeposit.value.push(box.sandOrder);
                    selectedQueueForDeposit.value.push(box);
                    // tomar la box.location y guardarla en una variable
                }

                console.log('boxDeposit', selectedBoxesForDeposit.value);
                console.log('queueDeposit', selectedQueueForDeposit.value);
            };

            const truck = (box: QueueItem) => {
                const boxWasSelected = selectedBoxesForTrucks.value.find(
                    (check) => check.boxId === box.sandOrder.boxId
                );

                if (boxWasSelected) {
                    // Si la caja estaba seleccionad la borramos de la lista
                    selectedBoxesForTrucks.value = selectedBoxesForTrucks.value.filter(
                        (check) => check.boxId !== box.sandOrder.boxId
                    );
                    selectedQueueForTrucks.value = selectedQueueForTrucks.value.filter((check) => check.id !== box.id);
                } else {
                    // Sino la agregamos a la lista
                    selectedBoxesForTrucks.value.push(box.sandOrder);
                    selectedQueueForTrucks.value.push(box);
                }
            };

            const checkIfWasBoxInOriginalDeposit = (boxId) => {
                let response = false;
                Object.entries(originalWarehouseLayout.value.layout).forEach((cell) => {
                    if (cell[1].id == boxId) {
                        return (response = true);
                    }
                });

                return response;
            };

            const checkIfWasBoxInOriginalCradle = (boxId) => {
                let response = false;
                cradles.value.forEach((cradle) => {
                    cradle.slots.forEach((slot) => {
                        if (slot.boxId == boxId) {
                            response = true;
                        }
                    });
                });

                return response;
            };

            const selectBox = async (box: Box) => {
                // Si ya estaba en el deposito o en el cradle no se pisa
                // Igual no se deberia poder clickear ;D
                if (choosedBox.value.wasOriginallyOnDeposit || choosedBox.value.wasOriginallyOnCradle) {
                    return;
                }

                // Si clickea en un pasillo no hace nada. Sumo Cradle
                // Tampoco deberia poder clickear en un pasillo
                if (box.category == 'aisle' || box.category == 'cradle') {
                    return;
                }

                choosedBox.value.location = {
                    where: 'warehouse',
                    where_id: warehouse.value.id,
                    floor: box.floor,
                    row: box.row,
                    col: box.col,
                    where_origin: `F${box.row} C${box.col} N${box.floor}`,
                };

                choosedBox.value.floor = box.floor;
                choosedBox.value.row = box.row;
                choosedBox.value.col = box.col;
                sandOrders.value.push(choosedBox.value);
                wasWarehouseModificated.value = true;
                inDepoBoxes.value = getInDepoBoxes(sandOrders.value, warehouse.value.id);
            };

            // :: DEPOSIT
            const warehouses = ref([]);
            const warehouse = ref({});

            let wasWarehouseModificated = ref(false);

            const inDepoBoxes = ref([]);

            const floor = ref(0);
            const row = ref(0);
            const col = ref(0);

            const sandOrders = ref([]);

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
                if (clientId.value >= 0 && pitId.value >= 0) {
                    sandOrders.value = await getSandOrders();
                    sandOrders.value = sandOrders.value.filter((box: SandOrder) => box.location).map(formatBoxLocation);

                    await getQueueItem();
                    await assingWareHouseValue();
                    await assignDepositLayout();

                    if (warehouse.value) {
                        inDepoBoxes.value = await searchInDepoBoxes(warehouse.value.id);
                    }
                }

                boxes.value = boxes.value.map((box) => {
                    if (box.location && JSON.parse(box.location)) {
                        box.location = JSON.parse(box.location);
                        box.location.been_set = true;
                    }

                    return box;
                });
            });

            const saveDepositBoxes = async () => {
                const data = selectedBoxesForDeposit.value[0];
                data.location = JSON.stringify(data.location);
                console.log(data.location);
                await axios.put(`${apiUrl}/sandOrder/${data.id}`, data);
            };

            // SAVE
            const confirm = () => {
                // Chequeamos si hay boxes en truck para disparar save correspondiente
                if (selectedBoxesForTrucks.value.length > 0) {
                    confirmPurchaseOrder.value = true;
                }

                // Chequeamos is hay boxes en deposit para disparar el save correspondiente
                if (selectedBoxesForDeposit.value.length > 0) {
                    saveDepositBoxes();
                    updateQueueItem();
                    openSuccess.value = true;
                }
            };

            const closeModalAndReset = () => {
                clientId.value = -1;
                pitId.value = -1;
                selectedBoxesForDeposit.value = [];
                selectedBoxesForTrucks.value = [];
                openSuccess.value = false;
                router.go(0);
            };

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
                confirmPurchaseOrder,
                confirm,
                updateQueueItem,
                inDepoBoxes,
                selectBox,
                openSuccess,
                closeModalAndReset,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
