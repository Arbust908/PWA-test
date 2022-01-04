<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-second-900 text-2xl self-start mb-3 md:mb-0">Diseño de depósito</h1>
        </header>
        <section class="deposit bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-12 flex flex-col gap-4">
                <fieldset class="py-2 w-full max-w-2xl grid grid-cols-12 gap-y-4 gap-x-14">
                    <h2 class="col-span-full text-[24px] font-bold">Pozo {{ designName }}</h2>
                    <label class="col-span-5" for="depositClient">
                        <span>Cliente</span>
                        <select id="depositClient" v-model="clientId" class="input" name="depositClient">
                            <option selected disabled value="-1">Seleccionar cliente</option>
                            <option v-for="client in clients" :key="client.id" :value="client.id">
                                {{ client.name }}
                            </option>
                        </select>
                    </label>
                    <label class="col-span-4" for="depositPit">
                        <span>Pozo</span>
                        <select id="depositPit" v-model="pitId" class="input" name="depositPit">
                            <option selected disabled value="-1">Seleccionar pozo</option>
                            <option v-for="pit in pits" :key="pit.id" :value="pit.id">
                                {{ pit.name }}
                            </option>
                        </select>
                    </label>
                    <div class="col-span-2"></div>
                    <div class="col-span-6 md:col-span-4 flex flex-col items-left gap-4">
                        <h3 class="text-sm">Cantidad de filas</h3>
                        <Counter :amount="rows" @update:amount="rows = $event" />
                    </div>
                    <div class="col-span-6 md:col-span-4 flex flex-col items-center gap-4">
                        <h3 class="text-sm">Cantidad de columnas</h3>
                        <Counter :amount="cols" @update:amount="cols = $event" />
                    </div>
                    <div class="col-span-6 md:col-span-4 flex-col items-end gap-4">
                        <h3 class="text-sm">Cantidad de pisos</h3>
                        <Counter :amount="floors" :max="2" @update:amount="floors = $event" />
                    </div>
                    <!-- <div class="col-span-3 flex flex-col items-center gap-4">
            <h3 class="text-xs">Cantidad de ubicación</h3>
            <Counter />
          </div> -->
                </fieldset>
                <fieldset class="py-2 flex gap-x-10 2xl:gap-x-40">
                    <section class="w-full max-w-[220px] lg:max-w-[260px] flex flex-col gap-6 md:gap-8">
                        <h2 class="col-span-full text-xl font-bold">Asignar categoría</h2>
                        <div class="flex flex-col gap-5 ml-4">
                            <label v-for="(sand, i) in sandTypes" :key="i" class="type-select" :for="sand.type">
                                <input
                                    :id="sand.type"
                                    :checked="selectedBox.category == sand.id"
                                    type="radio"
                                    name="boxCat"
                                    :class="`form-checkbox mesh-type__${sand.id} radio clickable`"
                                    @click="setCat(sand.id.toString())"
                                />
                                <span>{{ sand.type }}</span>
                            </label>
                            <label class="type-select" for="empty">
                                <input
                                    id="empty"
                                    :checked="selectedBox.category === 'empty'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox mesh-type__empty mesh-type__empty"
                                    @click="setCat('empty')"
                                />
                                <span>Caja Vacía</span>
                            </label>
                            <label class="type-select" for="cradle">
                                <input
                                    id="cradle"
                                    :checked="selectedBox.category === 'cradle'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox mesh-type__taken cradle-clickable"
                                    @click="setCat('cradle')"
                                />
                                <span>Cradle</span>
                            </label>
                            <label class="type-select" for="aisle">
                                <input
                                    id="aisle"
                                    :checked="selectedBox.category === 'aisle'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox mesh-type__taken aisle-clickable"
                                    @click="setCat('aisle')"
                                />
                                <span>Pasillo</span>
                            </label>
                        </div>
                        <BoxCard
                            v-if="selectedBox.category !== ''"
                            v-bind="selectedBox"
                            :deposit-render="true"
                            :sand-name="sandName"
                        />
                    </section>
                    <DepositGrid
                        class="w-full flex flex-col gap-5"
                        :selected-box="selectedBox"
                        :rows="rows"
                        :cols="cols"
                        :floor="floors"
                        :deposit="deposit"
                        @select-box="selectBox"
                    />
                </fieldset>
            </form>
        </section>

        <!-- *** -->
        <footer class="mt-8 space-x-3 flex justify-end items-center">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/diseno-de-deposito')">Cancelar</SecondaryBtn>
            <PrimaryBtn btn="wide" :disabled="!isFull ? 'yes' : null" @click.prevent="isFull && save()">
                Guardar
            </PrimaryBtn>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, defineComponent, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useTitle } from '@vueuse/core';

    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Counter from '@/components/ui/Counter.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
    import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            Counter,
            SecondaryBtn,
            Layout,
            PrimaryBtn,
            DepositGrid,
            BoxCard,
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });
            const id = route.params.id;
            useTitle(`Depósito ${id} <> Sandflow`);
            const warehouse = ref([]);

            const sandTypes = ref([]);
            const sandName = computed(() => {
                if (
                    selectedBox.value.category != 'empty' &&
                    selectedBox.value.category != 'aisle' &&
                    selectedBox.value.category != 'cradle'
                ) {
                    return sandTypes.value[parseInt(selectedBox.value.category) - 1].type;
                }
            });

            onMounted(async () => {
                const result = await axios.get(`${apiUrl}/sand`);
                sandTypes.value = result.data.data;
            });

            const rows: Ref<number> = ref(0);
            watch(rows, (newV, oldV) => {
                if (newV > oldV) {
                    addRow(newV);
                } else if (newV < oldV) {
                    removeRow(oldV);
                }
            });
            const addRow = (row: number) => {
                for (let c = 1; c <= cols.value; c++) {
                    for (let f = 1; f <= floors.value; f++) {
                        addNewCell(f, row, c);
                    }
                }
            };
            const removeRow = (row: number) => {
                for (const key in deposit.value) {
                    if (Object.prototype.hasOwnProperty.call(deposit.value, key)) {
                        const proxy = key.split('|');
                        const [Pfloor, Prow, Pcol] = proxy;

                        if (Number(Prow) > row) {
                            removeCell(Number(Pfloor), Number(Prow), Number(Pcol));
                        }
                    }
                }
            };
            const cols: Ref<number> = ref(0);
            watch(cols, (newV, oldV) => {
                if (newV > oldV) {
                    addCol(newV);
                } else if (newV < oldV) {
                    removeCol(oldV);
                }
            });
            const addCol = (col: number) => {
                for (let r = 1; r <= rows.value; r++) {
                    for (let f = 1; f <= floors.value; f++) {
                        addNewCell(f, r, col);
                    }
                }
            };
            const removeCol = (col: number) => {
                for (const key in deposit.value) {
                    if (Object.prototype.hasOwnProperty.call(deposit.value, key)) {
                        const proxy = key.split('|');
                        const [Pfloor, Prow, Pcol] = proxy;

                        if (Number(Pcol) > col) {
                            removeCell(Number(Pfloor), Number(Prow), Number(Pcol));
                        }
                    }
                }
            };
            const floors: Ref<number> = ref(1);
            watch(floors, (newV, oldV) => {
                if (newV > oldV) {
                    addFloor(newV);
                } else if (newV < oldV) {
                    removeFloor(oldV);
                }
            });
            const addFloor = (floor: number) => {
                for (let c = 1; c <= cols.value; c++) {
                    for (let r = 1; r <= rows.value; r++) {
                        addNewCell(floor, c, r);
                    }
                }
            };
            const removeFloor = (floor: number) => {
                for (const key in deposit.value) {
                    if (Object.prototype.hasOwnProperty.call(deposit.value, key)) {
                        const proxy = key.split('|');
                        const [Pfloor, Prow, Pcol] = proxy;

                        if (Number(Pfloor) > floor) {
                            removeCell(Number(Pfloor), Number(Prow), Number(Pcol));
                        }
                    }
                }
            };
            const purgeOffCells = () => {
                for (const key in deposit.value) {
                    if (Object.prototype.hasOwnProperty.call(deposit.value, key)) {
                        const cell = deposit.value[key];
                        const proxy = key.split('|');
                        const [Pfloor, Prow, Pcol] = proxy;

                        if (cell === 'DELETED') {
                            //BOrrar ?
                        }

                        if (Number(Pfloor) > floors.value || Number(Prow) > rows.value || Number(Pcol) > cols.value) {
                            removeCell(Number(Pfloor), Number(Prow), Number(Pcol));
                        }
                    }
                }
            };

            const addNewCell = (floor: number, row: number, col: number) => {
                if (!deposit.value[`${floor}|${row}|${col}`]) {
                    deposit.value[`${floor}|${row}|${col}`] = {};
                }
            };
            const removeCell = (floor: number, row: number, col: number) => {
                if (deposit.value[`${floor}|${row}|${col}`] !== undefined) {
                    deposit.value[`${floor}|${row}|${col}`] = 'DELETED';
                    delete deposit.value[`${floor}|${row}|${col}`];
                }
            };

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
                return clientId.value >= 0 && clients.value.length > 0
                    ? clients.value.find((client) => client.id === clientId.value)?.name
                    : '';
            });
            // << CLIENT
            // :: PITS
            const pitId = ref(-1);
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);
            watch(pitsData, (pitApi) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                }
            });
            const selectedPitName = computed(() => {
                return pitId.value >= 0 && pits.value.length > 0
                    ? pits.value.find((pit) => pit.id === pitId.value)?.name
                    : '';
            });
            // << PITS
            const designName = computed(() => {
                return selectedClientName.value !== '' && selectedPitName.value !== ''
                    ? `${selectedPitName.value} - ${selectedClientName.value}`
                    : selectedClientName.value !== ''
                    ? selectedClientName.value
                    : selectedPitName.value !== ''
                    ? selectedPitName.value
                    : '';
            });

            const selectedBox: Ref<Box> = ref({
                warehouseId: null,
                floor: 1,
                col: 0,
                row: 0,
                category: '',
            });
            const selectBox = (box: Box) => {
                console.log(box);
                selectedBox.value = box;
            };
            const setCat = (cat: string) => {
                selectedBox.value.category = cat;
                const box = selectedBox.value;
                deposit.value[`${box.floor}|${box.row}|${box.col}`].category = cat;
            };

            // :: DEPOSIT
            const deposit = ref({});
            // << DEPOSIT

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

            const updateData = (newData: Warehouse | null) => {
                if (newData) {
                    pitId.value = newData.pitId;
                    clientId.value = newData.clientCompanyId;
                    deposit.value = newData.layout;
                    const formatedDeposit = formatDeposit(newData.layout);
                    rows.value = formatedDeposit.row;
                    cols.value = formatedDeposit.col;
                    floors.value = formatedDeposit.floor;
                }
            };

            const vuexData = ref(
                JSON.parse(JSON.stringify(store.state.depositDesign.all)).find((depo: Warehouse) => {
                    return depo.id === Number(id);
                })
            );

            if (vuexData.value) {
                warehouse.value = vuexData;
                updateData(vuexData.value);
            } else {
                const { data: dData } = useAxios(`/warehouse/${id}`, instance);
                watch(dData, (dData, prevCount) => {
                    if (dData && dData.data) {
                        warehouse.value = dData.data;
                    }
                });
            }

            watch(warehouse, (newData, oldData) => {
                if (newData) {
                    updateData(newData);
                }
            });

            const isFull = computed(() => {
                const hasClientAndPit: boolean = clientId.value >= 0 && pitId.value >= 0;
                const hasDeposit: boolean = rows.value > 0 && cols.value > 0 && floors.value > 0;

                return hasClientAndPit && hasDeposit;
            });
            const save = () => {
                purgeOffCells();
                const wH: Warehouse = {
                    id: Number(id),
                    clientCompanyId: clientId.value,
                    pitId: pitId.value,
                    layout: deposit.value,
                };
                const { data } = useAxios(`/warehouse/${id}`, { method: 'PUT', data: wH }, instance);
                watch(data, (warehouseApi, prevCount) => {
                    if (warehouseApi && warehouseApi.data) {
                        store.dispatch('updateDeposit', warehouseApi.data);
                        router.push('/diseno-de-deposito');
                    }
                });
            };

            return {
                clients,
                pits,
                rows,
                cols,
                floors,
                selectedBox,
                selectBox,
                setCat,
                clientId,
                pitId,
                designName,
                deposit,
                isFull,
                save,
                sandTypes,
                sandName,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input[type='radio'] {
        @apply w-5 h-5 border border-second-400 text-second-400;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label:not(.type-select) {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
        }
        &__options {
            @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
        }
        &__add {
            @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
        }
        &__add--special {
            @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
        }
        &__mobile-only {
            @apply lg:hidden;
        }
        &__desktop-only {
            @apply hidden lg:inline-flex;
        }
    }
    .type-select {
        @apply flex items-center gap-2;
    }
</style>
