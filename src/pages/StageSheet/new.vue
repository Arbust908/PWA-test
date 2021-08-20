<template>
  <Layout class="relative">
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Stage sheet
      </h1>
    </header>
    <div class="grid gap-8 grid-cols-2 relative">
      <FieldGroup class="max-w-xl col-span-full !py-0">
        <ClientPitCombo
          :clientId="currentStageSheet.companyId"
          :pitId="currentStageSheet.pitId"
          @update:clientId="currentStageSheet.companyId = $event"
          @update:pitId="currentStageSheet.pitId = $event"
        />
      </FieldGroup>
      <section class="panel col-span-full">
        <form method="POST" action="/" class="p-4 flex flex-col gap-4">
          <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div
                class="
                  py-2
                  align-middle
                  inline-block
                  min-w-full
                  sm:px-6
                  lg:px-8
                "
              >
                <div class="overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                      <StageHeader />
                    </thead>
                    <tbody class="divide-y">
                      <SandPlanStage
                        v-for="(stage, Key) in currentStageSheet.stages"
                        :key="Key"
                        :stage="stage"
                        :editing="editingStage"
                        :sands="sands"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </form>
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
                <!-- <DepositGrid
                  class="w-full flex flex-col gap-5"
                  :selectedBox="choosedBox"
                  :rows="row"
                  :cols="col"
                  :floor="floor"
                  :deposit="warehouse.layout"
                  :visibleCategories="visibleCategories"
                  @select-box="selectBox"
                /> -->
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
              endpoint="/cradle"
              :endpointData="cradles"
              :data="currentStageSheet.cradleId"
              @update:data="currentStageSheet.cradleId = $event"
            />
            <FieldLoading :title="false" class="max-w-[200px]" v-else />
          </div>
          <div
            v-if="currentStageSheet.cradleId == -1"
            class="py-8 flex justify-center items-center flex-wrap gap-5"
          >
            <div class="cradle-slot-ph">1</div>
            <div class="cradle-slot-ph">2</div>
            <div class="cradle-slot-ph">3</div>
            <div class="cradle-slot-ph">4</div>
          </div>
          <div
            v-else
            class="py-8 flex justify-center items-center flex-wrap gap-5"
          >
            <div class="cradle-slot">1</div>
            <div class="cradle-slot">2</div>
            <div class="cradle-slot">3</div>
            <div class="cradle-slot">4</div>
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
  import { useActions } from 'vuex-composition-helpers';

  import Icon from '@/components/icon/TheAllIcon.vue';
  import Pill from '@/components/ui/Pill.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';

  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import SandPlanStage from '@/components/stageSheet/StageRow.vue';
  import StageEmptyState from '@/components/stageSheet/StageEmptyState.vue';
  import StageHeader from '@/components/stageSheet/StageHeader.vue';
  import DepositGrid from '@/components/depositDesign/Deposit.vue';
  import {
    Pit,
    Company,
    StageSheet,
    Sand,
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
      SandPlanStage,
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
    },
    setup() {
      // Init
      const store = useStore();
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      const currentStageSheet: StageSheet = reactive({
        companyId: -1,
        pitId: -1,
        cradleId: -1,
        warehouseId: -1,
        operativeCradleId: -1,
        backupCradleId: -1,
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
            sandPlanId: 0,
            status: 0,
          },
        ],
      });
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
      const sands = ref([] as Array<Sand>);
      const { data: sandsData } = useAxios('/sand', instance);
      watch(sandsData, (api) => {
        if (api && api.data) {
          sands.value = api.data;
          console.log(sands.value);
        }
      });
      // :: CLIENT
      const clients = ref([] as Array<Company>);
      const backupClients = ref([]);
      const { data: companiesData } = useAxios('/company', instance);
      watch(companiesData, (companiesApi, prevCount) => {
        if (companiesApi && companiesApi.data) {
          clients.value = companiesApi.data;
          backupClients.value = companiesApi.data;
        }
      });
      const selectedClientName = computed(() => {
        return currentStageSheet.companyId >= 0
          ? clients.value.find(
              (client) => client.id === currentStageSheet.companyId
            ).name
          : '';
      });
      // << CLIENT
      // :: PITS
      const pits = ref([] as Array<Pit>);
      const backupPits = ref([]);
      const { data: pitsData } = useAxios('/pit', instance);
      watch(pitsData, (pitApi, prevCount) => {
        if (pitApi && pitApi.data) {
          pits.value = pitApi.data;
          backupPits.value = pitApi.data;
        }
      });
      const selectedPitName = computed(() => {
        return currentStageSheet.pitId >= 0
          ? pits.value.find((pit) => pit.id === currentStageSheet.pitId).name
          : '';
      });
      // << PITS
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
        if (box.category == 'aisle') return;
        if (box.category == 'empty') {
          let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}`;
          let selectedBoxPosition = `${box.floor}|${box.row}|${box.col}`;

          choosedBox.value.floor = box.floor;
          choosedBox.value.col = box.col;
          choosedBox.value.row = box.row;
          warehouse.value.layout[`${selectedBoxPosition}`] =
            choosedBox.value.category;
          warehouse.value.layout[`${prevBoxPosition}`] = 'empty';
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

      const filterPitsByClient = (clientId: number) => {
        pits.value = [];
        setTimeout(() => {
          pits.value = backupPits.value.filter((pit: Pit) => {
            return pit.companyId == clientId;
          });
          if (pits.value.length === 1) {
            currentStageSheet.pitId = pits.value[0].id;
          } else if (pits.value.length <= 0) {
            pits.value = [{ name: 'No hay pozos', id: -1 }];
            currentStageSheet.pitId = -1;
          }
        }, 100);
      };

      watchEffect(() => {
        if (currentStageSheet.companyId !== -1) {
          filterPitsByClient(currentStageSheet.companyId);
        }
        // if (currentStageSheet.pitId !== -1) {
        //   const curPit = backupPits.value.find((pit) => {
        //     return pit.id == currentStageSheet.pitId;
        //   });
        //   console.log(curPit);
        //   if (curPit) {
        //     clients.value = [];
        //     setTimeout(() => {
        //       clients.value = backupClients.value.filter((client) => {
        //         return client.id == curPit.companyId;
        //       });
        //       if (clients.value.length === 1) {
        //         currentStageSheet.companyId = clients.value[0].id;
        //       } else if (clients.value.length <= 0) {
        //         clients.value = [{ name: 'No hay clientes', id: -1 }];
        //         currentStageSheet.companyId = -1;
        //       }
        //     }, 100);
        //   }
        // }
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
            const fDepo = formatDeposit(warehouse.value.layout);
            console.log(fDepo);
            floor.value = fDepo.floor;
            row.value = fDepo.row;
            col.value = fDepo.col;
          }
        }
      });
      let visibleCategories = ref([]);
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
        console.log(backupWorkorder.value);
        setTimeout(() => {
          const lasWO = backupWorkorder.value.find((wo) => {
            return (
              (wo.clientId === clientId || wo.client === clientId) &&
              wo.pits.some((pit) => {
                return pit.id === pitId;
              })
            );
          });
          console.log(lasWO);
          cradles.value = backupCradles.value.filter((cradle) => {
            return (
              cradle.id === lasWO.operativeCradle ||
              cradle.id === lasWO.operativeCradleId ||
              cradle.id === lasWO.backupCradle ||
              cradle.id === lasWO.backupCradleId
            );
          });
        }, 100);
      };

      const selectedCradleName = computed(() => {
        return currentStageSheet.cradleId >= 0
          ? cradles.value.find(
              (cradle) => cradle.id === currentStageSheet.cradleId
            ).name
          : '';
      });
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
          currentStageSheet.stages.length > 0 &&
          currentStageSheet.stages.length <= 40 &&
          noZeroSandTypeNull &&
          noZeroSandTypeZero
        );
      });
      const { saveSandPlan } = useActions(['saveSandPlan']);
      const save = (): void => {};
      return {
        currentStageSheet,
        clients,
        pits,
        selectedPitName,
        sands,
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
      };
    },
  };
</script>

<style lang="scss" scoped>
  .panel {
    @apply bg-white rounded-md shadow-sm border;
  }
  .cradle-slot-ph {
    @apply w-[6.25rem] h-[6.25rem] rounded-lg border-2 border-dashed border-second-300 text-4xl font-bold text-second-200 flex justify-center items-center;
  }
  .cradle-slot {
    @apply w-[6.25rem] h-[6.25rem] rounded-lg border-2 border-dashed border-second-400 text-4xl font-bold text-second-300 flex justify-center items-center;
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
  // Quizas hay que armar algo externo para los estilos de boton
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
    }
    &__options {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-gray-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
    }
    &__add {
      @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
</style>
