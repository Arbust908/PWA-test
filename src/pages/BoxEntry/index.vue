<template>
    <Layout>
        <ABMFormTitle title="Nuevo ingreso de caja" />
        <section class="deposit bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-12 flex flex-col gap-4">
                <FieldGroup class="border-hidden grid grid-cols-12 gap-4 max-w-4xl">
                    <span class="col-span-8 grid grid-cols-12 gap-4">
                        <ClientPitCombo
                            :client-id="Number(clientId)"
                            :pit-id="Number(pitId)"
                            @update:clientId="clientId = Number($event)"
                            @update:pitId="pitId = Number($event)"
                        />
                    </span>
                    <FieldSelect
                        class="col-span-4"
                        title="Orden de pedido"
                        field-name="sandType3"
                        placeholder="Seleccionar"
                        endpoint-key="id"
                        :endpoint-data="filteredPurchaseOrders"
                        :data="purchaseOrderId"
                        @update:data="purchaseOrderId = $event"
                    />
                </FieldGroup>
                <EntryBoxesList
                    v-if="selectionsAreDone"
                    :boxes="boxes"
                    :selected-box="choosedBox"
                    @select-box="setSelectedBox($event)"
                />
                <nav class="flex justify-between">
                    <button
                        :class="['section-tab', activeSection == 'deposit' ? 'active' : null]"
                        :selected="activeSection == 'deposit'"
                        @click.prevent="changeSection('deposit')"
                    >
                        <span> Depósito </span>
                    </button>
                    <button
                        :class="['section-tab', activeSection == 'cradle' ? 'active' : '']"
                        :selected="activeSection == 'cradle'"
                        @click.prevent="changeSection('cradle')"
                    >
                        <span> Cradle </span>
                    </button>
                </nav>
                <div v-if="selectionsAreDone">
                    <div v-if="warehouse">
                        <fieldset v-if="activeSection === 'deposit'" class="py-2 flex gap-x-10 2xl:gap-x-40">
                            <section class="w-full max-w-[170px] lg:max-w-[260px] flex flex-col gap-6 md:gap-8">
                                <h2 class="col-span-full text-xl font-bold">Referencias</h2>
                                <div class="flex flex-col gap-5">
                                    <span
                                        v-for="(sand, i) in sandTypes"
                                        :key="i"
                                        :class="`select-category mesh-type__${sand.id} radio clickable`"
                                        @click="setVisibleCategories(sand.id)"
                                    >
                                        <EyeIcon v-if="visibleCategories.includes(sand.id)" class="icon" />
                                        <EyeIconOff v-else class="icon" />
                                        {{ sand.type }}</span
                                    >
                                    <!-- <span class="select-category full">
                                        <div class="w-[10px] h-[10px] m-[5px] rounded-full bg-indigo-900" />
                                        Cradle</span
                                    > -->
                                    <span class="select-category full">
                                        <div class="w-[10px] h-[10px] m-[5px] rounded-full bg-[#878787]" />
                                        Ocupado ocupado
                                    </span>
                                    <span class="select-category full">
                                        <div class="w-[10px] h-[10px] m-[5px] rounded-full bg-[#CECCCC]" />
                                        Pasillo
                                    </span>
                                </div>
                                <BoxCard
                                    v-if="choosedBox.category !== ''"
                                    :floor="choosedBox.floor"
                                    :row="choosedBox.row"
                                    :col="choosedBox.col"
                                    :category="choosedBox.sandTypeId.toString()"
                                    :choosed-box="choosedBox"
                                />
                            </section>
                            <DepositGrid
                                v-if="warehouse"
                                class="w-full flex flex-col gap-5"
                                :selected-box="choosedBox"
                                :boxes="inDepoBoxes"
                                :rows="row"
                                :cols="col"
                                :floor="floor"
                                :deposit="warehouse.layout || {}"
                                :visible-categories="visibleCategories"
                                @select-box="selectBox"
                            />
                        </fieldset>
                        <fieldset v-if="activeSection == 'cradle'" class="py-2 flex flex-col gap-x-10 2xl:gap-x-40">
                            <h2 class="text-xl font-bold">Elegir Cradle para montar</h2>
                            <div class="mt-4 w-full flex flex-col gap-6 md:gap-8">
                                <CradleRow
                                    v-for="cradle in cradles"
                                    :id="cradle.id"
                                    :key="cradle.id"
                                    class="cradle-row-wrapper flex flex-row"
                                    :cradle="cradle"
                                    :selected="selectedCradle == cradle.id"
                                    :choosed-box="choosedBox"
                                    @handle-selected-cradle="handleSelectedCradle(cradle.id)"
                                    @clear-box-in-deposit="clearBoxInDeposit"
                                />
                            </div>
                        </fieldset>
                    </div>
                    <div
                        v-else
                        class="w-full max-w-sm border border-dashed rounded-xl p-5 my-3 mx-auto flex items-center justify-center flex-col"
                        @click.prevent="$router.push('/diseno-de-deposito')"
                    >
                        Necesitás diseñar un depósito para continuar
                        <button class="mt-4 bg-green-700 text-white rounded-md p-4 text-center">
                            Ir a diseño de depósito
                        </button>
                    </div>
                </div>
                <div
                    v-else
                    class="w-full max-w-sm border-2 border-dashed rounded-xl p-6 my-3 mx-auto tracking-wide leading-relaxed"
                >
                    Seleccionar cliente, pozo y orden de pedido para comenzar.
                </div>
            </form>
        </section>
        <footer class="space-x-3 flex justify-end items-center mt-8">
            <!-- <SecondaryBtn btn="wide" @click.prevent="$router.push('/diseno-de-deposito')"> Cancelar </SecondaryBtn> -->
            <PrimaryBtn btn="wide" :is-loading="isLoading" :disabled="!canSave" @click.prevent="save()">
                Guardar
            </PrimaryBtn>
        </footer>
        <SuccessModal
            :open="confirmModal"
            title="El ingreso de cajas ha sido guardado con éxito."
            @close="resetBoxIn"
            @main="resetBoxIn"
        />
    </Layout>
