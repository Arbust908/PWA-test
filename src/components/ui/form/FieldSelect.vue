<template>
  <label :for="fieldName">
    <p v-if="title">
      {{ title }}
      <span v-if="isOptional">(Opcional)</span>
    </p>
    <!-- TODO: Dropdown con Busqueda -->
    <!-- TODO: Options con entrada cheta -->
    <!-- TODO: StoreLogic -->
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
  import { defineComponent } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { useApi } from '@/helpers/useApi';
  import '@/assets/inputs.scss';
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
      isOptional: {
        type: Boolean,
        default: false,
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
