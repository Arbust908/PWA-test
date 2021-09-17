<template>
  <article :class="category" class="card">
    <BoxCardIcon class="icon" :category="category" />
    <div class="flex flex-col justify-between">
      <div>
        <p class="text-sm font-bold leading-tight">Piso: {{ floor }}</p>
        <p class="text-sm font-bold leading-tight">Columna: {{ col }}</p>
        <p class="text-sm font-bold leading-tight">Fila: {{ row }}</p>
      </div>
      <p class="text-sm">{{ makeValue }}</p>
    </div>
  </article>
</template>

<script lang="ts">
  import { defineComponent, defineAsyncComponent, toRefs, computed } from 'vue';
  import { BoxCategory } from '@/interfaces/sandflow';
  import BoxCardIcon from '@/components/depositDesign/BoxCardIcon.vue';

  export default defineComponent({
    name: 'BoxCard',
    props: {
      floor: {
        type: Number,
        required: true,
      },
      row: {
        type: Number,
        required: true,
      },
      col: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
    components: {
      BoxCardIcon,
    },
    setup(props) {
      const { floor, row, col, category } = toRefs(props);
      const makeValue = computed(() => {
        return BoxCategory[category.value];
      });

      return {
        floor,
        row,
        col,
        category,
        makeValue,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .card {
    @apply p-4 rounded-2xl flex gap-6 bg-second-400 text-second-0;
    & .icon {
      @apply w-20 h-20;
    }

    &.aisle {
      @apply bg-second-300;
      & .icon {
        @apply text-second-400;
      }
    }
    &.fina {
      @apply bg-orange-600;
      & .icon {
        @apply text-orange-700;
      }
    }
    &.gruesa {
      @apply bg-green-600;
      & .icon {
        @apply text-green-700;
      }
    }
    &.cortada {
      @apply bg-blue-600;
      & .icon {
        @apply text-blue-700;
      }
    }
    &.empty {
      @apply bg-second-200 text-second-500;
      & .icon {
        @apply text-second-300;
      }
    }
  }
</style>
