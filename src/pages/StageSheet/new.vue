<template>
    <Layout>
        <ABMFormTitle title="Stage sheet" />
        <FieldGroup class="max-w-4xl items-start">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
            <PrimaryBtn class="col-span-6 md:col-span-3 max-h-12 mt-7">Finalizar Stage</PrimaryBtn>
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
                    :key="`stage-${sheet.id}`"
                    :sand-stage="sheet"
                    :boxes="boxes"
                    :is-selected-stage="isStageSelected(sheet.id, selectedStage.id)"
                    :is-active="pendingStages[0].id === sheet.id"
                    :pit-id="pitId"
                    @set-stage="setStage($event)"
                    @update-queue="updateQueue($event)"
                    @set-stage-full="setStageFull(sheet.id)"
                />
                <StageSheetStageBox v-if="pendingStages?.length <= 0">
                    <p class="text-center p-6">No hay etapas pendientes</p>
                </StageSheetStageBox>
            </div>
            <div v-else-if="isTabSelected(_TABS.COMPLETED)" class="stage--panel">
                <StageSheetStage
                    v-for="sheet in finalizedStages"
                    :key="`stage-${sheet.id}`"
                    :sand-stage="sheet"
                    :boxes="boxes"
                    :is-selected-stage="isStageSelected(sheet.id, selectedStage.id)"
                    :is-active="pendingStages[0].id === sheet.id"
                    :pit-id="pitId"
                    @set-stage="setStage($event)"
                    @update-queue="updateQueue($event)"
                    @set-stage-full="setStageFull(sheet.id)"
                />
                <StageSheetStageBox v-if="finalizedStages.length <= 0">
                    <p class="text-center p-6">No hay etapas finalizadas</p>
                </StageSheetStageBox>
            </div>
            <div v-else>
                <StageSheetStageBox v-if="finalizedStages.length <= 0">
                    <p class="text-center p-6">No hay etapas</p>
                </StageSheetStageBox>
            </div>
            <aside>
                <h3 class="text-3xl font-bold">Detalle</h3>
                <article v-if="selectedStage === -1" class="px-4 py-6 border rounded-[10px]">
                    <span class="text-center">Desplegá una etapa para ver el detalle de la misma</span>
                </article>
                <article v-else class="px-4 py-6 rounded-[10px] bg-blue-100">
                    {{ queueDetail }}
                    <div class="text-semibold space-y-3">
                        <p>
                            <span class="mr-2">Total Arena A:</span>
                            <span>{{ queueDetailFormated(queueDetail && queueDetail[0]) }}</span>
                        </p>
                        <p>
                            <span class="mr-2">Total Arena B:</span>
                            <span>{{ queueDetailFormated(queueDetail && queueDetail[1]) }}</span>
                        </p>
                        <p>
                            <span class="mr-2">Total Arena C:</span>
                            <span>{{ queueDetailFormated(queueDetail && queueDetail[2]) }}</span>
                        </p>
                        <p>
                            <span class="mr-2">Total Arena D:</span>
                            <span>{{ queueDetailFormated(queueDetail && queueDetail[3]) }}</span>
                        </p>
                    </div>
                    <hr class="border-white border mt-1" />
                    <p class="font-bold text-lg mt-4">
                        <span class="mr-2">Total General:</span>
                        <span>{{ queueDetailFormated(sumQueueDetail) }}</span>
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

