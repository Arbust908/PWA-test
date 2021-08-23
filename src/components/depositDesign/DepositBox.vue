<template>
  <button
    :class="['box', category, isTheSelected ? 'selected' : null, isBlocked() ? 'blocked' : null]"
    @click.prevent="selectBox"
  >
    <span class="text-sm">{{id}}</span>
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
      visibleCategories: {
        type: Array,
        required: false
      },
      boxData: {
        type: Object,
        required: false
      }
    },
    setup(props, { emit }) {
      let { floor, row, col, selectedBox ,boxData } = toRefs(props);

      const category = computed(() => {
        return (
          boxData ? boxData.value.category : 'empty'
        );
      });

      const id = computed(() => {
        return (
          boxData ? boxData.value.id : ''
        );
      });

      const selectBox = () => {
        const box: Box = {
          floor: floor.value,
          row: row.value,
          col: col.value,
          category: category.value,
          id: id.value,
        };
        emit('select-box', box);
      };

      const isTheSelected = computed(() => {
        return (
          selectedBox.value.row === row.value &&
          selectedBox.value.col === col.value &&
          selectedBox.value.floor === floor.value
        );
      });

      let visibleCategories = ref(props.visibleCategories)

      const isBlocked = () => {
        if(!visibleCategories.value) return false
        if(visibleCategories.value.includes(category.value) || category.value == 'aisle') {
          return false
        } else {
          return true
        }
      }

      return {
        floor,
        row,
        col,
        selectedBox,
        category,
        selectBox,
        isTheSelected,
        isBlocked,
        id
      };
    },
  });
</script>

<style lang="scss" scoped>
  .box {
    @apply h-[58px] w-[58px] rounded bg-second-300;
    &.aisle {
      @apply bg-second-300 text-second-300;
    }
    &.fine {
      @apply bg-orange-600 text-orange-800 font-medium;
    }
    &.thick {
      @apply bg-green-600 text-green-800 font-medium;
    }
    &.cut {
      @apply bg-blue-600 text-blue-800 font-medium;
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
