<template>
  <FieldGroup class="max-w-2xl">
    <FieldLegend>Tractor / Chasis</FieldLegend>
    <FieldGroup
      v-for="(traktor, traktorI) in traktors"
      :key="traktorI"
      class="relative col-span-full max-w-2xl"
    >
      <FieldInput
        class="col-span-full sm:col-span-6 lg:col-span-3"
        fieldName="chassis"
        placeholder="Id de tractor"
        :title="traktorI === firstTraktorIndex ? 'ID Tractor/Chasis' : null"
        :data="traktor.chassis"
        @update:data="traktor.chassis = $event"
      />
      <FieldInput
        class="col-span-full sm:col-span-6 lg:col-span-5"
        fieldName="supplier"
        placeholder="Proveedor de tractor"
        :title="traktorI === firstTraktorIndex ? 'Proveedor' : null"
        :data="traktor.supplier"
        @update:data="traktor.supplier = $event"
      />
      <FieldInput
        class="col-span-full sm:col-span-6 lg:col-span-4"
        :title="traktorI === firstTraktorIndex ? 'Descripción' : null"
        fieldName="description"
        placeholder="Descripción de tractor"
        isOptional
        :data="traktor.description"
        @update:data="traktor.description = $event"
      />
      <span
        v-if="traktors.length > 1 && traktorI !== lastTraktorIndex"
        :class="traktorI === firstTraktorIndex ? 'lg:bottom-6' : 'lg:top-3'"
        class="
          flex
          justify-center
          items-center
          col-span-2
          lg:absolute lg:-right-16
        "
      >
        <CircularBtn class="btn__delete" @click="remove(traktor.innerId)">
          <Icon icon="Trash" class="w-6 h-6" />
        </CircularBtn>
      </span>
    </FieldGroup>
    <button
      class="mt-1 flex items-center col-span-full sm:col-span-6"
      @click.prevent="add"
    >
      <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
      <span class="font-bold"> Agregar tractor/chasis </span>
    </button>
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import { useVModel } from '@vueuse/core';

  export default defineComponent({
    name: 'woTraktorField',
    components: {
      FieldInput,
      FieldGroup,
      FieldLegend,
      Icon,
      CircularBtn,
    },
    emits: ['update:traktors'],
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
      const tracktorInnerId = ref(0);
      traktors.value = traktors.value.map((traktor) => {
        tracktorInnerId.value++;
        traktor.innerId = traktor.innerId ?? tracktorInnerId.value;
        return traktor;
      });
      const remove = (traktorId: number) => {
        traktors.value = traktors.value.filter(
          (traktor: Traktor) => traktor.innerId !== traktorId
        );
      };
      const add = (): void => {
        tracktorInnerId.value++;
        const newTraktorId = tracktorInnerId.value;
        traktors.value.push({
          innerId: newTraktorId,
          chassis: '',
          supplier: '',
          description: '',
        });
      };
      if (traktors?.value?.length === 0) {
        add();
      }
      return {
        lastTraktorIndex,
        firstTraktorIndex,
        traktors,
        remove,
        add,
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
