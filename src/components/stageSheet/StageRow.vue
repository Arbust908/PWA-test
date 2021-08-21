<template>
  <tr>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-lg">
      {{ stage.stage }} - 40
    </td>
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm"
      :id="`sandType${stage.id}`"
    >
      <FieldSelect
        class="col-span-6"
        fieldName="sandType1"
        placeholder="Seleccionar"
        endpoint="/sand"
        endpointKey="type"
        :data="stage.sandId1"
        @update:data="stage.sandId1 = $event"
      />
      <div class="amountWrapper">
        <input
          v-model.number="stage.quantity1"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length > 0 && stage.sandId1 >= 0">
        {{ getSand(stage.sandId1)?.type }}
      </p>
      <p v-else></p>
      <p v-if="stage.quantity1 > 0">{{ stage.quantity1 }}t</p>
    </td>
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm max-w-[120px]"
    >
      <FieldSelect
        class="col-span-6"
        fieldName="sandType2"
        placeholder="Seleccionar"
        endpoint="/sand"
        endpointKey="type"
        :data="stage.sandId2"
        @update:data="stage.sandId2 = $event"
      />
      <div class="amountWrapper">
        <input
          v-model.number="stage.quantity2"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length > 0 && stage.sandId2 > 0">
        {{ getSand(stage.sandId2)?.type }}
      </p>
      <p v-else></p>
      <p v-if="stage.quantity2 > 0">{{ stage.quantity2 }}t</p>
    </td>
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm max-w-[120px]"
    >
      <FieldSelect
        class="col-span-6"
        fieldName="sandType3"
        placeholder="Seleccionar"
        endpoint="/sand"
        endpointKey="type"
        :data="stage.sandId3"
        @update:data="stage.sandId3 = $event"
      />
      <div class="amountWrapper">
        <input
          v-model.number="stage.quantity3"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length > 0 && stage.sandId3 > 0">
        {{ getSand(stage.sandId3)?.type }}
      </p>
      <p v-else></p>
      <p v-if="stage.quantity3 > 0">{{ stage.quantity3 }}t</p>
    </td>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap font-bold text-center">
      {{ totalWheight }}t
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, computed } from 'vue';
  import Pill from '@/components/ui/Pill.vue';
  import { Sand } from '@/interfaces/sandflow';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';

  export default defineComponent({
    props: {
      stage: {
        type: Object,
        required: true,
      },
      editing: {
        type: Number,
        required: true,
      },
      sands: {
        type: Array,
        required: true,
      },
    },
    components: {
      Pill,
      FieldSelect,
    },
    setup(props, { emit }) {
      const { stage, editing, sands } = toRefs(props);
      console.log(sands);

      const totalWheight = computed(() => {
        return (
          stage.value.quantity1 +
            stage.value.quantity2 +
            stage.value.quantity3 || 0
        );
      });
      const getSand = (sandId: number) => {
        return (
          sands.value.find((sand: Sand) => {
            return sand.id === sandId;
          }) || { tpye: '' }
        );
      };

      const editStage = () => {
        emit('editStage', stage.value);
      };
      const saveStage = () => {
        emit('saveStage', stage.value);
      };
      const duplicateStage = () => {
        emit('duplicateStage', stage.value);
      };
      const deleteStage = () => {
        emit('deleteStage', stage.value);
      };
      const upgrade = () => {
        if (stage.value.status >= 2) {
          console.error('Reset status');
          stage.value.status = 0;
          return;
        }
        stage.value.status++;
      };

      const pill = reactive({
        status:
          stage.value.status === 2
            ? 'finished'
            : stage.value.status === 1
            ? 'idle'
            : 'empty',
        name:
          stage.value.status === 2
            ? 'Finalizada'
            : stage.value.status === 1
            ? 'En Progreso'
            : 'Creada',
      });

      return {
        stage,
        editing,
        sands,
        totalWheight,
        getSand,
        duplicateStage,
        deleteStage,
        editStage,
        saveStage,
        upgrade,
        pill,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 mt-1 flex shadow-sm;
  }
  .amountWrapper {
    @apply mt-1 flex rounded shadow-sm;
  }
  .amountInput {
    @apply flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm;
  }
  .amountInput__unit {
    @apply inline-flex items-center px-3 rounded-r border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm;
  }
  .action {
    @apply text-gray-600 p-2;
  }
  .action.duplicate:not(:disabled):hover {
    @apply text-green-700;
  }
  .action.edit:not(:disabled):hover {
    @apply text-blue-700;
  }
  .action.delete:not(:disabled):hover {
    @apply text-red-700;
  }
  .action:disabled {
    @apply text-gray-400;
  }
</style>
