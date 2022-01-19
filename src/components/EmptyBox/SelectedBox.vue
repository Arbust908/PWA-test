<template>
    <article class="card">
        <div class="icon-box">
            <BoxIcon class="icon" />
        </div>
        <div class="info">
            <div class="text-sm">
                <p>Caja: {{ boxId }}</p>
                <p>Nivel: {{ floor }}</p>
                <p>Columna: {{ col }}</p>
                <p>Fila: {{ row }}</p>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import BoxIcon from '@/components/depositDesign/BoxIcon.vue';
    import { SandOrderBox } from '@/interfaces/sandflow';

    const props = defineProps<{ box: SandOrderBox }>();
    const { box } = toRefs(props);
    const {
        boxId,
        location: { floor, col, row },
    } = box.value;
</script>

<style lang="scss" scoped>
    .card {
        max-width: 260px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        @apply p-[10px] rounded-[10px] flex gap-3 items-center bg-second-400 border border-transparent bg-white transition duration-300 ease-out;
        &.selected {
            @apply border-green-500;
        }
        .icon-box {
            @apply w-[85px] h-[85px] bg-[#9CA2B0] flex justify-center items-center rounded-xl;
        }
        .icon {
            @apply w-12 h-12 text-second-400;
        }
        .info {
            @apply flex flex-col justify-between text-gray-500 grow;
        }
    }

    .button {
        @apply text-xs rounded-[10px] py-1 px-1.5 bg-[#94979C] text-white text-center w-full transition duration-300 ease-out;
        &.selected {
            @apply bg-[#25AE6C];
        }
    }
</style>
