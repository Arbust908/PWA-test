<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" :isOptional="isOptional" />
    <input
      :id="fieldName"
      class="input"
      :type="type"
      :name="fieldName"
      :placeholder="placeholder"
      v-model="value"
      v-maska="mask"
    />
    <!-- TODO: Validaciones -->
  </label>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska } from 'maska';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  export default defineComponent({
    directives: { maska },
    name: 'FieldInput',
    components: {
      FieldTitle,
    },
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
        type: [String, Array],
        default: '',
      },
      isOptional: {
        type: Boolean,
        default: false,
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
  @import '@/assets/inputs.scss';
</style>
