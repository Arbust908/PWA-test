<template>
    <button
        type="button"
        :class="`mesh-type__${box?.sandOrder?.sandTypeId} boxCard meshBorder`"
        :disabled="!sandInfo?.id"
        class="depo-box bubble"
        @click="$emit('set-box', box)"
    >
        {{ boxId }} :: {{ box?.sandType?.type }} - {{ amountInT }}
    </button>
</template>

<script setup lang="ts">
    import { useApi } from '@/helpers/useApi';
    import { Sand } from '@/interfaces/sandflow';
    import { Ref } from 'vue';

    const props = defineProps({
        box: {
            type: Object,
            required: true,
        },
    });
    defineEmits(['set-box']);
    const { box } = toRefs(props);

    const boxId = computed(() => {
        return box.value?.boxId;
    });
    const amountInT = computed(() => {
        return box.value?.amount + ' toneladas';
    });

    const sandTypeId = computed(() => {
        return box.value?.sandTypeId;
    });
    const boxInfo = computed(() => {
        return box.value?.sandOrder;
    });

    const { read } = useApi<Sand>(`/sand/${sandTypeId.value}`);
    const sandInfo = read() as Ref<Sand>;
    watch(sandInfo, (newVal) => {
        if (newVal) {
            box.value.sandType = newVal;
        }
    });
</script>

<style scoped lang="scss">
    @import '@/assets/box.scss';
    .depo-box {
        @apply p-3 rounded shadow text-sm w-full text-left;
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
        &:not(:disabled) {
            @apply transition duration-150 ease-in-out hover:shadow-lg;
        }
    }
</style>
