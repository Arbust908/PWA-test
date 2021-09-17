<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-second-900 text-xl self-start mb-3 md:mb-0">
        Nuevo ingreso de caja
      </h1>
    </header>
    <section class="deposit bg-second-0 rounded-md shadow-sm">
      <form method="POST" action="/" class="p-12 flex flex-col gap-4">
        <FieldGroup class="grid grid-cols-12 gap-4 max-w-4xl">
          <span class="col-span-8 grid grid-cols-12 gap-4">
            <ClientPitCombo
              :clientId="Number(clientId)"
              :pitId="Number(pitId)"
              @update:clientId="clientId = Number($event)"
              @update:pitId="pitId = Number($event)"
            />
          </span>
          <FieldSelect
            class="col-span-4"
            title="Orden de pedido"
            fieldName="sandType3"
            placeholder="Seleccionar orden de pedido"
            endpointKey="id"
            :endpointData="filteredPurchaseOrders"
            :data="purchaseOrderId"
            @update:data="purchaseOrderId = $event"
          />
        </FieldGroup>
        <fieldset v-if="selectionsAreDone" class="w-full py-5 px-2">
          <div v-if="boxes.length > 0">
            <div v-for="box in boxes" :key="box.id" class="available-box">
              <button
                :class="[choosedBox.boxId == box.boxId ? 'active' : null]"
                class="radio-button"
                @click.prevent="setSelectedBox(box.boxId)"
              ></button>
              <div class="box-id">
                <span> {{ box.category }} - {{ box.amount }}t - </span>
                <input
                  v-model="box.boxId"
                  :name="`boxId-${box.id}`"
                  type="text"
                  placeholder="S-0001"
                />
              </div>
            </div>
          </div>
          <div v-else>No hay cajas asociadas.</div>
        </fieldset>
        <nav class="flex justify-between">
          <button
            :class="['section-tab', activeSection == 'deposit' ? 'active' : '']"
            :selected="activeSection == 'deposit'"
            @click.prevent="changeSection('deposit')"
          >
            <span> Depósito </span>
          </button>
          <button
            :class="['section-tab', activeSection == 'cradle' ? 'active' : '']"
            :selected="activeSection == 'cradle'"
            @click.prevent="changeSection('cradle')"
          >
            <span> Cradle </span>
          </button>
        </nav>
        <div v-if="selectionsAreDone">
          <div v-if="warehouse">
            <fieldset
              v-if="activeSection === 'deposit'"
              class="py-2 flex gap-x-10 2xl:gap-x-40"
            >
              <section
                class="
                  w-full
                  max-w-[170px]
                  lg:max-w-[260px]
                  flex flex-col
                  gap-6
                  md:gap-8
                "
              >
                <div>
                  <BoxCard v-if="choosedBox.category !== ''" v-bind="choosedBox" />
                <h2 class="col-span-full text-xl font-bold">Referencias</h2>
                <div class="flex flex-col gap-5 ml-4">
                  <span
                    class="select-category fina"
                    @click="setVisibleCategories('fina')"
                  >
                    <EyeIcon
                      class="icon"
                      v-if="visibleCategories.includes('fina')"
                    />
                    <EyeIconOff class="icon" v-else />
                    Arena fina</span
                  >
                  <span
                    class="select-category gruesa"
                    @click="setVisibleCategories('gruesa')"
                  >
                    <EyeIcon
                      class="icon"
                      v-if="visibleCategories.includes('gruesa')"
                    />
                    <EyeIconOff class="icon" v-else />
                    Arena gruesa</span
                  >
                  <span
                    class="select-category cortada"
                    @click="setVisibleCategories('cortada')"
                  >
                    <EyeIcon
                      class="icon"
                      v-if="visibleCategories.includes('cortada')"
                    />
                    <EyeIconOff class="icon" v-else />
                    Caja cortada</span
                  >
                  <span class="select-category aisle">Pasillo</span>
                  <span class="select-category full">Ocupado</span>
                </div>
                </div>
              </section>
              <DepositGrid
                class="w-full flex flex-col gap-5"
                v-if="warehouse"
                :selectedBox="choosedBox"
                :rows="row"
                :cols="col"
                :floor="floor"
                :deposit="warehouse.layout"
                :visibleCategories="visibleCategories"
                @select-box="selectBox"
              />
            </fieldset>
            <fieldset
              v-if="activeSection == 'cradle'"
              class="py-2 flex flex-col gap-x-10 2xl:gap-x-40"
            >
              <h2 class="text-xl font-bold">Elegir Cradle para montar</h2>
              <div class="mt-4 w-full flex flex-col gap-6 md:gap-8">
                <CradleRow
                  class="cradle-row-wrapper flex flex-row"
                  v-for="cradle in cradles"
                  :key="cradle.id"
                  :id="cradle.id"
                  :cradle="cradle"
                  :selected="selectedCradle == cradle.id"
                  :choosedBox="choosedBox"
                  @handle-selected-cradle="handleSelectedCradle(cradle.id)"
                  @clear-box-in-deposit="clearBoxInDeposit"
                />
              </div>
            </fieldset>
          </div>
          <div
            v-else
            class="
              w-full
              max-w-sm
              border border-dashed border-
              rounded-xl
              p-5
              my-3
              mx-auto
              flex
              items-center
              justify-center
              flex-col
            "
            @click.prevent="$router.push('/diseno-de-deposito')"
          >
            Necesitás diseñar un depósito para continuar
            <button class="mt-4 bg-green-700 text-white rounded-md p-4 text-center">Ir a diseño de depósito</button>
          </div>
        </div>
        <div
          v-else
          class="
            w-full
            max-w-sm
            border border-dashed border-
            rounded-xl
            p-5
            my-3
            mx-auto
          "
        >
          Seleccionar cliente, pozo y orden de pedido para comenzar.
        </div>
      </form>
    </section>
    <footer class="p-4 space-x-8 flex justify-end">
      <GhostBtn
        class="border-none"
        @click.prevent="$router.push('/diseno-de-deposito')"
      >
        Cancelar
      </GhostBtn>
      <PrimaryBtn type="submit" size="lg" @click.prevent="save()">
        Guardar
      </PrimaryBtn>
    </footer>
  </Layout>
