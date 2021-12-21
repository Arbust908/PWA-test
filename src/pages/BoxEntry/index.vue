<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo ingreso de caja</h1>
        </header>
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
                        :class="['section-tab', activeSection == 'deposit' ? 'active' : '']"
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
                                <div>
                                    <h2 class="col-span-full text-xl font-bold">Referencias</h2>
                                    <div class="flex flex-col gap-5 mt-4">
                                        <span class="select-category fina" @click="setVisibleCategories('fina')">
                                            <EyeIcon v-if="visibleCategories.includes('fina')" class="icon" />
                                            <EyeIconOff v-else class="icon" />
                                            Arena fina</span
                                        >
                                        <span class="select-category gruesa" @click="setVisibleCategories('gruesa')">
                                            <EyeIcon v-if="visibleCategories.includes('gruesa')" class="icon" />
                                            <EyeIconOff v-else class="icon" />
                                            Arena gruesa</span
                                        >
                                        <span class="select-category cortada" @click="setVisibleCategories('cortada')">
                                            <EyeIcon v-if="visibleCategories.includes('cortada')" class="icon" />
                                            <EyeIconOff v-else class="icon" />
                                            Caja cortada</span
                                        >
                                        <span class="select-category aisle">
                                            <div class="w-4 h-4 mr-3 rounded-full bg-gray-300" />
                                            Pasillo
                                        </span>
                                        <span class="select-category full">
                                            <div class="w-4 h-4 mr-3 rounded-full bg-gray-600" />
                                            Ocupado
                                        </span>
                                    </div>
                                    <BoxCard
                                        v-if="choosedBox.category !== ''"
                                        :floor="choosedBox.floor"
                                        :row="choosedBox.row"
                                        :col="choosedBox.col"
                                        :category="choosedBox.category"
                                        :choosed-box="choosedBox"
                                    />
                                </div>
                            </section>
                            <DepositGrid
                                v-if="warehouse"
                                class="w-full flex flex-col gap-5"
                                :selected-box="choosedBox"
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
            <PrimaryBtn btn="wide" :disabled="!canSave" @click.prevent="save()"> Guardar </PrimaryBtn>
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
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
    import CradleRow from './CradleRow.vue';

    import { Company, Pit, Box } from '@/interfaces/sandflow';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import EntryBoxesList from '@/components/BoxEntry/EntryBoxesList.vue';

    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useTitle('Ingreso de Cajas <> Sandflow');
    const router = useRouter();
    let activeSection = ref('deposit');
    let boxes = ref([]);

    const purchaseOrders = ref([]);
    const filteredPurchaseOrders = ref([]);
    const clients = ref([] as Array<Company>);
    const pits = ref([] as Array<Pit>);
    const clientId = ref(-1);
    const purchaseOrderId = ref(-1);
    const pitId = ref(-1);
    const warehouses = ref([]);
    let floor = ref(0);
    let row = ref(0);
    let col = ref(0);
    let dimensions = ref('');
    let cradles = ref([]);
    let cleanCradles = ref([]);
    const selectedPurchaseOrder = ref({});

    const getPurchaseOrders = async () => {
        await axios
            .get(`${apiUrl}/purchaseOrder`)
            .then((res) => {
                purchaseOrders.value = res.data.data;
            })
            .catch((err) => console.error(err));
    };

    const getWarehouses = async () => {
        await axios
            .get(`${apiUrl}/warehouse`)
            .then((res) => {
                warehouses.value = res.data.data;
            })
            .catch((err) => console.error(err));
    };

    // Los Cradles deberian venir de la Orden de Trabajo
    // Ver con @Back tema api
    const getCradles = async () => {
        await axios
            .get(`${apiUrl}/cradle`)
            .then((res) => {
                cradles.value = res.data.data;
                cleanCradles.value = res.data.data;
            })
            .catch((err) => console.error(err));
    };

    const getFilteredCradles = async () => {
        const cradlesIds = [];
        const workOrders = await axios
            .get(`${apiUrl}/workOrder`)
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => console.error(err));

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
        dimensions.dimensions = `${dimensions.row} x ${dimensions.col}`;

        return dimensions;
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
        // console.log('filteredPurchaseOrders', filteredPurchaseOrders.value);
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
                    floor.value = formatDeposit(warehouse.value.layout).floor;
                    col.value = formatDeposit(warehouse.value.layout).col;
                    dimensions.value = formatDeposit(warehouse.value.layout).dimensions;
                    row.value = formatDeposit(warehouse.value.layout).row;
                }
            }
        }
    });

    const choosedBox = ref({
        floor: 1,
        col: 0,
        row: 0,
        category: '',
        id: '',
        boxId: '',
        wasOriginallyOnDeposit: false,
        wasOriginallyOnCradle: false,
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
        if (choosedBox.value.wasOriginallyOnDeposit) {
            return;
        }

        if (choosedBox.value.wasOriginallyOnCradle) {
            return;
        }

        clearBoxInCradleSlots(choosedBox.value.boxId);

        if (box.category == 'aisle') {
            return;
        }

        choosedBox.value.location = {
            where: 'warehouse',
            where_id: warehouse.value.id,
        };

        if (box.category == 'empty' || box.category !== 'aisle') {
            // if (visibleCategories.value.includes(box.category)) {
            wasWarehouseModificated.value = true;
            const hasPos = [choosedBox.value.floor, choosedBox.value.row, choosedBox.value.col].some(Boolean);

            if (hasPos) {
                let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}`;
                warehouse.value.layout[`${prevBoxPosition}`].category = 'empty';
                warehouse.value.layout[`${prevBoxPosition}`].id = '';
            }
            const newBPos = `${box.floor}|${box.row}|${box.col}`;
            choosedBox.value.floor = box.floor;
            choosedBox.value.col = box.col;
            choosedBox.value.row = box.row;
            warehouse.value.layout[`${newBPos}`].category = choosedBox.value.category;
            warehouse.value.layout[`${newBPos}`].id = choosedBox.value.boxId;
        }
    };

    const changeSection = (option: string) => {
        return (activeSection.value = option);
    };

    const selectionsAreDone = computed(() => {
        return clientId.value !== -1 && pitId.value !== -1 && purchaseOrderId.value !== -1;
    });

    const warehouse = ref({});
    const originalWarehouseLayout = ref({});
    let visibleCategories = ref(['fina', 'gruesa', 'cortada']);

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

    const handleSelectedCradle = (id) => {
        selectedCradle.value = id;
    };
    const setCat = (cat: string) => {
        choosedBox.value.category = cat;
        const box = choosedBox.value;
        deposit.value[`${box.floor}|${box.row}|${box.col}`].category = box.category;
    };

    const deposit = ref({});

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
        const isFullyAllocated = checkIfIsFullyAllocated(selectedPurchaseOrder.value);
        const warehouseDone = ref(false);
        const warehouseId = warehouse.value.id;
        const { createdAt, deletedAt, updatedAt, pit, clientCompany, ...wareData } = warehouse.value;
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
                    warehouseDone.value = !!res.data.data;
                })
                .catch((err) => console.error(err));
        }

        if (wasCradleModificated.value) {
            await axios
                .put(`${apiUrl}/cradle/${cradleId}`, cradleData)
                .then((res) => {
                    cradleDone.value = !!res.data.data;
                })
                .catch((err) => console.error(err));
        }

        boxes.value.forEach(async (box) => {
            const data = {
                id: box.id,
                boxId: box.boxId,
                sandTypeId: box.sandTypeId,
                amount: box.amount,
                location: JSON.stringify(box.location),
            };
            await axios.put(`${apiUrl}/sandOrder/${data.id}`, data);
        });

        if (warehouseDone.value && cradleDone.value) {
            confirmModal.value = true;
        }

        if (warehouseDone.value && wasCradleModificated.value == false) {
            confirmModal.value = true;
        }

        if (cradleDone.value && wasWarehouseModificated.value == false) {
            confirmModal.value = true;
        }

        if (isFullyAllocated) {
            const selectedPurchaseOrderID = selectedPurchaseOrder.value.id;
            axios.put(`${apiUrl}/purchaseOrder/${selectedPurchaseOrderID}`, {
                isFullyAllocated: 1,
            });
        }
    };

    const canSave = computed(() => {
        return clientId.value >= 0 && purchaseOrderId.value >= 0 && pitId.value >= 0;
    });

    onMounted(async () => {
        await getPurchaseOrders();
        await getWarehouses();
        await getCradles();
    });
</script>

<style lang="scss" scoped>
    .section-tab {
        @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
    }
    .section-tab.active {
        @apply border-main-500 text-main-500;
    }

    span.select-category {
        @apply flex items-center;

        & .icon {
            @apply w-5 h-5 mr-2;
        }

        &:not(.full):not(.aisle) {
            cursor: pointer;
        }

        &.aisle {
            @apply text-second-300 border-second-300;
        }
        &.fina {
            @apply text-orange-600 border-orange-600;
        }
        &.gruesa {
            @apply text-green-600 border-green-600;
        }
        &.cortada {
            @apply text-blue-600 border-blue-600;
        }
        &.blocked {
            @apply text-second-800 border-second-800;
        }
        &.empty {
            @apply text-second-200 border-second-200;
        }
    }

    .type-select {
        @apply flex items-center gap-2;
    }
</style>
