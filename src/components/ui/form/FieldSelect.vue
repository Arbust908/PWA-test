<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" :isOptional="isOptional" />
    <!-- TODO: Dropdown con Busqueda -->
    <!-- TODO: Options con entrada cheta -->
    <!-- TODO: StoreLogic -->
    <select
      :id="fieldName"
      class="input"
      :name="fieldName"
      v-model.number="value"
      @blur="$emit('is-blured')"
    >
      <option disabled value="-1">
        {{ placeholder }}
      </option>
      <option v-for="(res, i) in resources" :key="res?.id + i" :value="res?.id">
        {{ res[endpointKey] }}
      </option>
      <option v-for="(res, i) in epData" :key="res?.id + i" :value="res?.id">
        {{ res[endpointKey] }}
      </option>
    </select>
  </label>
</template>

<script>
  import { defineComponent, computed, ref, toRefs, watchEffect } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { useApi } from '@/helpers/useApi';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';

  export default defineComponent({
    name: 'FieldSelect',
    components: {
      FieldTitle
    },
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
        default: 'Seleccione',
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
      filteredData: {
        type: Array,
        required: false
      },
      requireValidation: {
        type: Boolean,
        required: false
      },
      validationType: {
        type: String,
        required: false
      },
      entity: {
        type: String,
        required: false
      }
    },
    setup(props, { emit }) {
      const {filteredData} = toRefs(props)
      const value = useVModel(props, 'data', emit);
      const endpointData = useVModel(props, 'endpointData', emit);
      const getApiVal = () => {
        const { read } = useApi(props.endpoint);
        return read();
      };
      let resources = ref([]);

      const epData = computed(() => {
        return props.endpoint === '/' ? endpointData.value : null;
      });

      if (props.endpoint !== '/' && props.endpoint !== null && !props.filteredData) {
        resources = getApiVal();
      }

      watchEffect(() => {
        if(props.filteredData && props.filteredData.length > 0) {
          resources.value = filteredData.value
        }
      })

      return {
        value,
        resources,
        epData,
        filteredData,
        ...props
      };
    },
  });
</script>

<style lang="scss" scoped>
  @import '@/assets/inputs.scss';
</style>
