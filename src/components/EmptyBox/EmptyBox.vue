<template>
    <article class="card" :class="activeChip && 'selected'">
        <div class="icon-box">
            <BoxIcon class="icon" />
        </div>
        <div class="info">
            <div class="space-y-1 text-sm font-bold">
                <p>Caja: {{ boxId }}</p>
                <p>Estación: {{ estacion }}</p>
            </div>
            <div class="mt-4 flex gap-1">
                <button
                    v-if="otherTruckBoxes.length === 0 && otherDepositBoxes.length < 1"
                    :class="activeChip === 'deposit' ? 'selected' : null"
                    class="button"
                    @click="switchChip('deposit')"
                >
                    Depósito
                </button>
                <button v-else class="button cursor-not-allowed">Depósito</button>
                <button
                    v-if="otherTruckBoxes.length < 2 && otherDepositBoxes.length === 0"
                    :class="activeChip === 'truck' ? 'selected' : null"
                    class="button"
                    @click="switchChip('truck')"
                >
                    Camión
                </button>
                <button v-else class="button cursor-not-allowed">Camión</button>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import BoxIcon from '@/components/depositDesign/BoxIcon.vue';

    const props = defineProps({
        boxId: {
            type: [Number, String],
            required: true,
        },
        estacion: {
            type: String,
            required: true,
        },
        selectedBoxesForTrucks: {
            type: Array,
            default: () => [],
        },
        selectedBoxesForDeposit: {
            type: Array,
            default: () => [],
        },
    });
    const emit = defineEmits(['deposit', 'truck']);
    const { boxId, estacion, selectedBoxesForTrucks, selectedBoxesForDeposit } = toRefs(props);

    const activeChip = ref('');

    const otherTruckBoxes = computed(() => {
        return selectedBoxesForTrucks.value.filter((box) => box.boxId !== boxId.value);
    });

    const otherDepositBoxes = computed(() => {
        return selectedBoxesForDeposit.value.filter((box) => box.boxId !== boxId.value);
    });

    const switchChip = (newChip: string) => {
        if (activeChip.value === 'deposit' || newChip === 'deposit') {
            emit('deposit');
        }

        if (activeChip.value === 'truck' || newChip === 'truck') {
            emit('truck');
        }
        activeChip.value = activeChip.value === newChip ? '' : newChip;
    };
</script>

<style lang="scss" scoped>
    .card {
        max-width: 260px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        @apply p-[10px] rounded-[10px] flex gap-3 items-center bg-second-400 border border-transparent bg-white;
        &.selected {
            @apply border-green-500;
        }
        .icon-box {
            @apply w-[85px] h-20 bg-[#9CA2B0] flex justify-center items-center rounded-xl;
        }
        .icon {
            @apply w-12 h-12 text-second-400;
        }
        .info {
            @apply flex flex-col justify-between text-gray-500 grow;
        }
    }

    .button {
        @apply text-xs rounded-[10px] py-1 px-1.5 bg-[#94979C] text-white text-center w-full;
        &.selected {
            @apply bg-[#25AE6C];
        }
    }
</style>
