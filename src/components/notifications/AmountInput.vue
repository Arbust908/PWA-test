<template>
  <label for="sandQuantity">
    <span v-if="title">Cantidad</span>
    <div class="wrapper">
      <input
        v-model.number="amount"
        type="number"
        name="sandQuantity"
        placeholder="22"
        list="sandQuantity-list"
      />
      <span class="post" title="Peso en Toneladas"> t </span>
    </div>
  </label>
</template>

<script lang="ts">
  import { useVModel } from '@vueuse/core';
  import { defineComponent } from 'vue';
  export default defineComponent({
    props: {
      amount: {
        type: Number,
        default: 0,
      },
      title: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { emit }) {
      const amount = useVModel(props, 'amount', emit);
      return {
        amount,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .wrapper {
    @apply mt-1 flex rounded shadow-sm;
  }
  span {
    @apply text-sm;
  }
  input {
    @apply flex-1 min-w-0 block w-full px-3 py-4 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-second-300 sm:text-sm;
  }
  .post {
    @apply inline-flex items-center px-3 rounded-r border border-second-300 bg-second-50 text-second-500 sm:text-sm;
  }
</style>
