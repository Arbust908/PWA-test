<template>
  <tr>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-lg">
      {{ pos }} - 40
    </td>
    <template v-if="editing === Number(stage.id)">
      <td
        class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm"
        :id="`sandType${stage.id}`"
      >
        <FieldSelect
          fieldName="sandType1"
          placeholder="Seleccionar"
          endpoint="/sand"
          endpointKey="type"
          :data="stage.sandId1"
          @update:data="stage.sandId1 = $event"
        />
        <FieldWithSides
          fieldName="sandQuantity1"
          placeholder="Cantidad de Arena"
          type="number"
          :post="{ title: 'Peso en Toneladas', value: 't' }"
          :data="stage.quantity1"
          @update="stage.quantity1 = $event"
        />
      </td>
      <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
        <FieldSelect
          fieldName="sandType2"
          placeholder="Seleccionar"
          endpoint="/sand"
          endpointKey="type"
          :data="stage.sandId2"
          @update:data="stage.sandId2 = $event"
        />
        <FieldWithSides
          fieldName="sandQuantity2"
          placeholder="Cantidad de Arena"
          type="number"
          :post="{ title: 'Peso en Toneladas', value: 't' }"
          :data="stage.quantity2"
          @update="stage.quantity2 = $event"
        />
      </td>
      <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
        <FieldSelect
          fieldName="sandType3"
          placeholder="Seleccionar"
          endpoint="/sand"
          endpointKey="type"
          :data="stage.sandId3"
          @update:data="stage.sandId3 = $event"
        />
        <FieldWithSides
          fieldName="sandQuantity3"
          placeholder="Cantidad de Arena"
          type="number"
          :post="{ title: 'Peso en Toneladas', value: 't' }"
          :data="stage.quantity3"
          @update="stage.quantity3 = $event"
        />
      </td>
    </template>
    <template v-else>
      <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
        <template
          v-if="(sands.length > 0 && stage.sandId1 >= 0) || stage.quantity1 > 0"
        >
          <p v-if="sands.length > 0 && stage.sandId1 >= 0">
            {{ getSand(stage.sandId1)?.type }}
          </p>
          <p v-if="stage.quantity1 > 0">{{ stage.quantity1 }}t</p>
        </template>
        <template v-else>
          <p>No hay arena</p>
        </template>
      </td>
      <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
        <template
          v-if="(sands.length > 0 && stage.sandId2 >= 0) || stage.quantity2 > 0"
        >
          <p v-if="sands.length > 0 && stage.sandId2 >= 0">
            {{ getSand(stage.sandId2)?.type }}
          </p>
          <p v-if="stage.quantity2 > 0">{{ stage.quantity2 }}t</p>
        </template>
        <template v-else>
          <p>No hay arena</p>
        </template>
      </td>
      <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm">
        <template
          v-if="(sands.length > 0 && stage.sandId3 >= 0) || stage.quantity3 > 0"
        >
          <p v-if="sands.length > 0 && stage.sandId3 >= 0">
            {{ getSand(stage.sandId3)?.type }}
          </p>
          <p v-if="stage.quantity3 > 0">{{ stage.quantity3 }}t</p>
        </template>
        <template v-else>
          <p>No hay arena</p>
        </template>
      </td>
    </template>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap font-bold text-center">
      {{ totalWheight }}t
      <!-- Mecanica de x/total para ir agregando / descontando -->
    </td>

    <td class="px-1 py-4 whitespace-nowrap text-sm">
      <Pill :type="pill.status">
        {{ pill.name }}
      </Pill>
    </td>
    <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div>
        <button
          @click.prevent="duplicateStage"
          class="action duplicate"
          title="Duplicar"
        >
          <Icon icon="DocumentDuplicate" class="w-6 h-6" />
          <span class="sr-only">Duplicar</span>
        </button>
        <button
          v-if="editing !== Number(stage.id)"
          @click.prevent="editStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
          title="Editar"
        >
          <Icon icon="PencilAlt" class="w-6 h-6" />
          <span class="sr-only">Editar</span>
        </button>
        <button
          v-else
          @click.prevent="saveStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
          title="Guardar"
        >
          <Icon icon="Save" class="w-6 h-6" />
          <span class="sr-only">Guardar</span>
        </button>
        <button
          @click.prevent="deleteStage"
          :disabled="stage.status > 0 || stage.stage === 1"
          class="action delete text-gray-600 hover:text-red-800 p-2"
          title="Borrar"
        >
          <Icon icon="Trash" class="w-6 h-6" />
          <span class="sr-only">Borrar</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, computed } from 'vue';
  import Pill from '@/components/ui/Pill.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
  import { Sand } from '@/interfaces/sandflow';

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
      pos: {
        type: Number,
        required: true,
      },
    },
    components: {
      Icon,
      Pill,
      FieldSelect,
      FieldWithSides,
    },
    setup(props, { emit }) {
      const { stage, editing, sands, pos } = toRefs(props);
      stage.value.stage = pos.value;

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
