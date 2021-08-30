<template>
  <p>
    {{ title }}
    <span v-if="isOptional">(Opcional)</span>
  </p>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'FieldTitle',
    props: {
      title: {
        type: [String, null],
        default: null,
      },
      isOptional: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>
