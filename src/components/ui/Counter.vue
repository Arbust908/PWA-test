<template>
    <div>
        <button :disabled="count <= 1" @click.prevent="dec()">
            <MinusIcon class="icon" />
        </button>
        <input v-model.number="count" type="text" />
        <button :disabled="count >= max" @click.prevent="inc()">
            <PlusIcon class="icon" />
        </button>
    </div>
</template>

<script>
    import { defineComponent, watch } from 'vue';
    import { PlusIcon, MinusIcon } from '@heroicons/vue/solid';
    import { useVModel, useCounter } from '@vueuse/core';
    export default defineComponent({
        name: 'Counter',
        components: {
            PlusIcon,
            MinusIcon,
        },
        props: {
            amount: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                default: Infinity,
            },
        },
        setup(props, { emit }) {
            const amount = useVModel(props, 'amount', emit);
            const { count, inc, dec } = useCounter(amount);
            watch(count, (data, oldData) => {
                if (data < 1) {
                    amount.value = 1;
                } else if (data > props.max) {
                    amount.value = props.max;
                } else {
                    amount.value = data;
                }
            });

            return {
                count,
                inc,
                dec,
            };
        },
    });
</script>

<style lang="scss" scoped>
    div {
        @apply flex;
    }
    button {
        @apply bg-second-200 text-second-500 p-2 rounded-full w-8 h-8;
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
        &:not(:disabled):hover {
            @apply shadow bg-second-300;
        }
    }
    span {
        @apply bg-second-200 text-second-500 p-2 rounded-full w-8 h-8;
        &:disabled {
            @apply opacity-50 cursor-not-allowed;
        }
        &:not(:disabled):hover {
            @apply shadow bg-second-300;
        }
    }
    input {
        @apply w-8 bg-transparent p-0 border-none text-center rounded;
    }
    .icon {
        @apply w-full;
    }
</style>
