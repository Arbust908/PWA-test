<template>
  <label class="loading">
    <p v-if="title">titulo</p>
    <div class="input">Loading</div>
  </label>
</template>

<script>
  import { defineComponent } from 'vue';
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

<style lang="scss" scoped>
  @import '@/assets/inputs.scss';
</style>
