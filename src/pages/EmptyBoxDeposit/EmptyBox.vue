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
                <div v-if="boxes.length > 0" class="px-6 py-5 space-y-5">
                    <BoxCard
                        v-for="box in boxes"
                        :key="box.id"
                        :box-id="box.sandOrder.boxId"
                        :estacion="box.origin"
                        :selected-boxes-for-trucks="selectedBoxesForTrucks"
                        :selected-boxes-for-deposit="selectedBoxesForDeposit"
                        @deposit="deposit(box)"
                        @truck="truck(box)"
                    />
                </div>
                <div v-else class="flex flex-row bg-gray-100 mx-4 my-6 p-4 rounded text-center text-sm text-black">
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
                    @order-is-complete="confirmedPurchaseOrder = true"
                    @update-queue-item="updateQueueItem(selectedQueueForTrucks, 'truck', $event)"
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
            <PrimaryBtn btn="wide" size="md" :disabled="disabledConfirm" @click.prevent="confirm()">
                Confirmar
            </PrimaryBtn>
        </footer>

        <SuccessModal
            :open="openSuccess"
            title="¡Perfecto!"
            text="Las cajas ya tienen destino y estan listas para mover."
            @main="closeModalAndReset()"
        />
    </Layout>
</template>

<script setup lang="ts">
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
    import SuccessModal from '@/components/modal/SuccessModal.vue';
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
    import { Company, Pit, QueueItem, SandOrder, SandOrderBox, Warehouse } from '@/interfaces/sandflow';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { getFirst } from '@/helpers/iteretionHelpers';
    import { getOrderPro, QueueTransactions } from '@/helpers/useQueueItem';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useTitle('Destino de cajas vacias');

    const instance = axios.create({
        baseURL: apiUrl,
    });
    const router = useRouter();

    const confirmedPurchaseOrder = ref(false);
    const disabledConfirm = computed(() => {
        if (activeSection.value === 'PurchaseOrder') {
            return !confirmedPurchaseOrder.value;
        } else if (activeSection.value === 'Deposit') {
            const noBoxToMove = selectedBoxesForDeposit.value.length > 0;
            const boxHasPlace = choosedBox.value?.row;

            return noBoxToMove && !boxHasPlace;
        }

        return true;
    });

    //MODALS
    const openSuccess = ref(false);

    // :: CLIENT
    const clientId = ref(-1);
    const clients = ref([] as Array<Company>);
    const { data: companiesData } = useAxios('/company', instance);
    watch(companiesData, (companiesApi) => {
        if (companiesApi && companiesApi.data) {
            clients.value = companiesApi.data.filter((client: Company) => client.visible);
            boxes.value = [];
        }
    });
    // :: PITS
    const workOrders = ref([]);
    const pitId = ref(-1);
    const pits = ref([] as Array<Pit>);
    const { data: pitsData } = useAxios('/pit', instance);
    watch(pitsData, (pitApi) => {
        if (pitApi && pitApi.data) {
            pits.value = pitApi.data;
        }
    });

    const getQueueItem = async () => {
        boxes.value = [];
        boxes.value = await axios
            .get(`${apiUrl}/queueitem?status=10&pitId=${pitId.value}`)
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => console.error(err));
        console.log(boxes.value);
        boxes.value = boxes.value
            .filter((box) => box.sandOrder)
            .filter((box) => box.origin)
            .filter((box) => box.sandOrder)
            .filter((box) => box.sandOrder?.boxId);
    };

    /**
     * Revisa los queue Items, les pone estado 0 y los guarda
     * Esto es porque del OpCradle vienen con estado 11
     *
     * @param {Array<QueueItem>} queueItems
     * @param {string} origin puede ser o 'truck' o 'deposit'
     */
    const updateQueueItem = async (queueItemList: QueueItem[], origin: 'truck' | 'deposit', orderData: any = null) => {
        const { CradleADeposito, CradleATransporte } = QueueTransactions;

        await queueItemList.forEach(async (queueItem: QueueItem) => {
            queueItem.status = 0;

            if (origin === 'truck') {
                queueItem.order = await getOrderPro(CradleATransporte);
                queueItem.destination = `Camion ${orderData?.plates}`;
            } else if (origin === 'deposit') {
                queueItem.order = await getOrderPro(CradleADeposito);
                // Aca no ponemos destination porque ya lo trae
            }
            console.log('Queue Item que se actualiza', queueItem);

            useAxios('/queueItem/' + queueItem.id, { method: 'PUT', data: queueItem }, instance);
        });
    };

    const boxes = ref([] as QueueItem[]);
    const confirmPurchaseOrder = ref(false);

    const selectedBoxesForTrucks = ref([] as Array<SandOrderBox>);
    const selectedBoxesForDeposit = ref([] as Array<SandOrderBox>);

    const selectedQueueForTrucks = ref([] as Array<QueueItem>);
    const selectedQueueForDeposit = ref([] as Array<QueueItem>);

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
        confirmedPurchaseOrder.value = false;
        choosedBox.value = box.sandOrder as SandOrder;

        const boxWasSelected = selectedBoxesForDeposit.value.find((check) => check.boxId === box.sandOrder.boxId);

        if (boxWasSelected) {
            // Si la caja estaba seleccionad la borramos de la lista
            selectedBoxesForDeposit.value = selectedBoxesForDeposit.value.filter(
                (check) => check.boxId !== box.sandOrder.boxId
            );
            selectedQueueForDeposit.value = selectedQueueForDeposit.value.filter((check) => check.id !== box.id);
            // Hay que Vaciar la location de la caja
            choosedBox.value.location = '';
            // ...
            // BoxInDeposit map chequear el que tenga el mimo id y le remplazamos la location
        } else {
            // Sino la agregamos a la lista
            selectedBoxesForDeposit.value.push(box.sandOrder);
            selectedQueueForDeposit.value.push({ ...box });
            // tomar la box.location y guardarla en una variable
        }
    };

    const truck = (box: QueueItem) => {
        const boxWasSelected = selectedBoxesForTrucks.value.find((check) => check.boxId === box.sandOrder.boxId);
        console.log('El nuevo que item', box);

        if (boxWasSelected) {
            // Si la caja estaba seleccionad la borramos de la lista
            selectedBoxesForTrucks.value = selectedBoxesForTrucks.value.filter(
                (check) => check.boxId !== box.sandOrder.boxId
            );
            selectedQueueForTrucks.value = selectedQueueForTrucks.value.filter((check) => check.id !== box.id);
        } else {
            // Sino la agregamos a la lista
            selectedBoxesForTrucks.value.push(box.sandOrder);
            selectedQueueForTrucks.value.push({ ...box });
        }
    };

    /**
     * @param box es la celda de la grilla
     * Se usa para poner la locacion en la caja elegida
     * Tambien tenemos que cambiar el destino a la QueueItem
     */
    const selectBox = async (box: any) => {
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
        const sandOrderId = Number(choosedBox.value.id);
        const boxId = choosedBox.value.boxId;
        const selectedQueueItem = selectedQueueForDeposit.value.find((queueItem: QueueItem) => {
            return queueItem?.sandOrder?.id === sandOrderId && queueItem?.sandOrder.boxId === boxId;
        }) as QueueItem;
        console.log('selectedQueueItem', selectedQueueItem);
        // selectedQueueItem.origin = `F${box.row} C${box.col} N${box.floor}`;
        selectedQueueItem.destination = `F${box.row} C${box.col} N${box.floor}`;

        choosedBox.value.floor = box.floor;
        choosedBox.value.row = box.row;
        choosedBox.value.col = box.col;
        sandOrders.value.push(choosedBox.value);
        wasWarehouseModificated.value = true;
        inDepoBoxes.value = getInDepoBoxes(sandOrders.value, warehouse.value.id).filter(
            (boxy) => boxy.location && boxy.status < 99
        );
        console.log('inDepoBoxes', inDepoBoxes.value);
    };

    // :: DEPOSIT
    const warehouses = ref([] as Warehouse[]);
    const warehouse = ref({} as Warehouse);

    let wasWarehouseModificated = ref(false);

    const inDepoBoxes = ref([] as Array<SandOrderBox>);

    const floor = ref(0);
    const row = ref(0);
    const col = ref(0);

    const sandOrders = ref([] as SandOrderBox[]);

    const choosedBox = ref({
        ...defaultBox,
    });

    const assingWareHouseValue = async () => {
        warehouse.value = await warehouses.value.find((singleWarehouse) => {
            return (
                parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                parseInt(singleWarehouse.pitId) ==
                    workOrders.value.find((workOrder) => workOrder.pits.find((pit) => pit.id === pitId.value))?.id
                //parseInt(singleWarehouse.pitId) == pitId.value
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
            sandOrders.value = (await getSandOrders()) as SandOrderBox[];
            sandOrders.value = sandOrders.value
                .filter((box: SandOrderBox) => box.location)
                .map(formatBoxLocation) as SandOrderBox[];

            await getQueueItem();
            await assingWareHouseValue();
            await assignDepositLayout();

            if (warehouse.value) {
                inDepoBoxes.value = await searchInDepoBoxes(warehouse?.value?.id || 0);
                console.log('inDepoBoxes', inDepoBoxes.value);
                inDepoBoxes.value = inDepoBoxes.value.filter((boxy) => boxy.location && boxy.status < 99);
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

    /**
     * @description Tomamos la nueva locacion y la guardamos
     */
    const saveDepositBoxes = async () => {
        const boxToMove = getFirst(selectedBoxesForDeposit.value);
        const { id, location } = boxToMove;
        boxToMove.location = JSON.stringify(location);
        console.log('Caja movida al deposito', boxToMove);
        await axios.put(`${apiUrl}/sandOrder/${id}`, boxToMove);
    };

    /**
     * Chequea si hay cajas en Para el camion y para el deposito y dispara los modales
     * TODO el modal de exito dispara "solo" quizas deberia ser con prueba de que se haya guardado
     */
    const confirm = () => {
        if (selectedBoxesForTrucks.value.length > 0) {
            // Chequeamos si hay boxes para truck disparamos el modal en Orden de Pedido
            confirmPurchaseOrder.value = true;
        } else if (selectedBoxesForDeposit.value.length > 0) {
            // Chequeamos is hay boxes para deposit para disparar el save correspondiente
            saveDepositBoxes();

            if (selectedQueueForDeposit.value.length > 0) {
                updateQueueItem(selectedQueueForDeposit.value, 'deposit');
            }
            openSuccess.value = true;
        }
    };

    const closeModalAndReset = () => {
        openSuccess.value = false;
        router.go(0);
    };

    onMounted(async () => {
        workOrders.value = await getWorkOrders();
        warehouses.value = await getWarehouses();
    });
</script>
