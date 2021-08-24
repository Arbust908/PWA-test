<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Planificación de arenas
      </h1>
    </header>
    <section>
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset
          class="
            py-2
            w-full
            max-w-xl
            grid grid-cols-1
            md:grid-cols-2
            gap-3
            md:gap-4
          "
        >
          <label class="col-span-1" for="client">
            <span>Cliente</span>
            <select
              id="client"
              v-model="currentSandPlan.companyId"
              class="input"
              name="client"
            >
              <option selected disabled value="-1">Selecionar Cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </label>
          <label class="col-span-1" for="pit">
            <span>Pozo</span>
            <select
              id="pit"
              v-model="currentSandPlan.pitId"
              class="input"
              name="pit"
            >
              <option disabled selected value="-1">Seleccionar Pozo</option>
              <option v-for="pit in pits" :key="pit.id" :value="pit.id">
                {{ pit.name }}
              </option>
            </select>
          </label>
        </fieldset>
      </form>
    </section>
    <section class="bg-white rounded-md shadow-sm mb-14">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <header class="flex justify-between">
          <section class="flex space-x-4">
            <h2 class="text-2xl font-bold space-x-2">
              <span>Pozo</span>
              <span>{{ selectedPitName }}</span>
            </h2>
            <button class="flex items-center" @click.prevent="addStage">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold"> Agregar etapa </span>
            </button>
          </section>
          <section class="flex space-x-4">
            <button
              @click.prevent="toggleCurOp()"
              :title="currentOpened ? 'Ocultar Etapas' : 'Mostrar Etapas'"
            >
              <ChevronUpIcon
                :opened="currentOpened"
                :class="currentOpened ? 'rotate-180' : null"
                class="
                  w-8
                  h-8
                  text-gray-600
                  transition
                  transform
                  duration-300
                  ease-out
                  cursor-pointer
                "
              />
            </button>
          </section>
        </header>
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <StageHeader />
                  </thead>
                  <tbody v-show="currentOpened" class="divide-y">
                    <SandPlanStage
                      v-for="(stage, Key) in inProgressStages"
                      :key="Key"
                      :pos="Key + 1"
                      :stage="stage"
                      :editing="editingStage"
                      :sands="sands"
                      @editStage="editStage"
                      @saveStage="saveStage"
                      @duplicateStage="duplicateStage"
                      @deleteStage="deleteStage"
                    />
                    <StageEmptyState v-if="inProgressStages.length <= 0" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <header class="flex justify-between">
          <section class="flex space-x-4">
            <h2 class="text-2xl font-bold">
              <span>Etapas finalizadas</span>
            </h2>
          </section>
          <section class="flex space-x-4">
            <button
              @click.prevent="toggleFinOp()"
              :title="finishedOpened ? 'Ocultar Etapas' : 'Mostrar Etapas'"
            >
              <ChevronUpIcon
                :opened="finishedOpened"
                :class="finishedOpened ? 'rotate-180' : null"
                class="
                  w-8
                  h-8
                  text-gray-600
                  transition
                  transform
                  duration-300
                  ease-out
                  cursor-pointer
                "
              />
            </button>
          </section>
        </header>
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <StageHeader />
                  </thead>
                  <tbody v-show="finishedOpened" class="divide-y">
                    <SandPlanStage
                      v-for="(stage, Key) in finishedStages"
                      :key="Key"
                      :stage="stage"
                      :editing="editingStage"
                      :sands="sands"
                      @editStage="editStage"
                      @saveStage="saveStage"
                      @duplicateStage="duplicateStage"
                      @deleteStage="deleteStage"
                    />
                    <StageEmptyState v-if="finishedStages.length <= 0" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
    <footer class="p-4 space-x-8 flex justify-end">
      <button @click.prevent="$router.push('/planificacion-de-arena')">
        Cancelar
      </button>
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
    toRaw,
    watch,
    watchEffect,
  } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useActions } from 'vuex-composition-helpers';

  import {
    BookmarkIcon,
    DotsVerticalIcon,
    ChevronUpIcon,
  } from '@heroicons/vue/outline';
  import {
    PlusIcon,
    DocumentDuplicateIcon,
    PencilAltIcon,
    TrashIcon,
  } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import SandPlanStage from '@/components/sandPlan/StageRow.vue';
  import StageEmptyState from '@/components/sandPlan/StageEmptyState.vue';
  import StageHeader from '@/components/sandPlan/StageHeader.vue';
  import { Pit, Company, SandPlan } from '@/interfaces/sandflow';
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  import { useToggle } from '@vueuse/core';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      GhostBtn,
      BookmarkIcon,
      PlusIcon,
      CircularBtn,
      PrimaryBtn,
      DotsVerticalIcon,
      ChevronUpIcon,
      DocumentDuplicateIcon,
      PencilAltIcon,
      TrashIcon,
      SandPlanStage,
      StageEmptyState,
      StageHeader,
    },
    setup() {
      // Init
      const store = useStore();
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      const currentSandPlan: SandPlan = reactive({
        companyId: -1,
        pitId: -1,
        stagesAmount: 1,
        status: 'started',
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
      watchEffect(() => {
        if (currentSandPlan.companyId !== -1) {
          pits.value = backupPits.value.filter((pit) => {
            return pit.companyId === currentSandPlan.companyId;
          });
        }
        if (currentSandPlan.pitId !== -1) {
          const curPit = pits.value.find((pit) => {
            return pit.id === currentSandPlan.pitId;
          });
          if (curPit) {
            clients.value = backupClients.value.filter((client) => {
              return client.id === curPit.companyId;
            });
            if (clients.value.length === 1) {
              currentSandPlan.companyId = clients.value[0].id;
            }
          }
        }
      });

      const addStage = () => {
        if (currentSandPlan.stages?.length >= 39) {
          // Disparar modal. No se puede mas de 40 etapas
          return;
        }
        const defaultStage = {
          id: 0,
          stage: 1,
          sandId1: -1,
          quantity1: null,
          sandId2: -1,
          quantity2: null,
          sandId3: -1,
          quantity3: null,
          sandPlanId: 0,
          status: 0,
        };
        duplicateStage(defaultStage);
      };

      const inProgressStages = computed(() => {
        return currentSandPlan.stages.filter((stage) => stage.status < 2);
      });
      const finishedStages = computed(() => {
        return currentSandPlan.stages.filter((stage) => stage.status >= 2);
      });
      const editingStage = ref(0);

      const editStage = (stage) => {
        editingStage.value = stage.id;
      };
      const saveStage = (stage) => {
        currentSandPlan.stages[stage.id] = stage;
        editingStage.value = -1;
      };
      const duplicateStage = (stage) => {
        const lastStage =
          currentSandPlan.stages[currentSandPlan.stages.length - 1];
        const lastStageId = { id: lastStage.id + 1 };
        const lastStageStage = { stage: lastStage.stage + 1 };
        const newStatus = { status: 0 };
        const newStage = {
          ...stage,
          ...lastStageId,
          ...lastStageStage,
          ...newStatus,
        };
        currentSandPlan.stages.push(newStage);
        editStage(newStage);
      };
      const deleteStage = (stage) => {
        const stageId = stage.id;
        currentSandPlan.stages = currentSandPlan.stages.filter(
          (s) => s.id !== stageId
        );
      };

      const currentOpened: Ref<boolean> = ref(true);
      const toggleCurOp = useToggle(currentOpened);
      const finishedOpened: Ref<boolean> = ref(false);
      const toggleFinOp = useToggle(finishedOpened);
      // :: CLIENT
      const clients = ref([] as Array<Company>);
      const backupClients = ref([] as Array<Company>);
      const { data: companiesData } = useAxios('/company', instance);
      watch(companiesData, (companiesApi, prevCount) => {
        if (companiesApi && companiesApi.data) {
          clients.value = companiesApi.data;
          backupClients.value = companiesApi.data;
        }
      });
      // << CLIENT
      // :: PITS
      const pits = ref([] as Array<Pit>);
      const backupPits = ref([] as Array<Pit>);
      const { data: pitsData } = useAxios('/pit', instance);
      watch(pitsData, (pitApi, prevCount) => {
        if (pitApi && pitApi.data) {
          pits.value = pitApi.data;
          backupPits.value = pitApi.data;
        }
      });
      const selectedPitName = computed(() => {
        return currentSandPlan.pitId >= 0
          ? pits.value.find((pit) => pit.id === currentSandPlan.pitId).name
          : '';
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
        const noZeroSandTypeNull =
          (currentSandPlan.stages[0].sandId1 !== null &&
            currentSandPlan.stages[0].sandId1 !== -1) ||
          (currentSandPlan.stages[0].sandId2 !== null &&
            currentSandPlan.stages[0].sandId2 !== -1) ||
          (currentSandPlan.stages[0].sandId3 !== null &&
            currentSandPlan.stages[0].sandId3 !== -1);
        const noZeroSandTypeZero =
          currentSandPlan.stages[0].quantity1 !== 0 ||
          currentSandPlan.stages[0].quantity2 !== 0 ||
          currentSandPlan.stages[0].quantity3 !== 0;
        return !!(
          currentSandPlan.companyId >= 0 &&
          currentSandPlan.pitId >= 0 &&
          currentSandPlan.stages.length > 0 &&
          currentSandPlan.stages.length <= 40 &&
          noZeroSandTypeNull &&
          noZeroSandTypeZero
        );
      });
      const { saveSandPlan } = useActions(['saveSandPlan']);
      const save = (): void => {
        currentSandPlan.stages.map((stage) => {
          console.log(stage);
          if (stage.sandId1 === -1) {
            stage.sandId1 = null;
          }
          if (stage.sandId2 === -1) {
            stage.sandId2 = null;
          }
          if (stage.sandId3 === -1) {
            stage.sandId3 = null;
          }
          return stage;
        });
        currentSandPlan.stages = currentSandPlan.stages.filter((stage) => {
          const noSandTypeNull =
            (stage.sandId1 !== null && stage.quantity1 > 0) ||
            (stage.sandId2 !== null && stage.quantity2 > 0) ||
            (stage.sandId3 !== null && stage.quantity3 > 0);
          return noSandTypeNull;
        });
        const { data } = useAxios(
          '/sandPlan',
          { method: 'POST', data: currentSandPlan },
          instance
        );
        watch(data, (apiData) => {
          if (apiData && apiData.data) {
            const sandPlanId = apiData.data.id;
            currentSandPlan.id = sandPlanId;
            currentSandPlan.stages.map((stage) => {
              const { id, ...sandStage } = stage;
              sandStage.sandPlanId = sandPlanId;
              sandStage.action = 'create';
              console.log('Sand Stage', sandStage);
              const { data } = useAxios(
                '/sandStage',
                { method: 'POST', data: sandStage },
                instance
              );
            });
            console.log(currentSandPlan);
            saveSandPlan({ ...currentSandPlan });
            router.push('/planificacion-de-arena');
          }
        });
      };
      return {
        currentSandPlan,
        inProgressStages,
        finishedStages,
        editingStage,
        editStage,
        saveStage,
        duplicateStage,
        deleteStage,
        currentOpened,
        toggleCurOp,
        finishedOpened,
        toggleFinOp,
        clients,
        pits,
        selectedPitName,
        sands,
        save,
        isFull,
        addStage,
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
