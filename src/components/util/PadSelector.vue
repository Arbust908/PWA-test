<template>
    <FieldSelect
        v-if="workOrders.length > 0"
        field-name="pad"
        placeholder="Seleccionar PAD"
        title="PAD"
        require-validation
        :endpoint-data="padPopulation"
        endpoint-key="pad"
        v-model:data="woId"
        :select-class="useFirstPad"
        @click="useFirstPad = true"
    />
    <FieldLoading v-else />
    <InvalidInputLabel v-if="woId == -1 && useFirstPad === true" validation-type="empty" />
    {{ clientId }}
    {{ typeof clientId }}
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
        },
        setup(props, { emit }) {
            const { clientId, woId } = useVModels(props, emit);

            const workOrders = ref([]);
            const padPopulation = ref([]);
            const pads = ref([]);

            onMounted(async () => {
                const result = await axios.get(`${api}/workOrder`);
                workOrders.value = result.data.data;
                padPopulation.value = workOrders.value;
            });

            watch(clientId, (newVal) => {
                if (newVal !== -1) {
                    const filteredWorkOrders = workOrders.value.filter(
                        (workOrder) => Number(workOrder.client) === newVal
                    );
                    padPopulation.value = filteredWorkOrders;
                } else {
                    padPopulation.value = workOrders.value;
                }
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
