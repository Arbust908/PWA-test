<template>
  <template v-for="(pit, pitI) in pits" :key="pitI">
    <FieldInput
      :class="pitI !== lastPitIndex ? 'col-span-10' : 'col-span-full'"
      fieldName="name"
      placeholder="Nombre de cliente"
      mask="S*"
      :data="pit.name"
      @update:data="pit.name = $event"
    />
    <!-- Span Proxy para que pueda "Contener" el boton -->
    <span
      v-if="pitI !== lastPitIndex"
      class="col-span-2 flex justify-center items-center"
    >
      <CircularBtn class="btn__delete" size="sm" @click="removePit(pit.id)">
        <Icon icon="Trash" class="w-5 h-5" />
      </CircularBtn>
    </span>
  </template>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';

  export default defineComponent({
    name: 'woPitField',
    components: {
      FieldInput,
      Icon,
      CircularBtn,
    },
    emits: ['removePit'],
    props: {
      pits: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const lastPitIndex = props.pits.length - 1;
      const firstPitIndex = 0;
      const removePit = (pitId) => {
        emit('removePit', pitId);
      };
      return {
        lastPitIndex,
        firstPitIndex,
        removePit,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .btn {
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 transition duration-150 ease-out;
    }
  }
</style>
