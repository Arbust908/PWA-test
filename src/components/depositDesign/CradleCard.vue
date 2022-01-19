<template>
    <article :class="['card', 'items-center', category, !selected ? 'w-100 bg-gray-800' : 'w-80 bg-green-800']">
        <div
            v-if="!selected"
            :class="['check-radio-button', !selected ? 'bg-pink-600' : 'w-80 h-80 border-green-800']"
        ></div>
        <CheckCircleIcon v-else class="w-5 h-5" />
        <ExcavatorIcon :class="['icon', 'p-2 rounded-md', !selected ? 'bg-gray-700' : 'bg-green-700']" />
        <div class="flex flex-col justify-between">
            <div>
                {{ cradle.name }}<br />
                ID {{ id }}
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { CheckCircleIcon } from '@heroicons/vue/solid';
    import ExcavatorIcon from './ExcavatorIcon.vue';

    const props = defineProps({
        id: {
            type: Number,
            required: true,
        },
        selected: {
            type: Boolean,
            required: true,
        },
        cradle: {
            type: Object,
            required: true,
        },
    });
    const { id, selected, cradle } = toRefs(props);
</script>

<style lang="scss" scoped>
    .card {
        cursor: pointer;
        transition: all 400ms ease-in-out;
        @apply p-4 rounded-2xl flex gap-4 text-second-0;
        & .icon {
            @apply w-20 h-20;
        }
        .check-radio-button {
            @apply block w-4 h-4 bg-white border-2 rounded-full;
        }
    }
</style>
