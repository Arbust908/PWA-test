<script setup lang="ts">
    import ChevronIcon from '@/components/stageSheet/ChevronIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import InverseBtn from '@/components/ui/buttons/InverseBtn.vue';
    import PlusIcon from './PlusIcon.vue';
    const props = defineProps({
        stage: {
            type: Number,
            default: 1,
        },
        weight: {
            type: Number,
            default: 1,
        },
        done: {
            type: Number,
            default: 0,
        },
        isSelectedStage: {
            type: Boolean,
            default: false,
        },
    });
    defineEmits(['set-stage']);
    const stagePorcentage = ref(Math.round((props.done / props.weight) * 100));
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
</script>

<template>
    <article class="stage--row">
        <header class="flex justify-between">
            <h2>Etapa {{ stage }}/20</h2>
            <p>Total: {{ weight }} Toneladas</p>
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
                @click="$emit('set-stage', stage)"
            >
                <ChevronIcon />
            </i>
        </header>
        <div
            :class="isSelectedStage ? 'opened' : 'scale-y-0 h-0'"
            class="flex gap-5 border-t border-gray-200 transform transition ease-in-out duration-300 overflow-hidden origin-top flex-wrap"
        >
            <section
                class="max-w-[244px] w-full rounded border border-gray-200 shadow-sm px-5 py-7 flex items-start self-start"
            >
                <i class="w-3 h-3 inline-block rounded-full mesh-box__1 m-2 bubble"></i>
                <article>
                    <h4>Arena 30/70</h4>
                    <p class="text-gray-400">15 toneladas</p>
                </article>
                <article ref="progress" class="w-[70px] rounded flex justify-center items-center ml-auto">
                    <div class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center circle-progress">
                        <p class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]">
                            {{ stagePorcentage }}%
                        </p>
                    </div>
                </article>
            </section>
            <section v-if="!showProgress" class="flex justify-center items-center max-w-md">
                <p class="leading-wider leading-loose text-center w-full px-4">
                    Debés completar al menos un 70% de la etapa anterior para continuar con la siguiente
                </p>
            </section>
            <section v-else class="grid grid-cols-5 gap-4 max-w-md mx-auto">
                <article v-for="place in 14" :key="place + 'place'" class="stage--box not-filled">
                    {{ place }}
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
            @apply text-blue-600 bg-blue-100 border-blue-600;
        }
    }
    .circle-progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
    }
</style>
