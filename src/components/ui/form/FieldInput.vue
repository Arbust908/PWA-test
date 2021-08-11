<template>
  <label :for="name">
    <span>{{ title }}</span>
    <input
      :id="name"
      class="input"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      v-model="value"
    />
  </label>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useVModel } from '@vueuse/core';
  export default defineComponent({
    name: 'FieldInput',
    props: {
      data: {
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
      name: {
        type: String,
        default: 'input',
      },
      placeholder: {
        type: String,
        default: 'Input',
      },
      title: {
        type: String,
        default: 'Input',
      },
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      const update = (event) => {
        value.value = event.target.value;
      };
      return {
        value,
        update,
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
