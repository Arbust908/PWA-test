<template>
  <button
    :class="[category, isTheSelected ? 'selected' : null]"
    class="box"
    @click.prevent="selectBox"
  >
    <span class="text-sm">{{ row }} - {{ col }}</span>
  </button>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, toRefs, computed } from 'vue';
  import { Box } from '@/interfaces/sandflow';

  export default defineComponent({
    name: 'DepositBox',
    props: {
      selectedBox: {
        type: Object,
        required: true,
      },
      deposit: {
        type: Object,
        required: true,
      },
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
    },
    setup(props, { emit }) {
      const { deposit, floor, row, col, selectedBox } = toRefs(props);
      const selectBox = () => {
        const box: Box = {
          floor: floor.value,
          row: row.value,
          col: col.value,
          category: category.value,
        };
        emit('select-box', box);
      };
      const category = computed(() => {
        return (
          deposit.value[`${floor.value}|${row.value}|${col.value}`] || 'empty'
        );
      });
      const isTheSelected = computed(() => {
        return (
          selectedBox.value.row === row.value &&
          selectedBox.value.col === col.value &&
          selectedBox.value.floor === floor.value
        );
      });

      return {
        deposit,
        floor,
        row,
        col,
        selectedBox,
        category,
        selectBox,
        isTheSelected,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .box {
    @apply h-12 w-12 rounded bg-second-300;
    &.aisle {
      @apply bg-second-300 text-second-300;
    }
    &.fine {
      @apply bg-orange-600 text-orange-600;
    }
    &.thick {
      @apply bg-green-600 text-green-600;
    }
    &.cut {
      @apply bg-blue-600 text-blue-600;
    }
    &.blocked {
      @apply bg-second-800 text-second-800;
    }
    &.empty {
      @apply bg-second-200 text-second-200;
    }
    &.selected {
      @apply ring-2 ring-offset-second-0 ring-offset-2 ring-main-500;
    }
  }
</style>
