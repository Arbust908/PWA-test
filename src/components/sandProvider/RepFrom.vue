<template>
  <FieldGroup>
    <FieldLegend>Contacto principal</FieldLegend>
    <FieldInput
      class="col-span-full"
      title="Nombre y Apellido"
      fieldName="sandRepName"
      placeholder="Ingresar Nombre y Apellido"
      :data="repName"
      @update:data="repName = $event"
      requireValidation
      @update-validation-state="updateValidationState"
    />
    <FieldInput
      class="col-span-full"
      title="Teléfono"
      fieldName="sandRepPhone"
      placeholder="+11 1234 5678"
      mask="#*"
      :data="repPhone"
      @update:data="repPhone = $event"
      requireValidation
      validationType="numeric"
      @update-validation-state="updateValidationState"
    />
    <FieldInput
      class="col-span-full"
      title="Email"
      fieldName="sandRepEmail"
      placeholder="empresa@mail.com"
      :data="repEmail"
      @update:data="repEmail = $event"
      requireValidation
      validationType="email"
      @update-validation-state="updateValidationState"
    />
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useVModels } from '@vueuse/core';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  export default defineComponent({
    components: {
      FieldGroup,
      FieldInput,
      FieldTextArea,
      FieldLegend,
      Icon,
    },
    props: {
      repName: {
        type: String,
        default: '',
      },
      repPhone: {
        type: String,
        default: '12345678901',
      },
      repEmail: {
        type: String,
        default: '',
      },
    },
    setup(props, { emit }) {
      const { repName, repPhone, repEmail } = useVModels(props, emit);

      const updateValidationState = (data: Object) => {
        emit('update-validation-state',{fieldName: data.fieldName,validationsPassed: data.validationsPassed})
      }

      return { repName, repPhone, repEmail, updateValidationState };
    },
  });
</script>
