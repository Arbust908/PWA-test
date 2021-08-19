<template>
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
      mask="#*"
      :data="pickup.pickupId"
      @update:data="pickup.pickupId = $event"
    />
    <FieldInput
      class="col-span-6"
      fieldName="description"
      placeholder="Descripción de pickup"
      :title="pickupI === firstIndex ? 'Descripción' : null"
      mask="S*"
      :data="pickup.description"
      @update:data="pickup.description = $event"
    />
    <!-- Span Proxy para que pueda "Contener" el boton -->
    <span
      v-if="pickups.length > 1 && pickupI !== lastIndex"
      class="flex items-center col-span-2"
    >
      <CircularBtn class="btn__delete" size="sm" @click="remove(pickup.id)">
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
  import CircularBtn from '@/components/ui/CircularBtn.vue';

  export default defineComponent({
    name: 'woPickupField',
    components: {
      FieldInput,
      FieldGroup,
      Icon,
      CircularBtn,
    },
    emits: ['remove'],
    props: {
      pickups: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const lastIndex = computed(() => {
        return props.pickups.length - 1;
      });
      const firstIndex = 0;
      const remove = (id: number) => {
        emit('remove', id);
      };
      return {
        lastIndex,
        firstIndex,
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
