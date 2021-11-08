<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-second-900 text-2xl self-start mb-3 md:mb-0">Diseño de depósito</h1>
        </header>
        <section class="deposit bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-12 flex flex-col gap-4">
                <FieldGroup class="col-span-full gap-x-6 py-0 max-w-xl">
                    <h2 class="col-span-full text-3xl font-bold">Pozo {{ designName }}</h2>
                    <ClientPitCombo
                        :client-id="clientId"
                        :pit-id="pitId"
                        @update:clientId="clientId = $event"
                        @update:pitId="pitId = $event"
                    />
                    <div class="col-span-6 md:col-span-4 flex flex-col items-center gap-4">
                        <h3 class="text-xs">Cantidad de filas</h3>
                        <Counter :amount="rows" @update:amount="rows = $event" />
                    </div>
                    <div class="col-span-6 md:col-span-4 flex flex-col items-center gap-4">
                        <h3 class="text-xs">Cantidad de columnas</h3>
                        <Counter :amount="cols" @update:amount="cols = $event" />
                    </div>
                    <div class="col-span-6 md:col-span-4 flex flex-col items-center gap-4">
                        <h3 class="text-xs">Cantidad de pisos</h3>
                        <Counter :amount="floors" @update:amount="floors = $event" />
                    </div>
                </FieldGroup>
                <fieldset class="py-2 flex gap-x-10 2xl:gap-x-40">
                    <section class="w-full max-w-[170px] lg:max-w-[260px] flex flex-col gap-6 md:gap-8">
                        <h2 class="col-span-full text-xl font-bold">Asignar categoría</h2>
                        <div class="flex flex-col gap-5 ml-4">
                            <label class="type-select" for="aisle">
                                <input
                                    id="aisle"
                                    :checked="selectedBox.category === 'aisle'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox aisle"
                                    @click="setCat('aisle')"
                                />
                                <span>Pasillo</span>
                            </label>
                            <label class="type-select" for="fina">
                                <input
                                    id="fina"
                                    :checked="selectedBox.category === 'fina'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox fina"
                                    @click="setCat('fina')"
                                />
                                <span>Arena fina</span>
                            </label>
                            <label class="type-select" for="gruesa">
                                <input
                                    id="gruesa"
                                    :checked="selectedBox.category === 'gruesa'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox gruesa"
                                    @click="setCat('gruesa')"
                                />
                                <span>Arena gruesa</span>
                            </label>
                            <label class="type-select" for="cortada">
                                <input
                                    id="cortada"
                                    :checked="selectedBox.category === 'cortada'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox cortada"
                                    @click="setCat('cortada')"
                                />
                                <span>Caja cortada</span>
                            </label>
                            <label class="type-select" for="empty">
                                <input
                                    id="empty"
                                    :checked="selectedBox.category === 'empty'"
                                    type="radio"
                                    name="boxCat"
                                    class="form-checkbox empty"
                                    @click="setCat('empty')"
                                />
                                <span>Vacio</span>
                            </label>
                        </div>
                        <!-- <h2 class="col-span-full text-xl font-bold">Asignar ubicación</h2>
            <div class="flex flex-col gap-5 ml-4">
              <label class="type-select" for="top">
                <input
                  id="aisle"
                  type="radio"
                  name="boxCat"
                  class="form-checkbox"
                />
                <span>Pasillo</span>
              </label>
              <label class="type-select" for="bot">
                <input
                  id="fine"
                  type="radio"
                  name="boxCat"
                  class="form-checkbox"
                />
                <span>Arena fina</span>
              </label>
            </div> -->
                        <BoxCard v-if="selectedBox.category !== ''" v-bind="selectedBox" />
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

        <footer class="mt-5 gap-3 flex justify-end">
            <section class="space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/diseno-de-deposito')">Cancelar</SecondaryBtn>
                <PrimaryBtn btn="wide" :disabled="!isFull ? 'yes' : null" @click.prevent="isFull && save()">
                    Guardar
                </PrimaryBtn>
            </section>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, defineComponent, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';

    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Counter from '@/components/ui/Counter.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
    import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';

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
            FieldGroup,
            ClientPitCombo,
        },
        setup() {
            useTitle('Nuevo Depósito <> Sandflow');
            const router = useRouter();
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });

            let deposit = ref({});

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
                for (let c = cols.value; c > 1; c--) {
                    for (let f = floors.value; f > 1; f--) {
                        removeCell(f, row, c);
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
                for (let r = rows.value; r > 1; r--) {
                    for (let f = floors.value; f > 1; f--) {
                        removeCell(f, r, col);
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
                        addNewCell(floor, r, c);
                    }
                }
            };

            const removeFloor = (floor: number) => {
                for (let c = cols.value; c >= 1; c--) {
                    for (let r = rows.value; r >= 1; r--) {
                        removeCell(floor, c, r);
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
                }
            });

            const selectedPitName = computed(() => {
                return pitId.value >= 0 ? pits.value.find((pit) => pit.id === pitId.value).name : '';
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
                floor: 1,
                col: 0,
                row: 0,
                category: '',
                id: '',
            });
            const selectBox = (box: Box) => {
                selectedBox.value = box;
            };

            const setCat = (cat: string) => {
                selectedBox.value.category = cat;

                const { floor, row, col } = selectedBox.value;
                deposit.value[`${floor}|${row}|${col}`].category = cat;
            };

            const isFull = computed(() => {
                const hasClientAndPit: boolean = clientId.value >= 0 && pitId.value >= 0;
                const hasDeposit: boolean = rows.value > 0 && cols.value > 0 && floors.value > 0;

                return hasClientAndPit && hasDeposit;
            });

            const save = () => {
                const wH: Warehouse = {
                    clientCompanyId: clientId.value,
                    pitId: pitId.value,
                    layout: deposit.value,
                };
                const { data } = useAxios('/warehouse', { method: 'POST', data: wH }, instance);
                watch(data, (warehouseApi) => {
                    if (warehouseApi && warehouseApi.data) {
                        store.dispatch('saveDeposit', warehouseApi.data);
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
            };
        },
    });
</script>

<style lang="scss" scoped>
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input[type='radio'] {
        @apply w-5 h-5 border border-second-400 text-second-400;
        &.aisle {
            @apply border-second-300 text-second-300;
        }
        &.fina {
            @apply border-orange-600 text-orange-600;
        }
        &.gruesa {
            @apply border-green-600 text-green-600;
        }
        &.cortada {
            @apply border-blue-600 text-blue-600;
        }
        &.blocked {
            @apply border-second-800 text-second-800;
        }
        &.empty {
            @apply border-second-200 text-second-200;
        }
    }
    // input:read-only {
    //   @apply bg-second-200 border cursor-not-allowed;
    // }
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