</template>

<script setup lang="ts">
    import { EyeIcon } from '@heroicons/vue/solid';
    import EyeIconOff from './EyeIconOff.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
    import CradleRow from './CradleRow.vue';
    import { formatDeposit, defaultBox, getInDepoBoxes } from '@/helpers/useWarehouse';
    import {
        getPurchaseOrders,
        getSandOrders,
        getWarehouses,
        getCradles,
        getWorkOrders,
        getSand,
    } from '@/helpers/useGetEntities';
    import { asyncForEach } from '@/helpers/useAsyncFor';

    import { Box } from '@/interfaces/sandflow';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import EntryBoxesList from '@/components/BoxEntry/EntryBoxesList.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';

    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useTitle('Ingreso de Cajas <> Sandflow');
    const router = useRouter();
    let activeSection = ref('deposit');
    let boxes = ref([]);

    const purchaseOrders = ref([]);
    const sandOrders = ref([]);
    const inDepoBoxes = ref([]);
    const filteredPurchaseOrders = ref([]);

    const clientId = ref(-1);
    const purchaseOrderId = ref(-1);
    const pitId = ref(-1);
    const warehouses = ref([]);

    const floor = ref(0);
    const row = ref(0);
    const col = ref(0);
    const cradles = ref([]);
    const cleanCradles = ref([]);
    const selectedPurchaseOrder = ref({});

    const sandTypes = ref([]);

    const isLoading = ref(false);
    const toggleLoading = useToggle(isLoading);

    const getFilteredCradles = async () => {
        const cradlesIds = [];
        const workOrders = await getWorkOrders();

        workOrders.forEach((workOrder) => {
            workOrder.pits.forEach((pit) => {
                if (pit.id == pitId.value) {
                    if (workOrder.operativeCradle !== '-1') {
                        cradlesIds.push(parseInt(workOrder.operativeCradle));
                    }

                    if (workOrder.backupCradle !== '-1') {
                        cradlesIds.push(parseInt(workOrder.backupCradle));
                    }
                }
            });
        });

        const newCradles = cleanCradles.value.filter((cradle) => {
            if (cradlesIds.includes(cradle.id)) {
                return cradle;
            }
        });

        cradles.value = newCradles;
    };

    const clearBoxInDeposit = (id) => {
        Object.entries(warehouse.value.layout).forEach((cell) => {
            if (cell[1].id == id) {
                (cell[1].category = 'empty'), delete cell[1][id];
            }
        });
    };

    const clearBoxInCradleSlots = (id) => {
        cradles.value.forEach((cradle) => {
            cradle.slots = cradle.slots.map((slot) => {
                if (slot.boxId == id) {
                    slot = {
                        boxId: null,
                    };
                }

                return slot;
            });
        });
    };

    watchEffect(async () => {
        console.log('Watchpokalips');

        if (purchaseOrders.value.length > 0) {
            if (clientId.value !== -1 && pitId.value !== -1) {
                filteredPurchaseOrders.value = purchaseOrders.value.filter((po) => {
                    if (po.companyId == clientId.value && po.pitId == pitId.value && po.isFullyAllocated == 0) {
                        return po;
                    }
                });
            }

            if (purchaseOrderId.value !== -1) {
                let sandTypes = await axios
                    .get(`${apiUrl}/sand`)
                    .then((res) => {
                        return res.data.data;
                    })
                    .catch((err) => console.error(err));

                if (filteredPurchaseOrders.value.length > 0) {
                    const purchaseOrderIndex = filteredPurchaseOrders.value.findIndex(
                        (po) => po.id == purchaseOrderId.value
                    );

                    selectedPurchaseOrder.value = filteredPurchaseOrders.value[purchaseOrderIndex];

                    boxes.value = filteredPurchaseOrders.value[purchaseOrderIndex].sandOrders;
                } else {
                    boxes.value = [];
                }

                boxes.value.map((box) => {
                    let sandType = sandTypes.find((type) => parseInt(type.id) == parseInt(box.sandTypeId));
                    box.category = sandType.type.toLowerCase();
                });

                warehouse.value = await warehouses.value.filter((singleWarehouse) => {
                    if (
                        parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                        parseInt(singleWarehouse.pitId) == pitId.value
                    ) {
                        return singleWarehouse;
                    }
                })[0];

                originalWarehouseLayout.value = warehouse.value;
                await getFilteredCradles();

                if (warehouse.value) {
                    const { col: fCol, floor: fFloor, row: fRow } = formatDeposit(warehouse.value.layout);
                    col.value = fCol;
                    floor.value = fFloor;
                    row.value = fRow;
                }
            }
        }
    });

    const choosedBox = ref({
        ...defaultBox,
    });

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

    const setSelectedBox = async (id: number) => {
        choosedBox.value = boxes.value.find((box) => {
            return box.boxId === id;
        });

        setVisibleCategories(choosedBox.value.sandTypeId);

        if (checkIfWasBoxInOriginalDeposit(id)) {
            Object.entries(warehouse.value.layout).forEach((cell) => {
                if (cell[1].id == id) {
                    const [floor, row, col] = cell[0].split('|');
                    choosedBox.value.floor = parseInt(floor);
                    choosedBox.value.row = parseInt(row);
                    choosedBox.value.col = parseInt(col);
                }
            });
        }
        choosedBox.value.wasOriginallyOnDeposit = checkIfWasBoxInOriginalDeposit(id);
        choosedBox.value.wasOriginallyOnCradle = checkIfWasBoxInOriginalCradle(id);
    };

    const selectBox = (box: Box) => {
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

        // Sacamos la caja de cradle si estaba ahi
        clearBoxInCradleSlots(choosedBox.value.boxId);

        choosedBox.value.location = {
            where: 'warehouse',
            where_id: warehouse.value.id,
            floor: box.floor,
            row: box.row,
            col: box.col,
        };
        choosedBox.value.floor = box.floor;
        choosedBox.value.row = box.row;
        choosedBox.value.col = box.col;
        sandOrders.value.push(choosedBox.value);
        wasWarehouseModificated.value = true;
        inDepoBoxes.value = getInDepoBoxes(sandOrders.value, warehouse.value.id);

        // if (box.category == 'empty' || box.category !== 'aisle') {
        //     // if (visibleCategories.value.includes(box.category)) {
        //     const hasPos = [choosedBox.value.floor, choosedBox.value.row, choosedBox.value.col].some(Boolean);

        //     if (hasPos) {
        //         let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}`;
        //         warehouse.value.layout[`${prevBoxPosition}`].category = 'empty';
        //         warehouse.value.layout[`${prevBoxPosition}`].id = '';
        //     }
        //     const newBPos = `${box.floor}|${box.row}|${box.col}`;
        //     choosedBox.value.floor = box.floor;
        //     choosedBox.value.col = box.col;
        //     choosedBox.value.row = box.row;
        //     warehouse.value.layout[`${newBPos}`].category = choosedBox.value.category;
        //     warehouse.value.layout[`${newBPos}`].id = choosedBox.value.boxId;
        // }
    };

    const changeSection = (option: string) => {
        return (activeSection.value = option);
    };

    const selectionsAreDone = computed(() => {
        return clientId.value !== -1 && pitId.value !== -1 && purchaseOrderId.value !== -1;
    });

    watch(selectionsAreDone, async (newVal) => {
        if (newVal) {
            sandOrders.value = await getSandOrders();
            const boxes = sandOrders.value
                .map((box) => {
                    if (box.location && JSON.parse(box.location)) {
                        box.location = JSON.parse(box.location);
                        box.location.been_set = true;
                    }

                    return box;
                })
                .filter((box) => {
                    return box.location;
                });
            inDepoBoxes.value = getInDepoBoxes(boxes, warehouse.value.id);
        }
    });

    const warehouse = ref({});
    const originalWarehouseLayout = ref({});
    const visibleCategories = ref([]);

    const setVisibleCategories = (category: string) => {
        if (visibleCategories.value.includes(category)) {
            visibleCategories.value.splice(visibleCategories.value.indexOf(category), 1);
        } else {
            visibleCategories.value.push(category);
        }
    };

    let selectedCradle = ref(0);
    let wasCradleModificated = ref(false);
    let wasWarehouseModificated = ref(false);

    const handleSelectedCradle = (id: any) => {
        selectedCradle.value = id;
    };

    const confirmModal = ref(false);
    const resetBoxIn = () => {
        router.go(0);
    };

    const checkIfIsFullyAllocated = (selected) => {
        return selected.sandOrders.every((order) => {
            return order.location !== null;
        });
    };

    const save = async () => {
        toggleLoading(true);
        const isFullyAllocated = checkIfIsFullyAllocated(selectedPurchaseOrder.value);
        const warehouseDone = ref(false);
        const warehouseId = warehouse.value.id;
        const { createdAt, deletedAt, updatedAt, pit, clientCompany, ...wareData } = warehouse.value;
        // Conseguir el Cradle para guardar la data
        const cradleDone = ref(false);
        const cradleId = selectedCradle.value;
        const cradleData = cradles.value.find((c) => {
            return c.id === cradleId;
        });

        if (cradleId !== 0) {
            wasCradleModificated.value = true;
        }

        if (wasWarehouseModificated.value) {
            await axios
                .put(`${apiUrl}/warehouse/${warehouseId}`, wareData)
                .then((res) => {
                    console.log('SH axios', res.data.data);
                    warehouseDone.value = !!res.data.data;
                })
                .catch((err) => console.error(err));
        }

        if (wasCradleModificated.value) {
            await axios
                .put(`${apiUrl}/cradle/${cradleId}`, cradleData)
                .then((res) => {
                    console.log('Cd axios', res.data.data);
                    cradleDone.value = !!res.data.data;
                })
                .catch((err) => console.error(err));
        }

        const saveBoxes = async () => {
            await asyncForEach(boxes.value, async (box) => {
                const data = {
                    id: box.id,
                    boxId: box.boxId,
                    sandTypeId: box.sandTypeId,
                    amount: box.amount,
                    location: JSON.stringify(box.location),
                };
                await axios.put(`${apiUrl}/sandOrder/${data.id}`, data);
            });
        };

        await saveBoxes();

        if (isFullyAllocated) {
            const selectedPurchaseOrderID = selectedPurchaseOrder.value.id;
            axios.put(`${apiUrl}/purchaseOrder/${selectedPurchaseOrderID}`, {
                isFullyAllocated: 1,
            });
        }

        toggleLoading(false);

        console.info('Depo Guardado', warehouseDone.value);
        console.info('Crdl Guardado', cradleDone.value);
        console.warn('Se modifico Cradle?', wasCradleModificated.value);
        console.warn('Se modifico Depo?', wasWarehouseModificated.value);
        console.error(wasCradleModificated.value == false);
        console.error(wasWarehouseModificated.value == false);

        if (warehouseDone.value && cradleDone.value) {
            confirmModal.value = true;
        }

        if (warehouseDone.value && wasCradleModificated.value == false) {
            confirmModal.value = true;
        }

        if (cradleDone.value && wasWarehouseModificated.value == false) {
            confirmModal.value = true;
        }

        toggleLoading(false);
    };

    const canSave = computed(() => {
        return clientId.value >= 0 && purchaseOrderId.value >= 0 && pitId.value >= 0;
    });

    onMounted(async () => {
        sandTypes.value = await getSand();
        sandTypes.value = sandTypes.value.filter((type) => {
            return type.visible;
        });

        purchaseOrders.value = await getPurchaseOrders();
        warehouses.value = await getWarehouses();
        cradles.value = await getCradles();
        cleanCradles.value = [...cradles.value];
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
    .section-tab {
        @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
    }
    .section-tab.active {
        @apply border-main-500 text-main-500;
    }

    span.select-category {
        @apply flex items-center gap-x-3;

        & .icon {
            @apply w-5 h-5;
        }

        &:not(.full):not(.aisle) {
            cursor: pointer;
        }
        &.blocked {
            @apply text-second-800 border-second-800;
        }
    }

    .type-select {
        @apply flex items-center gap-2;
    }
</style>
