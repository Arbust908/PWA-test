<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Carga de planificación de arenas</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-12 text-xl">Locación</legend>
          <label class="col-span-12" for="sandProvider">
            <span>Pozo</span>
            <input v-model="pit" class="input" type="text" name="sandProvider" list="sandProvider" placeholder="Proveedor de Arena">
            <datalist id="sandProvider">
              <option value="San Luis">San Luis</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>
          <label class="col-span-10" for="sandType">
            <span>Etapas</span>
            <input v-model="stages" readonly class="input" type="number" name="sandType" placeholder="Etapas">
          </label>
          <div class="col-span-2 flex justify-end items-end">
            <CircularBtn class="btn__options" size="sm" @click="">
              <DotsVerticalIcon class="w-5 h-5" />
            </CircularBtn>
          </div>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-full text-xl">Transporte</legend>
          <template v-for="(sandStage, ssKey) in sandStages" :key="ssKey">
            <hr v-if="ssKey !== 0" class="mt-4 mb-2 col-span-full">
            <label class="col-span-full" for="sandType">
              <span>Etapa</span>
              <input v-model="sandStage.number" readonly class="input" type="text" name="sandType" placeholder="n° de Etapa">
            </label>

            <label class="col-span-5" for="sandType">
              <span>Tipo</span>
              <input v-model="sandStage.sandType" class="input" type="text" name="sandType" list="sandType" placeholder="arena">
              <datalist id="sandType">
                <option value="30/40">Arena #30/40</option>
                <option value="50/100">Arena #30/40</option>
              </datalist>
            </label>
            
            <label class="col-span-5" for="sandQuantity">
              <span>Cantidad</span>
              <div class="mt-1 flex rounded shadow-sm">
                <input v-model.number="sandStage.quantity" type="number" name="sandQuantity" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm" placeholder="22" list="sandQuantity" />
                <datalist id="sandQuantity">
                  <option value="12">12</option>
                  <option value="22">22</option>
                  <option value="44">44</option>
                  <option value="88">88</option>
                </datalist>
                <span class="inline-flex items-center px-3 rounded-r border  border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" title="Peso en Toneladas">
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
                <input v-model.number="totalAmount" readonly type="number" name="sandQuantity" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm" placeholder="Total de Arena" />
                <span class="inline-flex items-center px-3 rounded-r border  border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" title="Peso en Toneladas">
                  t
                </span>
              </div>
          </label>
        </fieldset>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="$router.push('/planificacion-de-arena')">Cancelar</button>
        <PrimaryBtn type="submit" size="sm" class="p-4" :class="isFull ? null : 'opacity-50 cursor-not-allowed'" :disabled="!isFull" @click.prevent="isFull && save()">
          Cargar Planificacíon
        </PrimaryBtn>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, reactive, computed, ComputedRef, toRaw } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useState, useActions } from 'vuex-composition-helpers';

  import { BookmarkIcon, TrashIcon, DotsVerticalIcon } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import Layout from '@/layouts/Main.vue';
  import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import { PurchaseOrder, SandProvider, SandOrder, TransportProvider } from '@/interfaces/PurchaseOrder.ts'

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon, 
    PlusIcon,
    CircularBtn,
    PrimaryBtn,
    DotsVerticalIcon,
  },
  setup() {
    // Init
    const store = useStore();
    const router = useRouter();

    const defaultStage = {
      id: 0,
      number: 1,
      sandType: '',
      quantity: null,
    }
    const pit = ref('');
    const sandStages = ref([{...defaultStage}])
    const stages = computed(() => {
      return sandStages.value.length;
    });
    const totalAmount = computed(() => {
      return sandStages.value.reduce((totalSand, sandStage) => {
        return totalSand + (sandStage.quantity || 0);
      }, 0);
    });

    const removeSandStage = (id: number) => {
      sandStages.value = sandStages.value.filter(stage => stage.id !== id);
    }
    const addSandStage = () => {
      const lastStageId = sandStages.value[sandStages.value.length - 1].id;
      const newStage = {...defaultStage};
      newStage.id = lastStageId + 1;
      newStage.number = newStage.number + 1;
      sandStages.value.push(newStage);
    }

    const isFull = computed(() => {
      return pit.value != '' && stages.value >= 1 && sandStages.value.every(stage => stage.quantity > 0) && sandStages.value.every(stage => stage.sandType !== '');
    });

    const { saveSandPlan } = useActions(['saveSandPlan']);
    const save = (): void => {
      const sandPlan = {
        pit: pit.value,
        sandStages: sandStages.value,
        stages: stages.value,
      }
      saveSandPlan(sandPlan);
      router.push('/planificacion-de-arena');
    };
    return {
      pit,
      sandStages,
      stages,
      removeSandStage,
      addSandStage,
      totalAmount,
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
    @apply bg-gray-200 border cursor-not-allowed
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
