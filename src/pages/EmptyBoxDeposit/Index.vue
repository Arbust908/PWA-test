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
        <div v-if="activeSection !== 'PurchaseOrder'" class="flex flex-row gap-8 h-full">
            <section class="white-panel grid-panel">
                <div
                    v-show="activeSection === null"
                    class="px-6 py-8 mx-auto rounded-lg border border-dashed text-center max-w-sm mt-32"
                >
                    <p>Seleccione cliente o pozo para comenzar</p>
                </div>
                <DepositGrid
                    v-if="activeSection === 'Deposit'"
                    class="w-full pl-14 pt-10"
                    :selected-box="choosedBox"
                    :boxes="inDepoBoxes"
                    :rows="row"
                    :cols="col"
                    :floor="floor"
                    :deposit="warehouse.layout || {}"
                    @select-box="selectBox"
                />
            </section>
            <section class="white-panel selection-panel">
                <h2 class="my-8 text-center font-bold text-2xl text-gray-800">Cajas Seleccionadas</h2>
                <div class="px-6 pb-5 space-y-5">
                    <SelectedBox v-for="box in selectedBoxes" :key="box.id" :box="box" />
                    <div v-if="selectionIsDone && selectedBoxes.length <= 0" class="null-boxes-panel">
                        No hay cajas vacias seleccionadas
                    </div>
                    <div v-if="!selectionIsDone" class="null-boxes-panel">
                        <Icon icon="ExclamationCircle" type="outline" class="w-4 h-4" />
                        <p class="pr-4">No hay cajas vacias por retirar</p>
                    </div>
                </div>
            </section>
        </div>
        <div v-else class="flex flex-row gap-8 h-full">
            <section class="white-panel order-panel">
                <PurchaseOrderForm
                    :company-client-id="clientId"
                    :pit-id="pitId"
                    :selected-boxes="selectedBoxes"
                    :confirm-purchase-order="fireOrder"
                    @updateQueueItem="finalizeOrder($event)"
                    @orderIsComplete="canSendOrder = true"
                />
            </section>
        </div>
        <footer :class="activeSection !== 'PurchaseOrder' ? 'depo-view' : 'order-view'" class="btn-panel">
            <SecondaryBtn btn="wide" :is-loading="isLoading" @click.prevent="$router.push('/')">Cancelar</SecondaryBtn>
            <PrimaryBtn
                v-if="activeSection !== 'PurchaseOrder'"
                btn="wide"
                size="md"
                :disabled="!canCreateOrder"
                :is-loading="isLoading"
                @click="activeSection = 'PurchaseOrder'"
            >
                Generar orden
            </PrimaryBtn>
            <PrimaryBtn
                v-else
                btn="wide"
                size="md"
                :disabled="!canSendOrder"
                :is-loading="isLoading"
                @click="confirmOrder"
            >
                Crear orden
            </PrimaryBtn>
        </footer>
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
    import SelectedBox from '@/components/EmptyBox/SelectedBox.vue';
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
    import { getQueueItems } from '@/helpers/useQueueItem';
    import { QueueItem, SandOrder, Warehouse, SandOrderBox } from '@/interfaces/sandflow';

    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useTitle('Depósito de cajas vacias');

    // La seccion activa
    const activeSection: Ref<string | null> = ref(null);

    const isLoading = ref(false);

    const clientId = ref(-1);
    const pitId = ref(-1);
    const selectionIsDone = computed(() => clientId.value !== -1 && pitId.value !== -1);

    // Esto se usa para la grilla del Deposito
    const warehouse = ref({} as Warehouse);
    const floor = ref(0);
    const row = ref(0);
    const col = ref(0);

    watch(pitId, async (newVal) => {
        if (newVal > -1 && clientId.value > -1) {
            // Buscamos el deposito
            const warehouseUrl = `${apiUrl}/warehouse?pitId=${pitId.value}&clientCompanyId=${clientId.value}`;
            warehouse.value = await axios
                .get(warehouseUrl)
                .then((response) => {
                    return response.data.data[0];
                })
                .catch((err) => console.error(err));
            warehouseConfiguration();
            activeSection.value = 'Deposit';
        }
    });

    const selectedBoxes: Ref<Array<SandOrder | SandOrderBox>> = ref([] as SandOrder[]);
    const selectedBoxesIsEmpty = computed(() => selectedBoxes.value.length <= 0);
    const selectedBoxesIsFull = computed(() => selectedBoxes.value.length == 2);
    const fireOrder = ref(false);
    const confirmOrder = () => {
        fireOrder.value = true;
    };

    const canCreateOrder = computed(() => {
        return selectionIsDone.value && !isLoading.value && !selectedBoxesIsEmpty.value;
    });

    const sandOrders: Ref<SandOrderBox[]> = ref([] as SandOrderBox[]);
    const inDepoBoxes: Ref<SandOrderBox[]> = ref([] as SandOrderBox[]);

    const selectBox = async (box) => {
        // Si clickea en un pasillo no hace nada. Sumo Cradle
        // Tampoco deberia poder clickear en un pasillo
        if (box.category == 'aisle' || box.category == 'cradle') {
            return;
        }

        // Tembien deberiamos impedir que levantes cajas que no sean vacias
        // code...

        const foundBox = inDepoBoxes.value.find(({ location }: SandOrderBox) => {
            const isSameFloor = location.floor == box.floor;
            const isSameRow = location.row == box.row;
            const isSameCol = location.col == box.col;

            return isSameFloor && isSameRow && isSameCol;
        });

        if (foundBox) {
            // Si encontramos la caja que clickeamos, la agregamos a los seleccionados
            // Chequeamos si exist en la lista para sacarlo
            const foundBoxIsSelected = selectedBoxes.value.find((selected) => selected.id === foundBox.id);

            if (foundBoxIsSelected) {
                selectedBoxes.value = selectedBoxes.value.filter((boxToRemove) => boxToRemove.id !== foundBox.id);
            } else {
                if (!selectedBoxesIsFull.value) {
                    selectedBoxes.value.push(foundBox);
                } else {
                    console.warn('Ya hay Dos cajas');
                }
            }
        } else {
            console.warn('No se encontro la caja');
        }

        return;
    };

    const choosedBox = ref({
        ...defaultBox,
    });

    const warehouseConfiguration = () => {
        const { col: fCol, floor: fFloor, row: fRow } = formatDeposit(warehouse.value?.layout);
        col.value = fCol;
        floor.value = fFloor;
        row.value = fRow;

        if (warehouse.value.id) {
            // Chequeamos que el deposito tenga ID para filtrar las cajas al depo
            inDepoBoxes.value = getInDepoBoxes(sandOrders.value, warehouse.value.id);
        }
    };

    const canSendOrder = ref(false);

    const finalizeOrder = (order: any) => {
        console.log('Finalizando orden');
        console.log(selectedBoxes.value);
        console.log(order);
    };

    // Esto queda como ultimo por consejo Experto
    onMounted(async () => {
        // Cuando monta buscamos las Cajas y les formateamos el location
        sandOrders.value = await getSandOrders();
        sandOrders.value = sandOrders.value.filter((box: SandOrder) => box.location).map(formatBoxLocation);
        sandOrders.value = sandOrders.value as SandOrderBox[];
    });
</script>

<style scoped lang="scss">
    .white-panel {
        @apply bg-white rounded-md shadow-sm;
        &.grid-panel {
            @apply max-w-4xl grow min-h-[544px];
        }
        &.selection-panel {
            @apply w-[308px];
        }
        &.order-panel {
            @apply max-w-4xl grow min-h-[544px] pl-14 py-10;
        }
    }

    .null-boxes-panel {
        @apply flex bg-gray-100 justify-center p-4 rounded text-xs text-gray-800 space-x-2;
    }

    .btn-panel {
        @apply mt-10 space-x-3 flex justify-end;
        &.depo-view {
            @apply max-w-[1240px];
        }
        &.order-view {
            @apply max-w-[896px];
        }
    }
</style>
