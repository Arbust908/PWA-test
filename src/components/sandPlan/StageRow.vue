<template>
  <tr>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-lg">
      {{ stage.stage }} - 40
    </td>
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm"
      :id="`sandType${stage.id}`"
    >
      <select id="pit" v-model="stage.sandId1" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
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
    <!-- /Tipos -->
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm"
    >
      <select id="pit" v-model="stage.sandId2" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
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
    <!-- /Tipos -->
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm"
    >
      <select id="pit" v-model="stage.sandId3" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
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
    <!-- /Tipos -->
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap font-bold text-center">
      {{ totalWheight }}t
      <!-- Mecanica de x/total para ir agregando / descontando -->
    </td>

    <td class="px-1 py-4 whitespace-nowrap text-sm">
      <!-- Atar el cambio de estado a el x sobre total -->
      <span v-if="stage.status === 0" class="pill bg-gray-500"> Creada </span>
      <span v-else-if="stage.status === 1" class="pill bg-blue-500">
        En Progreso
      </span>
      <span v-else-if="stage.status === 2" class="pill bg-green-600">
        Finalizada
      </span>
    </td>
    <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div>
        <button
          @click.prevent="upgrade"
          class="action duplicate"
          title="Mejorar"
        >
          <ReceiptRefundIcon class="w-6 h-6" />
          <span class="sr-only">Mejorar</span>
        </button>
        <button
          @click.prevent="duplicateStage"
          class="action duplicate"
          title="Duplicar"
        >
          <DocumentDuplicateIcon class="w-6 h-6" />
          <span class="sr-only">Duplicar</span>
        </button>
        <button
          v-if="editing !== stage.id"
          @click.prevent="editStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
          title="Editar"
        >
          <PencilAltIcon class="w-6 h-6" />
          <span class="sr-only">Editar</span>
        </button>
        <button
          v-else
          @click.prevent="saveStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
          title="Guardar"
        >
          <SaveIcon class="w-6 h-6" />
          <span class="sr-only">Guardar</span>
        </button>
        <button
          @click.prevent="deleteStage"
          :disabled="stage.status > 0"
          class="action delete text-gray-600 hover:text-red-800 p-2"
          title="Borrar"
        >
          <TrashIcon class="w-6 h-6" />
          <span class="sr-only">Borrar</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs, ref, computed } from 'vue';
  import {
    DocumentDuplicateIcon,
    PencilAltIcon,
    TrashIcon,
    SaveIcon,
    ReceiptRefundIcon,
  } from '@heroicons/vue/solid';
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
    },
    components: {
      DocumentDuplicateIcon,
      PencilAltIcon,
      TrashIcon,
      SaveIcon,
      ReceiptRefundIcon,
    },
    setup(props, { emit }) {
      const { stage, editing, sands } = toRefs(props);

      const totalWheight = computed(() => {
        return (
          stage.value.quantity1 + stage.value.quantity2 + stage.value.quantity3
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
      };
    },
  });
</script>

<style lang="scss" scoped>
  .pill {
    @apply flex justify-center rounded-full text-white px-1 w-28;
  }
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
