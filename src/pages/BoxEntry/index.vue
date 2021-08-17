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
        <fieldset
          class="py-2 w-full grid grid-cols-12 gap-y-4 gap-x-14"
        >
          <label class="col-span-4" for="depositClient">
            <span>Cliente</span>
            <select
              id="depositClient"
              v-model="clientId"
              class="input"
              name="depositClient"
            >
              <option selected disabled value="-1">Seleccionar cliente</option>
              <option
                v-for="client in clients"
                :key="client.id"
                :value="client.id"
              >
                {{ client.name }}
              </option>
            </select>
          </label>
          <label class="col-span-4" for="depositPit">
            <span>Pozo</span>
            <select
              id="depositPit"
              v-model="pitId"
              class="input"
              name="depositPit"
            >
              <option selected disabled value="-1">Seleccionar pozo</option>
              <option v-for="pit in pits" :key="pit.id" :value="pit.id">
                {{ pit.name }}
              </option>
            </select>
          </label>
          <label class="col-span-4" for="depositPit">
            <span>Orden de pedido</span>
            <select
              id="depositPit"
              v-model="purchaseOrder"
              class="input"
              name="depositPit"
            >
              <option selected disabled value="-1">Seleccionar orden de pedido</option>
              <option v-for="purchaseOrder in purchaseOrders" :key="purchaseOrder.id" :value="purchaseOrder.id">
                #{{ purchaseOrder.id }}
              </option>
            </select>
          </label>
        </fieldset>
        <fieldset v-if="selectionsAreDone" class="w-full py-5 px-2">
          <div v-for="box in boxes" :key="box.id" class="available-box">
            <div :class="['radio-button', choosedBox.id == box.id ? 'active' : '']" @click.prevent="setSelectedBox(box.id)"></div>
            <div class="box-id"># {{box.id}}</div>
          </div>
        </fieldset>
        <nav class="flex justify-between">
          <button
            :class="['section-tab', activeSection === 'deposit' ? 'active' : '']"
            :selected="WO_section === 'deposit'"
            @click.prevent="changeSection('deposit')"
          >
            <span> Depósito </span>
            <CheckCircleIcon v-if="isOrderFull" class="w-5 h-5" />
          </button>
          <button
            :class="['section-tab', activeSection === 'cradle' ? 'active' : '']"
            :selected="WO_section === 'cradle'"
            @click.prevent="changeSection('cradle')"
          >
            <span> Cradle </span>
            
          </button>
        </nav>
        <div v-if="selectionsAreDone">
        <fieldset v-if="activeSection === 'deposit'" class="py-2 flex gap-x-10 2xl:gap-x-40">
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
              <span class="select-category fine" @click="setVisibleCategories('fine')">
                <EyeIcon class="icon" v-if="visibleCategories.includes('fine')" />
                <EyeIconOff class="icon" v-else />
                Arena fina</span>
              <span class="select-category thick" @click="setVisibleCategories('thick')">
                <EyeIcon class="icon" v-if="visibleCategories.includes('thick')"/>
                <EyeIconOff class="icon" v-else />
                Arena gruesa</span>
              <span class="select-category cut" @click="setVisibleCategories('cut')">
                <EyeIcon class="icon" v-if="visibleCategories.includes('cut')" />
                <EyeIconOff class="icon" v-else />
                Caja cortada</span>
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
        <fieldset v-if="activeSection === 'cradle'" class="py-2 flex flex-col gap-x-10 2xl:gap-x-40">
          <h2 class="text-xl font-bold">Elegir Cradle para montar</h2>
          <div class="mt-4 w-full
              max-w-[170px]
              lg:max-w-[260px]
              flex flex-col
              gap-6
              md:gap-8">
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
        <div v-else class="
          w-full
          max-w-sm
          border border-dashed border-
          rounded-xl
          p-5
          my-3
          mx-auto
        ">
          Seleccionar cliente, pozo y orden de pedido para comenzar. 
        </div>
      </form>
      <!-- {{ selectedBox }}
      <hr />
      {{ deposit }} -->
    </section>
    <footer class="p-4 space-x-8 flex justify-end">
      <GhostBtn
        class="border-none"
        @click.prevent="$router.push('/diseno-de-deposito')"
      >
        Cancelar
      </GhostBtn>
      <PrimaryBtn
        type="submit"
        size="lg"
        @click.prevent="save()"
      >
        Guardar
      </PrimaryBtn>
    </footer>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, computed, defineComponent, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  import { TrashIcon,  } from '@heroicons/vue/outline';
  import { PlusIcon, BellIcon, EyeIcon } from '@heroicons/vue/solid';
  import EyeIconOff from './EyeIconOff.vue'
  import Layout from '@/layouts/Main.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import Counter from '@/components/ui/Counter.vue';
  import DepositGrid from '@/components/depositDesign/Deposit.vue';
  import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
  import CradleCard from '@/components/depositDesign/CradleCard.vue';
  import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';

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
      EyeIconOff
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      let activeSection = ref('deposit')
      let boxes= ref([
        {
          id: 1,
          warehouseId: 1,
          warehouse: {
            id: 1,
            clientCompanyId: 1,
            pitId: 1,
            pit: {
              id: 1,
              name: "Test",
              workOrderId: 1,
            },
            layout: 'any'
          },
          category: 'cut',
          col: 1,
          floor: 1,
          row: 1
        },
        {
          id: 2,
          warehouseId: 1,
          warehouse: {
            id: 1,
            clientCompanyId: 1,
            pitId: 1,
            pit: {
              id: 1,
              name: "Test",
              workOrderId: 1,
            },
            layout: 'any'
          },
          category: 'fine',
          col: 2,
          floor: 1,
          row: 2
        },
      ])

      let purchaseOrders = ref([
        {
          id: 1235,
        },
        {
          id: 2356
        },
        {
          id: 2254
        }
      ])

      let purchaseOrder = ref(-1)

      const choosedBox: Ref<Box> = ref({
        floor: 1,
        col: 0,
        row: 0,
        category: '',
      });

      const setSelectedBox = (id: Number) => {
        choosedBox.value = boxes.value.filter(box => {
          if(box.id === id) {
            if(choosedBox.value.category !== box.category) {
              setVisibleCategories(choosedBox.value.category)
              setVisibleCategories(box.category)
            }
            return box
          }
        })[0]
      }
            
      const selectBox = (box: Box) => {
        if(box.category == 'aisle') return
        if(box.category == 'empty') { 
          let prevBoxPosition = `${choosedBox.value.floor}|${choosedBox.value.row}|${choosedBox.value.col}` 
          let selectedBoxPosition = `${box.floor}|${box.row}|${box.col}`

          choosedBox.value.floor = box.floor
          choosedBox.value.col = box.col
          choosedBox.value.row = box.row
          warehouse.value.layout[`${selectedBoxPosition}`] = choosedBox.value.category
          warehouse.value.layout[`${prevBoxPosition}`] = "empty"
        }
      };

      const changeSection = (option: String) => {
        return activeSection.value = option
      }

      const selectionsAreDone = computed(() => {
        if(clientId.value !== -1 && pitId.value !== -1 && purchaseOrder.value !== -1) {
          if(originalWarehouseWasSaved == false) {
            originalWarehouseWasSaved = true
            originalWarehouseLayout = warehouse.value.layout
          }
          return true
        }
      })

      const warehouse = ref({
        id: 2,
        clientCompanyId: 7,
        pitId: 1,
        layout: {
          "1|1|1": "cut",
          "1|1|2": "fine",
          "1|2|1": "empty",
          "1|2|2": "fine",
          "2|1|1": "aisle",
          "2|1|2": "fine",
          "2|2|1": "aisle",
          "2|2|2": "fine",
          "3|1|1": "aisle",
          "3|1|2": "cut",
          "3|2|1": "aisle",
          "3|2|2": "cut"
        },
        createdAt: "2021-08-06T14:44:26.000Z",
        updatedAt: null,
        deletedAt: null,
        pit: {
          id: 1,
          name: "pit 1"
        },
        clientCompany: {
          id: 7,
          name: "OtroCliente",
          legalName: "asd",
          legalId: 789,
          isOperator: false,
          childId: null,
          observations: "asd",
          companyRepresentativeId: 8
        }
      })

      let originalWarehouseLayout = {}
      let originalWarehouseWasSaved = false

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

      formatDeposit(warehouse.value.layout)

      let {floor,row,col, dimensions} = formatDeposit(warehouse.value.layout)

      let visibleCategories = ref([])

      const setVisibleCategories = (category: String) => {
        if(visibleCategories.value.includes(category)) {
          visibleCategories.value.splice(visibleCategories.value.indexOf(category))
        } else {
          visibleCategories.value.push(category)
        }
      }

      let cradles = ref([
        {
          "id": "1",
          "name": "MXH123",
          "observations": ""
        },
        {
          "id": "3",
          "name": "AB0012",
          "observations": "No funciona"
        },
        {
          "id": "4",
          "name": "SBC123",
          "observations": "No funciona"
        },
        {
          "id": "5",
          "name": "Gruita",
          "observations": "Es Camufalada ... FUaa"
        },
        {
          "id": "6",
          "name": "Pancho ",
          "observations": ""
        }
      ])

      let selectedCradle = ref(0) 

      const handleSelectedCradle = (id) => {
        selectedCradle.value = id
      }

      // :: CLIENT
      const clientId = ref(-1);
      const clients = ref([] as Array<Company>);
      const { data: companiesData } = useAxios('/company', instance);
      watch(companiesData, (companiesApi, prevCount) => {
        if (companiesApi && companiesApi.data) {
          clients.value = companiesApi.data;
        }
      });
      const selectedClientName = computed(() => {
        return clientId.value >= 0
          ? clients.value.find((pit) => pit.id === clientId.value).name
          : '';
      });
      // << CLIENT
      // :: PITS
      const pitId = ref(-1);
      const pits = ref([] as Array<Pit>);
      const { data: pitsData } = useAxios('/pit', instance);
      watch(pitsData, (pitApi, prevCount) => {
        if (pitApi && pitApi.data) {
          pits.value = pitApi.data;
        }
      });
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
        choosedBox.value.category = cat;
        const box = choosedBox.value;
        deposit.value[`${box.floor}|${box.row}|${box.col}`] = box.category;
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
        purchaseOrder,
        purchaseOrders
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
      margin-left: .5rem;
    }
  }
</style>
