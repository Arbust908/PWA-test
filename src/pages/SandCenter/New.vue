<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-second-900 text-xl self-start mb-3 md:mb-0">Centro de carga de arenas</h1>
    </header>
    <section class="bg-second-50 rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 grid-r gap-3 md:gap-4">
          <legend class="col-span-12 text-xl">Orden de Pedido</legend>
          <label class="col-span-12" for="provider">
            <span>Proveedor</span>
            <input
              v-model="provider"
              class="input"
              type="text"
              name="provider"
              list="provider"
              placeholder="Proveedor de Arena"
            />
            <datalist id="provider">
              <option value="San Luis">San Luis</option>
              <option value="Orange">Orange</option>
            </datalist>
          </label>
        </fieldset>
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <legend class="col-span-full text-xl">Arena</legend>
          <template v-for="(sandCarge, scKey) in sandCarges" :key="scKey">
            <hr v-if="scKey !== 0" class="mt-4 mb-2 col-span-full" />
            <label class="col-span-full" for="sandType">
              <span>Tipo</span>
              <input
                v-model="sandCarge.sandType"
                class="input"
                type="text"
                name="sandType"
                list="sandType"
                placeholder="Tipo de Arena"
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
                  v-model.number="sandCarge.quantity"
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
                    border-second-300
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
                    border border-second-300
                    bg-second-50
                    text-second-500
                    sm:text-sm
                  "
                  title="Peso en Toneladas"
                >
                  t
                </span>
              </div>
            </label>

            <label class="col-span-5" for="sandType">
              <span>ID Caja</span>
              <input
                v-model="sandCarge.boxId"
                class="input"
                type="text"
                name="sandType"
                list="sandType"
                placeholder="Codigo de Caja"
              />
              <datalist id="sandType">
                <option value="#1234455">#1234455</option>
                <option value="#1234455">#1234455</option>
              </datalist>
            </label>

            <div class="col-span-2 flex justify-end items-end">
              <CircularBtn class="btn__delete" size="sm" @click="removeSandCarge(sandCarge.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </template>
          <div class="col-span-full mt-1 pb-4 mb-4 border-b">
            <button class="flex items-center p-1" @click.prevent="addSandCarge">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-4 h-4" />
              </CircularBtn>
              <span class="font-bold text"> Agregar Etapa </span>
            </button>
          </div>
          <label class="col-span-full toggle" for="sandBoxId">
            <span>Camion Patente {{ transportId }} - {{ loaded ? 'Cargado' : 'No Cargado' }}</span>
            <SlimToggle :on="loaded" @click="toggleLoaded" />
          </label>
        </fieldset>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="$router.push('/centro-de-carga-de-arena')">Cancelar</button>
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
import { ref, Ref, reactive, computed, ComputedRef, toRaw, defineComponent } from 'vue';
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
import { PurchaseOrder, SandProvider, SandOrder, TransportProvider } from '@/interfaces/PurchaseOrder.ts';
import SlimToggle from '@/components/ui/SlimToggle.vue';

interface SandCarge {
  id: number;
  sandType: string;
  quantity: number;
  boxId: string;
}

export default defineComponent({
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon,
    PlusIcon,
    CircularBtn,
    PrimaryBtn,
    DotsVerticalIcon,
    SlimToggle,
  },
  setup() {
    // Init
    const store = useStore();
    const router = useRouter();

    const provider: Ref<string> = ref(null);
    const sandCarges: Ref<Array<SandCarge>> = ref([]);
    const transportId: Ref<string> = ref(null);
    const loaded: Ref<boolean> = ref(false);

    const addSandCarge = () => {
      sandCarges.value.push({
        id: sandCarges.value.length + 1,
        sandType: '',
        quantity: 0,
        boxId: '',
      });
    };
    const removeSandCarge = (id: number) => {
      sandCarges.value = sandCarges.value.filter((c) => c.id !== id);
    };
    addSandCarge();

    const toggleLoaded = () => {
      loaded.value = !loaded.value;
    };

    const isFull = computed(() => {
      return (
        provider.value &&
        sandCarges.value.length > 0 &&
        transportId.value &&
        sandCarges.value.every((c) => c.boxId) &&
        sandCarges.value.every((c) => c.quantity > 0) &&
        sandCarges.value.every((c) => c.sandType)
      );
    });

    const { saveSandCenter } = useActions(['saveSandCenter']);
    const save = (): void => {
      const sandCenter = {
        provider: provider.value,
        sandCarges: sandCarges.value,
        transportId: transportId.value,
        loaded: loaded.value,
      };
      saveSandCenter(sandCenter);
      router.push('/centro-de-carga-de-arena');
    };
    return {
      provider,
      sandCarges,
      transportId,
      loaded,
      addSandCarge,
      removeSandCarge,
      toggleLoaded,
      save,
      isFull,
    };
  },
});
</script>

<style lang="scss" scoped>
.input {
  @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
}
input:read-only {
  @apply bg-second-200 border cursor-not-allowed;
}
fieldset:not(:last-of-type) {
  @apply border-b pb-6;
}
label:not(.toggle) {
  @apply flex flex-col;
  span {
    @apply text-sm;
  }
}
.toggle {
  @apply flex space-x-3 items-center;
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
</style>
