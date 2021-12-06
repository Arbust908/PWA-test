<template>
    <div class="flex p-1 items-center rounded border border-second-300">
        <input
            v-model="date"
            v-maska="'##/##/####'"
            type="text"
            placeholder="--/--/----"
            class="sel w-40"
            @blur="getDate"
        />
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
        setup(props: any) {
            const date = ref('');
            let dateSplit = [];
            let day = 0;
            let month = 0;
            let year = 0;

            function getDate() {
                dateSplit = date.value.split('/');
                day = parseInt(dateSplit[0]);
                month = parseInt(dateSplit[1]);
                year = parseInt(dateSplit[2]);
                console.log(date.value);
                console.log(date.value);
                console.log(dateSplit);
                console.log(day);
                console.log(month);
                console.log(year);
            }

            return { date, getDate };
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
</style>
