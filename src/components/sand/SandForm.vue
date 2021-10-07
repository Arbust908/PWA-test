<template>
  <form method="POST" action="/" class="p-4">
    <FieldGroup>
      <FieldInput
        class="col-span-full"
        fieldName="sandMesh"
        placeholder="Ingrese tipo de malla"
        title="Tipo de malla"
        :data="type"
        @update:data="type = $event"
        requireValidation
        @update-validation-state="updateValidationState"
      />
      <FieldTextArea
        class="col-span-full"
        fieldName="observations"
        placeholder="Observaciones..."
        title="Observaciones"
        :rows="5"
        isOptional
        :data="description"
        @update:data="description = $event"
      />
    </FieldGroup>
  </form>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import { useVModels } from '@vueuse/core';
  export default defineComponent({
    components: {
      FieldGroup,
      FieldInput,
      FieldTextArea,
    },
    props: {
      type: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },
    setup(props, { emit }) {
      const { type, description } = useVModels(props, emit);

      const updateValidationState = (data: Object) => {
        emit('update-validation-state',{fieldName: data.fieldName,validationsPassed: data.validationsPassed})
      }

      return {
        type,
        description,
        updateValidationState
      };
    },
  });
</script>

<style></style>
