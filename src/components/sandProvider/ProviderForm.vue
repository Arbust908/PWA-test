<template>
  <FieldGroup>
    <FieldInput
      class="col-span-full"
      title="Nombre / Razón Social"
      fieldName="sandProvName"
      placeholder="Ingresar Nombre / Razón Social"
      :data="spName"
      @update:data="spName = $event"
    />
    <FieldInput
      class="col-span-full"
      title="CUIT / CUIL"
      fieldName="sandProvId"
      placeholder="Ingresar CUIT / CUIL"
      mask="###########"
      :data="spLegalId"
      @update:data="spLegalId = Number($event)"
    />
    <FieldInput
      class="col-span-full"
      title="Domicilio"
      fieldName="sandProvAddress"
      placeholder="Ingresar domicilio"
      :data="spAddress"
      @update:data="spAddress = $event"
    />
    <label class="col-span-full" for="meshType">
      <span>Tipo de malla</span>
      <div class="mb-4">
        <div
          class="flex items-center"
          v-for="(mesh, i) in spMeshTypes"
          :key="i"
        >
          <input class="input readonly" type="text" :value="mesh" readonly />
          <Icon
            icon="Trash"
            type="outline"
            class="ml-3 w-5 h-5 cursor-pointer"
            @click="deleteMeshType(mesh)"
          />
        </div>
      </div>
      <div class="flex items-center">
        <input
          class="input"
          type="text"
          name="meshType"
          v-model="spMesh"
          placeholder="Ingrese tipo de malla"
        />
        <Icon
          icon="Plus"
          type="outline"
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
  import { defineComponent } from 'vue';
  import { useVModels } from '@vueuse/core';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';

  export default defineComponent({
    components: {
      FieldGroup,
      FieldInput,
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
      const deleteMeshType = (mesh) => {
        spMeshTypes.value.filter((m) => {
          return m !== mesh;
        });
      };
      const addMeshType = (mesh) => {
        spMeshTypes.value.push(mesh);
        spMesh.value = '';
      };
      return {
        deleteMeshType,
        addMeshType,
        spName,
        spLegalId,
        spAddress,
        spMeshTypes,
        spMesh,
        spObs,
      };
    },
  });
</script>
