<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Planificación de arenas</h1>
    </header>
    <section>
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <label class="col-span-1" for="client">
            <span>Cliente</span>
            <select id="client" v-model="currentSandPlan.companyId" class="input" type="text" name="client">
              <option selected disabled value="-1">Selecionar Cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <label class="col-span-1" for="pit">
            <span>Pozo</span>
            <select id="pit" v-model="currentSandPlan.pitId" class="input" type="text" name="pit">
              <option disabled selected value="-1">Seleccionar Pozo</option>
              <option v-for="pit in pits" :key="pit.id" :value="pit.id">{{ pit.name }}</option>
            </select>
          </label>
        </fieldset>
      </form>
    </section>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <header class="flex justify-between">
          <section class="flex space-x-4">
            <h2 class="text-2xl font-bold">
              <span>Pozo</span>
              <span>{{ selectedPitName }}</span>
            </h2>
            <button class="flex items-center" @click.prevent="">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold"> Agregar pozo </span>
            </button>
          </section>
          <section class="flex space-x-4">
            <!-- <CircularBtn class="btn__add hidden" size="xs">
              <PlusIcon class="w-4 h-4" />
            </CircularBtn> -->
            <ChevronDownIcon
              :opened="currentOpened"
              :class="currentOpened ? 'rotate-180' : null"
              class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer"
              @click="toggleCurOp"
            />
          </section>
        </header>
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Etapa
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo de arena A
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo de arena B
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo de arena C
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stage, Key) in currentSandPlan.stages" :key="Key">
                      <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-lg">{{ stage.stage }} - 40</td>
                      <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                        <select id="pit" v-model="stage.sandId" class="input" type="text" name="pit">
                          <option disabled selected value="-1">Seleccionar</option>
                          <option v-for="sand in sands" :key="sand.id" :value="sand.id">
                            {{ sand.type }}
                          </option>
                        </select>
                      </td>
                      <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                        <select id="pit" v-model="stage.sandId" class="input" type="text" name="pit">
                          <option disabled selected value="-1">Seleccionar</option>
                          <option v-for="sand in sands" :key="sand.id" :value="sand.id">
                            {{ sand.type }}
                          </option>
                        </select>
                      </td>
                      <td class="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                        <select id="pit" v-model="stage.sandId" class="input" type="text" name="pit">
                          <option disabled selected value="-1">Seleccionar</option>
                          <option v-for="sand in sands" :key="sand.id" :value="sand.id">
                            {{ sand.type }}
                          </option>
                        </select>
                      </td>
                      <td class="text-gray-500 px-6 py-4 whitespace-nowrap font-bold">0t</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="rounded-full bg-gray-700 text-white px-4"> Creada </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div>
                          <button @click="" class="text-red-600 hover:text-red-900 p-2">
                            <DocumentDuplicateIcon class="w-5 h-5" />
                            <span class="sr-only">Duplicar</span>
                          </button>
                          <button @click="" class="text-red-600 hover:text-red-900 p-2">
                            <PencilAltIcon class="w-5 h-5" />
                            <span class="sr-only">Editar</span>
                          </button>
                          <button @click="" class="text-red-600 hover:text-red-900 p-2">
                            <TrashIcon class="w-5 h-5" />
                            <span class="sr-only">Borrar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <label class="col-span-12" for="sandProvider">
            <span>Pozo</span>
            <input
              v-model="pit"
              class="input"
              type="text"
              name="sandProvider"
              list="sandProvider"
              placeholder="Proveedor de Arena"
            />
            <datalist id="sandProvider">
              <option value="San Luis">San Luis</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>
          <label class="col-span-10" for="sandType">
            <span>Etapas</span>
            <input v-model="stages" readonly class="input" type="number" name="sandType" placeholder="Etapas" />
          </label>
          <div class="col-span-2 flex justify-end items-end">
            <CircularBtn class="btn__options" size="sm" @click="">
              <DotsVerticalIcon class="w-5 h-5" />
            </CircularBtn>
          </div>
        </fieldset>
        <!-- <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-full text-xl">Transporte</legend>
          <template v-for="(sandStage, ssKey) in sandStages" :key="ssKey">
            <hr v-if="ssKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label class="col-span-full" for="sandType">
              <span>Etapa</span>
              <input
                v-model="sandStage.number"
                readonly
                class="input"
                type="text"
                name="sandType"
                placeholder="n° de Etapa"
              />
            </label>

            <label class="col-span-5" for="sandType">
              <span>Tipo</span>
              <input
                v-model="sandStage.sandType"
                class="input"
                type="text"
                name="sandType"
                list="sandType"
                placeholder="arena"
              />
              <datalist id="sandType">
                <option value="30/40">Arena #30/40</option>
                <option value="50/100">Arena #30/40</option>
              </datalist>
            </label>

            <label class="col-span-5" for="sandQuantity">
              <span>Cantidad</span>
              <div class="mt-1 flex rounded shadow-sm">
                <input
                  v-model.number="sandStage.quantity"
                  type="number"
                  name="sandQuantity"
                  class="
                    flex-1
                    min-w-0
                    block
                    w-full
                    px-3
                    py-2
                    rounded-none
                    border-r-0
                    rounded-l
                    focus:ring-indigo-500 focus:border-indigo-500
                    border-gray-300
                    sm:text-sm
                  "
                  placeholder="22"
                  list="sandQuantity"
                />
                <datalist id="sandQuantity">
                  <option value="12">12</option>
                  <option value="22">22</option>
                  <option value="44">44</option>
                  <option value="88">88</option>
                </datalist>
                <span
                  class="
                    inline-flex
                    items-center
                    px-3
                    rounded-r
                    border border-gray-300
                    bg-gray-50
                    text-gray-500
                    sm:text-sm
                  "
                  title="Peso en Toneladas"
                >
                  t
                </span>
              </div>
            </label>

            <div class="col-span-2 flex justify-end items-end">
              <CircularBtn class="btn__delete" size="sm" @click="removeSandStage(sandStage.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </template>
          <button class="col-span-full mt-1 pb-4 mb-4 border-b flex items-center" @click.prevent="addSandStage">
            <CircularBtn class="btn__add" size="xs">
              <PlusIcon class="w-4 h-4" />
            </CircularBtn>
            <span class="font-bold text"> Agregar Etapa </span>
          </button>
          <label class="col-span-full" for="sandBoxId">
            <span>Total Arena</span>
            <div class="mt-1 flex rounded shadow-sm">
              <input
                v-model.number="totalAmount"
                readonly
                type="number"
                name="sandQuantity"
                class="
                  flex-1
                  min-w-0
                  block
                  w-full
                  px-3
                  py-2
                  rounded-none
                  border-r-0
                  rounded-l
                  focus:ring-indigo-500 focus:border-indigo-500
                  border-gray-300
                  sm:text-sm
                "
                placeholder="Total de Arena"
              />
              <span
                class="
                  inline-flex
                  items-center
                  px-3
                  rounded-r
                  border border-gray-300
                  bg-gray-50
                  text-gray-500
                  sm:text-sm
                "
                title="Peso en Toneladas"
              >
                t
              </span>
            </div>
          </label>
        </fieldset> -->
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="$router.push('/planificacion-de-arena')">Cancelar</button>
        <PrimaryBtn
          type="submit"
          size="sm"
          class="p-4"
          :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
          :disabled="!isFull"
          @click.prevent="isFull && save()"
        >
          Cargar Planificacíon
        </PrimaryBtn>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, ComputedRef, toRaw, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useState, useActions } from 'vuex-composition-helpers';

