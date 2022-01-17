<template>
    <button
        type="button"
        :class="`mesh-type__${box?.sandOrder?.sandTypeId} boxCard meshBorder`"
        :disabled="!boxInfo?.id"
        class="depo-box bubble"
        @click="$emit('set-box', boxInfo)"
    >
        {{ boxId }} :: {{ box?.sandType?.type }} - {{ amountInT }}
    </button>
</template>

<script setup lang="ts">
    import { useApi } from '@/helpers/useApi';

    const props = defineProps({
        box: {
            type: Object,
            required: true,
        },
    });
    defineEmits(['set-box']);

    const myBox = ref(props.box);

    const boxId = computed(() => {
        return myBox.value?.sandOrder?.id;
    });
    const amountInT = computed(() => {
        return myBox.value?.sandOrder?.amount + ' toneladas';
    });

    const { read } = useApi(`/sandOrder/${boxId.value}`);
    const boxInfo = read();
    watch(boxInfo, () => {
        if (boxInfo.value) {
            myBox.value.sandType = boxInfo.value?.sandType;
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
