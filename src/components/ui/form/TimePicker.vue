<template>
    <div class="flex gap-2 items-center p-1 rounded border border-second-300">
        <select v-model="hour" name="picker-hour" class="sel selecThor" :data-a="hour">
            <option v-for="h in hours" :key="`hour-${h}`" :value="h">
                {{ h >= 10 ? h : `0${h}` }}
            </option>
        </select>
        <span>:</span>
        <select v-model="minute" name="picker-minutes" class="sel selecThor">
            <option v-for="m in minutes" :key="`minutes-${m}`" :value="m">
                {{ m >= 10 ? m : `0${m}` }}
            </option>
        </select>
        <input type="checkbox" name="picker-time" class="hidden" />
        <div class="sel selecTime">
            <button @click.prevent="toggleTime(true)">AM</button>
            <button @click.prevent="toggleTime(false)">PM</button>
            <div class="marker-wrapper">
                <span :class="time ? 'translate-x-0' : 'translate-x-full'" class="marker"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch } from 'vue';
    import { useVModels, useToggle } from '@vueuse/core';
    import { createFromDate, createToDate } from '@/helpers/useChronos';

    export default defineComponent({
        name: 'TimePicker',
        props: {
            timetrack: {
                type: Number,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { timetrack } = useVModels(props, emit);
            const { hour, minute, time } = createFromDate(timetrack.value);
            watch(hour, (value, oldValue) => {
                if (value !== oldValue) {
                    const { date } = createToDate(value, minute.value, time.value);
                    timetrack.value = date;
                }
            });
            watch(minute, (value, oldValue) => {
                if (value !== oldValue) {
                    const { date } = createToDate(hour.value, value, time.value);
                    timetrack.value = date;
                }
            });
            watch(time, (value, oldValue) => {
                if (value !== oldValue) {
                    const { date } = createToDate(hour.value, minute.value, value);
                    timetrack.value = date;
                }
            });
            const toggleTime = useToggle(time);
            let hours = [...Array(12).keys()];
            hours = hours.map((hour: number) => {
                return hour + 1;
            });
            let minutes = [...Array(12).keys()];
            minutes = minutes.map((min: number) => {
                return min * 5;
            });
            const logger = () => {
                console.log(`${hour.value} : ${minute.value} ${time.value}`);
            };

            return {
                hours,
                minutes,
                hour,
                minute,
                time,
                toggleTime,
                logger,
            };
        },
    });
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
