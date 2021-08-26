<template>
  <FieldGroup class="max-w-lg">
    <FieldLegend>Pickup</FieldLegend>
    <FieldGroup
      v-for="(pickup, pickupI) in pickups"
      :key="pickupI"
      class="relative col-span-full max-w-2xl"
    >
      <FieldInput
        class="col-span-6 lg:col-span-4"
        fieldName="pickupId"
        placeholder="Patente"
        :title="pickupI === firstIndex ? 'ID Pickup' : null"
        :data="pickup.pickupId"
        @update:data="pickup.pickupId = $event"
      />
      <FieldInput
        class="col-span-6"
        fieldName="description"
        placeholder="Descripción de pickup"
        :title="pickupI === firstIndex ? 'Descripción' : null"
        :data="pickup.description"
        @update:data="pickup.description = $event"
      />
      <span
        v-if="pickups.length > 1 && pickupI !== lastIndex"
        class="flex items-center col-span-2"
      >
        <CircularBtn
          class="btn__delete"
          size="sm"
          @click="remove(pickup.innerId)"
        >
          <Icon icon="Trash" class="w-5 h-5" />
        </CircularBtn>
        {{ pickup.innerId }}
      </span>
    </FieldGroup>
    <button class="mt-1 flex items-center col-span-6" @click.prevent="add">
      <CircularBtn class="btn__add" size="xs">
        <Icon icon="Plus" class="w-5 h-5" />
      </CircularBtn>
      <span class="font-bold"> Agregar pickup </span>
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
    name: 'woPickupField',
    components: {
      FieldInput,
      FieldGroup,
      FieldLegend,
      Icon,
      CircularBtn,
    },
    emits: ['update:pickups'],
    props: {
      pickups: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const pickups = useVModel(props, 'pickups', emit);
      const lastIndex = computed(() => {
        return props.pickups.length - 1;
      });
      const firstIndex = 0;
      const pickupInnerId = ref(0);
      pickups.value = pickups.value.map((pickup) => {
        pickupInnerId.value++;
        pickup.innerId = pickup.innerId ?? pickupInnerId.value;
        return pickup;
      });
      const remove = (id: number) => {
        pickups.value = pickups.value.filter(
          (pickup: Pickup) => pickup.innerId !== id
        );
      };
      const add = (): void => {
        pickupInnerId.value++;
        const newPickupId = pickupInnerId.value;
        pickups.value.push({
          id: newPickupId,
          pickupId: '',
          description: '',
        });
      };
      return {
        lastIndex,
        firstIndex,
        pickups,
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