</template>

<script lang="ts">
  import {
    ref,
    Ref,
    computed,
    defineComponent,
    watch,
    onMounted,
    watchEffect,
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  import { TrashIcon } from '@heroicons/vue/outline';
  import { PlusIcon, BellIcon, EyeIcon } from '@heroicons/vue/solid';
  import EyeIconOff from './EyeIconOff.vue';
  import Layout from '@/layouts/Main.vue';
  import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import Counter from '@/components/ui/Counter.vue';
  import DepositGrid from '@/components/depositDesign/Deposit.vue';
  import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
  import CradleRow from './CradleRow.vue';

  import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';

  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default defineComponent({
    components: {
      BellIcon,
      CircularBtn,
      Counter,
      GhostBtn,
      Layout,
      PlusIcon,
      PrimaryBtn,
      TrashIcon,
      DepositGrid,
      BoxCard,
      EyeIcon,
      EyeIconOff,
      ClientPitCombo,
      CradleRow,
      FieldGroup,
      FieldSelect,
      FieldInput,
    },
    setup() {
      const router = useRouter();
      let activeSection = ref('deposit');
      let boxes = ref([]);

      const purchaseOrders = ref([]);
      const filteredPurchaseOrders = ref([]);
      const clients = ref([] as Array<Company>);
      const pits = ref([] as Array<Pit>);
      const clientId = ref(-1);
      const purchaseOrderId = ref(-1);
      const pitId = ref(-1);
      const warehouses = ref([]);
      let floor = ref('');
      let row = ref('');
      let col = ref('');
      let dimensions = ref('');
      let cradles = ref([]);

      const getPurchaseOrders = async () => {
        await axios
          .get(`${apiUrl}/purchaseOrder`)
          .then((res) => {
            purchaseOrders.value = res.data.data;
          })
          .catch((err) => console.error(err));
      };

      const getWarehouses = async () => {
        await axios
          .get(`${apiUrl}/warehouse`)
          .then((res) => {
            warehouses.value = res.data.data;
          })
          .catch((err) => console.error(err));
      };

      // Los Cradles deberian venir de la Orden de Trabajo
      // Ver con @Back tema api
      const getCradles = async () => {
        await axios
          .get(`${apiUrl}/cradle`)
          .then((res) => {
            cradles.value = res.data.data;
          })
          .catch((err) => console.error(err));
      };
      
      const getFilteredCradles = async () => {
        let cradlesToFilter = []
        let workOrders = await axios
          .get(`${apiUrl}/workOrder`)
          .then((res) => {
            return res.data.data;
          })
          .catch((err) => console.error(err));

        await workOrders.forEach(workOrder => {
          workOrder.pits.forEach(pit => {
            if(pit.id == pitId.value) {
              if(workOrder.operativeCradle !== "-1") cradlesToFilter.push(workOrder.operativeCradle)
              if(workOrder.backupCradle !== "-1") cradlesToFilter.push(workOrder.backupCradle)
            }
          })
        });

        cradles.value = await cradles.value.filter(cradle => {
          if(cradlesToFilter.includes(cradle.id.toString())) return cradle
        })
      };

      onMounted(async () => {
        await getPurchaseOrders();
        await getWarehouses();
        await getCradles();
      });

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

      const clearBoxInDeposit = (id) => {
        Object.entries(warehouse.value.layout).forEach((cell) => {
          if (cell[1].id == id) {
            (cell[1].category = 'empty'), delete cell[1][id];
          }
        });
      };

      const clearBoxInCradleSlots = (id) => {
        cradles.value.forEach((cradle) => {
          cradle.slots = cradle.slots.map((slot) => {
            if (slot.boxId == id) {
              slot = {
                boxId: null,
              };
            }
            return slot;
          });
        });
      };

      watchEffect(async () => {
        if (purchaseOrders.value.length > 0) {
          if (clientId.value !== -1 && pitId.value !== -1) {
            filteredPurchaseOrders.value = purchaseOrders.value.filter((po) => {
              if (po.companyId == clientId.value && po.pitId == pitId.value) {
                return po;
              }
            });
          }
          if (purchaseOrderId.value !== -1) {
            await getFilteredCradles()
            let sandTypes = await axios
              .get(`${apiUrl}/sand`)
              .then((res) => {
                return res.data.data;
              })
              .catch((err) => console.error(err));
            
              filteredPurchaseOrders.value.length > 0
                ? boxes.value = filteredPurchaseOrders.value[filteredPurchaseOrders.value.findIndex(po => po.id == purchaseOrderId.value)].sandOrders
                : boxes.value = [];
              
            boxes.value.map((box) => {
              let sandType = sandTypes.find(
                (type) => parseInt(type.id) == parseInt(box.sandTypeId)
              );
              box.category = sandType.type.toLowerCase();
            });

            warehouse.value = warehouses.value.filter((singleWarehouse) => {
              if (
                parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                parseInt(singleWarehouse.pitId) == pitId.value
              ) {
                return singleWarehouse;
              }
            })[0];
            if (warehouse.value) {
              floor.value = formatDeposit(warehouse.value.layout).floor;
              col.value = formatDeposit(warehouse.value.layout).col;
              dimensions.value = formatDeposit(
                warehouse.value.layout
              ).dimensions;
              row.value = formatDeposit(warehouse.value.layout).row;
            }
          }
        }
      });

      const choosedBox: Ref<Box> = ref({
        floor: 1,
        col: 0,
        row: 0,
        category: '',
        id: '',
      });

      const setSelectedBox = (id: Number) => {
        choosedBox.value = boxes.value.filter((box) => {
          if (box.boxId == id) {
            if (choosedBox.value.category !== box.category) {
              setVisibleCategories(choosedBox.value.category);
              setVisibleCategories(box.category);
            }
            return box;
          }
        })[0];
      };

      const selectBox = (box: Box) => {
        clearBoxInCradleSlots(choosedBox.value.boxId);
        if (box.category == 'aisle') return;
        if (box.category == 'empty' || box.category !== 'aisle') {
        // if (visibleCategories.value.includes(box.category)) {
          const hasPos = [
            choosedBox.value.floor,
            choosedBox.value.row,
            choosedBox.value.col,
          ].some(Boolean);
          if (hasPos) {
            let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}`;
            warehouse.value.layout[`${prevBoxPosition}`].category = 'empty';
            warehouse.value.layout[`${prevBoxPosition}`].id = '';
          }
          const newBPos = `${box.floor}|${box.row}|${box.col}`;
          choosedBox.value.floor = box.floor;
          choosedBox.value.col = box.col;
          choosedBox.value.row = box.row;
          warehouse.value.layout[`${newBPos}`].category =
            choosedBox.value.category;
          warehouse.value.layout[`${newBPos}`].id = choosedBox.value.boxId;
        }
      };

      const changeSection = (option: String) => {
        return (activeSection.value = option);
      };

      const selectionsAreDone = computed(() => {
        if (
          clientId.value !== -1 &&
          pitId.value !== -1 &&
          purchaseOrderId.value !== -1
        ) {
          if (originalWarehouseWasSaved == false) {
            originalWarehouseWasSaved = true;
            originalWarehouseLayout = warehouse.value.layout;
          }
          return true;
        }
      });

      const warehouse = ref({});

      let originalWarehouseLayout = {};
      let originalWarehouseWasSaved = false;
      let visibleCategories = ref([]);

      const setVisibleCategories = (category: String) => {
        if (visibleCategories.value.includes(category)) {
          visibleCategories.value.splice(
            visibleCategories.value.indexOf(category)
          );
        } else {
          visibleCategories.value.push(category);
        }
      };

      let selectedCradle = ref(0);

      const handleSelectedCradle = (id) => {
        selectedCradle.value = id;
      };

      // :: CLIENT
      const selectedClientName = computed(() => {
        return clientId.value >= 0
          ? clients.value.find((pit) => pit.id === clientId.value).name
          : '';
      });
      // << CLIENT
      // :: PITS
      const selectedPitName = computed(() => {
        return pitId.value >= 0
          ? pits.value.find((pit) => pit.id === pitId.value).name
          : '';
      });
      // << PITS
      const designName = computed(() => {
        return selectedClientName.value !== '' && selectedPitName.value !== ''
          ? `${selectedPitName.value} - ${selectedClientName.value}`
          : selectedClientName.value !== ''
          ? selectedClientName.value
          : selectedPitName.value !== ''
          ? selectedPitName.value
          : '';
      });
      //
      const setCat = (cat: string) => {
        choosedBox.value.category = cat;
        const box = choosedBox.value;
        deposit.value[`${box.floor}|${box.row}|${box.col}`].category =
          box.category;
      };
      // :: DEPOSIT
      const deposit = ref({});
      // << DEPOSIT
      const save = async () => {
        const warehouseDone = ref(false);
        const warehouseId = warehouse.value.id;
        const {
          createdAt,
          deletedAt,
          updatedAt,
          pit,
          clientCompany,
          ...wareData
        } = warehouse.value;
        const cradleDone = ref(false);
        const cradleId = selectedCradle.value;
        const cradleData = cradles.value.find((c) => {
          return c.id === cradleId;
        });
        await axios
          .put(`${apiUrl}/warehouse/${warehouseId}`, wareData)
          .then((res) => {
            warehouseDone.value = !!res.data.data;
          })
          .catch((err) => console.error(err))
        await axios
          .put(`${apiUrl}/cradle/${cradleId}`, cradleData)
          .then((res) => {
            cradleDone.value = !!res.data.data;
          })
          .catch((err) => console.error(err))
        watchEffect(() => {
          if (warehouseDone.value && cradleDone.value) {
            router.push('/');
          }
        });
      };

      return {
        activeSection,
        clients,
        pits,
        choosedBox,
        selectBox,
        setCat,
        clientId,
        pitId,
        designName,
        deposit,
        save,
        changeSection,
        selectionsAreDone,
        boxes,
        setSelectedBox,
        warehouse,
        floor,
        row,
        col,
        dimensions,
        visibleCategories,
        setVisibleCategories,
        handleSelectedCradle,
        cradles,
        selectedCradle,
        purchaseOrderId,
        purchaseOrders,
        filteredPurchaseOrders,
        clearBoxInDeposit,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .section-tab {
    @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
  }
  .section-tab.active {
    @apply border-main-500 text-main-500;
  }
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  span.select-category {
    @apply flex items-center;

    & .icon {
      @apply w-5 h-5 mr-2;
    }

    &:not(.full):not(.aisle) {
      cursor: pointer;
    }

    &.aisle {
      @apply text-second-300 text-second-300;
    }
    &.fina {
      @apply text-orange-600 text-orange-600;
    }
    &.gruesa {
      @apply text-green-600 text-green-600;
    }
    &.cortada {
      @apply text-blue-600 text-blue-600;
    }
    &.blocked {
      @apply text-second-800 text-second-800;
    }
    &.empty {
      @apply text-second-200 text-second-200;
    }
  }
  // input:read-only {
  //   @apply bg-second-200 border cursor-not-allowed;
  // }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
  label:not(.type-select) {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
    }
    &__options {
      @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
    }
    &__add {
      @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
  .type-select {
    @apply flex items-center gap-2;
  }

  .available-box {
    @apply flex items-center mb-2;

    .radio-button {
      @apply border border-gray-800 w-5 h-5 cursor-pointer rounded-full;
      &.active {
        @apply relative;
        &::after {
          content: '';
          @apply absolute inset-0 w-3 h-3 rounded-full m-auto bg-gray-900;
          animation: pop_in 150ms ease-out;
        }
      }
    }
    .box-id {
      @apply mx-2 flex items-center;
      & > input {
        @apply border-none inline p-0.5 rounded w-20 hover:bg-gray-200 focus:ring-main-500 focus:border-main-500;
      }
    }
  }
  @keyframes pop_in {
    from {
      @apply transform scale-0;
    }
    90% {
      @apply transform scale-110;
    }
    to {
      @apply transform scale-100;
    }
  }
</style>
