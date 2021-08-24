<template>
  <FieldGroup>
    <FieldInput
      class="col-span-full"
      title="Nombre y apellido"
      fieldName="driverName"
      placeholder="Ingresar conductor"
      :data="driverName"
      @update:data="driverName = $event"
    />
    <FieldInput
      class="col-span-full"
      fieldName="driverPhone"
      placeholder="+11 1234 5678"
      mask="#*"
      title="Teléfono"
      :data="driverPhone"
      @update:data="driverPhone = $event"
    />
    <FieldInput
      class="col-span-full"
      fieldName="driverEmail"
      placeholder="empresa@mail.com"
      title="Email"
      :data="driverEmail"
      @update:data="driverEmail = $event"
    />
    <FieldInput
      class="col-span-full"
      title="Tipo de transporte"
      fieldName="driverVehicleType"
      placeholder="Doble carga"
      :data="driverTType"
      @update:data="driverTType = $event"
    />
    <FieldInput
      class="col-span-full"
      title="Patente"
      fieldName="driverVehicleId"
      placeholder="patente"
      :data="driverTId"
      @update:data="driverTId = $event"
    />
    <FieldTextArea
      class="col-span-full"
      fieldName="observations"
      placeholder="Observaciones..."
      title="Observaciones"
      :rows="5"
      isFixed
      isOptional
      :data="driverObs"
      @update:data="driverObs = $event"
    />
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import { useVModels } from '@vueuse/core';
  export default defineComponent({
    props: {
      driverName: {
        type: String,
        default: '',
      },
      driverPhone: {
        type: String,
        default: '123456789',
      },
      driverEmail: {
        type: String,
        default: '',
      },
      driverTType: {
        type: String,
        default: '',
      },
      driverTId: {
        type: String,
        default: '',
      },
      driverObs: {
        type: String,
        default: '',
      },
    },
    components: {
      FieldGroup,
      FieldInput,
    },
    setup(props, { emit }) {
      const {
        driverName,
        driverPhone,
        driverEmail,
        driverTType,
        driverTId,
        driverObs,
      } = useVModels(props, emit);
      return {
        driverName,
        driverPhone,
        driverEmail,
        driverTType,
        driverTId,
        driverObs,
      };
    },
  });
</script>
