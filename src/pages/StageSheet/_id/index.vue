<template>
  <Layout class="relative">
    <header>
      <h1>
        <span>Stage sheet</span>
        <span>></span>
        <span>
          {{ currentStageSheet?.company?.name }}
        </span>
        <span>></span>
        <span>
          {{ currentStageSheet?.pit?.name }}
        </span>
      </h1>
    </header>
    <div class="grid gap-8 grid-cols-2 relative">
      <section class="panel col-span-full">
        <StageTable>
          <template #head>
            <StageHeader />
          </template>
          <template #body>
            <StageSheetStage
              v-for="(stage, key) in currentStageSheet.stages"
              :key="key"
              :pos="key + 1"
              :stage="stage"
              :editing="editingStage"
              @update:stage="stage = $event"
            />
          </template>
        </StageTable>
      </section>
    </div>
    <footer class="p-4 space-x-8 flex justify-end">
      <NoneBtn @click.prevent="$router.push('/stage-sheet')">
        Cancelar
      </NoneBtn>
      <PrimaryBtn
        type="submit"
        size="sm"
        class="p-4"
        :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
        :disabled="!isFull"
        @click.prevent="isFull && save()"
      >
        Guardar
      </PrimaryBtn>
    </footer>
  </Layout>
</template>

<script lang="ts">
  import {
    ref,
    Ref,
    reactive,
    computed,
    ComputedRef,
    watchEffect,
    watch,
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';

  import Icon from '@/components/icon/TheAllIcon.vue';
  import Pill from '@/components/ui/Pill.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';

  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import StageSheetStage from '@/components/stageSheet/StageRow.vue';
  import StageEmptyState from '@/components/stageSheet/StageEmptyState.vue';
  import StageHeader from '@/components/stageSheet/StageHeader.vue';
  import StageTable from '@/components/stageSheet/StageTable.vue';
  import DepositGrid from '@/components/depositDesign/Deposit.vue';
  import {
    Cradle,
    PurchaseOrder,
    Box,
  } from '@/interfaces/sandflow';
  import SideTabName from '@/components/stageSheet/sideTabName.vue';

  import { useApi } from '@/helpers/useApi';

  export default {
    components: {
      Layout,
      NoneBtn,
      CircularBtn,
      PrimaryBtn,
      StageSheetStage,
      StageEmptyState,
      StageHeader,
      Icon,
      Pill,
      FieldGroup,
      FieldSelect,
      FieldLoading,
      SideTabName,
      DepositGrid,
      ClientPitCombo,
      StageTable,
    },
    setup() {
      // Init
      const router = useRouter();
      const route = useRoute();
      const id = route.params.id;

      const { read: getStageSheet } = useApi(`/stageSheet/${id}`);
      const currentStageSheet = getStageSheet();
      watch( currentStageSheet, (newVal) => {
        if (newVal) {
          selectedCradle.value = newVal.operativeCradle;
          setLayoutDimensions(newVal.warehouse)
          warehouse.value = newVal.warehouse;
          editingStage.value = newVal.stages.length;
        }
      });

      const editingStage = ref(false);

      const selectedCradle = ref(null);
      const warehouse = ref();


      const chosenBox: Ref<Box> = ref({
        floor: 1,
        col: 0,
        row: 0,
        category: '',
      });
      const selectBox = (box: Box) => {
        chosenBox.value.value = box;
      };
      const moveBox = (box: Box) => {
        const myBox = warehouse.value.layout[`${box.floor}|${box.col}|${box.row}`].id = "";
      }
      /**
       * Este metodo se encarga de sacar la caja del slot en el que se encuentra
       * para poder ponerlo en un nuevo lugar
       *
       * @param cradle Toma un objeto cradele (despues del .value)
       * @param boxId El id de la caja que se quiere mover
       */
      const resetCradleSlots = (cradle: any, boxId: number | string) => {
        cradle.slots.map((slot: any) => {
          if (slot.boxId == boxId) {
            slot.boxId = null;
            slot.category = null;
          }
        });
      }
      const setBox = (slotPos: number) => {
        console.log(slotPos);
        if (selectedCradle.value) {
          resetCradleSlots(selectedCradle.value, chosenBox.value.id);
          // Si hay box lo ponemos
          const isValidBox = chosenBox?.value?.id;
          const isFreeSlot = selectedCradle.value.slots[slotPos].boxId == null || selectedCradle.value.slots[slotPos].boxId == "";
          if (isValidBox && isFreeSlot) {
            selectedCradle.value.slots[slotPos].category =
              chosenBox.value.category;
            selectedCradle.value.slots[slotPos].boxId = chosenBox.value.id;
            moveBox(chosenBox.value);
          } else  {
            // Tiramos un modal (?)
            if (isValidBox) {
              console.log('Ya hay una caja en el Slot');
            } else if (isFreeSlot) {
              console.log('No box selected');
            } else {
              console.log('Error')
            }
          }
        }
      };
      const setLayoutDimensions = (warehouse: any) => {
        console.group('setLayoutDimensions');
        console.log(warehouse);
        const deposit = formatDeposit(warehouse.layout);
        console.log(deposit);
        console.log(floor.value, col.value, row.value);
        floor.value = deposit.floor;
        col.value = deposit.col;
        row.value = deposit.row;
        console.log(floor.value, col.value, row.value);
        console.groupEnd();
      }
      const formatDeposit = (deposit) => {
        const dimensions = Object.keys(deposit).reduce(
          (dims, currentCell) => {
            const proxy = currentCell.split('|');
            const [floor, row, col] = proxy;
            dims.floor = Math.max(dims.floor, floor);
            dims.row = Math.max(dims.row, row);
            dims.col = Math.max(dims.col, col);
            return dims;
          },
          { floor: 0, row: 0, col: 0 }
        );
        dimensions.dimensions = `${dimensions.row} x ${dimensions.col}`;
        return dimensions;
      };
      const floor = ref(0);
      const row = ref(0);
      const col = ref(0);
      let visibleCategories = ref();


      const isFull = computed(() => {
        const noZeroSandTypeNull =
          (currentStage.sandId1 !== null &&
            currentStage.sandId1 !== -1) ||
          (currentStage.sandId2 !== null &&
            currentStage.sandId2 !== -1) ||
          (currentStage.sandId3 !== null &&
            currentStage.sandId3 !== -1);
        const noZeroSandTypeZero =
          currentStage.quantity1 !== 0 ||
          currentStage.quantity2 !== 0 ||
          currentStage.quantity3 !== 0;
        return !!(
          noZeroSandTypeNull &&
          noZeroSandTypeZero
        );
      });
      const save = (): void => {
        console.groupCollapsed('SAVE');
        // return console.log('DD');
        const { clientCompany, pit, ...newWarehouse} = warehouse.value;
        console.log('New Warehouse', newWarehouse);
        const { update: putWarehouse } = useApi('/warehouse');
        const { isFinished: wEnd } = putWarehouse(newWarehouse);

        const newCradle = selectedCradle.value;
        console.log('New Cradle', newCradle);
        const { update: putCradle } = useApi('/cradle');
        const { isFinished: cEnd } = putCradle(newCradle);


        const StSHId = currentStageSheet.value.id;
        currentStage.stageSheetId = StSHId;
        currentStage.sandId1 = currentStage.sandId1 === -1 ? null : currentStage.sandId1;
        currentStage.sandId2 = currentStage.sandId2 === -1 ? null : currentStage.sandId2;
        currentStage.sandId3 = currentStage.sandId3 === -1 ? null : currentStage.sandId3;
        console.log('New Stage', currentStage);
        const { create: makeStage } = useApi('/sandStage');
        const { data: newStage } = makeStage(currentStage);

        watch(newStage, (newVal) => {
          if (newVal && newVal.data) {
            console.log('Saved Stage', newVal.data);
            setTimeout(() => {
              console.groupEnd();
              router.push('/stage-sheet');
              return;
            }, 500);
          }
        });
      };
      return {
        currentStageSheet,
        save,
        isFull,
        warehouse,
        chosenBox,
        selectBox,
        floor,
        row,
        col,
        visibleCategories,
        setBox,
        selectedCradle,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/button.scss';
  header {
    @apply flex flex-col md:flex-row md:justify-between items-center md:mb-4;
  }
  h1 {
    @apply font-bold text-gray-900 text-xl self-start mb-3 md:mb-0 space-x-2;
  }
  .panel {
    @apply bg-white rounded-md shadow-sm border;
  }
  .cradle-grid {
    grid-template-columns: repeat(auto-fit, 6.25rem);
    @apply py-8 grid flex-wrap gap-4;
  }
  .cradle-slot {
    @apply w-[6.25rem] h-[6.25rem] rounded-lg border-2 border-dashed border-second-400 text-4xl font-bold text-second-300 flex justify-center items-center;
    &.ph {
      @apply border-second-300 text-second-200;
    }
    &:not(.ph) {
      @apply cursor-pointer;
    }
    &.thick,
    &.thin,
    &.cut {
      @apply text-2xl border-none shadow;
    }
    &.aisle {
      @apply bg-second-300 text-second-300;
    }
    &.fine {
      @apply bg-orange-600 text-orange-800;
    }
    &.thick {
      @apply bg-green-600 text-green-800;
    }
    &.cut {
      @apply bg-blue-600 text-blue-800;
    }
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
</style>
