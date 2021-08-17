<template>
  <label :for="fieldName">
    <span v-if="title">{{ title }}</span>
    <!-- TODO: Dropdown con Busqueda -->
    <!-- TODO: Options con entrada cheta -->
    <select
      :id="fieldName"
      class="input"
      :name="fieldName"
      v-model.number="value"
    >
      <option disabled value="-1">
        {{ placeholder }}
      </option>
      <option v-for="(res, i) in resources" :key="res.id + i" :value="res.id">
        {{ res[enpointKey] }}
      </option>
    </select>
  </label>
</template>

<script>
  import { defineComponent, ref, watch } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { useApi } from '@/helpers/useApi';
  export default defineComponent({
    name: 'FieldInput',
    props: {
      data: {
        default: '',
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
        type: String,
        default: null,
      },
      endpoint: {
        type: String,
        default: '/',
      },
      enpointKey: {
        type: String,
        default: 'name',
      },
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      const { read } = useApi(props.endpoint);
      const resources = read();

      return {
        value,
        resources,
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
