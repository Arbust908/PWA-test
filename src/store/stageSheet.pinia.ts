import { boxesByFloor } from '@/helpers/useWarehouse';
import { BoxLocation, Cradle, QueueItem, Sand, SandStage, Warehouse, WorkOrder } from '@/interfaces/sandflow';
import { defineStore } from 'pinia';

interface QueueBox extends QueueItem {
    location?: BoxLocation;
    row?: number;
    col?: number;
    floor?: number;
}

export const useSheetStore = defineStore('stageSheet', () => {
    // State
    const clientId = ref(-1);
    const currentCradle = ref({} as Cradle);
    const currentWarehouse = ref({} as Warehouse);
    const pitId = ref(-1);
    const queueBoxes = ref([] as QueueBox[]);
    const sands = ref([] as Sand[]);
    const selectedSandStage = ref({} as SandStage);
    const selectedStageId = ref(-1);
    const selectedTab = ref(0);
    const stages = ref([] as SandStage[]);
    const workOrder = ref({} as WorkOrder);

    // Getters
    const getPitBoxes = computed(() => {
        return queueBoxes.value.filter((box) => box.pitId === pitId.value);
    });
    const getPitBoxesByFloor = computed(() => {
        console.log('Pinia', getPitBoxes.value);

        return boxesByFloor(getPitBoxes.value, true);
    });
    const getSelectStage = computed(() => {
        return stages.value.find((stage) => stage.id === selectedStageId.value) || ({} as SandStage);
    });
    const finalizedStages = computed(() => {
        return stages.value?.filter((s: SandStage) => s.status === 2) || [];
    });
    const pendingStages = computed(() => {
        return (
            stages.value
                ?.filter((s: SandStage) => s.status !== 2)
                ?.sort((a: SandStage, b: SandStage) => a.stage - b.stage) || []
        );
    });

    const getSandById = (id: number) => {
        return sands.value.find((sand) => sand.id === id);
    };

    // Actions
    const setTab = (tabToSet: number) => {
        selectedTab.value = tabToSet;
    };
    const setCradle = (cradleToSet: Cradle) => {
        currentCradle.value = cradleToSet;
    };
    const setWorkOrder = (workOrderToSet: WorkOrder) => {
        workOrder.value = workOrderToSet;
    };
    const setSelectedStageId = (stageId: number) => {
        if (stageId === selectedStageId.value) {
            selectedStageId.value = -1;
            selectedSandStage.value = {} as SandStage;
        } else {
            selectedStageId.value = stageId;
            selectedSandStage.value = stages.value.find((stage) => stage.id === stageId) || ({} as SandStage);
        }
    };
    const setSands = (sandsToSet: Sand[]) => {
        sands.value = sandsToSet;
    };

    // Helpers
    const isTabSelected = (tab: number) => {
        return selectedTab.value === tab;
    };

    return {
        clientId,
        currentCradle,
        currentWarehouse,
        finalizedStages,
        getPitBoxes,
        getPitBoxesByFloor,
        getSelectStage,
        pendingStages,
        pitId,
        queueBoxes,
        sands,
        selectedSandStage,
        selectedStageId,
        selectedTab,
        stages,
        workOrder,
        // Methods
        getSandById,
        isTabSelected,
        setCradle,
        setSelectedStageId,
        setTab,
        setWorkOrder,
        setSands,
    };
});
