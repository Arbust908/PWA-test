<template>
  <FieldGroup
    v-for="(traktor, traktorI) in traktors"
    :key="traktorI"
    class="relative col-span-full max-w-2xl"
  >
    <FieldInput
      class="col-span-6 lg:col-span-3"
      fieldName="chassis"
      placeholder="Id de tractor"
      :title="traktorI === firstTraktorIndex ? 'ID Tractor/Chasis' : null"
      :data="traktor.chassis"
      @update:data="traktor.chassis = $event"
    />
    <FieldInput
      class="col-span-7 lg:col-span-6"
      fieldName="supplier"
      placeholder="Proveedor de tractor"
      :title="traktorI === firstTraktorIndex ? 'Proveedor' : null"
      :data="traktor.supplier"
      @update:data="traktor.supplier = $event"
    />
    <FieldInput
      class="col-span-6 lg:col-span-3"
      fieldName="description"
      placeholder="Descripción de tractor"
      :title="traktorI === firstTraktorIndex ? 'Descripción' : null"
      :data="traktor.description"
      @update:data="traktor.description = $event"
    />
    <!-- Span Proxy para que pueda "Contener" el boton -->
    <span
      v-if="traktors.length > 1 && traktorI !== lastTraktorIndex"
      :class="traktorI === firstTraktorIndex ? 'lg:bottom-6' : 'lg:top-3'"
      class="
        flex
        justify-center
        items-center
        col-span-2
        lg:absolute lg:-right-12
      "
    >
      <CircularBtn class="btn__delete" size="sm" @click="remove(traktor.id)">
        <Icon icon="Trash" class="w-5 h-5" />
      </CircularBtn>
    </span>
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import { useVModel } from '@vueuse/core';

  export default defineComponent({
    name: 'woTraktorField',
    components: {
      FieldInput,
      FieldGroup,
      Icon,
      CircularBtn,
    },
    emits: ['remove'],
    props: {
      traktors: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const traktors = useVModel(props, 'traktors', emit);
      const lastTraktorIndex = computed(() => {
        return props.traktors.length - 1;
      });
      const firstTraktorIndex = 0;
      const remove = (traktorId: number) => {
        emit('remove', traktorId);
      };
      return {
        lastTraktorIndex,
        firstTraktorIndex,
        traktors,
        remove,
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
