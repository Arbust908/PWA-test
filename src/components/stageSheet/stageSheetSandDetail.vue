<template>
    <div class="flex items-start">
        <i :class="`mesh-type__${id}`" class="w-3 h-3 inline-block rounded-full m-2 bubble" />
        <article>
            <h4>Arena {{ type }}</h4>
            <p class="text-gray-400">{{ amount }} toneladas</p>
        </article>
        <article class="w-[70px] rounded flex justify-center items-center ml-auto">
            <div
                :style="`--progress: ${circleAmount}`"
                :class="porcentage > 100 ? 'over' : null"
                class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center progress"
            >
                <p class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]">
                    {{ circleAmount }}
                </p>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
    import { TransitionPresets } from '@vueuse/core';
    const props = defineProps({
        sand: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        porcentage: {
            type: Number,
            required: true,
        },
    });
    const { type, amount, porcentage, sand } = toRefs(props);
    const id = computed(() => {
        return sand.value.id;
    });
    // TODO animacion de fill
    const input = ref(0);
    input.value = porcentage.value;

    watch(porcentage, (newValue) => {
        input.value = newValue;
    });

    const output = useTransition(input, {
        duration: 1000,
        transition: TransitionPresets.easeInOutCubic,
    });

    const circleAmount = computed(() => {
        return `${output.value.toFixed()}%`;
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
    .progress {
        background-image: conic-gradient(#00a75d 0%, #00a75d var(--progress), #c4c4c4 var(--progress), #c4c4c4 100%);
        &.over {
            background-image: conic-gradient(#be1a3b 0%, #be1a3b 100%, #c4c4c4 100%, #c4c4c4 100%);
        }
    }
</style>
