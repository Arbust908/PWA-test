<template>
    <article class="available-box">
        <TheAllIcon v-if="isActiveBox" type="outline" icon="CheckCircle" class="w-6 h-6 text-green-600" />
        <button
            v-else
            class="radio-button"
            :disabled="box.boxId?.length <= 0"
            type="button"
            @click="$emit('select-box', box.boxId)"
        />
        <div class="mx-2 flex items-center">
            <span> {{ box.category }} - {{ box.amount }}t - </span>
            <div class="box-id">
                <span> ID Caja </span>
                <input
                    :value="boxy.boxId"
                    :name="`boxId-${box.id}`"
                    :readonly="hadId"
                    type="text"
                    placeholder="Ej: S-0908"
                    class="input"
                    @blur="boxy.boxId = $event.target.value"
                />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
    import TheAllIcon from '@/components/icon/TheAllIcon.vue';
    const props = defineProps({
        box: {
            type: Object,
            required: true,
        },
        isActiveBox: {
            type: Boolean,
            default: false,
        },
    });
    const emit = defineEmits(['select-box', 'update:box']);
    const boxy = useVModel(props, 'box', emit);
    const hadId = props?.box?.boxId.length > 0;
</script>

<style lang="scss" scoped>
    .available-box {
        @apply flex items-center;
    }
    .radio-button {
        @apply border border-gray-800 w-5 h-5 m-1 cursor-pointer rounded-full;
        &:disabled {
            @apply opacity-50 flex justify-center items-center cursor-not-allowed;
            &::after {
                content: '';
                @apply bg-slate-400 absolute w-3 h-3 rounded-full;
            }
        }
    }

    .box-id {
        @apply mx-2 w-[148px] flex justify-between text-center border rounded-md overflow-hidden border-gray-300;
        span {
            @apply p-2 w-1/2 bg-gray-100 border-r border-gray-300;
        }
        .input {
            @apply w-1/2 border-none inline text-center focus:ring-main-500 focus:border-main-500 px-2;
            &:read-only {
                @apply cursor-not-allowed bg-gray-100;
            }
        }
    }
</style>
