<template>
    <div class="flex items-start">
        <i class="w-3 h-3 inline-block rounded-full mesh-box__1 m-2 bubble"></i>
        <article>
            <h4>Arena {{ type }}</h4>
            <p class="text-gray-400">{{ amount }} toneladas</p>
        </article>
        <article class="w-[70px] rounded flex justify-center items-center ml-auto">
            <div
                :style="{
                    color: 'red',
                    'background-image': `conic-gradient(#00a75d 0%, #00a75d ${porcentage}, #c4c4c4 ${porcentage}, #c4c4c4 100%);`,
                }"
                class="w-11 h-11 rounded-full bg-gray-700 flex justify-center items-center progress"
            >
                <p class="w-9 h-9 rounded-full bg-white flex justify-center items-center text-[10px]">
                    {{ porcentage.toFixed() }}%
                </p>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
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
    const { type, amount, porcentage } = toRefs(props);

    const progrssBar = `conic-gradient(#00a75d 0%, #00a75d ${porcentage}, #c4c4c4 ${porcentage}, #c4c4c4 100%);`;
</script>

<style lang="scss" scoped>
    .progress {
        background-image: v-bind(progrssBar);
    }
</style>
