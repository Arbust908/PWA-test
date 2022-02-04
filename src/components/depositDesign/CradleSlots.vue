<template>
    <div class="slots-wrapper">
        <div
            v-for="(slot, index) in cradle.slots"
            :key="index"
            :class="[
                'single-slot',
                slot.sandTypeId,
                slotClasses(slot.sandTypeId),
                !slot.category ? 'border-dashed border-2 border-second-500' : '',
            ]"
            @click="handleSlotClick(slot, index)"
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
    import { getBoxClasses } from '@/helpers/useWarehouse';
    import { BoxLocation, SandOrderBox } from '@/interfaces/sandflow';
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
    const emits = defineEmits(['clear-box-in-deposit', 'handle-slot-click']);
    const { cradle, box } = toRefs(props);
    const wasBoxInCradle = ref(false);

    const slotClasses = (sandId: number) => {
        if (typeof sandId === 'number') {
            return getBoxClasses(String(sandId), -1);
        }

        return getBoxClasses(sandId, -1);
    };

    const handleSlotClick = (slot: SandOrderBox, index: number) => {
        // Si ya estaba en el deposito o en el cradle (antes del ingreso) no se mueve
        if (box.value.wasOriginallyOnDeposit || box.value.wasOriginallyOnCradle) {
            return;
        }

        // Si ya estaba en el cradle no se mueve
        if (wasBoxInCradle.value) {
            // toast.error("La caja ya est� ingresada")
            return;
        }

        // si la caja no tiene id no se mueve
        if (box.value.id === '') {
            return;
        }

        // Si paso empezamos a retocar la info de la caja

        if (box.value.location && box.value.location.where === 'warehouse') {
            // Si la caja estaba en deposito lo sacamos
            emits('clear-box-in-deposit', box.value);
        }
        // Ponemos los valores de la locacion en el objeto location
        box.value.location = {
            where: 'cradle',
            where_id: cradle.value.id,
            where_slot: index,
            where_origin: 'Estación ' + (index + 1),
        } as BoxLocation;

        // Sacamos de los Slots la caja que se mueve
        const movingBoxid = box.value.boxId;
        cradle.value.slots = cradle.value.slots.map((cradleSlot: SandOrderBox) => {
            if (cradleSlot.boxId == movingBoxid) {
                return { boxId: null };
            }

            return cradleSlot;
        });

        // Movemos la caja al Slot seleccionado
        cradle.value.slots[index] = box.value;
        emits('handle-slot-click', slot);
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
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
