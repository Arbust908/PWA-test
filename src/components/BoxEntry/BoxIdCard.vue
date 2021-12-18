!
<template>
    <div class="available-box">
        <button
            :class="choosedBoxId == box.boxId ? 'active' : null"
            class="radio-button"
            type="button"
            @click="$emit('select-box', box.boxId)"
        />
        <div class="mx-2 flex items-center">
            <span> {{ box.category }} - {{ box.amount }}t - </span>
            <div class="box-id">
                <span> ID Caja </span>
                <input
                    v-model="boxyId"
                    :name="`boxId-${box.id}`"
                    :readonly="hasId"
                    type="text"
                    placeholder="Ej: S-0001"
                    class="input"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useVModel } from '@vueuse/core';
    export default defineComponent({
        props: {
            box: {
                type: Object,
                required: true,
            },
            boxId: {
                type: String,
                required: true,
            },
            choosedBoxId: {
                type: String,
                default: '',
            },
        },
        emits: ['select-box', 'update:boxId'],
        setup(props, { emit }) {
            const boxyId = useVModel(props, 'boxId', emit);
            const hasId = boxyId.value.length > 0;

            return {
                boxyId,
                hasId,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .available-box {
        @apply flex items-center;
    }
    .radio-button {
        @apply border border-gray-800 w-5 h-5 cursor-pointer rounded-full;
        &.active {
            @apply relative;
            &::after {
                content: '';
                @apply absolute inset-0 w-3 h-3 rounded-full m-auto bg-green-600;
                animation: pop_in 150ms ease-out;
            }
        }
    }
    .box-id {
        @apply mx-2 w-48 flex justify-between text-center border rounded-md overflow-hidden border-gray-300;
        span {
            @apply p-2 w-1/2 bg-gray-100 border-r border-gray-300;
        }
        .input {
            @apply w-1/2 border-none inline text-center focus:ring-main-500 focus:border-main-500;
            &:read-only {
                @apply cursor-not-allowed bg-gray-100;
            }
        }
    }
</style>
