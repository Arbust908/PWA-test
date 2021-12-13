<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import StageSheetStage from '@/components/stageSheet/stageSheetStage.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

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
    const isSageSelected = (stage: number, selected: number): boolean => {
        return selected === stage;
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
        </nav>
        <section class="mt-4 panel">
            <div v-if="isTabSelected(_TABS.PENDING)" class="stage--panel">
                <StageSheetStage
                    v-for="sheet in pendingStages"
                    :key="`stage-${sheet.stage}`"
                    v-bind="sheet"
                    :is-selected-stage="isSageSelected(sheet.stage, selectedStage)"
                    @set-stage="setStage($event)"
                />
            </div>
            <div v-else-if="isTabSelected(_TABS.COMPLETED)" class="stage--panel">
                <StageSheetStage
                    v-for="sheet in finalizedStages"
                    :key="`stage-${sheet.stage}`"
                    v-bind="sheet"
                    :is-selected-stage="isSageSelected(sheet.stage, selectedStage)"
                    @set-stage="setStage($event)"
                />
            </div>
            <aside>
                <h3 class="text-3xl font-bold">Detalle</h3>
                <article v-if="selectedStage === -1" class="px-4 py-6 border rounded-[10px]">
                    <span class="text-center">Desplegá una etapa para ver el detalle de la misma</span>
                </article>
                <article v-else class="px-4 py-6 rounded-[10px] bg-blue-100">
                    <div class="text-semibold space-y-3">
                        <p>
                            <span>Total Arena A:</span>
                            <span>-</span>
                        </p>
                        <p>
                            <span>Total Arena B:</span>
                            <span>-</span>
                        </p>
                        <p>
                            <span>Total Arena C:</span>
                            <span>-</span>
                        </p>
                    </div>
                    <hr class="border-white border mt-1" />
                    <p class="text-bold text-lg mt-4">
                        <span>Total General:</span>
                        <span>-</span>
                    </p>
                </article>
                <article v-if="false" class="px-3 py-4 rounded-[10px] bg-gray-100 border border-gray-400 shadow">
                    <p class="text-sm flex gap-x-1">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.323 12.5452L8.323 9.21191M8.323 5.87858L8.31466 5.87858M0.822998 9.21192C0.822997 5.06978 4.18086 1.71192 8.323 1.71192C12.4651 1.71191 15.823 5.06978 15.823 9.21191C15.823 13.354 12.4651 16.7119 8.323 16.7119C4.18086 16.7119 0.822998 13.3541 0.822998 9.21192Z"
                                stroke="#374151"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>

                        <span>No coincide con el total de la planificación</span>
                    </p>
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
</style>
