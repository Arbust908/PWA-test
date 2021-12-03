<template>
    <div class="flex gap-2 items-center p-1 rounded border border-second-300">
        <input type="text" v-maska="'##/##/####'" class="sel calendar" v-model="fecha" @blur="imprimir" />
    </div>
</template>

<script lang="ts">
    import { ref } from 'vue';
    /* import { defineComponent, watch } from 'vue';
    import { useVModels, useToggle } from '@vueuse/core';
    import { createFromDate, createToDate } from '@/helpers/useChronos';
    */
    import { maska } from 'maska';
    export default {
        name: 'DatePicker',
        directives: { maska },
        props: {
            delDate: {
                type: Date,
                required: true,
            },
        },
        setup(props: any) {
            const fecha = ref('');
            function imprimir() {
                console.log(fecha.value);
            }
            return { fecha, imprimir };
        },
    };
</script>

<style lang="scss" scoped>
    .sel {
        @apply h-8 rounded bg-transparent border-none;
    }
    .selecThor {
        @apply pl-1 pr-1 py-0 text-right;
    }
    select {
        @apply bg-none;
    }
    .selecTime {
        @apply px-2 flex relative gap-2;
        .marker-wrapper {
            @apply absolute inset-0 z-0 p-1;
        }
        .marker {
            @apply bg-main-200 text-transparent rounded py-1 px-1 transition duration-700 ease-in-out transform h-6 w-8 inline-block;
            &.am {
                @apply translate-x-0;
            }
            &.pm {
                @apply translate-x-full;
            }
        }
        button {
            @apply relative z-10;
        }
    }
    .calendar::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
    }
</style>
