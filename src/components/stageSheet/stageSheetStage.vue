<script setup lang="ts">
    import { SandStage } from '@/interfaces/sandflow';

    import { OnClickOutside } from '@vueuse/components';
    import ChevronIcon from '@/components/stageSheet/ChevronIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import InverseBtn from '@/components/ui/buttons/InverseBtn.vue';
    import PlusIcon from './PlusIcon.vue';
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
    });
    defineEmits(['set-stage']);
    const sands = computed(() => {
        if (!props.sandStage) {
            return [];
        }
        const sand1 = {
            ...props.sandStage.sand1,
            ...(props.sandStage.sand1 && { quantity: props.sandStage.quantity1 }),
        };
        const sand2 = {
            ...props.sandStage.sand2,
            ...(props.sandStage.sand2 && { quantity: props.sandStage.quantity2 }),
        };
        const sand3 = {
            ...props.sandStage.sand3,
            ...(props.sandStage.sand3 && { quantity: props.sandStage.quantity3 }),
        };

        return [sand1, sand2, sand3].filter((sand) => {
            return Object.keys(sand).length !== 0;
        });
    });
    const weigth = computed(() => {
        return sands.value.reduce((acc, sand) => {
            return acc + sand.quantity;
        }, 0);
    });
    const stagePorcentage = ref(Math.round((1 / weigth.value) * 100));
    const progress = ref(null);
    const stagePorcentageVariable = useCssVar('--progress', progress);
    stagePorcentageVariable.value = '0%';
    const progression = setInterval(() => {
        if (parseInt(stagePorcentageVariable.value) < stagePorcentage.value) {
            stagePorcentageVariable.value = parseInt(stagePorcentageVariable.value) + 1 + '%';
        } else {
            clearInterval(progression);
        }
    }, 100);

    const showProgress = computed(() => {
        return stagePorcentage.value > 0 && stagePorcentage.value < 100;
    });
    const boxQueue = ref([]);
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
        console.log(event);
        console.log(event.clientX, event.clientY);
        popUpCords.x = event.clientX;
        popUpCords.y = event.clientY;
        console.log(popUpCords);
    };
</script>

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
                <div v-for="sand in sands" :key="sand.id + sand.type" class="flex items-start">
                    <i class="w-3 h-3 inline-block rounded-full mesh-box__1 m-2 bubble"></i>
                    <article>
                        <h4>Arena {{ sand.type }}</h4>
                        <p class="text-gray-400">{{ sand.quantity }} toneladas</p>
                    </article>
                    <article ref="progress" class="w-[70px] rounded flex justify-center items-center ml-auto">
                        <div
                            class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center circle-progress"
                        >
                            <p class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]">
                                {{ stagePorcentage }}%
                            </p>
                        </div>
                    </article>
                </div>
            </section>
            <section v-if="!showProgress" class="flex justify-center items-center max-w-md">
                <p class="leading-wider leading-loose text-center w-full px-4">
                    Debés completar al menos un 70% de la etapa anterior para continuar con la siguiente
                </p>
            </section>
            <section v-else class="grid grid-cols-5 gap-4 max-w-md mx-auto">
                <article
                    v-for="place in 14"
                    :key="place + 'place'"
                    :class="isSelectedBox(place) ? 'selected' : null"
                    class="stage--box not-filled"
                    @click="fillBox(place, $event)"
                >
                    {{ place }}
                    <teleport to="#modal">
                        <OnClickOutside v-if="isSelectedBox(place)" @trigger="selectedBox = null">
                            <div
                                :style="`top: ${popUpCords.y}px; left: ${popUpCords.x}px`"
                                class="top-0 left-0 absolute rounded bg-gray-50 z-40 w-[309px] max-h-[390px] p-6 shadow-md"
                            >
                                <div>
                                    <h2 class="text-xl font-bold">Depósito</h2>
                                    <nav class="mt-5 mb-4 space-x-6">
                                        <button
                                            class="text-sm font-medium text-main-500 pb-3 border-b-2 border-main-500"
                                        >
                                            Nivel x
                                        </button>
                                        <button class="text-sm text-main-500 pb-3 border-b-2 border-transparent">
                                            Nivel xx
                                        </button>
                                    </nav>
                                    <button
                                        v-for="({ id, category, floor, row, col }, index) in boxes"
                                        :key="index + '_' + id"
                                        :class="`mesh-box__1 mesh-box__${category} bubble`"
                                        class="p-3 rounded shadow-sm text-sm w-full text-left"
                                    >
                                        {{ id }}::{{ category }} - {{ floor }} - {{ row }} - {{ col }}
                                    </button>
                                    <button v-for="(box, index) in boxes" :key="index">
                                        {{ box }}
                                    </button>
                                </div>
                            </div>
                        </OnClickOutside>
                    </teleport>
                </article>
                <article class="stage--box">
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
        @apply rounded-lg flex justify-center items-center hover:shadow-md cursor-pointer transition duration-300 ease-in-out;
        &.not-filled {
            @apply border border-dashed border-gray-400;
        }
        &.selected {
            @apply text-blue-600 bg-blue-100 border-blue-600 border-solid;
        }
    }
    .circle-progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
    }
</style>
