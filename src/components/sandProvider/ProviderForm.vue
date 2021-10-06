<template>
  <FieldGroup>
    <FieldInput
      class="col-span-full"
      title="Nombre / Razón Social"
      fieldName="sandProvName"
      placeholder="Ingresar Nombre / Razón Social"
      :data="spName"
      @update:data="spName = $event"
      requireValidation
      @update-validation-state="updateValidationState"
    />
    <FieldInput
      class="col-span-full"
      title="CUIT / CUIL"
      fieldName="sandProvId"
      placeholder="Ingresar CUIT / CUIL"
      mask="#*"
      :data="spLegalId"
      @update:data="spLegalId = Number($event)"
      requireValidation
      validationType="extension"
      :charAmount="{min: 11,max:11}"
      @update-validation-state="updateValidationState"
    />
    <FieldInput
      class="col-span-full"
      title="Domicilio"
      fieldName="sandProvAddress"
      placeholder="Ingresar domicilio"
      :data="spAddress"
      @update:data="spAddress = $event"
      requireValidation
      @update-validation-state="updateValidationState"
    />
    <label class="col-span-full" for="meshType">
      <span>Tipo de malla</span>
      <div class="mb-4">
        <div
          class="flex items-center"
          v-for="(mesh, i) in spMeshTypes"
          :key="i"
        >
          <FieldInput
            class="col-span-7"
            fieldName="mesh"
            placeholder="Malla"
            isReadonly
            :data="mesh.type"
          />
          <Icon
            icon="Trash"
            type="outline"
            size="lg"
            class="ml-3 w-5 h-5 cursor-pointer"
            @click="deleteMeshType(i)"
          />
        </div>
      </div>
      <div class="flex items-center">
        <FieldSelect
          fieldName="sandType1"
          placeholder="Seleccionar"
          endpoint="/sand"
          endpointKey="type"
          :data="spMesh"
          @update:data="spMesh = $event"
        />
        <Icon
          icon="Plus"
          type="outline"
          size="lg"
          class="ml-3 w-5 h-5 cursor-pointer"
          @click="addMeshType(spMesh)"
        />
      </div>
    </label>
    <FieldTextArea
      class="col-span-full"
      fieldName="observations"
      placeholder="Observaciones..."
      title="Observaciones"
      :rows="5"
      isFixed
      isOptional
      :data="spObs"
      @update:data="spObs = $event"
    />
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent, onMounted, watchEffect } from 'vue';
  import { useVModels } from '@vueuse/core';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  export default defineComponent({
    components: {
      FieldGroup,
      FieldInput,
      FieldSelect,
      FieldTextArea,
      Icon,
    },
    props: {
      spName: {
        type: String,
        default: '',
      },
      spLegalId: {
        type: Number,
        default: 12345678901,
      },
      spAddress: {
        type: String,
        default: '',
      },
      spMeshTypes: {
        type: Array,
        default: () => [],
      },
      spMesh: {
        type: String,
        default: '',
      },
      spObs: {
        type: String,
        default: '',
      },
    },
    setup(props, { emit }) {
      const { spName, spLegalId, spAddress, spMeshTypes, spMesh, spObs } =
        useVModels(props, emit);

      const deleteMeshType = (index: Number) => {
        emit('delete-mesh-type',index)
      };

      const addMeshType = (mesh: Object) => {
        emit('add-mesh-type',mesh)
      };

      const updateValidationState = (data: Object) => {
        emit('update-validation-state',{fieldName: data.fieldName,validationsPassed: data.validationsPassed})
      }

      watchEffect(() => {
        if(spMesh.value !== 0 && spMesh.value !== "") {
          addMeshType(spMesh.value)
        }
      })

      return {
        deleteMeshType,
        addMeshType,
        spName,
        spLegalId,
        spAddress,
        spMeshTypes,
        spMesh,
        spObs,
        updateValidationState
      };
    },
  });
</script>
