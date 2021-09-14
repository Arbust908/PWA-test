<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" />
    <div class="input_side">
      <span v-if="pre" class="pre" :title="pre.title">{{ pre.value }}</span>
      <input
        :class="[pre ? null : 'n-pre', post ? null : 'n-post']"
        :id="fieldName"
        :type="type"
        :name="fieldName"
        :placeholder="placeholder"
        v-model="value"
        v-maska="mask"
      />
      <span v-if="post" class="post text-center" :title="post.title">{{ post.value }}</span>
    </div>
  </label>
</template>

<script>
  import { defineComponent, watch } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska } from 'maska';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  export default defineComponent({
    directives: { maska },
    name: 'FieldInput',
    components: { FieldTitle },
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
      pre: {
        type: Object,
        default: null,
      },
      post: {
        type: Object,
        default: null,
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
