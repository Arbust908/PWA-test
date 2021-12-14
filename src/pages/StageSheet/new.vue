<script setup lang="ts">
    import { StageSheet, SandStage } from '@/interfaces/sandflow';

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
    const stages: Ref<Array<SandStage>> = ref([
        {
            id: 2,
            stage: 1,
            sandId1: 1,
            sandId2: 2,
            sandId3: null,
            quantity1: 100,
            quantity2: 20,
            quantity3: 0,
            sandPlanId: 1,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-26T19:33:55.000Z',
            updatedAt: '2021-11-26T19:34:10.000Z',
            deletedAt: null,
            sandPlan: {
                id: 1,
                pitId: 1,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-26T19:33:55.000Z',
                updatedAt: '2021-11-26T19:34:10.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '100',
                visible: true,
                createdAt: '2021-11-26T19:07:45.000Z',
                updatedAt: '2021-12-07T18:00:13.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
            sand3: null,
        },
        {
            id: 3,
            stage: 3,
            sandId1: 1,
            sandId2: 2,
            sandId3: null,
            quantity1: 200,
            quantity2: 10,
            quantity3: null,
            sandPlanId: 1,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-26T19:33:55.000Z',
            updatedAt: '2021-11-26T19:34:10.000Z',
            deletedAt: null,
            sandPlan: {
                id: 1,
                pitId: 1,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-26T19:33:55.000Z',
                updatedAt: '2021-11-26T19:34:10.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '100',
                visible: true,
                createdAt: '2021-11-26T19:07:45.000Z',
                updatedAt: '2021-12-07T18:00:13.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
            sand3: null,
        },
        {
            id: 1,
            stage: 2,
            sandId1: 1,
            sandId2: 2,
            sandId3: null,
            quantity1: 200,
            quantity2: 10,
            quantity3: null,
            sandPlanId: 1,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-26T19:33:55.000Z',
            updatedAt: '2021-11-26T19:34:10.000Z',
            deletedAt: null,
            sandPlan: {
                id: 1,
                pitId: 1,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-26T19:33:55.000Z',
                updatedAt: '2021-11-26T19:34:10.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '100',
                visible: true,
                createdAt: '2021-11-26T19:07:45.000Z',
                updatedAt: '2021-12-07T18:00:13.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
            sand3: null,
        },
        {
            id: 4,
            stage: 4,
            sandId1: 1,
            sandId2: null,
            sandId3: null,
            quantity1: 10,
            quantity2: null,
            quantity3: null,
            sandPlanId: 1,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-26T19:34:11.000Z',
            updatedAt: '2021-11-26T19:34:11.000Z',
            deletedAt: null,
            sandPlan: {
                id: 1,
                pitId: 1,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-26T19:33:55.000Z',
                updatedAt: '2021-11-26T19:34:10.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '100',
                visible: true,
                createdAt: '2021-11-26T19:07:45.000Z',
                updatedAt: '2021-12-07T18:00:13.000Z',
                deletedAt: null,
            },
            sand2: null,
            sand3: null,
        },
        {
            id: 5,
            stage: 1,
            sandId1: 2,
            sandId2: 3,
            sandId3: 3,
            quantity1: 250,
            quantity2: 400,
            quantity3: 600,
            sandPlanId: 2,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-30T14:22:13.000Z',
            updatedAt: '2021-12-07T14:16:59.000Z',
            deletedAt: null,
            sandPlan: {
                id: 2,
                pitId: 4,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-30T14:22:13.000Z',
                updatedAt: '2021-12-07T14:16:59.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
            sand3: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
        },
        {
            id: 6,
            stage: 3,
            sandId1: 4,
            sandId2: 3,
            sandId3: 2,
            quantity1: 950,
            quantity2: 200,
            quantity3: 100,
            sandPlanId: 2,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-30T14:22:13.000Z',
            updatedAt: '2021-12-07T14:16:59.000Z',
            deletedAt: null,
            sandPlan: {
                id: 2,
                pitId: 4,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-30T14:22:13.000Z',
                updatedAt: '2021-12-07T14:16:59.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 4,
                categoryId: null,
                observations:
                    'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó u',
                type: 'Malla',
                visible: true,
                createdAt: '2021-11-30T13:32:56.000Z',
                updatedAt: '2021-12-01T21:13:37.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
            sand3: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
        },
        {
            id: 7,
            stage: 2,
            sandId1: 2,
            sandId2: 3,
            sandId3: 3,
            quantity1: 250,
            quantity2: 400,
            quantity3: 600,
            sandPlanId: 2,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-30T14:22:13.000Z',
            updatedAt: '2021-12-07T14:16:59.000Z',
            deletedAt: null,
            sandPlan: {
                id: 2,
                pitId: 4,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-30T14:22:13.000Z',
                updatedAt: '2021-12-07T14:16:59.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
            sand3: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
        },
        {
            id: 31,
            stage: 5,
            sandId1: 4,
            sandId2: 3,
            sandId3: 2,
            quantity1: 950,
            quantity2: 200,
            quantity3: 100,
            sandPlanId: 2,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-30T14:22:13.000Z',
            updatedAt: '2021-12-07T14:16:59.000Z',
            deletedAt: null,
            sandPlan: {
                id: 2,
                pitId: 4,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-30T14:22:13.000Z',
                updatedAt: '2021-12-07T14:16:59.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 4,
                categoryId: null,
                observations:
                    'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó u',
                type: 'Malla',
                visible: true,
                createdAt: '2021-11-30T13:32:56.000Z',
                updatedAt: '2021-12-01T21:13:37.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
            sand3: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
        },
        {
            id: 30,
            stage: 4,
            sandId1: 4,
            sandId2: 3,
            sandId3: 2,
            quantity1: 950,
            quantity2: 200,
            quantity3: 100,
            sandPlanId: 2,
            status: 0,
            stageSheetId: null,
            createdAt: '2021-11-30T14:22:13.000Z',
            updatedAt: '2021-12-07T14:16:59.000Z',
            deletedAt: null,
            sandPlan: {
                id: 2,
                pitId: 4,
                companyId: 1,
                visible: true,
                createdAt: '2021-11-30T14:22:13.000Z',
                updatedAt: '2021-12-07T14:16:59.000Z',
                deletedAt: null,
            },
            stageSheet: null,
            sand1: {
                id: 4,
                categoryId: null,
                observations:
                    'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó u',
                type: 'Malla',
                visible: true,
                createdAt: '2021-11-30T13:32:56.000Z',
                updatedAt: '2021-12-01T21:13:37.000Z',
                deletedAt: null,
            },
            sand2: {
                id: 3,
                categoryId: null,
                observations: '',
                type: 'Fina',
                visible: true,
                createdAt: '2021-11-30T13:30:07.000Z',
                updatedAt: '2021-12-01T21:21:27.000Z',
                deletedAt: null,
            },
            sand3: {
                id: 2,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-11-26T19:09:40.000Z',
                updatedAt: '2021-11-26T19:09:40.000Z',
                deletedAt: null,
            },
        },
    ]);
    const setStage = (stage: number) => {
        selectedStage.value = selectedStage.value === stage ? -1 : stage;
    };
    const finalizedStages = computed(() => {
        return stages.value.filter((stage) => stage.done === stage.weight);
    });
    const pendingStages = computed(() => {
        // return stages.value.filter((stage) => stage.done < stage.weight);
        return stages.value;
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
                    :sand-stage="sheet"
                    :is-selected-stage="isSageSelected(sheet.id, selectedStage)"
                    @set-stage="setStage($event)"
                />
            </div>
            <div v-else-if="isTabSelected(_TABS.COMPLETED)" class="stage--panel">
                <StageSheetStage
                    v-for="sheet in finalizedStages"
                    :key="`stage-${sheet.stage}`"
                    v-bind="sheet"
                    :is-selected-stage="isSageSelected(sheet.id, selectedStage)"
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
