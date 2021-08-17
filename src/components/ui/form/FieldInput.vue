<template>
  <label :for="fieldName">
    <span v-if="title">{{ title }}</span>
    <input
      :id="fieldName"
      class="input"
      :type="type"
      :name="fieldName"
      :placeholder="placeholder"
      v-model="value"
    />
    <!-- TODO: Masking & Validaciones -->
  </label>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import { useVModel } from '@vueuse/core';
  // import { maska, mask } from 'maska';
  export default defineComponent({
    // directives: { maska },
    name: 'FieldInput',
    props: {
      data: {
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
      fieldName: {
        type: String,
        default: 'input',
      },
      placeholder: {
        type: String,
        default: 'Input',
      },
      title: {
        type: [String, null],
        default: null,
      },
      mask: {
        type: String,
        default: '',
      },
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      return {
        value,
        ...props,
      };
    },
  });
</script>

<style lang="scss" scoped>
  label {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  input:read-only {
    @apply bg-second-200 border cursor-not-allowed;
  }
</style>
