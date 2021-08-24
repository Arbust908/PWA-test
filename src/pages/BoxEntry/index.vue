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
        <fieldset class="py-2 w-full grid grid-cols-12 gap-y-4 gap-x-14">
          <FieldGroup class="grid col-12 col-span-8">
            <ClientPitCombo
              :clientId="clientId"
              :pitId="pitId"
              @update:clientId="clientId = $event"
              @update:pitId="pitId = $event"
            />
          </FieldGroup>
          <label class="col-span-4" for="purchaseOrder">
            <span>Orden de pedido</span>
            <select
              id="purchaseOrder"
              v-model="purchaseOrderId"
              class="input"
              name="purchaseOrder"
            >
              <option selected disabled value="-1">
                Seleccionar orden de pedido
              </option>
              <option
                v-for="purchaseOrder in purchaseOrders"
                :key="purchaseOrder.id"
                :value="purchaseOrder.id"
              >
                #{{ purchaseOrder.id }}
              </option>
              <option v-if="purchaseOrders.length <= 0" value="-1">
                No hay ordenes de pedido para este Pozo y/o cliente
              </option>
            </select>
          </label>
        </fieldset>
        <fieldset v-if="selectionsAreDone" class="w-full py-5 px-2">
          <div v-if="boxes.length > 0">
            <div v-for="box in boxes" :key="box.id" class="available-box">
              <div
                :class="[
                  'radio-button',
                  choosedBox.id == box.boxId ? 'active' : '',
                ]"
                @click.prevent="setSelectedBox(box.boxId)"
              ></div>
              <div class="box-id">{{ box.boxId }}</div>
            </div>
          </div>
          <div v-else>No hay cajas asociadas.</div>
        </fieldset>
        <nav class="flex justify-between">
          <button
            :class="[
              'section-tab',
              activeSection === 'deposit' ? 'active' : '',
            ]"
            :selected="activeSection === 'deposit'"
            @click.prevent="changeSection('deposit')"
          >
            <span> Depósito </span>
          </button>
          <button
            :class="['section-tab', activeSection === 'cradle' ? 'active' : '']"
            :selected="activeSection === 'cradle'"
            @click.prevent="changeSection('cradle')"
          >
            <span> Cradle </span>
          </button>
        </nav>
        <div v-if="selectionsAreDone">
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
              <BoxCard v-if="choosedBox.category !== ''" v-bind="choosedBox" />
              <h2 class="col-span-full text-xl font-bold">Referencias</h2>
              <div class="flex flex-col gap-5 ml-4">
                <span
                  class="select-category fine"
                  @click="setVisibleCategories('fine')"
                >
                  <EyeIcon
                    class="icon"
                    v-if="visibleCategories.includes('fine')"
                  />
                  <EyeIconOff class="icon" v-else />
                  Arena fina</span
                >
                <span
                  class="select-category thick"
                  @click="setVisibleCategories('thick')"
                >
                  <EyeIcon
                    class="icon"
                    v-if="visibleCategories.includes('thick')"
                  />
                  <EyeIconOff class="icon" v-else />
                  Arena gruesa</span
                >
                <span
                  class="select-category cut"
                  @click="setVisibleCategories('cut')"
                >
                  <EyeIcon
                    class="icon"
                    v-if="visibleCategories.includes('cut')"
                  />
                  <EyeIconOff class="icon" v-else />
                  Caja cortada</span
                >
                <span class="select-category aisle">Pasillo</span>
                <span class="select-category full">Ocupado</span>
              </div>
            </section>
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
          </fieldset>
          <fieldset
            v-if="activeSection === 'cradle'"
            class="py-2 flex flex-col gap-x-10 2xl:gap-x-40"
          >
            <h2 class="text-xl font-bold">Elegir Cradle para montar</h2>
            <div
              class="
                mt-4
                w-full
                max-w-[170px]
                lg:max-w-[260px]
                flex flex-col
                gap-6
                md:gap-8
              "
            >
              <CradleCard
                :id="cradle.id"
                :selected="selectedCradle == cradle.id"
                v-for="cradle in cradles"
                :key="cradle.id"
                @click="handleSelectedCradle(cradle.id)"
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
  import CradleCard from '@/components/depositDesign/CradleCard.vue';
  import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';

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
      CradleCard,
      EyeIcon,
      EyeIconOff,
      ClientPitCombo,
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      let activeSection = ref('deposit');
      let boxes = ref([
        //  {
        //    id: "ID-289",
        //    warehouseId: 1,
        //    warehouse: {
        //      id: 1,
        //      clientCompanyId: 1,
        //      pitId: 1,
        //      pit: {
        //        id: 1,
        //        name: "Test",
        //        workOrderId: 1,
        //      },
        //      layout: "any",
        //    },
        //    category: "cut",
        //    col: 2,
        //    floor: 1,
        //    row: 2,
        //  },
        //  {
        //    id: "A4%$",
        //    warehouseId: 1,
        //    warehouse: {
        //      id: 1,
        //      clientCompanyId: 1,
        //      pitId: 1,
        //      pit: {
        //        id: 1,
        //        name: "Test",
        //        workOrderId: 1,
        //      },
        //      layout: "any",
        //    },
        //    category: "fine",
        //    col: 2,
        //    floor: 1,
        //    row: 1,
        //  },
      ]);

      const purchaseOrders = ref([]);
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

      const getPurchaseOrders = async () => {
        await axios.get(`${apiUrl}/purchaseOrder`).then((res) => {
          purchaseOrders.value = res.data.data;
        });
      };

      const getWarehouses = async () => {
        await axios.get(`${apiUrl}/warehouse`).then((res) => {
          warehouses.value = res.data.data;
        });
      };

      onMounted(async () => {
        await getPurchaseOrders();
        await getWarehouses();
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

      watchEffect(async () => {
        if (purchaseOrders.value.length > 0) {
          if (clientId.value !== -1 && pitId.value !== -1) {
            purchaseOrders.value = purchaseOrders.value.filter((po) => {
              if (
                parseInt(po.companyId) == clientId.value &&
                parseInt(po.pitId) == pitId.value
              ) {
                return po;
              }
            });
          }
          if (purchaseOrderId.value !== -1) {
            let sandTypes = await axios
              .get(`${apiUrl}/sand`)
              .then((res) => {
                return res.data.data;
              })
              .catch((err) => console.error(err));
            boxes.value = purchaseOrders.value[0].sandOrders;
            boxes.value.map((box) => {
              let sandType = sandTypes.find(
                (type) => parseInt(type.id) == parseInt(box.sandTypeId)
              );
              box.category = sandType.type.toLowerCase();
            });

            console.log('cajas', boxes.value);

            warehouse.value = warehouses.value.filter((singleWarehouse) => {
              if (
                parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                parseInt(singleWarehouse.pitId) == pitId.value
              ) {
                return singleWarehouse;
              }
            })[0];
            floor.value = formatDeposit(warehouse.value.layout).floor;
            col.value = formatDeposit(warehouse.value.layout).col;
            dimensions.value = formatDeposit(warehouse.value.layout).dimensions;
            row.value = formatDeposit(warehouse.value.layout).row;
          }
          if (activeSection.value == 'cradle') {
            cradles.value = await axios
              .get(`${apiUrl}/cradle`)
              .then((res) => {
                return res.data.data;
              })
              .catch((err) => console.error(err));

            console.log(cradles.value);
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
            console.log('CAJA', box);
            if (choosedBox.value.category !== box.category) {
              setVisibleCategories(choosedBox.value.category);
              setVisibleCategories(box.category);
            }
            return box;
          }
        });
      };

      const selectBox = (box: Box) => {
        if (box.category == 'aisle') return;
        if (box.category == 'empty') {
          let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}`;
          let selectedBoxPosition = `${box.floor}|${box.row}|${box.col}`;

          choosedBox.value.floor = box.floor;
          choosedBox.value.col = box.col;
          choosedBox.value.row = box.row;
          warehouse.value.layout[`${selectedBoxPosition}`].category =
            choosedBox.value.category;
          warehouse.value.layout[`${selectedBoxPosition}`].id =
            choosedBox.value.id;
          warehouse.value.layout[`${prevBoxPosition}`].category = 'empty';
          warehouse.value.layout[`${prevBoxPosition}`].id = '';
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

      const warehouse = ref({
        // id: 2,
        // clientCompanyId: 7,
        // pitId: 1,
        // layout: {
        //   '1|1|1': {id: 'ID-222',category: 'cut'},
        //   '1|1|2': {id: 'A4%$',category: 'fine'},
        //   '1|2|1': {id: '',category: 'empty'},
        //   '1|2|2': {id: 'ID-289',category: 'cut'},
        //   '2|1|1': {id: '',category: 'empty'},
        //   '2|1|2': {id: 'ID-678',category: 'fine'},
        //   '2|2|1': {id: '',category: 'empty'},
        //   '2|2|2': {id: 'ID-890',category: 'fine'},
        //   '3|1|1': {id: '',category: 'empty'},
        //   '3|1|2': {id: 'ID-262',category: 'fine'},
        //   '3|2|1': {id: '',category: 'empty'},
        //   '3|2|2': {id: 'ID-290',category: 'cut'},
        // },
        // createdAt: '2021-08-06T14:44:26.000Z',
        // updatedAt: null,
        // deletedAt: null,
        // pit: {
        //   id: 1,
        //   name: 'pit 1',
        // },
        // clientCompany: {
        //   id: 7,
        //   name: 'OtroCliente',
        //   legalName: 'asd',
        //   legalId: 789,
        //   isOperator: false,
        //   childId: null,
        //   observations: 'asd',
        //   companyRepresentativeId: 8,
        // },
      });

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

      let cradles = ref([]);

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

      const setCat = (cat: string) => {
        console.log('ASD', cat);
        choosedBox.value.category = cat;
        const box = choosedBox.value;
        deposit.value[`${box.floor}|${box.row}|${box.col}`].category =
          box.category;
      };

      // :: DEPOSIT
      const deposit = ref({});
      // << DEPOSIT

      const save = () => {
        // No está funcionando
        // console.log("ORIGINAL", originalWarehouseLayout)
        // console.log("MODIF", warehouse.value.layout)
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
    &.fine {
      @apply text-orange-600 text-orange-600;
    }
    &.thick {
      @apply text-green-600 text-green-600;
    }
    &.cut {
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
    display: flex;
    flex-direction: row;
    align-items: center;

    .radio-button {
      border: 1px solid black;
      border-radius: 100%;
      height: 20px;
      width: 20px;
      cursor: pointer;

      &.active {
        position: relative;

        &::after {
          position: absolute;
          content: '';
          width: 10px;
          height: 10px;
          background: black;
          border-radius: 100%;
          margin: auto;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }
    .box-id {
      margin-left: 0.5rem;
    }
  }
</style>
