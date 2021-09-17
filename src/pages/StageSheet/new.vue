<template>
  <Layout class="relative">
    <header>
      <h1>
        Stage sheet
      </h1>
    </header>
    <div class="grid gap-8 grid-cols-2 relative">
      <FieldGroup class="col-span-full gap-x-6 py-0 max-w-xl">
        <ClientPitCombo
          :clientId="currentStageSheet.companyId"
          :pitId="currentStageSheet.pitId"
          @update:clientId="currentStageSheet.companyId = $event"
          @update:pitId="currentStageSheet.pitId = $event"
        />
      </FieldGroup>
      <section class="panel col-span-full">
        <StageTable>
          <template #head>
            <StageHeader />
          </template>
          <template #body>
            <StageSheetStage
              v-for="(stage, Key) in currentStageSheet.stages"
              :key="Key"
              :pos="Key + 1"
              :stage="stage"
              :editing="editingStage"
              @update:stage="stage = $event"
            />
          </template>
        </StageTable>
      </section>
      <section class="panel col-span-1">
        <article class="p-6">
          <h3 class="font-bold text-xl">Depósito</h3>
          <div>
            <div class="text-center">
              <span
                v-if="warehouse && warehouse.error"
                class="
                  inline-block
                  px-5
                  py-8
                  rounded-lg
                  border-2 border-second-300 border-dashed
                  text-center
                  mx-6
                  my-12
                  xl:mx-16 xl:my-20
                "
              >
                {{ warehouse.error }}
              </span>
              <span v-else-if="warehouse" class="px-5 py-8 text-center m-4">
                <DepositGrid
                  class="w-full flex flex-col gap-5"
                  :selectedBox="choosedBox"
                  :rows="row"
                  :cols="col"
                  :floor="floor"
                  :deposit="warehouse.layout"
                  :visibleCategories="visibleCategories"
                  @select-box="selectBox"
                />
              </span>
              <span
                v-else
                class="
                  inline-block
                  px-5
                  py-8
                  rounded-lg
                  border-2 border-second-300 border-dashed
                  text-center
                  mx-6
                  my-12
                  xl:mx-16 xl:my-20
                "
              >
                Selecciones cliente y pozo para comenzar
              </span>
            </div>
          </div>
        </article>
      </section>
      <section class="panel col-span-1">
        <article class="p-6">
          <h3 class="font-bold text-xl mb-6">Estaciones</h3>
          <div>
            <FieldSelect
              v-if="cradles.length > 0"
              class="max-w-[200px]"
              fieldName="cradle"
              placeholder="Seleccionar cradle"
              :endpointData="cradles"
              :data="currentStageSheet.cradleId"
              @update:data="currentStageSheet.cradleId = $event"
            />
            <FieldLoading :title="false" class="max-w-[200px]" v-else />
          </div>
          <div v-if="currentStageSheet.cradleId == -1" class="cradle-grid">
            <div v-for="pos in 4" :key="pos" class="cradle-slot ph">
              {{ pos }}
            </div>
          </div>
          <div v-else class="cradle-grid">
            <div
              v-for="(slot, pos) in selectedCradle.slots"
              :key="pos"
              :class="slot.category ?? null"
              class="cradle-slot"
              @click="setBox(pos)"
            >
              {{ slot.boxId ?? pos + 1 }}
            </div>
          </div>
        </article>
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
    <!-- <button
      class="
        tab
        fixed
        right-0
        top-[40%]
        rounded-l-lg
        bg-second-0
        border
        w-10
        h-56
        flex
        justify-center
        items-center
        text-second-600
        transition-all
        duration-150
        ease-in-out
        hover:w-14
      "
    >
      <div class="">
        <SideTabName />
      </div>
    </button> -->
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
  import { useRouter } from 'vue-router';
  import { useTitle } from '@vueuse/core';

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
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import SideTabName from '@/components/stageSheet/sideTabName.vue';
  const api = import.meta.env.VITE_API_URL || '/api';

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
      const store = useStore();
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      useTitle('Nueva Stage Sheet <> Sandflow');
      const currentStageSheet = reactive({
        companyId: -1,
        pitId: -1,
        cradleId: -1,
        warehouseId: -1,
        operativeCradleId: null,
        backupCradleId: null,
        stages: [
          {
            id: 0,
            stage: 1,
            sandId1: -1,
            quantity1: 0,
            sandId2: -1,
            quantity2: 0,
            sandId3: -1,
            quantity3: 0,
            sandPlanId: null,
            status: 0,
          },
        ],
      });
      watch(currentStageSheet, (newVal) => {
        if (newVal && newVal.cradleId && newVal.cradleId !== -1) {
          console.log('NEW CRADLE', newVal.cradleId);
          console.log('selected Cradle', selectedCradle.value);
          console.log('cradles', cradles.value);
          selectedCradle.value = cradles.value.find(
            (cradle) => cradle.id == newVal.cradleId
          );
          console.log('NEW CRADLE', selectedCradle.value);
        }
      });
      const selectedCradle = ref(null);

      const editingStage = ref(0);

      const editStage = (stage) => {
        editingStage.value = stage.id;
      };
      const saveStage = (stage) => {
        currentStageSheet.stages[stage.id] = stage;
        editingStage.value = -1;
      };
      const duplicateStage = (stage) => {
        const lastStage =
          currentStageSheet.stages[currentStageSheet.stages.length - 1];
        const lastStageId = { id: lastStage.id + 1 };
        const lastStageStage = { stage: lastStage.stage + 1 };
        const newStatus = { status: 0 };
        const newStage = {
          ...stage,
          ...lastStageId,
          ...lastStageStage,
          ...newStatus,
        };
        currentStageSheet.stages.push(newStage);
        editStage(newStage);
      };
      const deleteStage = (stage) => {
        const stageId = stage.id;
        currentStageSheet.stages = currentStageSheet.stages.filter(
          (s) => s.id !== stageId
        );
      };
      // :: WAREHOUSE
      const warehouse = ref();
      const backupWarehouses = ref([]);
      const { data: warehousesData } = useAxios('/warehouse', instance);
      watch(warehousesData, (api) => {
        if (api && api.data) {
          backupWarehouses.value = api.data;
        }
      });
      const choosedBox: Ref<Box> = ref({
        floor: 1,
        col: 0,
        row: 0,
        category: '',
      });
      const selectBox = (box: Box) => {
        choosedBox.value = box;
      };
      const moveBox = (box: Box) => {
        const myBox = warehouse.value.layout[`${box.floor}|${box.col}|${box.row}`].id = "";
      }
      const setBox = (slotPos: number) => {
        console.log(slotPos);
        if (selectedCradle.value) {
          // Reset los slots
          selectedCradle.value.slots.map((slot) => {
            if (slot.boxId == choosedBox.value.id) {
              slot.boxId = null;
              slot.category = null;
            }
          });
          // Si hay box lo ponemos
          if (choosedBox.value.id) {
            selectedCradle.value.slots[slotPos].category =
              choosedBox.value.category;
            selectedCradle.value.slots[slotPos].boxId = choosedBox.value.id;
            moveBox(choosedBox.value);
          } else  {
            // Tiramos un modal (?)
            console.log('No box selected');
          }
        }
      };
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
      // << WAREHOUSE
      const purchaseOrder: Ref<PurchaseOrder> = ref({} as PurchaseOrder);

      const getPurchaseOrder = (companyId: number, pitId: number) => {
        const { data: purchaseOrdersData } = useAxios(
          '/purchaseOrder',
          instance
        );
        watch(purchaseOrdersData, (api) => {
          console.log(api);
          if (api && api.data) {
            purchaseOrder.value = api.data.filter((po) => {
              return po.companyId === companyId && po.pitId === pitId;
            });
            console.log(purchaseOrder.value);
          }
        });
        return purchaseOrder;
      };
      const clientPitComboSelected: Ref<boolean> = ref(false);
      watch(clientPitComboSelected, (value) => {
        if (value) {
          getPurchaseOrder(
            currentStageSheet.companyId,
            currentStageSheet.pitId
          );
          ableCradles(currentStageSheet.companyId, currentStageSheet.pitId);
          console.log(purchaseOrder.value);
        }
      });

      watchEffect(() => {
        if (
          currentStageSheet.companyId !== -1 &&
          currentStageSheet.pitId !== -1
        ) {
          clientPitComboSelected.value = true;
          warehouse.value = backupWarehouses.value.find((warehouse) => {
            return (
              warehouse.pitId == currentStageSheet.pitId &&
              warehouse.clientCompanyId == currentStageSheet.companyId
            );
          });
          if (!warehouse.value) {
            console.log('no warehouse');
            warehouse.value = {
              error: 'No hay depósito para este cliente y/o pozo',
            };
          } else {
            currentStageSheet.warehouseId = warehouse.value.id;
            const fDepo = formatDeposit(warehouse.value.layout);
            console.log(fDepo);
            floor.value = fDepo.floor;
            row.value = fDepo.row;
            col.value = fDepo.col;
          }
        }
      });
      let visibleCategories = ref();
      // :: CRADLES
      const cradles = ref([] as Array<Cradle>);
      const backupCradles = ref([] as Array<Cradle>);
      const { data: cradlesData } = useAxios('/cradle', instance);
      watch(cradlesData, (cradleApi) => {
        if (cradleApi && cradleApi.data) {
          backupCradles.value = cradleApi.data;
        }
      });
      const backupWorkorder = ref([] as Array<Cradle>);
      const { data: woData } = useAxios('/workOrder', instance);
      watch(woData, (cradleApi) => {
        if (cradleApi && cradleApi.data) {
          backupWorkorder.value = cradleApi.data;
        }
      });

      const ableCradles = (clientId: number, pitId: number) => {
        cradles.value = [];
        console.log('client :_ ' + clientId, 'pit :_ ' + pitId);
        console.log('BWO', backupWorkorder.value);
        const lasWO = backupWorkorder.value.find((wo) => {
          return (
            (wo.clientId == clientId || wo.client == clientId) &&
            wo.pits.some((pit) => {
              return pit.id == pitId;
            })
          );
        });
        console.log('Last Work Order', lasWO);
        console.log(
          lasWO.operativeCradle,
          lasWO.operativeCradleId,
          lasWO.backupCradle,
          lasWO.backupCradleId
        );
        console.log(cradles.value);
        cradles.value = backupCradles.value.filter((cradle) => {
          return (
            cradle.id == lasWO.operativeCradle ||
            cradle.id == lasWO.operativeCradleId ||
            cradle.id == lasWO.backupCradle ||
            cradle.id == lasWO.backupCradleId
          );
        });
        if (cradles.value.length === 0) {
          cradles.value = [{ id: -1, name: 'No hay cradles' }];
        }
        console.log(cradles.value);
      };
      // << CRADLES

      const isFull = computed(() => {
        const noZeroSandTypeNull =
          (currentStageSheet.stages[0].sandId1 !== null &&
            currentStageSheet.stages[0].sandId1 !== -1) ||
          (currentStageSheet.stages[0].sandId2 !== null &&
            currentStageSheet.stages[0].sandId2 !== -1) ||
          (currentStageSheet.stages[0].sandId3 !== null &&
            currentStageSheet.stages[0].sandId3 !== -1);
        const noZeroSandTypeZero =
          currentStageSheet.stages[0].quantity1 !== 0 ||
          currentStageSheet.stages[0].quantity2 !== 0 ||
          currentStageSheet.stages[0].quantity3 !== 0;
        return !!(
          currentStageSheet.companyId >= 0 &&
          currentStageSheet.pitId >= 0 &&
          currentStageSheet.cradleId >= 0 &&
          noZeroSandTypeNull &&
          noZeroSandTypeZero
        );
      });
      const save = (): void => {
        console.groupCollapsed('SAVE');
        const { stages, ...newStageSheet} = currentStageSheet;
        const stage = stages[0];
        newStageSheet.operativeCradleId = newStageSheet.cradleId;
        console.log('New Stage Sheet', newStageSheet);
        console.log('Stage', stage);
        const { data } = useAxios(
          '/stageSheet',
          { method: 'POST', data: newStageSheet },
          instance
        );
        // post new workshop
        const { clientCompany, pit, ...newWarehouse} = warehouse.value;
        console.log('New Warehouse', newWarehouse);
        const { isFinished: wEnd } = useAxios(
          `/warehouse/${newWarehouse.id}`,
          { method: 'PUT', data: newWarehouse },
          instance
        );
        const newCradle = selectedCradle.value;
        console.log('New Cradle', newCradle);
        const { isFinished: cEnd } = useAxios(
          `/cradle/${newCradle.id}`,
          { method: 'PUT', data: newCradle },
          instance
        );
        watch(data, (newVal) => {
          if (newVal && newVal.data) {
            console.log('Saved Stage Sheet', newVal.data);
            const StSHId = newVal.data.id;
            console.log('Saved StSheet Id', newVal.data.id);
            stage.stageSheetId = StSHId;
            stage.sandId1 = stage.sandId1 === -1 ? null : stage.sandId1;
            stage.sandId2 = stage.sandId2 === -1 ? null : stage.sandId2;
            stage.sandId3 = stage.sandId3 === -1 ? null : stage.sandId3;
            console.log('New Stage', stage);
            const { data } = useAxios(
              '/sandStage',
              { method: 'POST', data: stage },
              instance
            );
            watch(data, (newVal) => {
              if (newVal && newVal.data) {
                console.log('Saved Stage', newVal.data);
                setTimeout(() => {
                  console.groupEnd();
                  router.push('/stage-sheet');
                  return;
                }, 500);
              }
            });
          }
        });
      };
      return {
        currentStageSheet,
        save,
        isFull,
        cradles,
        editingStage,
        editStage,
        saveStage,
        duplicateStage,
        deleteStage,
        warehouse,
        choosedBox,
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
    @apply font-bold text-gray-900 text-xl self-start mb-3 md:mb-0;
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
