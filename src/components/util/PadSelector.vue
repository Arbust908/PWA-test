<template>
    <FieldSelect
        v-if="workOrders.length > 0"
        field-name="pad"
        placeholder="Seleccionar PAD"
        title="PAD"
        require-validation
        :endpoint-data="padPopulation"
        endpoint-key="pad"
        :is-disabled="isDisabled"
        v-model:data="woId"
        v-model:work-orders="workOrders"
        v-model:first-filter="firstFilter"
        :select-class="useFirstPad"
        @click="useFirstPad = true"
    />
    <FieldLoading v-else />
    <InvalidInputLabel v-if="woId == -1 && useFirstPad === true" validation-type="empty" />
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { useVModels } from '@vueuse/core';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';

    export default defineComponent({
        name: 'PadSelector',
        components: {
            FieldSelect,
            FieldLoading,
            InvalidInputLabel,
        },
        props: {
            clientId: {
                type: Number,
                required: true,
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
            workOrders: {
                type: Array,
                default: [],
            },
            firstFilter: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { clientId, woId, workOrders, firstFilter } = useVModels(props, emit);

            const padPopulation = ref([]);
            const pads = ref([]);

            onMounted(async () => {
                const result = await axios.get(`${api}/workOrder`);
                workOrders.value = result.data.data;
                console.log(clientId.value);
            });

            watch(workOrders, (newVal) => {
                padPopulation.value = newVal;
                console.log(padPopulation.value);
            });

            const filteringPads = (newClientId) => {
                if (newClientId !== -1 && !firstFilter.value) {
                    const filteredWorkOrders = workOrders.value.filter(
                        (workOrder) => Number(workOrder.client) === newClientId
                    );
                    console.log('holi');
                    padPopulation.value = filteredWorkOrders;
                    woId.value = -1;
                } else {
                    padPopulation.value = workOrders.value;
                    console.log(workOrders.value);
                    if (!firstFilter.value) {
                        woId.value = -1;
                    }
                }
                firstFilter.value = false;
            };

            watch(clientId, (newVal) => {
                console.log(firstFilter.value);
                filteringPads(newVal);
            });

            const useFirstPad = ref(false);
            watch(useFirstPad, (newVal) => {
                useFirstPad.value = newVal;
            });
            return {
                clientId,
                InvalidInputLabel,
                useFirstPad,
                workOrders,
                padPopulation,
                pads,
                woId,
            };
        },
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
