import { boxesByFloor } from '@/helpers/useWarehouse';
import { BoxLocation, Cradle, QueueItem, Warehouse, WorkOrder } from '@/interfaces/sandflow';
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
    const pitId = ref(-1);
    const selectedTab = ref(0);
    const currentWarehouse = ref({} as Warehouse);
    const queueBoxes = ref([] as QueueBox[]);
    const workOrder = ref({} as WorkOrder);
    const currentCradle = ref({} as Cradle);

    // Getters
    const getPitBoxes = computed(() => {
        return queueBoxes.value.filter((box) => box.pitId === pitId.value);
    });
    const getPitBoxesByFloor = computed(() => {
        return boxesByFloor(getPitBoxes.value, true);
    });

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
    // Helpers
    const isTabSelected = (tab: number) => {
        return selectedTab.value === tab;
    };

    return {
        clientId,
        pitId,
        selectedTab,
        currentWarehouse,
        queueBoxes,
        workOrder,
        currentCradle,
        getPitBoxes,
        getPitBoxesByFloor,
        // Methods
        setTab,
        isTabSelected,
        setCradle,
        setWorkOrder,
    };
});
