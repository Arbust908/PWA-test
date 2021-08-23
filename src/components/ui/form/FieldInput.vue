<template>
  <label :for="fieldName">
    <p v-if="title">
      {{ title }}
      <span v-if="isOptional">(Opcional)</span>
    </p>
    <input
      :id="fieldName"
      class="input"
      :type="type"
      :name="fieldName"
      :placeholder="placeholder"
      v-model="value"
      v-maska="mask"
    />
    <!-- TODO: Masking & Validaciones -->
  </label>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska, mask } from 'maska';
  // import { mask } from 'vue-the-mask';
  import '@/assets/inputs.scss';
  export default defineComponent({
    directives: { maska },
    // directives: { mask },
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
