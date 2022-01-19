<template>
    <label :for="fieldName" :class="value ? 'checked' : null" @click="toggleValue()">
        <div class="ball" />
        <input :id="fieldName" :value="value" class="input invisible" type="checkbox" :name="fieldName" />
    </label>
</template>

<script setup lang="ts">
    const props = defineProps({
        fieldName: {
            type: String,
            required: true,
        },
        data: {
            type: Boolean,
            required: true,
        },
    });
    const emits = defineEmits(['toggle']);
    const value = useVModel(props, 'data');
    const canSendEvent = ref(true);
    const toggleValue = () => {
        if (!canSendEvent.value) {
            return;
        }
        console.log();
        emits('toggle', value.value);
        canSendEvent.value = false;
        setTimeout(() => {
            canSendEvent.value = true;
            console.log('can send event');
        }, 1000);
    };
</script>

<style lang="scss" scoped>
    label {
        @apply bg-[#E5E7EB] h-6 w-11 rounded-xl relative block cursor-pointer py-1 pl-1 transition-all duration-300 ease-in-out;
        & .ball {
            @apply relative block h-4 w-4  bg-white rounded-full shadow-md;
        }
        &.checked {
            @apply bg-[#10B981] pl-6 pr-1;
        }
    }
    input {
        @apply bg-slate-300;
    }
</style>
