<template>
    <FieldSelect
        v-if="allWorkOrders.length > 0"
        v-model:data="workOrderId"
        v-model:work-orders="allWorkOrders"
        v-model:first-filter="isFirstTime"
        field-name="pad"
        placeholder="Seleccionar PAD"
        title="PAD"
        endpoint-key="pad"
        :endpoint-data="padPopulation"
        :require-validation="requireValidation"
        :is-optional="isOptional"
        :is-disabled="isDisabled"
        :select-class="useFirstPad"
        @click="useFirstPad = true"
    />
    <FieldLoading v-else />
    <InvalidInputLabel v-if="workOrderId == -1 && useFirstPad === true && requireValidation" validation-type="empty" />
</template>

<script setup lang="ts">
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    import axios from 'axios';
    import { WorkOrder } from '@/interfaces/sandflow';
    const api = import.meta.env.VITE_API_URL || '/api';

    const props = defineProps({
        clientId: {
            type: Number,
            required: true,
        },
        requireValidation: {
            type: Boolean,
            default: false,
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        sharedClasses: {
            type: String,
            default: 'col-span-full md:col-span-6',
        },
        woId: {
            type: Number,
            default: -1,
        },
        firstFilter: {
            type: Boolean,
            default: false,
        },
        isOptional: {
            type: Boolean,
            default: false,
        },
    });
    const emit = defineEmits(['update:clientId', 'update:workOrderId', 'update:workOrders', 'update:isFirstTime']);
    const { clientId, woId: workOrderId, firstFilter: isFirstTime } = useVModels(props, emit);

    const allWorkOrders = ref([] as WorkOrder[]);
    const padPopulation = ref([]);

    watch(allWorkOrders, (newVal: any) => {
        padPopulation.value = newVal;
    });

    const filteringPads = (newClientId: number) => {
        if (newClientId !== -1 && !isFirstTime.value) {
            const filteredWorkOrders = allWorkOrders.value.filter(
                (workOrder) => Number(workOrder.client) === newClientId
            );
            padPopulation.value = filteredWorkOrders;
        } else {
            padPopulation.value = allWorkOrders.value;

            if (isFirstTime.value) {
                workOrderId.value = -1;
            }
        }
        isFirstTime.value = false;
    };

    watch(clientId, (newVal) => {
        filteringPads(newVal);
    });

    const useFirstPad = ref(false);
    watch(useFirstPad, (newVal) => {
        useFirstPad.value = newVal;
    });

    onMounted(async () => {
        const result = await axios.get(`${api}/workOrder`);
        console.log(result.data.data);
        setTimeout(() => {
            allWorkOrders.value = result.data.data;
        }, 1000);
        console.log(allWorkOrders.value);
    });
</script>

<style lang="scss" scoped>
    .unselected {
        @apply border-red-500;
    }
    .unselected option {
        @apply border-red-500;
    }
    .unselected option:first-child {
        @apply border-red-500;
    }
    .client {
        @apply border-red-500;
    }
</style>
