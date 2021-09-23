<template>
  <form method="POST" action="/" class="p-4 max-w-lg">
    <FieldGroup>
      <FieldInput
        class="col-span-full"
        fieldName="transportName"
        placeholder="Ingresar Nombre / Razón Social"
        title="Nombre / Razón Social"
        :data="tpName"
        @update:data="tpName = $event"
      />
      <FieldInput
        class="col-span-full"
        fieldName="transportId"
        placeholder="Ingresar CUIT / CUIL"
        title="CUIT / CUIL"
        mask="#*"
        :data="tpId"
        @update:data="tpId = $event"
      />
      <FieldInput
        class="col-span-full"
        fieldName="address"
        placeholder="Ingresar Domicilio"
        title="Domicilio"
        :data="tpAddress"
        @update:data="tpAddress = $event"
      />
      <FieldTextArea
        class="col-span-full"
        fieldName="observations"
        placeholder="Observaciones..."
        title="Observaciones"
        :rows="5"
        isFixed
        isOptional
        :data="tpObservations"
        @update:data="tpObservations = $event"
      />
    </FieldGroup>
    <FieldGroup>
      <FieldLegend>Contacto principal</FieldLegend>
      <FieldInput
        class="col-span-full"
        title="Nombre y Apellido"
        fieldName="repName"
        placeholder="Ingresar Nombre y Apellido"
        :data="crName"
        @update:data="crName = $event"
      />
      <FieldInput
        class="col-span-full"
        title="Teléfono"
        fieldName="repTel"
        placeholder="+11 1234 5678"
        mask="#*"
        :data="crPhone"
        @update:data="crPhone = $event"
      />
      <FieldInput
        class="col-span-full"
        title="Email"
        fieldName="repEmail"
        placeholder="empresa@mail.com"
        :data="crEmail"
        @update:data="crEmail = $event"
      />
    </FieldGroup>
  </form>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import { useVModels } from '@vueuse/core';
  export default defineComponent({
    props: {
      tpName: {
        type: String,
        default: '',
      },
      tpId: {
        type: [String, Number],
        default: '12345678901',
      },
      tpAddress: {
        type: String,
        default: '',
      },
      tpObservations: {
        type: String,
        default: '',
      },
      crName: {
        type: String,
        default: '',
      },
      crPhone: {
        type: String,
        default: '123456789',
      },
      crEmail: {
        type: String,
        default: '',
      },
    },
    components: {
      FieldGroup,
      FieldInput,
      FieldLegend,
      FieldTextArea,
    },
    setup(props, { emit }) {
      const {
        tpName,
        tpId,
        tpAddress,
        tpObservations,
        crName,
        crPhone,
        crEmail,
      } = useVModels(props, emit);
      return {
        tpName,
        tpId,
        tpAddress,
        tpObservations,
        crName,
        crPhone,
        crEmail,
      };
    },
  });
</script>
