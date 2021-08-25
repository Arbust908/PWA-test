<template>
  <div>
    <CradleCard
      class="max-w-[170px] lg:max-w-[260px]"
      :id="id"
      :selected="selected"
      @click="handleSelectedCradle"
    />
    <CradleSlots 
      :cradle="cradle" 
      :box="choosedBox"
    />
  </div>
</template>

<script lang="ts">
import CradleCard from '@/components/depositDesign/CradleCard.vue';
import CradleSlots from '@/components/depositDesign/CradleSlots.vue';

import {toRef,ref, watch} from 'vue'

export default {
  props: {
    cradle: {
      type: Object,
      required: true
    },
    choosedBox: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  components: {
    CradleCard,
    CradleSlots
  },
  setup (props, {emit}) {
    const cradle = ref(props.cradle)
    const choosedBox = ref(props.choosedBox)
    const selected = ref(props.selected)
    const id = ref(props.id)

    const handleSelectedCradle = () => {
      emit('handle-selected-cradle')
    }
    
    return {
      selected,
      choosedBox,
      cradle,
      id,
      handleSelectedCradle
    }
  }
}
</script>

<style lang="scss" scoped>

</style>