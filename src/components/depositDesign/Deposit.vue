<template>
    <section class="w-full flex flex-col gap-5">
        <nav class="flex gap-x-4 pl-2">
            <button
                v-for="f in floor"
                :key="`floor${f}`"
                :class="currentFloor === f ? 'current' : null"
                class="floor"
                @click.prevent="setFloor(f)"
            >
                Nivel {{ f }}
            </button>
        </nav>
        <article class="max-w-md md:max-w-lg lg:max-w-2xl p-2 max-h-[400px]">
            <div v-if="rows > 0 && cols > 0" ref="depo" class="deposit">
                <template v-for="row in rows" :key="`row-${row}`">
                    <template v-for="col in cols" :key="`col-${col}`">
                        <DepositBox
                            :row="row"
                            :col="col"
                            :floor="currentFloor"
                            :deposit="deposit"
                            :selected-box="selectedBox"
                            :visible-categories="visibleCategories"
                            :box-data="getBoxData(row, col, currentFloor)"
                            @select-box="selectBox"
                        />
                    </template>
                </template>
            </div>
            <div v-else class="w-full max-w-sm border-dashed border-4 rounded-xl p-5 my-3 mx-3">
                <span> Elige las dimensiones del depósito para comenzar</span>
            </div>
        </article>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue';
    import { useCssVar } from '@vueuse/core';
    import { Box } from '@/interfaces/sandflow';
    import DepositBox from '@/components/depositDesign/DepositBox.vue';

    export default defineComponent({
        name: 'Deposit',
        components: {
            DepositBox,
        },
        props: {
            selectedBox: {
                type: Object,
                required: true,
            },
            deposit: {
                type: Object,
                required: true,
            },
            floor: {
                type: Number,
                required: true,
            },
            rows: {
                type: Number,
                required: true,
            },
            cols: {
                type: Number,
                required: true,
            },
            visibleCategories: {
                type: Array,
                required: false,
                default: () => undefined,
            },
        },
        emits: { 'select-box': null },
        setup(props, { emit }) {
            const { floor, rows, cols, deposit } = toRefs(props);
            const depo = ref(null);
            const cssRows = useCssVar('--rows', depo);
            cssRows.value = '' + rows.value;

            watch(rows, (newVal) => {
                cssRows.value = `${newVal}`;
            });

            const cssCols = useCssVar('--cols', depo);
            cssCols.value = '' + cols.value;

            watch(cols, (newVal) => {
                cssCols.value = `${newVal}`;
            });

            const currentFloor = ref(1);
            const setFloor = (floorNum: number) => {
                currentFloor.value = floorNum;
            };

            watch(floor, (newVal) => {
                if (newVal < currentFloor.value) {
                    setFloor(newVal);
                }
            });

            const selectBox = (box: Box) => {
                emit('select-box', box);
            };

            const getBoxData = (row: number, col: number, floorNum: number) => {
                return deposit.value[`${floorNum}|${row}|${col}`];
            };

            ref(props.visibleCategories);

            return {
                currentFloor,
                getBoxData,
                setFloor,
                selectBox,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .deposit {
        grid-template-columns: repeat(var(--cols), 3rem);
        grid-template-rows: repeat(var(--rows), 3rem);
        @apply grid gap-4; // gap-[17px]
    }
    .floor {
        @apply border-b-4 border-transparent pb-2;
    }
    .current {
        @apply border-main-500;
    }
</style>
