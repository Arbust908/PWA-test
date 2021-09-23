<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" :isOptional="isOptional" />
    <textarea
      :id="fieldName"
      :class="isFixed ? 'resize-none' : null"
      class="input"
      :name="fieldName"
      :placeholder="placeholder"
      v-model="value"
      :rows="rows"
    >
    </textarea>
  </label>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import { useVModel } from '@vueuse/core';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  export default defineComponent({
    name: 'FieldInput',
    components: {
      FieldTitle,
    },
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
        type: [String, null],
        default: null,
      },
      rows: {
        type: Number,
        default: 4,
      },
      isOptional: {
        type: Boolean,
        default: false,
      },
      isFixed: {
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
