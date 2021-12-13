<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import ChevronIcon from '@/components/stageSheet/ChevronIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import InverseBtn from '@/components/ui/buttons/InverseBtn.vue';

    const clientId = ref(-1);
    const pitId = ref(-1);

    const _TABS = { PENDING: 0, COMPLETED: 1 };
    const selectedTab = ref(0);
    const setTab = (tab: number) => {
        selectedTab.value = tab;
    };
    const isTabSelected = (tab: number) => {
        return selectedTab.value === tab;
    };

    const selectedStage = ref(-1);
    const stages = ref([
        { stage: 1, weight: 100, done: 100 },
        { stage: 2, weight: 200, done: 70 },
        { stage: 3, weight: 100, done: 0 },
        { stage: 4, weight: 100, done: 0 },
        { stage: 5, weight: 100, done: 0 },
        { stage: 6, weight: 100, done: 0 },
    ]);
    const setStage = (stage: number) => {
        selectedStage.value = selectedStage.value === stage ? -1 : stage;
    };
    const finalizedStages = computed(() => {
        return stages.value.filter((stage) => stage.done === stage.weight);
    });
    const pendingStages = computed(() => {
        return stages.value.filter((stage) => stage.done < stage.weight);
    });
    const calcPorcent = (done: number, total: number) => {
        return Math.round((done / total) * 100);
    };
</script>

<template>
    <Layout>
        <ABMFormTitle title="Stage sheet" />
        <FieldGroup class="max-w-4xl items-end">
            <ClientPitCombo :client-id="clientId" :pit-id="pitId" shared-classes="col-span-full md:col-span-4" />
            <PrimaryBtn class="col-span-6 md:col-span-3 max-h-12">Finalizar Stage</PrimaryBtn>
        </FieldGroup>
        <nav class="flex gap-8 mt-10">
            <button
                :class="isTabSelected(_TABS.PENDING) ? 'selected' : null"
                class="tab"
                @click="setTab(_TABS.PENDING)"
            >
                Etapas pendientes
            </button>
            <button
                :class="isTabSelected(_TABS.COMPLETED) ? 'selected' : null"
                class="tab"
                @click="setTab(_TABS.COMPLETED)"
            >
                Etapas finalizadas
            </button>
            {{ selectedStage }}
        </nav>
        <section class="mt-4 panel">
            <div v-if="isTabSelected(_TABS.PENDING)" class="stage--panel">
                <article v-for="{ stage, weight, done } in pendingStages" :key="`stage-${stage}`" class="stage--row">
                    <header class="flex justify-between">
                        <h2>Etapa {{ stage }}/20</h2>
                        <p>Total: {{ weight }} Toneladas</p>
                        <div class="flex gap-x-1 items-center">
                            <progress max="100" :value="calcPorcent(done, weight)">
                                {{ calcPorcent(done, weight) }}%
                            </progress>
                            <span>{{ calcPorcent(done, weight) }}%</span>
                        </div>
                        <i
                            :class="stage == selectedStage ? 'rotate-180' : 'rotate-0'"
                            class="expand-btn"
                            @click="setStage(stage)"
                        >
                            <ChevronIcon />
                        </i>
                    </header>
                    <div
                        :class="stage == selectedStage ? 'opened' : 'scale-y-0 h-0'"
                        class="flex gap-5 border-t border-gray-200 transform transition ease-in-out duration-300 overflow-hidden origin-top flex-wrap"
                    >
                        <section
                            class="max-w-[244px] w-full rounded border border-gray-200 shadow-sm px-5 py-7 flex items-start self-start"
                        >
                            <i class="w-3 h-3 inline-block rounded-full mesh-box__1 m-2"></i>
                            <article>
                                <h4>Arena 30/70</h4>
                                <p class="text-gray-400">15 toneladas</p>
                            </article>
                            <article class="w-[70px] rounded flex justify-center items-center ml-auto">
                                <div class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center">
                                    <p
                                        class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]"
                                    >
                                        x%
                                    </p>
                                </div>
                            </article>
                        </section>
                        <section class="grid grid-cols-5 gap-4">
                            <article
                                v-for="place in 14"
                                :key="place + 'place'"
                                class="w-[70px] h-[70px] rounded-lg border border-dashed border-gray-400 flex justify-center items-center hover:shadow-md cursor-pointer"
                            >
                                {{ place }}
                            </article>
                            <article
                                class="w-[70px] h-[70px] rounded-lg flex justify-center items-center hover:shadow-md cursor-pointer"
                            >
                                <svg
                                    width="25"
                                    height="25"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.9805 0.549805C6.35144 0.549805 0.980469 5.92077 0.980469 12.5498C0.980469 19.1788 6.35144 24.5498 12.9805 24.5498C19.6095 24.5498 24.9805 19.1788 24.9805 12.5498C24.9805 5.92077 19.6095 0.549805 12.9805 0.549805ZM19.9482 13.9046C19.9482 14.224 19.6869 14.4853 19.3676 14.4853H14.916V18.9369C14.916 19.2563 14.6547 19.5175 14.3353 19.5175H11.6256C11.3063 19.5175 11.045 19.2563 11.045 18.9369V14.4853H6.59337C6.27402 14.4853 6.01273 14.224 6.01273 13.9046V11.195C6.01273 10.8756 6.27402 10.6143 6.59337 10.6143H11.045V6.16271C11.045 5.84335 11.3063 5.58206 11.6256 5.58206H14.3353C14.6547 5.58206 14.916 5.84335 14.916 6.16271V10.6143H19.3676C19.6869 10.6143 19.9482 10.8756 19.9482 11.195V13.9046Z"
                                        fill="#8DC881"
                                    />
                                </svg>
                            </article>
                        </section>
                        <footer class="w-full flex justify-end gap-3">
                            <NoneBtn btn="wide"> Cancelar </NoneBtn>
                            <InverseBtn btn="wide"> Guardar </InverseBtn>
                        </footer>
                    </div>
                </article>
            </div>
            <div v-else-if="isTabSelected(_TABS.COMPLETED)" class="stage--panel">
                <article v-for="{ stage, weight } in finalizedStages" :key="`stage-${stage}`" class="stage--row">
                    <header class="flex justify-between">
                        <h2>Etapa {{ stage }}/20</h2>
                        <p>Total: {{ weight }} Toneladas</p>
                        <div class="flex gap-x-1 items-center justify-center">
                            <span class="italic">Finalizada</span>
                        </div>
                        <i
                            :class="stage === selectedStage ? 'opened' : null"
                            class="expand-btn"
                            @click="setStage(stage)"
                        >
                            <ChevronIcon />
                        </i>
                    </header>
                    <div></div>
                </article>
            </div>
            <aside>
                <h3 class="text-3xl font-bold">Detalle</h3>
                <article class="px-4 py-6 border rounded-[10px]">
                    <span class="text-center">Desplegá una etapa para ver el detalle de la misma</span>
                </article>
            </aside>
        </section>
    </Layout>
</template>

<style scoped lang="scss">
    @import '@/assets/box.scss';
    .tab {
        @apply text-lg border-b-4 border-transparent text-main-600 h-[48px];
        &.selected {
            @apply border-main-600 text-main-600 font-bold;
        }
    }
    .panel {
        @apply grid gap-x-6;
        grid-template-columns: minmax(320px, 1fr) 360px;
    }
    .stage {
        &--panel {
            @apply flex flex-col gap-y-2 pb-8;
        }
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
    aside {
        @apply bg-white px-4 py-6 rounded-md border border-gray-200 shadow self-start flex flex-col gap-6;
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
</style>
