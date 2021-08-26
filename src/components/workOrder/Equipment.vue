<template>
  <form method="POST" action="/" class="p-4">
    <div class="flex flex-col md:flex-row gap-6 md:gap-8 xl:gap-16">
      <FieldGroup>
        <FieldLegend>Cradle</FieldLegend>
        <FieldSelect
          class="col-span-full"
          fieldName="operativeCradle"
          placeholder="Selecciona un operativo"
          title="Operativo"
          endpoint="/cradle"
          :data="operativeCradleId"
          @update:data="operativeCradleId = $event"
        />
        <FieldSelect
          class="col-span-full"
          fieldName="backupCradle"
          placeholder="Selecciona un backup"
          title="Backup"
          endpoint="/cradle"
          :data="backupCradleId"
          @update:data="backupCradleId = $event"
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLegend>Forklift</FieldLegend>
        <FieldSelect
          class="col-span-full"
          fieldName="operativeForklift"
          placeholder="Selecciona un operativo"
          title="Operativo"
          endpoint="/forklift"
          :data="operativeForkliftId"
          @update:data="operativeForkliftId = $event"
        />
        <FieldSelect
          class="col-span-full"
          fieldName="backupForklift"
          placeholder="Selecciona un backup"
          title="Backup"
          endpoint="/forklift"
          :data="backupForkliftId"
          @update:data="backupForkliftId = $event"
        />
      </FieldGroup>
    </div>
    <TracktoField :traktors="traktors" @update:traktors="traktors = $event" />
    <PickupField :pickups="pickups" @update:pickups="pickups = $event" />
    <FieldGroup class="max-w-lg">
      <FieldLegend>Equipamento</FieldLegend>
      <FieldInput
        class="col-span-4"
        fieldName="rigmats"
        placeholder="Rigmats"
        title="Rigmats"
        mask="#*"
        :data="rigmats"
        @update:data="rigmats = Number($event)"
      />
      <FieldInput
        class="col-span-4"
        fieldName="conex"
        placeholder="Conex"
        title="Conex"
        mask="#*"
        :data="conex"
        @update:data="conex = Number($event)"
      />
      <FieldInput
        class="col-span-4"
        fieldName="generators"
        placeholder="Generador de apoyo"
        title="Generador de apoyo"
        mask="#*"
        :data="generators"
        @update:data="generators = Number($event)"
      />
      <FieldInput
        class="col-span-4"
        fieldName="tower"
        placeholder="Torre de iluminación"
        title="Torre de iluminación"
        mask="#*"
        :data="tower"
        @update:data="tower = Number($event)"
      />
      <FieldInput
        class="col-span-4"
        fieldName="cabin"
        placeholder="Cabina de operador"
        title="Cabina de operador"
        mask="#*"
        :data="cabin"
        @update:data="cabin = Number($event)"
      />
    </FieldGroup>
  </form>
</template>

<script lang="ts">
  import { ref, watchEffect, defineComponent, computed } from 'vue';
  import { useVModels } from '@vueuse/core';
  import { useRoute } from 'vue-router';

  import Icon from '@/components/icon/TheAllIcon.vue';

  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import TracktoField from '@/components/workOrder/woTraktorField.vue';
  import PickupField from '@/components/workOrder/woPickupField.vue';

  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import { Pit } from '@/interfaces/sandflow';
  import { useApi } from '@/helpers/useApi';

  import '@/assets/button.scss';

  export default defineComponent({
    components: {
      FieldGroup,
      FieldSelect,
      FieldInput,
      FieldLegend,
      Icon,
      TracktoField,
      PickupField,
      CircularBtn,
    },
    props: {
      operativeCradleId: {
        type: Number,
        required: true,
      },
      backupCradleId: {
        type: Number,
        required: true,
      },
      operativeForkliftId: {
        type: Number,
        required: true,
      },
      backupForkliftId: {
        type: Number,
        required: true,
      },
      traktors: {
        type: Array,
        default: () => [],
      },
      pickups: {
        type: Array,
        default: () => [],
      },
      rigmats: {
        type: Number,
        required: true,
      },
      conex: {
        type: Number,
        required: true,
      },
      generators: {
        type: Number,
        required: true,
      },
      tower: {
        type: Number,
        required: true,
      },
      cabin: {
        type: Number,
        required: true,
      },
      isFull: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { emit }) {
      const {
        operativeCradleId,
        backupCradleId,
        operativeForkliftId,
        backupForkliftId,
        traktors,
        pickups,
        rigmats,
        conex,
        generators,
        tower,
        cabin,
        isFull,
      } = useVModels(props, emit);

      const firstTracktorFull = computed(() => {
        const trackto = traktors.value[0];
        return (
          trackto.chassis !== '' &&
          trackto.supplier !== '' &&
          trackto.description !== ''
        );
      });
      const firstPickupFull = computed(() => {
        const pickup = pickups.value[0];
        return pickup.pickup_id !== '' && pickup.description !== '';
      });

      watchEffect(() => {
        isFull.value = !!(
          operativeCradleId.value >= 0 &&
          operativeForkliftId.value >= 0 &&
          traktors.value.length &&
          pickups.value.length &&
          firstTracktorFull.value &&
          firstPickupFull.value &&
          conex.value >= 0 &&
          generators.value >= 0 &&
          rigmats.value >= 0 &&
          tower.value >= 0 &&
          cabin.value >= 0
        );
      });

      return {
        operativeCradleId,
        backupCradleId,
        operativeForkliftId,
        backupForkliftId,
        traktors,
        pickups,
        rigmats,
        conex,
        generators,
        tower,
        cabin,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
      /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
    }
    &__add {
      @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
  .input-block select,
  .input-block input {
    @apply w-full rounded mb-3 p-2;
  }

  .pit-block {
    @apply flex mt-1 items-center w-full mb-3;
    & select,
    & input {
      @apply rounded p-2 max-w-md inline-block w-full;
    }
  }

  fieldset {
    @apply mb-6;
  }
  label {
    @apply text-sm;
  }
</style>
