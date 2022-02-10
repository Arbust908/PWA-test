<template>
    <article class="stage--row">
        <header class="flex justify-between">
            <h2>Etapa {{ sandStage.stage }}/20</h2>
            <p>Total: {{ weigth }} Toneladas</p>
            <!-- <p>{{ sandStage.id }}</p> -->
            <div v-if="sandStage.status === 2" class="flex gap-x-1 items-center">
                <span class="italic text-center w-full">Finalizado</span>
            </div>
            <div v-else class="flex gap-x-1 items-center">
                <progress
                    v-if="showProgress"
                    max="100"
                    :class="stagePorcentage > 100 ? 'over' : null"
                    :value="stagePorcentage"
                >
                    {{ stagePorcentage }}%
                </progress>
                <span v-if="showProgress">{{ stagePorcentage.toFixed(2) + '%' }}</span>
                <span v-else class="italic text-center w-full">{{ stageStatus[sandStage.status] }}</span>
            </div>
            <i
                :class="isSelectedStage ? 'rotate-180' : 'rotate-0'"
                class="expand-btn"
                @click="$emit('set-stage', sandStage.id)"
            >
                <ChevronIcon />
            </i>
        </header>
        <div v-if="isSelectedStage" :class="isSelectedStage ? 'opened' : 'scale-y-0 h-0'" class="stage--details">
            <section
                class="max-w-[16rem] w-full rounded border border-gray-200 shadow-sm px-5 py-7 self-start space-y-6"
            >
                <StageSheetSandDetail
                    v-for="sand in sands"
                    :key="sand.id + sand.type"
                    :sand="sand"
                    :type="sand.type"
                    :amount="sand.quantity"
                    :porcentage="getPorcentage(sand?.quantity, queueDetail[sand.type]?.amount)"
                />
            </section>
            <section v-if="sandStage.status === 0 && !isActive" class="flex justify-center items-center max-w-md">
                <p class="leading-wider leading-loose text-center max-w-sm mx-auto">
                    Debés completar al menos un 70% de la etapa anterior para continuar con la siguiente
                </p>
            </section>
            <section v-else class="stage--queue">
                <article
                    v-for="(box, place) in boxQueue"
                    :key="place + 'place'"
                    :class="[
                        isSelectedBox(place) ? 'selected' : null,
                        box?.boxId ? `mesh-type__${box?.sandTypeId} filled boxCard relative group` : 'not-filled',
                        box?.status === 99 ? 'done' : null,
                        box?.status === 100 ? 'completed' : null,
                    ]"
                    class="stage--box"
                    :order="box.order"
                    @click="box?.boxId ? activeDelete(box) : fillBox(place, $event)"
                >
                    <button
                        v-if="box?.boxId && box?.status < 99"
                        class="w-6 h-6 absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full shadow-sm group-hover:bg-red-400 group-hover:text-red-50 transition duration-150 ease-out"
                    >
                        <TheAllIcon icon="XCircle" type="outline" />
                    </button>
                    <p>{{ box?.boxId ? box.boxId : box }}</p>
                    <p v-if="box?.amount" :class="box?.status < 99 ? 'text-black' : null">{{ box.amount }} ton</p>
                    <!-- <p v-if="box?.sandStageId">{{ box?.sandStageId }}</p> -->
                    <teleport to="#modal">
                        <OnClickOutside v-if="isSelectedBox(place)" @trigger="selectedBox = null">
                            <div
                                :style="`top: ${popUpCords.y}px; left: ${popUpCords.x}px`"
                                class="top-0 left-0 absolute rounded bg-gray-50 z-40 w-[309px] max-h-[390px] pt-6 shadow-md"
                            >
                                <div>
                                    <h2 class="text-xl font-bold px-6">Depósito</h2>
                                    <nav class="mt-5 mb-4 space-x-6 px-6">
                                        <button
                                            v-for="flor in floors"
                                            :key="`Floor${flor}`"
                                            :class="`${
                                                flor === selectedFloor
                                                    ? 'border-main-500 font-medium'
                                                    : 'border-transparent font-normal'
                                            }`"
                                            class="text-sm text-main-500 pb-3 border-b-2"
                                            @click="selectFloor(flor)"
                                        >
                                            Nivel {{ flor }}
                                        </button>
                                    </nav>
                                    <section class="overflow-y-auto gutter-stable-both max-h-[220px] pb-6 space-y-2">
                                        <SheetDepoBox
                                            v-for="(floorBox, index) in boxesByFloorAndFiltered"
                                            :key="index"
                                            :box="floorBox"
                                            @set-box="addBoxToQueue(place, $event)"
                                        />
                                        <p v-if="boxesByFloorAndFiltered.length <= 0">Sin Cajas</p>
                                    </section>
                                </div>
                            </div>
                        </OnClickOutside>
                    </teleport>
                </article>
                <article class="stage--box" @click="addBoxToQueue()">
                    <PlusIcon />
                </article>
            </section>
            <footer class="col-span-full flex justify-end gap-3">
                <NoneBtn btn="wide" :is-loading="isLoading" @click="$emit('set-stage', sandStage.id)">
                    Cancelar
                </NoneBtn>
                <InverseBtn btn="wide" :is-loading="isLoading" @click="generateQueue()">
                    {{ stagePorcentage < 100 ? 'Guardar' : 'Finalizar' }}
                </InverseBtn>
            </footer>
        </div>
    </article>
</template>

<script setup lang="ts">
    import {
        SandStage,
        Sand,
        QueueItem,
        SandOrder,
        SandOrderBox,
        PurchaseOrder,
        BoxLocation,
        QueueBox,
    } from '@/interfaces/sandflow';
    import { useStoreLogic, StoreLogicMethods } from '@/helpers/useStoreLogic';
    import { useClone } from '@/helpers/useClone';
    import { Ref } from 'vue';

    import { OnClickOutside } from '@vueuse/components';
    import ChevronIcon from '@/components/stageSheet/ChevronIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import InverseBtn from '@/components/ui/buttons/InverseBtn.vue';
    import PlusIcon from './PlusIcon.vue';
    import SheetDepoBox from './sheetDepoBox.vue';
    import StageSheetSandDetail from './stageSheetSandDetail.vue';
    import {
        createAllQueueItems,
        deleteQueueItem,
        getOrderPro,
        getQueueItems,
        QueueTransactions,
        separateQueues,
        sheetGridItems,
    } from '@/helpers/useQueueItem';
    import {
        encodeNewOrigin,
        extractBoxInfo,
        extractOrderInfo,
        filterEmptyQueueBox,
        filterJustToAddBox,
        getPorcentage,
        moveBoxes,
    } from '@/helpers/useSheetHelpers';
    import { getSandOrders } from '@/helpers/useWarehouse';
    import { getLast } from '@/helpers/iteretionHelpers';
    import { useSheetStore } from '@/store/stageSheet.pinia';
    import { storeToRefs } from 'pinia';
    import TheAllIcon from '../icon/TheAllIcon.vue';
    const props = defineProps({
        sandStage: {
            type: Object,
            required: true,
        },
        boxes: {
            type: Array,
            default: () => [],
        },
        isSelectedStage: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    });
    const emits = defineEmits(['set-stage', 'update-queue', 'set-stage-full', 'saved-queue']);
    const sheetStore = useSheetStore();
    const { sands: allSands, getPitBoxes, getPitBoxesByFloor } = storeToRefs(sheetStore);
    /**
     * isActive Marca si es un stage que esta "activo" y por ende muestra el porsentaje
     * isSelectedStage Marca si el stage esta seleccionado y por ende el que muestra los detalles
     */
    const { isActive, isSelectedStage } = toRefs(props);
    const sands = ref([] as Sand[]);
    const weigth = computed(() => {
        console.log('SANDS', sands.value);

        return sands.value.reduce((acc, sand: any) => {
            return acc + sand.quantity;
        }, 0);
    });
    const isLoading = ref(false);
    const stageStatus = {
        0: 'Pendiente',
        1: 'En Proceso',
        2: 'Finalizado',
    };

    const showProgress = computed(() => {
        return stagePorcentage.value > 0;
    });
    // Cola de cajas del Stage
    /**
     * @type {Ref<Array<number | QueueItem>>}
     * @description Referencia a la cola de cajas del stage
     */
    const boxQueue: Ref<Array<number | SandOrderBox | QueueBox>> = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

    /**
     * Tomamos los QueueItems de este Pozo y los filtramos por los que van al Cradle
     * y los mutamos para que tengan la info de la caja (boxId, peso y tipo de arena)
     */
    const fillQueueBoxes = async () => {
        const sheetItems = getPitBoxes.value;
        console.log('---------->>fillQueueBoxes<<----------');
        console.log('sheetItems', sheetItems);
        const { deTransporte, aCradle } = separateQueues(sheetItems);
        const newItemList = [...deTransporte, ...aCradle];
        /**
         * Lo que quiero son las tareas que mueven Cajas
         *  1 - Del depo al Cradle
         *  2 - Del Transporte al Cradle
         * quiero filtar para que solo me queden las que cumplen con eso
         * sacando las que van del tranporte al deposito
         */
        console.log('newItemList', newItemList);
        const queueIds = [] as number[];
        let boxList = newItemList.filter((item) => {
            const { origin, destination } = item;
            console.groupCollapsed(`${origin} => ${destination}`);
            const baseOrigin = origin.split(' ')[0];
            const baseDestination = destination.split(' ')[0];
            console.log(baseOrigin);
            console.log(baseDestination);

            // Si viene del camion
            if (baseOrigin === 'Camion') {
                console.log('Vengo del camion');
                const destinationArray = destination.split(' ');

                // Si tiene 3 de length va al depo por enden no las quiero
                if (destinationArray.length === 3) {
                    console.log('voy al depo');
                    console.groupEnd();

                    return false;
                }
                console.log('voy al cradle');
                console.groupEnd();

                return true;
            } else if (baseDestination === 'Estación' || baseDestination === '') {
                console.log('voy al cradle');
                console.groupEnd();

                return true;
            } else {
                console.log('No entro');
                console.groupEnd();

                return false;
            }
        });

        boxList = boxList.filter((item) => {
            const currentStageId = props.sandStage.id;
            const { sandStageId } = item as QueueBox;
            console.groupCollapsed('QueueBox');
            console.log('item', item);
            console.log('sandStage', props.sandStage.id);
            console.log('Es de este Stage?', currentStageId === sandStageId);
            console.groupEnd();

            return currentStageId === sandStageId;
        });
        boxList = boxList.map(extractOrderInfo);
        boxList = boxList.filter((item) => {
            const itemId = item.id as number;
            console.log('itemId', item);
            const isDuplicate = queueIds.includes(itemId);

            if (!isDuplicate) {
                queueIds.push(itemId);

                return true;
            }
        });
        console.log(boxList);
        boxQueue.value = boxList as QueueBox[];

        if (boxQueue.value.length < 14) {
            const queueNum = boxQueue.value.length;
            for (let i = queueNum + 1; i <= 14; i++) {
                boxQueue.value.push(i);
            }
        }
    };

    const { sandId1, sandId2, sandId3, sandId4, quantity1, quantity2, quantity3, quantity4 } = toRefs(props.sandStage);
    const updateSand = (sand: Sand, sandQuantity: number) => {
        const sandInfo = JSON.parse(JSON.stringify(sand));
        sandInfo.quantity = sandQuantity;
        sands.value.push(sandInfo);
    };

    if (sandId1.value) {
        const sand1 = allSands.value.find((sand) => sand.id === sandId1.value) || ({} as Sand);
        console.log('sand1', sand1);
        console.log('QUANTITY 1', quantity1.value);
        updateSand(sand1, quantity1.value);
    }

    if (sandId2.value) {
        const sand2 = allSands.value.find((sand) => sand.id === sandId2.value) || ({} as Sand);
        updateSand(sand2, quantity2.value);
    }

    if (sandId3.value) {
        const sand3 = allSands.value.find((sand) => sand.id === sandId3.value) || ({} as Sand);
        updateSand(sand3, quantity3.value);
    }

    if (sandId4.value) {
        const sand4 = allSands.value.find((sand) => sand.id === sandId4.value) || ({} as Sand);
        updateSand(sand4, quantity4.value);
    }

    watch(isSelectedStage, (val) => {
        if (val) {
            emits('update-queue', boxQueue.value);
        }
    });
    watch(
        isActive,
        (val) => {
            if (val) {
                emits('update-queue', boxQueue.value);
                fillQueueBoxes();
            }
        },
        { immediate: true }
    );

    const addBoxToQueue = (place: null | number = null, box: any = null) => {
        if (place !== null && box !== null) {
            box.toAdd = true; // *** Con esto puedo saber si la agregue recien ;D
            boxQueue.value[place] = box;
            selectedBox.value = null;
            emits('update-queue', boxQueue.value);
        } else {
            boxQueue.value.push(boxQueue.value.length + 1);
        }
    };
    const selectedBox = ref(null as any);
    const isSelectedBox = (boxId: number) => {
        return selectedBox.value?.id === boxId;
    };
    const popUpCords = reactive({
        x: 0,
        y: 0,
    });
    const fillBox = (boxId: number, event: any) => {
        selectedBox.value = { id: boxId };
        popUpCords.x = event.clientX;
        popUpCords.y = event.clientY;
    };
    const activeDelete = async (place: QueueItem | SandOrder | number) => {
        console.log('activeDelete', place);

        if (typeof place === 'number') {
            return;
        } else if ('queueItems' in place) {
            // Soy SandOrder
            // Simplemente lo elimino de la cola
            boxQueue.value = boxQueue.value.filter((item: any) => {
                return (item?.queueItems && item.id !== place.id) || typeof item === 'number';
            });
        } else {
            // Soy QueueItem
            // Lo elimino de la cola
            place.id && (await deleteQueueItem(place.id));
            boxQueue.value = boxQueue.value.filter((item: any) => {
                return (!item?.queueItems && item.id !== place.id) || typeof item === 'number';
            });
        }
        // await fillQueueBoxes();
    };

    const selectedFloor = ref(1);
    const floors = computed(() => {
        return props.boxes.length;
    });
    const selectFloor = (floor: number) => {
        selectedFloor.value = floor;
    };

    /* CAJAS POR PISO para el dropdown que agrega */
    const boxesByFloorAndFiltered = computed(() => {
        console.log('boxesByFloorAndFiltered', getPitBoxesByFloor.value);
        let filteredBoxes = getPitBoxesByFloor.value[selectedFloor.value - 1] || [];
        console.log('filteredBoxes', filteredBoxes);
        filteredBoxes =
            filteredBoxes.filter((box: any) => {
                const { location, status } = box;
                const { where } = location;

                return where === 'warehouse' && status <= 99;
            }) || [];

        const queueNoNumbers = boxQueue.value.filter((item) => {
            return typeof item !== 'number';
        });
        const usedQueueIds = queueNoNumbers.map((box) => {
            const { boxId } = box as SandOrderBox;

            return boxId;
        });

        return filteredBoxes.filter((box: SandOrderBox) => !usedQueueIds.includes(box?.boxId));
    });

    interface QueueDetail {
        name: string;
        amount: number;
        sand: Sand;
        id: number;
    }

    // Suma de los mismos tipos de arena
    const queueDetail = computed(() => {
        console.log('Las cajas en la cola 🍑', boxQueue.value);

        return boxQueue.value.reduce((acc, item) => {
            if (typeof item === 'number') {
                return acc;
            }

            if (item?.sandTypeId) {
                const sandId = item?.sandTypeId;
                const selectedSand = allSands.value.find((sand) => sand.id === sandId) as Sand;
                const sandType = selectedSand?.type || 'Desconocido';
                const sandAmount = item?.amount || 0;

                if (acc[sandType]) {
                    acc[sandType].amount = acc[sandType].amount + sandAmount;
                } else {
                    acc[sandType] = { name: sandType, amount: sandAmount, id: sandId, sand: selectedSand };
                }
            }

            return acc;
        }, {} as { [key: string]: QueueDetail });
    });

    // Suma del total de arena
    const queueDetailTotal = computed(() => {
        return Object.values(queueDetail.value).reduce((acc, item) => {
            return acc + item.amount;
        }, 0);
    });
    const stagePorcentage = computed(() => {
        console.log(weigth.value, queueDetailTotal.value);

        return getPorcentage(weigth.value, queueDetailTotal.value);
    });

    const generateQueue = async () => {
        isLoading.value = true;
        const toAddQueue: Array<SandOrderBox> = boxQueue.value
            .filter(filterEmptyQueueBox)
            .filter(filterJustToAddBox) as SandOrderBox[];

        /**
         * Aca lo que voy a tener son QueueItems y cajas que estan en el depo
         * Hay que crear los QueueItems que van al Cradle
         */
        const SandOrdersToMove = [] as Array<SandOrderBox>;
        const newQueueItems = await JSON.parse(JSON.stringify(toAddQueue)).map(async (item: SandOrderBox) => {
            const { id, purchaseOrder, location } = item;
            const { pitId: itemPitId } = purchaseOrder as PurchaseOrder;
            const { where, where_origin } = location as BoxLocation;
            const { DepositoACradle } = QueueTransactions;

            const destination = (where === 'warehouse' ? where_origin : '') as string;

            const newOrder = await getOrderPro(DepositoACradle);

            const newItem = {
                status: 0,
                order: newOrder,
                sandOrderId: id,
                pitId: itemPitId,
                origin: destination,
                destination: '',
            };
            const { sandStage } = toRefs(props);
            console.log('SandPlan & SandStage', sandStage.value, sandStage.value.sandPlanId);
            console.log('newItem, newOrigin', 'encodeNewOrigin');
            const newOrigin = encodeNewOrigin(newItem.origin, sandStage.value as SandStage);
            newItem.origin = newOrigin;
            SandOrdersToMove.push(item);

            return newItem as QueueItem;
        });

        await moveBoxes(SandOrdersToMove);
        await createAllQueueItems(await Promise.all(newQueueItems));
        isLoading.value = false;

        console.log(stagePorcentage.value, '👌');

        if (stagePorcentage.value >= 100) {
            console.log('👍');
            emits('saved-queue', true);
        } else {
            console.log('👎');
            emits('saved-queue', false);
        }
    };

    onMounted(() => {
        fillQueueBoxes();
        emits('update-queue', boxQueue.value);
    });
</script>

<style scoped lang="scss">
    @import '@/assets/box.scss';
    .stage {
        &--row {
            @apply rounded-md border border-gray-200 bg-white max-w-[744px];
            & > header {
                @apply px-6 py-8;
                h2,
                p,
                div {
                    @apply w-40;
                }
                p {
                    @apply text-center;
                }
            }
            & > div.opened {
                @apply px-6 py-8 scale-y-100 h-auto;
            }
        }
        &--details {
            grid-template-columns: 16rem 1fr;
            @apply grid gap-5 border-t border-gray-200 transform transition ease-in-out duration-300 overflow-hidden origin-top;
        }
    }
    progress {
        @apply rounded-full h-2.5;
        &::-webkit-progress-bar {
            @apply bg-[#E5E7EB] rounded-full;
        }
        &::-webkit-progress-value {
            @apply bg-main-500 rounded-full;
        }
        &::-moz-progress-bar {
            @apply bg-gray-200 rounded-full;
        }
    }
    progress.over {
        &::-webkit-progress-value {
            @apply bg-red-500;
        }
    }
    .expand-btn {
        @apply flex justify-center items-center w-8 cursor-pointer transition-all duration-300 ease-in-out transform;
    }
    .stage--queue {
        grid-template-columns: repeat(auto-fit, 70px);
        @apply grid gap-4;
    }
    .stage--box {
        height: 70px;
        @apply rounded-lg flex flex-col justify-center items-center hover:shadow-md cursor-pointer transition duration-300 ease-in-out;
        &.not-filled {
            @apply border border-dashed border-gray-400;
        }
        &.selected {
            @apply text-blue-600 bg-blue-100 border-blue-600 border-solid;
        }
        &.filled {
            @apply border-solid border  text-sm;
        }
        &.done {
            @apply cursor-not-allowed bg-gray-300 border-gray-400 text-gray-400 hover:shadow-none;
        }
        &.completed {
            @apply cursor-not-allowed bg-gray-400 border-gray-200 text-gray-200 hover:shadow-none;
        }
    }
    .circle-progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
    }
    .gutter-stable-both {
        scrollbar-gutter: stable both-edges;
    }
</style>
