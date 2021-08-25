<template>
  <div class="slots-wrapper">
    <div
      v-for="(slot, index) in cradle.slots"
      :key="index"
      class="single-slot"
      @click="handleSlotClick"
    >
      <div v-if="slot.boxId == null" class="index-wrapper">
        <span class="index">{{ index + 1 }}</span>
      </div>
      <div v-else>
        {{ slot.boxId }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';

  export default {
    props: {
      cradle: {
        type: Object,
        required: true,
      },
      box: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const cradle = ref(props.cradle);
      const box = ref(props.box);

      const handleSlotClick = () => {
        console.log(box.value.id);
      };

      return {
        cradle,
        box,
        handleSlotClick,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .slots-wrapper {
    @apply ml-4 flex flex-row justify-between items-center;
  }
  .index-wrapper {
    @apply flex justify-center items-center;
  }
  .index {
    @apply text-4xl text-second-300;
  }
  .single-slot {
    @apply w-[100px] h-[100px] border-dashed border-2 border-second-500 justify-center items-center flex m-2 cursor-pointer  rounded;
  }
</style>
