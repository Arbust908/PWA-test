<script lang="ts">
    export default {
        props: {
            modelValue: {
                type: [String, Number, Boolean],
                required: true,
            },
            inputName: {
                type: String,
                default: 'Input',
            },
            labelName: {
                type: String,
                default: 'Label',
            },
            inputClass: {
                type: String,
                default: 'hover:bg-purple-200',
            },
        },
        emits: ['update:modelValue'],
        setup(props: any, { emit }: any) {
            const inputValue = ref(props.modelValue);
            const changeValue = (e: any) => {
                inputValue.value = e.target.value;
                emit('update:modelValue', inputValue.value);
            };

            return {
                inputValue,
                changeValue,
            };
        },
    };
</script>

<template>
    <label :for="inputName">{{ labelName }}</label>
    <input :id="inputName" :value="inputValue" type="text" :class="inputClass" @input="changeValue" />
</template>

<style scoped>
    input {
        @apply rounded-xl shadow border-2 bg-gray-200;
    }
</style>
