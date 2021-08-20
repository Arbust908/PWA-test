<template>
  <label class="loading">
    <p v-if="title">titulo</p>
    <div class="input">Loading</div>
  </label>
</template>

<script>
  import { defineComponent } from 'vue';
  import '@/assets/inputs.scss';
  export default defineComponent({
    name: 'FieldLoading',
    props: {
      title: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      return {
        ...props,
      };
    },
  });
</script>