import { BookmarkIcon, DotsVerticalIcon, ChevronDownIcon } from '@heroicons/vue/outline';
import { PlusIcon, DocumentDuplicateIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
import {
  PurchaseOrder,
  SandProvider,
  SandOrder,
  TransportProvider,
  Pit,
  Company,
} from '@/interfaces/sandflow.Types.ts';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
import { useToggle } from '@vueuse/core';
const api = import.meta.env.VITE_API_URL;

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    PlusIcon,
    CircularBtn,
    PrimaryBtn,
    DotsVerticalIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon,
    PencilAltIcon,
    TrashIcon,
  },
  setup() {
    // Init
    const store = useStore();
    const router = useRouter();
    const instance = axios.create({
      baseURL: api,
    });
    const currentSandPlan = reactive({
      companyId: -1,
      pitId: -1,
      stagesAmount: 1,
      stages: [
        {
          id: 0,
          stage: 1,
          sandId: -1,
          quantity: 200,
          sandPlanId: 0,
        },
      ],
    });
    const currentOpened: Ref<boolean> = ref(false);
    const toggleCurOp = useToggle(currentOpened);
    // :: CLIENT
    const clients = ref([] as Array<Company>);
    const { data: companiesData } = useAxios('/company', instance);
    watch(companiesData, (companiesApi, prevCount) => {
      if (companiesApi && companiesApi.data) {
        clients.value = companiesApi.data;
      }
    });
    // << CLIENT
    // :: PITS
    const pits = ref([] as Array<Pit>);
    const { data: pitsData } = useAxios('/client', instance);
    watch(pitsData, (pitApi, prevCount) => {
      if (pitApi && pitApi.data) {
        pits.value = pitApi.data;
      }
    });
    const selectedPitName = computed(() => {
      return currentSandPlan.pitId >= 0 ? pits.value.find((pit) => pit.id === currentSandPlan.pitId).name : '';
    });
    // << PITS
    // :: SAND
    const sands = ref([] as Array<Pit>);
    const { data: sandsData } = useAxios('/sand', instance);
    watch(sandsData, (sandApi, prevCount) => {
      if (sandApi && sandApi.data) {
        sands.value = sandApi.data;
      }
    });
    // << SAND

    const isFull = computed(() => {
      return false;
    });
    const { saveSandPlan } = useActions(['saveSandPlan']);
    const save = (): void => {
      const sandPlan = {
        pit: pit.value,
        sandStages: sandStages.value,
        stages: stages.value,
      };
      saveSandPlan(sandPlan);
      router.push('/planificacion-de-arena');
    };
    return {
      currentSandPlan,
      currentOpened,
      toggleCurOp,
      clients,
      pits,
      selectedPitName,
      sands,
      save,
      isFull,
    };
  },
};
</script>

<style lang="scss" scoped>
.input {
  @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 mt-1 flex shadow-sm;
}
input:read-only {
  @apply bg-gray-200 border cursor-not-allowed;
}
fieldset:not(:last-of-type) {
  @apply border-b pb-6;
}
label {
  @apply flex flex-col;
  span {
    @apply text-sm;
  }
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
