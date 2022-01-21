<template>
    <article class="stage--row">
        <header class="flex justify-between">
            <h2>Etapa {{ sandStage.stage }}/20</h2>
            <p>Total: {{ weigth }} Toneladas</p>
            <div class="flex gap-x-1 items-center">
                <progress
                    v-if="showProgress"
                    max="100"
                    :class="stagePorcentage > 100 ? 'over' : null"
                    :value="stagePorcentage"
                >
                    {{ stagePorcentage }}%
                </progress>
                <span v-if="showProgress">{{ stagePorcentage.toFixed(2) + '%' }}</span>
                <span v-else class="italic text-center w-full">{{
                    stagePorcentage === 0 ? 'Pendiente' : 'Finalizada '
                }}</span>
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
                    v-for="(sand, key) in sands"
                    :key="sand.id + sand.type"
                    :sand="sand"
                    :type="sand.type"
                    :amount="sand.quantity"
                    :porcentage="getPorcentage(sand.quantity, queueDetail[sand.type])"
                />
            </section>
            <section v-if="!isActiveStage" class="flex justify-center items-center max-w-md">
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
                        box?.boxId ? `mesh-type__${box?.sandType?.id} filled boxCard` : 'not-filled',
                        box?.isDone ? 'done' : null,
                    ]"
                    class="stage--box"
                    :order="box.order"
                    @click="fillBox(place, $event)"
                >
                    <p>{{ box?.boxId ? box.boxId : box }}</p>
                    <p v-if="box?.amount" :class="box?.isDone ? '!text-gray-400' : null" class="text-black">
                        {{ box.amount }} ton
                    </p>
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
                                            v-for="(box, index) in boxesByFloorAndFiltered"
                                            :key="index"
                                            :box="box"
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
                <InverseBtn btn="wide" :is-loading="isLoading" @click="generateQueue()"> Guardar </InverseBtn>
            </footer>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { SandStage, Sand, QueueItem, SandOrder } from '@/interfaces/sandflow';
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
    import { createAllQueueItems, getQueueItems } from '@/helpers/useQueueItem';
    import { getSandOrders } from '@/helpers/useWarehouse';
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
        pitId: {
            type: Number,
            default: 0,
        },
    });
    const emits = defineEmits(['set-stage', 'update-queue', 'set-stage-full']);
    const { isActive, isSelectedStage } = toRefs(props);
    const router = useRouter();
    const store = useStore();
    const sands = ref([]);
    const weigth = computed(() => {
        return sands.value.reduce((acc, sand) => {
            return acc + sand.quantity;
        }, 0);
    });

    const isLoading = ref(false);

    const showProgress = computed(() => {
        return stagePorcentage.value > 0;
    });
    const boxQueue: Ref<Array<number | SandOrder>> = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

    const fillQueueBoxes = async () => {
        boxQueue.value = await getSandOrders();
        console.log(boxQueue.value);
        boxQueue.value = boxQueue.value
            .filter((order) => {
                return order.location;
            })
            .filter((order) => {
                const { queueItems } = order;

                if (queueItems.length) {
                    const queueItem = queueItems[0];
                    const { pitId } = queueItem;

                    return pitId === props.pitId;
                }

                return;
            })
            .map((order) => {
                const { queueItems, location } = order;

                order.location = JSON.parse(location);

                if (queueItems.length) {
                    const queueItem = queueItems[0];
                    order.isDone = queueItem.status === 99;
                    order.order = queueItem.order;

                    return order;
                }

                return;
            })
            .filter((order) => {
                return order?.order && order?.order > 0;
            })
            .sort((a, b) => {
                const { queueItems: qiA } = a;
                const { queueItems: qiB } = b;
                let orderA = 0;
                let orderB = 0;

                if (qiA.length) {
                    const queueItem = qiA[0];
                    orderA = queueItem.order;
                }

                if (qiB.length) {
                    const queueItem = qiB[0];
                    orderB = queueItem.order;
                }

                return orderB - orderA;
            });

        if (boxQueue.value.length < 14) {
            const queueNum = boxQueue.value.length;
            for (let i = queueNum + 1; i <= 14; i++) {
                boxQueue.value.push(i);
            }
        }
        console.log(boxQueue.value);
    };

    watch(isSelectedStage, (val) => {
        if (val) {
            emits('update-queue', boxQueue.value);
        }
    });

    watch(
        isActive,
        (val) => {
            if (val) {
                fillQueueBoxes();
            }
        },
        { immediate: true }
    );

    const addBoxToQueue = (place: null | number = null, box: any = null) => {
        if (place !== null && box !== null) {
            if (typeof box.location === 'string') {
                box.location = JSON.parse(box.location);
            }
            box.location.where = 'sheet';
            boxQueue.value[place] = box;
            selectedBox.value = null;
            emits('update-queue', boxQueue.value);
        } else {
            boxQueue.value.push(boxQueue.value.length + 1);
        }
    };
    const isActiveStage = computed(() => {
        return props.isActive;
    });
    watch(
        isActiveStage,
        (newValue) => {
            console.log(newValue);

            if (newValue) {
                newValue && console.log('Emito');
                emits('update-queue', boxQueue.value);
            }
        },
        { immediate: true }
    );
    const selectedBox = ref(null as any);
    const isSelectedBox = (boxId: number) => {
        return selectedBox.value?.id === boxId;
    };
    const popUpCords = reactive({
        x: 0,
        y: 0,
    });
    const fillBox = (boxId: number, event) => {
        selectedBox.value = { id: boxId };
        popUpCords.x = event.clientX;
        popUpCords.y = event.clientY;
    };

    const selectedFloor = ref(1);
    const floors = computed(() => {
        return props.boxes.length;
    });
    const selectFloor = (floor: number) => {
        selectedFloor.value = floor;
    };
    const boxesByFloorAndFiltered = computed(() => {
        const filteredBoxes = [];
        props.boxes[selectedFloor.value - 1].map((box) => {
            console.groupCollapsed(`${box.id}`);
            console.log('Box Id: ', box.id);
            console.log('Box where: ', box?.location?.where);
            console.log('Box BoxId: ', box?.sandOrder?.boxId);
            console.log('Box: ', box);
            console.groupEnd();

            const compareQueue = boxQueue.value.filter((queuedBox) => {
                return queuedBox.id;
            });

            console.log('Compare Queue: ', compareQueue);

            if (compareQueue.length <= 0) {
                filteredBoxes.push(box);

                return true;
            }

            if (box?.id) {
                const isOnQueue = compareQueue.some((queuedBox) => {
                    console.groupCollapsed(`isOnQueue ${queuedBox.id}`);
                    console.log('Box: ', queuedBox);
                    console.log('Box Id: ', queuedBox.id);
                    console.log('Box where: ', queuedBox?.location?.where);
                    console.log('Box BoxId: ', queuedBox?.boxId);
                    console.groupEnd();

                    return queuedBox.boxId === box?.sandOrder?.boxId;
                });

                if (!isOnQueue) {
                    filteredBoxes.push(box);
                }

                return !compareQueue.some((queuedBox) => queuedBox.boxId === box.boxId);
            }

            return box;
        });

        return filteredBoxes;
    });

    const queueDetail = computed(() => {
        return boxQueue.value.reduce((acc, item) => {
            if (item?.sandType?.id) {
                const sandId = item?.sandType?.id;
                const sandType = item?.sandType?.type;

                acc[sandType] = acc[sandType] ? acc[sandType] + item?.amount : item?.amount;
            }

            return acc;
        }, {});
    });
    const queueDetailTotal = computed(() => {
        let total = 0;
        for (const key in queueDetail.value) {
            if (Object.prototype.hasOwnProperty.call(queueDetail.value, key)) {
                const element = queueDetail.value[key];
                total += element;
            }
        }

        return total;
    });
    const getPorcentage = (total: number, value = 0) => {
        const result = (value * 100) / total;

        return result === Infinity ? 0 : (value * 100) / total;
    };

    const stagePorcentage = computed(() => {
        return getPorcentage(weigth.value, queueDetailTotal.value);
    });
    watch(stagePorcentage, () => {
        if (stagePorcentage.value >= 100) {
            emits('set-stage-full');
        }
    });

    const getSandLogic = async (sandId: number) => {
        const { GET } = StoreLogicMethods;
        const result = await useStoreLogic(router, store, 'sand', GET, sandId);

        if (result?.res) {
            return result.res;
        }

        return {};
    };

    const updateSand = (sand: Sand, sandQuantity: number) => {
        const { clone: sandInfo } = useClone(sand);
        sandInfo.quantity = sandQuantity;
        sands.value.push(sandInfo);
    };

    onMounted(async () => {
        emits('update-queue', boxQueue.value);
        const { sandId1, sandId2, sandId3, sandId4, quantity1, quantity2, quantity3, quantity4 } = props.sandStage;

        if (sandId1) {
            updateSand(await getSandLogic(sandId1), quantity1);
        }

        if (sandId2) {
            updateSand(await getSandLogic(sandId2), quantity2);
        }

        if (sandId3) {
            updateSand(await getSandLogic(sandId3), quantity3);
        }

        if (sandId4) {
            updateSand(await getSandLogic(sandId4), quantity4);
        }
    });

    const generateQueue = async () => {
        isLoading.value = true;
        console.log(boxQueue.value);
        const toAddQueue: Array<QueueItem> = boxQueue.value
            .filter((box) => {
                return typeof box !== 'number';
            })
            .map((box) => {
                return box.queueItems[0];
            })
            .filter((item) => {
                console.log('item: ', item);

                return;
            })
            .map((item) => {
                item.origin = item.destination;
                item.destination = null;
            });
        console.log(toAddQueue);

        await createAllQueueItems(toAddQueue);
        console.log('Espero');
        isLoading.value = false;
        // Emit que todo esta sumado
    };
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
    }
    .circle-progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
    }
    .gutter-stable-both {
        scrollbar-gutter: stable both-edges;
    }
</style>
