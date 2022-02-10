<template>
    <Layout>
        <ABMFormTitle title="Stage sheet" />
        <FieldGroup class="max-w-4xl items-start">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
            <PrimaryBtn
                class="col-span-6 md:col-span-3 max-h-12 mt-7"
                :disabled="disableFinishBtn"
                @click="finishCurrent"
            >
                Finalizar Stage
            </PrimaryBtn>
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
                    :is-selected-stage="isStageSelected(sheet.id, selectedStageId)"
                    :is-active="pendingStages[0].id === sheet.id"
                    @set-stage="setSelectedStageId($event)"
                    @update-queue="updateQueue($event)"
                    @set-stage-full="setStageFull(sheet.id)"
                    @saved-queue="saveQueue"
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
                    :is-selected-stage="isStageSelected(sheet.id, selectedStageId)"
                    :is-active="finalizedStages[0].id === sheet.id"
                    @set-stage="setSelectedStageId($event)"
                    @update-queue="updateQueue($event)"
                    @set-stage-full="setStageFull(sheet.id)"
                    @saved-queue="saveQueue"
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
                <article v-if="selectedStageId === -1" class="px-4 py-6 border rounded-[10px]">
                    <span class="text-center">Desplegá una etapa para ver el detalle de la misma</span>
                </article>
                <article v-else class="px-4 py-6 rounded-[10px] bg-blue-100">
                    <div class="text-semibold space-y-3">
                        <p v-for="(detail, index) in queueDetail" :key="index">
                            <span class="mr-2">{{ detailTitle(index) }}:</span>
                            <span>{{ queueDetailFormated(detail) }}</span>
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
    import { ComputedRef, Ref } from 'vue';
    import {
        StageSheet,
        SandStage,
        Warehouse,
        QueueItem,
        SandOrder,
        WorkOrder,
        Pit,
        SandOrderBox,
        QueueBox,
    } from '@/interfaces/sandflow';
    import { boxesByFloor, formatLocation, searchInDepoBoxes } from '@/helpers/useWarehouse';
    import { useAxios } from '@vueuse/integrations/useAxios';

    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import StageSheetStage from '@/components/stageSheet/stageSheetStage.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import StageSheetStageBox from '@/components/stageSheet/stageSheetStageBox.vue';
    import { deleteAllQueueItems, getQueueItems, updateAllQueueItems } from '@/helpers/useQueueItem';
    import { useSheetStore } from '@/store/stageSheet.pinia';
    import { storeToRefs } from 'pinia';
    import {
        detailTitle,
        queueDetailFormated,
        isStageSelected,
        finishSandStage,
        decodeNewOrigin,
    } from '@/helpers/useSheetHelpers';
    import { getSandOrders } from '@/helpers/useGetEntities';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const instance = axios.create({
        baseURL: apiUrl,
    });
    useTitle('Stage Sheet <> SandFlow');
    const _TABS = { PENDING: 0, COMPLETED: 1 };

    const store = useSheetStore();
    const {
        clientId,
        pitId,
        currentWarehouse,
        queueBoxes,
        workOrder,
        stages,
        finalizedStages,
        pendingStages,
        selectedStageId,
        selectedSandStage,
        ultimateBoxes,
    } = storeToRefs(store);
    const { setTab, isTabSelected, setCradle, setWorkOrder, setSelectedStageId, setSands } = store;

    const actualSheet: StageSheet = reactive({
        companyId: -1,
        pitId: -1,
        warehouseId: -1,
        operativeCradleId: -1,
        backupCradleId: -1,
        stages: [],
    });

    const fillSheet = async (currentSheet: any) => {
        if (currentSheet.companyId !== -1 && currentSheet.pitId !== -1) {
            await getSandPlan(currentSheet);
            await getWorkorder(currentSheet);
            await getDeposit();
            const cradleId = workOrder.value.operativeCradle;
            await getCradle(Number(cradleId));
            fillBoxes();
        }
    };
    const disableFinishBtn = computed(() => {
        return (
            selectedStageId.value < 0 ||
            selectedSandStage.value?.status === null ||
            selectedSandStage.value?.status >= 2
        );
    });

    const finishCurrent = async () => {
        console.log(selectedStageId.value);

        if (selectedStageId.value < 0) {
            return;
        }
        const toFreeBoxes = selectedQueue.value.filter((item: QueueItem) => item.status < 99);
        const toFinishBoxes = selectedQueue.value
            .filter((item: QueueItem) => item.status >= 99)
            .map((item: QueueItem) => {
                if ('sandPlanId' in item && 'sandStageId' in item) {
                    console.log('Tengo data extra');
                    const { origin, sandPlanId, sandStageId } = item;
                    const newOrigin = { origin, sandPlanId, sandStageId };
                    console.log(newOrigin);
                    item.origin = JSON.stringify(newOrigin);
                }

                return {
                    ...item,
                    status: 100,
                };
            });
        console.log('🔒', toFinishBoxes);
        console.log('🔓', toFreeBoxes);
        console.log('📦', selectedSandStage.value);
        await updateAllQueueItems(toFinishBoxes);
        await deleteAllQueueItems(toFreeBoxes);
        await finishSandStage(selectedSandStage.value);
        router.go(0);
    };

    watch(clientId, (newVal) => {
        actualSheet.companyId = newVal;
        fillSheet(actualSheet);
    });
    watch(pitId, (newVal) => {
        actualSheet.pitId = newVal;
        fillSheet(actualSheet);
    });

    const getSand = async () => {
        const { data } = useAxios(`/sand`, instance);
        watch(data, (newVal) => {
            setSands(newVal.data);
        });
    };
    const getSandPlan = async ({ pitId: pozoId }: StageSheet) => {
        const { data } = useAxios(`/sandPlan?pitId=${pozoId}`, instance);
        watch(data, (newVal) => {
            stages.value = newVal.data[0]?.stages;
        });
    };

    const getDeposit = async () => {
        const workOrdeId = workOrder.value.id;
        const { data } = useAxios(`/warehouse?pitId=${workOrdeId}`, instance);
        watch(data, (newVal) => {
            currentWarehouse.value = newVal?.data[0];
        });
    };

    const getWorkorder = async ({ pitId: pozoId, companyId }: StageSheet) => {
        const response = await axios.get(`${apiUrl}/workOrder?client=${companyId}`);
        const workOrderFromApi = response.data.data;
        const currentWO = workOrderFromApi.find((wo: WorkOrder) => wo.pits.some((pozo: Pit) => pozo.id === pozoId));
        setWorkOrder(currentWO);
    };

    const getCradle = async (cradleId: number) => {
        const { data } = useAxios(`/cradle/${cradleId}`, instance);
        watch(data, (newVal) => {
            setCradle(newVal.data);
        });
    };

    const boxes = computed(() => {
        if (pitId.value !== -1 && clientId.value !== -1) {
            console.log('power box', newPowerBoxes.value);
            ultimateBoxes.value = newPowerBoxes?.value;

            return boxesByFloor(newPowerBoxes.value, true);
        }

        return [];
    });

    const selectedQueue = ref([] as any[]);
    const updateQueue = (queue: Array<any>) => {
        selectedQueue.value = queue;
    };
    const queueDetail: ComputedRef<Array<number>> = computed(() => {
        const filteredSelectQueue = selectedQueue.value.filter((item: SandOrder | number | any) => item?.sandTypeId);

        return Object.values(
            filteredSelectQueue.reduce((acc, item: SandOrder) => {
                const sandId = item?.sandTypeId;

                if (acc[sandId]) {
                    acc[sandId] += item.amount;
                } else {
                    acc[sandId] = item.amount;
                }

                return acc;
            }, {} as { [key: string]: number })
        );
    });
    const sumQueueDetail = computed(() => {
        return queueDetail.value.reduce((acc: number, item: number) => {
            return acc + item;
        }, 0);
    });
    // Dirty
    const setStageFull = (sheetId: number) => {
        const stage = stages.value.find((stage) => stage.stageSheetId === sheetId);

        if (stage) {
            stage.done = stage.weight;
        }
    };

    const boxesInWarehouse = await getSandOrders();
    const fillBoxes = () => {
        return boxesInWarehouse
            .filter((boxy: SandOrder) => boxy.location)
            .map((boxy: SandOrder) => {
                const { location } = boxy;

                if (location && typeof location === 'string') {
                    boxy.location = JSON.parse(location);
                }

                return boxy as SandOrderBox;
            })
            .filter((boxy: SandOrderBox) => boxy.location?.where === 'warehouse')
            .filter((boxy: SandOrderBox) => boxy.location?.where_id === currentWarehouse.value?.id);
    };
    const newPowerBoxes = computed(() => {
        if (currentWarehouse.value?.id) {
            return fillBoxes();
        }

        return [];
    });

    /**
     * EStas son las Queue Items que queremos mostrar en la listita
     */
    queueBoxes.value = await getQueueItems();
    console.log('queueBoxes', queueBoxes.value);
    queueBoxes.value = queueBoxes.value
        ?.filter((item) => item.sandOrder)
        .map((item) => {
            // Agrego el location del sandOrder para que sea mas facil de manejar
            const { sandOrder } = item;
            let location = '';

            if (sandOrder) {
                location = sandOrder.location;
            }

            if (location && JSON.parse(location)) {
                item.location = JSON.parse(location);
            }

            return item;
        });
    // .filter((item) => item.location?.where === 'warehouse');
    console.log('queueBoxes', queueBoxes.value);
    queueBoxes.value = queueBoxes.value.map((item: QueueBox) => {
        // Convierto el QueueItem a un QueueBox
        // AKA convierto el nuevo Origin sucio en Origin y sandStageId + sandPlanId
        const { origin } = item as QueueBox;
        console.log('Origen', origin);

        if (origin.includes('sandPlanId') && origin.includes('sandStageId')) {
            const originData = decodeNewOrigin(origin);
            console.log('originData', originData);
            item.origin = originData.origin;
            item.sandStageId = originData.sandStageId;
            item.sandPlanId = originData.sandPlanId;
        }

        return item as QueueBox;
    });
    // queueBoxes.value = queueBoxes.value.filter((item) => item.status <= 100);
    console.log('queueBoxes', queueBoxes.value);

    const router = useRouter();
    const saveQueue = (isFinished: boolean) => {
        console.log('👎? ' + isFinished);

        if (isFinished) {
            // tomo el stage de sageID
            // le pongo 2 para que este finalizado
            // Modificamos el Stage para que este finalizado
            console.log('Finalizo 😺');
            finishCurrent();

            return;
        }
        // En cualquier caso cierro el acordeaon y recargo
        // selectedStageId.value = -1;
        router.go(0);
    };

    onMounted(async () => {
        await getSand();
    });
    onUnmounted(() => {
        clientId.value = -1;
        pitId.value = -1;
        currentWarehouse.value = {} as Warehouse;
        queueBoxes.value = [];
        selectedSandStage.value = {} as SandStage;
        selectedStageId.value = -1;
        stages.value = [];
        workOrder.value = {} as WorkOrder;
        ultimateBoxes.value = [];
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
