<template>
    <div class="slots-wrapper">
        <div
            v-for="(slot, index) in cradle.slots"
            :key="index"
            :class="['single-slot', slot.category, !slot.category ? 'border-dashed border-2 border-second-500' : '']"
            @click="handleSlotClick(index)"
        >
            <div v-if="slot.boxId == null" class="index-wrapper">
                <span class="index">{{ index + 1 }}</span>
            </div>
            <div v-else>
                <div class="box-id">{{ slot.boxId }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        cradle: {
            type: Object,
            required: true,
        },
        box: {
            type: Object,
            required: true,
        },
    });
    const emits = defineEmits(['clear-box-in-deposit']);
    const cradle = ref(props.cradle);
    const box = ref(props.box);
    const wasBoxInCradle = ref(false);

    const handleSlotClick = (index) => {
        if (box.value.wasOriginallyOnDeposit) {
            return;
        }

        if (box.value.wasOriginallyOnCradle) {
            return;
        }

        if (wasBoxInCradle.value) {
            // toast.error("La caja ya est� ingresada")
            return;
        }

        box.value.location = {
            where: 'cradle',
            where_id: cradle.value.id,
            where_slot: index,
            where_origin: 'Estación ' + (index + 1),
        };

        const id = box.value.boxId;
        cradle.value.slots = cradle.value.slots.map((slot) => {
            if (slot.boxId == id) {
                slot = {
                    boxId: null,
                };
            }

            return slot;
        });
        cradle.value.slots[index] = box.value;
        emits('clear-box-in-deposit', id);
    };

    watchEffect(() => {
        box.value = props.box;
        cradle.value = props.cradle;
    });
</script>

<style lang="scss" scoped>
    .slots-wrapper {
        @apply ml-4 flex flex-row justify-between items-center;
    }
    .index-wrapper {
        @apply flex justify-center items-center;
    }
    .index {
        @apply text-4xl text-second-300;
    }
    .single-slot {
        @apply justify-center items-center flex m-2 cursor-pointer rounded;
        width: 100px;
        height: 100px;
    }
    .aisle {
        @apply bg-second-300;
        & .box-id {
            @apply text-second-400;
        }
    }
    .fina {
        @apply bg-orange-600;
        & .box-id {
            @apply text-orange-700;
        }
    }
    .gruesa {
        @apply bg-green-600;
        & .box-id {
            @apply text-green-700;
        }
    }
    .cortada {
        @apply bg-blue-600;
        & .box-id {
            @apply text-blue-700;
        }
    }
    .empty {
        @apply bg-second-200 text-second-500;
        & .box-id {
            @apply text-second-300;
        }
    }
</style>
