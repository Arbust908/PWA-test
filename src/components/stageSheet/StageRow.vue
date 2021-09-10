<template>
  <tr>
    <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-lg">
      {{ pos }} - 40
    </td>
    <template v-if="editing === Number(stage.id)" :key="stage.id">
      <SandTypeAmount
        :sandId="stage.sandId1"
        :quantity="stage.quantity1"
        mod="1"
        @update:sandId="stage.sandId1 = $event"
        @update:quantity="stage.quantity1 = $event"
      />
      <SandTypeAmount
        :sandId="stage.sandId2"
        :quantity="stage.quantity2"
        mod="2"
        @update:sandId="stage.sandId2 = $event"
        @update:quantity="stage.quantity2 = $event"
      />
      <SandTypeAmount
        :sandId="stage.sandId3"
        :quantity="stage.quantity3"
        mod="3"
        @update:sandId="stage.sandId3 = $event"
        @update:quantity="stage.quantity3 = $event"
      />
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
  import { defineComponent, toRefs, reactive, computed, ref, watch } from 'vue';
  import { useVModels } from '@vueuse/core';
  import Pill from '@/components/ui/Pill.vue';
  import { Sand } from '@/interfaces/sandflow';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import SandTypeAmount from '@/components/ui/SandTypeAmount.vue';
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const api = import.meta.env.VITE_API_URL || '/api';

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
      pos: {
        type: Number,
        default: 0,
      },
    },
    components: {
      Pill,
      FieldSelect,
      SandTypeAmount,
    },
    setup(props, { emit }) {
      const instance = axios.create({
        baseURL: api,
      });
      const { stage, editing } = useVModels(props, emit);
      const sands = ref([]);
      const { data } = useAxios('/sand', instance);
      watch(data, (api) => {
        if (api && api.data) {
          sands.value = api.data;
        }
      });

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
          }) || { type: '' }
        );
      };

      return {
        stage,
        editing,
        sands,
        totalWheight,
        getSand,
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
