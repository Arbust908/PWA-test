<script setup lang="ts">
    import { useApi } from '@/helpers/useApi';

    const props = defineProps({
        boxId: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    });
    defineEmits(['set-box']);

    const boxInfo = ref({});
    const { read } = useApi(`/sandOrder?boxId=${props.boxId}`);
    const boxesInfo = read();
    watch(boxesInfo, () => {
        if (boxesInfo.value.length > 0) {
            boxInfo.value = boxesInfo.value[0];
        }
    });
    const amountInT = computed(() => {
        return boxInfo.value?.amount && boxInfo.value.amount + ' toneladas';
    });
</script>

<template>
    <button
        type="button"
        :class="`mesh-box__1 mesh-box__${category}`"
        :disabled="!boxInfo?.id"
        class="depo-box bubble"
        @click="$emit('set-box', boxInfo)"
    >
        {{ boxId }} :: {{ category }} - {{ amountInT }}
    </button>
</template>

<style scoped lang="scss">
    @import '@/assets/box.scss';
    .depo-box {
        @apply p-3 rounded shadow-sm text-sm w-full text-left;
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
    }
</style>
