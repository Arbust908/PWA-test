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
        {{ res[endpointKey] }}
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
    name: 'FieldSelect',
    props: {
      data: {
        default: '',
      },
      fieldName: {
        type: String,
        default: 'select',
      },
      placeholder: {
        type: String,
        default: 'Ppciones',
      },
      title: {
        type: String,
        default: null,
      },
      endpoint: {
        type: String,
        default: '/',
      },
      endpointKey: {
        type: String,
        default: 'name',
      },
      endpointData: {
        type: Array,
        default: null,
      },
      isOptional: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      let resources = null;
      if (props.endpointData !== null) {
        resources = props.endpointData;
      } else {
        const { read } = useApi(props.endpoint);
        resources = read();
      }
      return {
        value,
        resources,
        ...props,
      };
    },
  });
</script>
