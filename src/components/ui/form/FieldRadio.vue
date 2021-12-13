<template>
    <fieldset :id="id">
        <legend v-if="title" class="font-semibold">{{ title }}</legend>
        <div v-for="(option, index) in options" :key="option.text" class="mt-4">
            <input
                :id="id + index"
                :name="id"
                type="radio"
                :value="option.value"
                :checked="option.value === modelValue"
                :class="inputClass"
                :disabled="disabled"
                :required="required"
                class="box-shadow text-main-600 w-5 h-5"
                @change="updateValue(option.value)"
            />
            <label :for="id + index" class="ml-3">{{ option.text }}</label>
            <slot v-if="option.value === modelValue" :name="option.value" />
        </div>
    </fieldset>
</template>

<script>
    export default {
        model: {
            event: 'change',
        },
        props: {
            id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            modelValue: {
                type: [String, Number, Boolean, Object],
                default: null,
            },
            options: {
                type: [Array],
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            inputClass: {
                type: [String, Object],
                default: '',
            },
        },
        methods: {
            updateValue(value) {
                this.$emit('update:modelValue', value);
            },
        },
    };
</script>
