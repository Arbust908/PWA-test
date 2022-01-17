<template>
    <article class="stage--row">
        <header class="flex justify-between">
            <h2>Etapa {{ sandStage.stage }}/20</h2>
            <p>Total: {{ weigth }} Toneladas</p>
            <div class="flex gap-x-1 items-center">
                <progress v-if="showProgress" max="100" :value="stagePorcentage">{{ stagePorcentage }}%</progress>
                <span v-if="showProgress">{{ stagePorcentage + '%' }}</span>
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
        <div
            :class="isSelectedStage ? 'opened' : 'scale-y-0 h-0'"
            class="flex gap-5 border-t border-gray-200 transform transition ease-in-out duration-300 overflow-hidden origin-top flex-wrap"
        >
            <section
                class="max-w-[16rem] w-full rounded border border-gray-200 shadow-sm px-5 py-7 self-start space-y-6"
            >
                <div v-for="(sand, index) in sands" :key="sand.id + sand.type" class="flex items-start">
                    <i class="w-3 h-3 inline-block rounded-full mesh-box__1 m-2 bubble"></i>
                    <article>
                        <h4>Arena {{ sand.type }}</h4>
                        <p class="text-gray-400">{{ sand.quantity }} toneladas</p>
                    </article>
                    <article
                        :ref="`progress${index >= 1 ? index + 1 : null}`"
                        class="w-[70px] rounded flex justify-center items-center ml-auto"
                    >
                        <div
                            class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center circle-progress"
                        >
                            <p class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]">
                                {{ getPorcentage(sand.quantity, queueDetail[sand.type], index) }}%
                            </p>
                        </div>
                    </article>
                </div>
            </section>
            <section v-if="!isActiveStage" class="flex justify-center items-center max-w-md">
                <p class="leading-wider leading-loose text-center max-w-sm mx-auto">
                    Debés completar al menos un 70% de la etapa anterior para continuar con la siguiente
                </p>
            </section>
            <section v-else class="grid grid-cols-5 gap-4 max-w-md mx-auto">
                <article
                    v-for="(box, place) in boxQueue"
                    :key="place + 'place'"
                    :class="[
                        isSelectedBox(place) ? 'selected' : null,
                        box.boxId ? `mesh-box__1 mesh-box__${box.category} filled` : 'not-filled',
                    ]"
                    class="stage--box"
                    @click="fillBox(place, $event)"
                >
                    <p>{{ box.boxId ? box.boxId : box }}</p>
                    <p v-if="box.amount" class="text-black">{{ box.amount }} ton</p>
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
            <footer class="w-full flex justify-end gap-3">
                <NoneBtn btn="wide"> Cancelar </NoneBtn>
                <InverseBtn btn="wide"> Guardar </InverseBtn>
            </footer>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { SandStage, Sand } from '@/interfaces/sandflow';
    import { useStoreLogic, StoreLogicMethods } from '@/helpers/useStoreLogic';
    import { useClone } from '@/helpers/useClone';

    import { OnClickOutside } from '@vueuse/components';
    import ChevronIcon from '@/components/stageSheet/ChevronIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import InverseBtn from '@/components/ui/buttons/InverseBtn.vue';
    import PlusIcon from './PlusIcon.vue';
    import SheetDepoBox from './sheetDepoBox.vue';
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
    const emits = defineEmits(['set-stage', 'update-queue', 'set-stage-full']);
    const router = useRouter();
    const store = useStore();
    const sands = ref([]);
    const weigth = computed(() => {
        return sands.value.reduce((acc, sand) => {
            return acc + sand.quantity;
        }, 0);
    });

    const progress = ref(null);
    const progress2 = ref(null);
    const progress3 = ref(null);
    const stagePorcentageVariable = useCssVar('--progress', progress);
    const stagePorcentageVariable2 = useCssVar('--progress', progress2);
    const stagePorcentageVariable3 = useCssVar('--progress', progress3);
    stagePorcentageVariable.value = '0%';
    const progression = setInterval(() => {
        if (parseInt(stagePorcentageVariable.value) < stagePorcentage.value) {
            stagePorcentageVariable.value = parseInt(stagePorcentageVariable.value) + '%';
        } else {
            clearInterval(progression);
        }
    }, 100);

    const showProgress = computed(() => {
        return stagePorcentage.value > 0 && stagePorcentage.value < 100;
    });
    const boxQueue = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    const addBoxToQueue = (place: null | number = null, box: any = null) => {
        if (place !== null && box !== null) {
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
    watch(isActiveStage, (newValue) => {
        if (newValue) {
            emits('update-queue', boxQueue.value);
        }
    });
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
            const compareQueue = boxQueue.value.filter((box) => {
                return box.id;
            });

            if (compareQueue.length <= 0) {
                filteredBoxes.push(box);

                return true;
            }

            if (box && box.id) {
                const isOnQueue = compareQueue.some((queuedBox) => {
                    return queuedBox.boxId === box.id;
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
    const getPorcentage = (total: number, value = 0, index = 0) => {
        if (index !== null) {
            switch (index) {
                case 0:
                    stagePorcentageVariable.value = (value * 100) / total + '%';
                    break;
                case 1:
                    stagePorcentageVariable2.value = (value * 100) / total + '%';
                    break;
                case 2:
                    stagePorcentageVariable3.value = (value * 100) / total + '%';
                    break;
            }
        }

        return (value * 100) / total;
    };

    const stagePorcentage = computed(() => {
        return getPorcentage(weigth.value, queueDetailTotal.value, null);
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
        const { sandId1, sandId2, sandId3, quantity1, quantity2, quantity3 } = props.sandStage;

        if (sandId1) {
            updateSand(await getSandLogic(sandId1), quantity1);
        }

        if (sandId2) {
            updateSand(await getSandLogic(sandId2), quantity2);
        }

        if (sandId3) {
            updateSand(await getSandLogic(sandId3), quantity3);
        }
    });
</script>

<style scoped lang="scss">
    @import '@/assets/box.scss';
    .stage {
        &--row {
            @apply rounded-md border border-gray-200 bg-white;
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
    }

    progress {
        @apply rounded-full h-2.5;
    }
    progress::-webkit-progress-bar {
        @apply bg-[#E5E7EB] rounded-full;
    }
    progress::-webkit-progress-value {
        @apply bg-main-500 rounded-full;
    }
    progress::-moz-progress-bar {
        @apply bg-gray-200 rounded-full;
    }
    .expand-btn {
        @apply flex justify-center items-center w-8 cursor-pointer transition-all duration-300 ease-in-out transform;
    }
    .stage--box {
        width: 70px;
        height: 70px;
        @apply rounded-lg flex flex-col justify-center items-center hover:shadow-md cursor-pointer transition duration-300 ease-in-out;
        &.not-filled {
            @apply border border-dashed border-gray-400;
        }
        &.selected {
            @apply text-blue-600 bg-blue-100 border-blue-600 border-solid;
        }
        &.filled {
            @apply border-solid border-2 text-sm;
        }
    }
    .circle-progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
    }
    .gutter-stable-both {
        scrollbar-gutter: stable both-edges;
    }
</style>