<script setup lang="ts">
    import axios from 'axios';
    import { StageSheet, SandStage, Warehouse, QueueItem } from '@/interfaces/sandflow';
    import { boxesByFloor, formatLocation, searchInDepoBoxes } from '@/helpers/useWarehouse';
    import { useAxios } from '@vueuse/integrations/useAxios';

    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import StageSheetStage from '@/components/stageSheet/stageSheetStage.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import StageSheetStageBox from '@/components/stageSheet/stageSheetStageBox.vue';
    import { getQueueItems } from '@/helpers/useQueueItem';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const instance = axios.create({
        baseURL: apiUrl,
    });

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

    const actualSheet: StageSheet = reactive({
        companyId: -1,
        pitId: -1,
        warehouseId: -1,
        operativeCradleId: -1,
        backupCradleId: -1,
        stages: [],
    });

    let warehouse: Ref<Warehouse> = ref({});
    const queueBoxes = ref([]);

    const fillSheet = async (currentSheet: any) => {
        if (currentSheet.companyId !== -1 && currentSheet.pitId !== -1) {
            getSandPlan(currentSheet);
            getDeposit(currentSheet);
        }
    };

    watch(clientId, (newVal) => {
        actualSheet.companyId = newVal;
        fillSheet(actualSheet);
    });
    watch(pitId, (newVal) => {
        actualSheet.pitId = newVal;
        fillSheet(actualSheet);
    });

    const getSandPlan = async ({ pitId: pozoId, companyId }: StageSheet) => {
        const { data } = useAxios(`/sandPlan?pitId=${pozoId}`, instance);
        watch(data, (newVal) => {
            console.log(newVal);
            stages.value = newVal.data[0]?.stages;
        });
    };

    const getDeposit = async ({ pitId: pozoId, companyId }: StageSheet) => {
        const { data } = useAxios(`/warehouse?pitId=${pozoId}`, instance);
        watch(data, (newVal) => {
            warehouse.value = newVal?.data[0];
        });
    };

    const selectedStage = ref(-1);
    let stages: Ref<Array<SandStage>> = ref([]);

    const setWareHouseBoxes = ({ layout }: Warehouse) => {
        const whBoxes = [];
        for (const key in layout) {
            if (Object.prototype.hasOwnProperty.call(layout, key)) {
                const element = layout[key];
                const location = formatLocation(key);
                whBoxes.push({
                    ...element,
                    ...location,
                });
            }
        }

        return whBoxes.filter((box) => box.id);
    };

    const setStage = (stage: number) => {
        if (selectedStage.value.id === stage) {
            selectedStage.value = -1;
        } else {
            selectedStage.value = stages.value.find((s) => s.id === stage);
        }
    };
    const finalizedStages = computed(() => {
        return stages.value?.filter((s) => s.status === 'finalized') || [];
    });
    const pendingStages = computed(() => {
        return stages.value?.sort((a, b) => a.stage - b.stage) || [];
    });
    const activeStage = computed(() => {
        return (
            stages.value
                ?.sort((a, b) => {
                    return a.stage - b.stage;
                })
                .find((_: SandStage, index: number) => {
                    return index === 0;
                }) || {}
        );
    });

    const isStageSelected = (stage: number, selected: number): boolean => {
        return selected === stage;
    };
    const boxes = computed(() => {
        if (pitId.value !== -1 && clientId.value !== -1) {
            return boxesByFloor(
                queueBoxes.value.filter((box) => box.pitId === pitId.value),
                true
            );
        }

        return boxesByFloor(warehouse.value.layout || {});
    });

    const selectedQueue = ref([]);
    const updateQueue = (queue: Array<any>) => {
        selectedQueue.value = queue;
    };
    const queueDetail = computed(() => {
        console.log('queueDetail', selectedQueue.value);

        return selectedQueue.value.reduce((acc, item) => {
            console.log('acc', acc);
            console.log('item', item);

            if (item?.sandTypeId) {
                console.log('Entramos');
                const sandId = item?.sandTypeId;
                const sandIndex = acc.indexOf(sandId);

                console.log(sandId, sandIndex);

                if (sandIndex === -1) {
                    acc.push(item?.amount);
                } else {
                    acc[sandIndex] = acc[sandIndex] + item?.amount;
                }
            }
            console.log(acc);

            return acc;
        }, []);
    });
    const sumQueueDetail = computed(() => {
        return queueDetail.value.reduce((acc, item) => {
            return acc + item;
        }, 0);
    });
    const queueDetailFormated = (info: any) => {
        if (info) {
            return info + ' toneladas';
        }

        return '-';
    };
    const setStageFull = (sheetId: number) => {
        const stage = stages.value.find((stage) => stage.stageSheetId === sheetId);

        if (stage) {
            stage.done = stage.weight;
        }
    };

    onMounted(async () => {
        queueBoxes.value = await getQueueItems();
        queueBoxes.value = queueBoxes.value
            ?.filter((item) => item.sandOrder)
            .map((item) => {
                const { sandOrder } = item;
                let location = {};

                if (sandOrder) {
                    location = sandOrder.location;
                } else {
                    console.log('No tenemos Location');
                }

                if (location && JSON.parse(location)) {
                    item.location = JSON.parse(location);
                }

                return item;
            })
            .filter((item) => item.location?.where === 'warehouse');
    });
</script>

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
        grid-template-columns: minmax(320px, 760px) 360px;
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
