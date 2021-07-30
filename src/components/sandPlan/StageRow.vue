<template>
  <tr>
    <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-lg">
      {{ stage.stage }} - 40
    </td>
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm"
    >
      <select id="pit" v-model="stage.sandId" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
      <div class="amountWrapper">
        <input
          v-model="stage.quantity"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length < 0 && stage.sandId > 0">
        {{ sands.find((sand) => sand.id === stage.sandId).type || '-' }}
      </p>
      <p v-else>-</p>
      <p>{{ stage.quantity }}t</p>
    </td>
    <!-- /Tipos -->
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm"
    >
      <select id="pit" v-model="stage.sandId" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
      <div class="amountWrapper">
        <input
          v-model="stage.quantity"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length < 0 && stage.sandId > 0">
        {{ sands.find((sand) => sand.id === stage.sandId).type || '-' }}
      </p>
      <p v-else>-</p>
      <p>{{ stage.quantity }}t</p>
    </td>
    <!-- /Tipos -->
    <!-- Tipos -->
    <td
      v-if="editing === stage.id"
      class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm"
    >
      <select id="pit" v-model="stage.sandId" class="input" name="pit">
        <option disabled selected value="-1">Seleccionar</option>
        <option v-for="sand in sands" :key="sand.id" :value="sand.id">
          {{ sand.type }}
        </option>
      </select>
      <div class="amountWrapper">
        <input
          v-model="stage.quantity"
          type="number"
          name="sandQuantity"
          class="amountInput"
          placeholder="Cantidad de Arena"
          list="sandQuantity"
        />
        <span class="amountInput__unit" title="Peso en Toneladas"> t </span>
      </div>
    </td>
    <td v-else class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
      <p v-if="sands.length < 0 && stage.sandId > 0">
        {{ sands.find((sand) => sand.id === stage.sandId).type || '-' }}
      </p>
      <p v-else>-</p>
      <p>{{ stage.quantity }}t</p>
    </td>
    <!-- /Tipos -->
    <td class="text-gray-500 px-6 py-4 whitespace-nowrap font-bold">
      {{ totalWheight }}t
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm">
      <span
        v-if="stage.status === 0"
        class="
          flex
          justify-center
          rounded-full
          bg-gray-500
          text-white
          px-4
          w-28
        "
      >
        Creada
      </span>
      <span
        v-else-if="stage.status === 1"
        class="
          flex
          justify-center
          rounded-full
          bg-blue-500
          text-white
          px-4
          w-28
        "
      >
        En Progreso
      </span>
      <span
        v-else-if="stage.status === 2"
        class="
          flex
          justify-center
          rounded-full
          bg-green-600
          text-white
          px-4
          w-28
        "
      >
        Finalizada
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div>
        <button @click="duplicateStage" class="action duplicate">
          <DocumentDuplicateIcon class="w-6 h-6" />
          <span class="sr-only">Duplicar</span>
        </button>
        <button
          v-if="editing === stage.id"
          @click="editStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
        >
          <PencilAltIcon class="w-6 h-6" />
          <span class="sr-only">Editar</span>
        </button>
        <button
          v-else
          @click="saveStage"
          :disabled="stage.status > 0"
          class="action edit text-gray-600 hover:text-blue-800 p-2"
        >
          <PencilAltIcon class="w-6 h-6" />
          <span class="sr-only">Guardar</span>
        </button>
        <button
          @click="deleteStage"
          :disabled="stage.status > 0"
          class="action delete text-gray-600 hover:text-red-800 p-2"
        >
          <TrashIcon class="w-6 h-6" />
          <span class="sr-only">Borrar</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from 'vue';
  import {
    DocumentDuplicateIcon,
    PencilAltIcon,
    TrashIcon,
  } from '@heroicons/vue/solid';
  import { useVModel } from '@vueuse/core';

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
    },
    setup(props, { emit }) {
      const { stage, editing, sands } = toRefs(props);

      const totalWheight = sands.value.reduce(
        (acc, sand) => acc + sand.weight,
        0
      );

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

      return {
        stage,
        editing,
        sands,
        totalWheight,
        duplicateStage,
        deleteStage,
        editStage,
        saveStage,
      };
    },
  });
</script>

<style lang="scss">
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
