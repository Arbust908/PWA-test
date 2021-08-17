<template>
  <article :class="['card','items-center', category, !selected ? 'w-100 bg-second-800' : 'w-80 bg-green-800']">
    <div :class="['check-radio-button',!selected ? '' : 'w-80 border-green-800']" v-if="!selected"></div>
    <CheckCircleIcon v-else class="w-5 h-5"/>
    <ExcavatorIcon :class="['icon', 'p-2 rounded-md',!selected ?  'bg-second-700' : 'bg-green-700' ]" />
    <div class="flex flex-col justify-between">
      <div>
        Cradle<br>
        ID {{id}}
        <div v-if="selected">
          datos extra
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
  import { defineComponent, toRefs, ref } from 'vue';
  import { BoxCategory } from '@/interfaces/sandflow';
  import BoxCardIcon from '@/components/depositDesign/BoxCardIcon.vue';
  import { CheckCircleIcon } from '@heroicons/vue/solid';
  import ExcavatorIcon from './ExcavatorIcon.vue'
  
  export default defineComponent({
    name: 'BoxCard',
    props: {
      id: {
        type: Number,
        required: true
      },
      selected: {
        type: Boolean,
        required: true
      }
    },
    components: {
      BoxCardIcon,
      CheckCircleIcon,
      ExcavatorIcon
    },
    setup(props) {
      const { id, selected } = toRefs(props);

      return {
        id,
        selected
      };
    },
  });
</script>

<style lang="scss" scoped>
  .card {
    cursor: pointer;
    transition: all 400ms ease-in-out;
    @apply p-4 rounded-2xl flex gap-6 text-second-0;
    & .icon {
      @apply w-20 h-20;
    }

    .check-radio-button {
      width: 15px;
      height: 15px;
      background: white;
      border-radius: 100%;
      border: 2px;
    }
  }
</style>
