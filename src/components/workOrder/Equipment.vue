<template>
  <form method="POST" action="/" class="p-4">
    <section class="md:flex md:justify-between max-w-4xl gap-4">
      <fieldset class="w-full max-w-sm">
        <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Cradle</legend>
        <section>
          <div class="input-block">
            <label for="cradle_main" class=""> Operativo </label>
            <div class="mt-1">
              <input v-model="operativeCradle" name="cradle_main" type="text" placeholder="Cradle 1" />
              <!-- <select v-model="operativeCradle" name="cradle_main">
                    <option selected disabled value="">Cradle Operativo</option>
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select> -->
            </div>
          </div>
          <div class="input-block">
            <label for="cradle_backup" class=""> Backup </label>
            <div class="mt-1">
              <input v-model="backupCradle" name="cradle_backup" type="text" placeholder="Cradle 25" />
              <!-- <select v-model="backupCradle" name="cradle_backup">
                    <option selected disabled value="">Backup Cradle</option>
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select> -->
            </div>
          </div>
        </section>
      </fieldset>
      <fieldset class="w-full max-w-sm">
        <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Forklift</legend>
        <section>
          <div class="input-block">
            <label for="operative_forklift" class=""> Operativo </label>
            <div class="mt-1">
              <input v-model="operativeForklift" name="operative_forklift" type="text" placeholder="Forklift 1" />
              <!-- <select v-model="operativeForklift" name="client">
                    <option selected disabled value="">Forklift Operativo</option>
                    <option value="roklim">Roklim</option>
                    <option value="salmin">Salmin</option>
                    <option value="eroba">Eroba</option>
                  </select> -->
            </div>
          </div>
          <div class="input-block">
            <label for="backup_forklift" class=""> Backup </label>
            <div class="mt-1">
              <input v-model="backupForklift" name="backup_forklift" type="text" placeholder="forklift 7" />
              <!-- <select v-model="backupForklift" name="client">
                    <option selected disabled value="">Backup Forklift</option>
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select> -->
            </div>
          </div>
        </section>
      </fieldset>
    </section>
    <fieldset>
      <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full max-w-4xl">Tractor / Chasis</legend>
      <section class="divide-y">
        <article v-for="traktor in traktors" :key="traktor.id" class="pt-2 pb-3 lg:flex lg:gap-4 lg:items-center">
          <div>
            <label :for="`tractor-${traktor.id}-chasis`"> ID Tractor / Chasis </label>
            <div class="pit-block">
              <input
                v-model="traktor.chassis"
                :name="`tractor-${traktor.id}-chasis`"
                type="text"
                placeholder="#47AGH"
              />
              <CircularBtn class="btn__delete btn__mobile-only" size="sm" @click="removeTraktor(traktor.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </div>
          <div class="input-block lg:w-5/12">
            <label :for="`tractor-${traktor.id}-proveedor`"> Proveedor </label>
            <div class="mt-1">
              <input
                v-model="traktor.supplier"
                :name="`tractor-${traktor.id}-proveedor`"
                type="text"
                placeholder="Nombre de proveedor"
              />
              <!-- <select v-model="traktor.supplier" :name="`tractor-${traktor.id}-proveedor`">
                    <option selected disabled value="">Proveedor</option>
                    <option value="10223">Transportes Zaraza SRL</option>
                    <option value="10224">Montoto Logistica SRL</option>
                    <option value="10225">E Inc</option>
                  </select> -->
            </div>
          </div>
          <div class="input-block">
            <label :for="`tractor-${traktor.id}-description`"> Descripción </label>
            <div class="mt-1">
              <input
                v-model="traktor.description"
                :for="`tractor-${traktor.id}-description`"
                type="text"
                placeholder="Tractor rojo"
              />
            </div>
          </div>
          <div class="mt-8 mb-5">
            <CircularBtn class="btn__delete btn__desktop-only" size="sm" @click="removeTraktor(traktor.id)">
              <TrashIcon class="w-5 h-5" />
            </CircularBtn>
          </div>
        </article>
      </section>
      <button class="mt-1 flex items-center" @click.prevent="addTraktor">
        <CircularBtn class="btn__add" size="xs">
          <PlusIcon class="w-4 h-4" />
        </CircularBtn>
        <span class="font-bold text-lg"> Agregar tractor / chasis </span>
      </button>
    </fieldset>
    <fieldset class="max-w-2xl">
      <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">ID Pickup</legend>
      <section class="divide-y">
        <article v-for="pickup in pickups" :key="pickup.id" class="pt-2 pb-3 lg:flex lg:gap-4 lg:items-center">
          <div class="lg:w-5/12">
            <label :for="`pickup-${pickup.id}-chassis`"> ID Pickup </label>
            <div class="pit-block">
              <input v-model="pickup.pickup_id" :name="`pickup-${pickup.id}-chassis`" type="text" placeholder="#456" />
              <CircularBtn class="btn__delete btn__mobile-only" size="sm" @click="removePickup(pickup.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </div>
          <div class="input-block lg:w-8/12">
            <label :for="`pickup-${pickup.id}-description`"> Descripción </label>
            <div class="mt-1">
              <input
                v-model="pickup.description"
                :name="`pickup-${pickup.id}-description`"
                type="text"
                placeholder="Pickup de color"
              />
            </div>
          </div>
          <div class="mt-8 mb-5">
            <CircularBtn class="btn__delete btn__desktop-only" size="sm" @click="removePickup(pickup.id)">
              <TrashIcon class="w-5 h-5" />
            </CircularBtn>
          </div>
        </article>
      </section>
      <button class="mt-1 flex items-center" @click.prevent="addPickup">
        <CircularBtn class="btn__add" size="xs">
          <PlusIcon class="w-4 h-4" />
        </CircularBtn>
        <span class="font-bold text-lg"> Agregar pickup </span>
      </button>
    </fieldset>
    <fieldset class="max-w-xl">
      <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Equipamiento</legend>
      <section class="equip-grid">
        <div class="input-block">
          <label for="rigmats">Rigmats</label>
          <div class="mt-1">
            <input v-model="rigmats" name="rigmats" type="number" placeholder="cantidad" />
          </div>
        </div>
        <div class="input-block">
          <label for="conex">Conex</label>
          <div class="mt-1">
            <input v-model="conex" name="conex" type="number" placeholder="cantidad" />
          </div>
        </div>
        <div class="input-block">
          <label for="generators">Generador de apoyo</label>
          <div class="mt-1">
            <input v-model="generators" name="generators" type="number" placeholder="cantidad" />
          </div>
        </div>
        <div class="input-block">
          <label for="tower">Torre de iluminación</label>
          <div class="mt-1">
            <input v-model="tower" name="tower" type="number" placeholder="cantidad" />
          </div>
        </div>
        <div class="input-block">
          <label for="cabin">Cabina de operador cradle</label>
          <div class="mt-1">
            <input v-model="cabin" name="cabin" type="number" placeholder="cantidad" />
          </div>
        </div>
      </section>
    </fieldset>
  </form>
</template>

<script lang="ts">
  import { ref, Ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

  import { Pit, Traktor, Pickup, HumanResource, Crew, WorkOrder } from '@/interfaces/WorkOrder';

import axios from 'axios';
const api = import.meta.env.VITE_API_URL;

  export default {
    components: {
      BookmarkIcon,
      CheckCircleIcon,
      CircularBtn,
      GhostBtn,
      Layout,
      PlusIcon,
      PrimaryBtn,
      TrashIcon,
    },
    setup() {
      // ::
      // Cradle
      // ::
      const operativeCradle: Ref<string> = ref('');
      const backupCradle: Ref<string> = ref('');
      // ::
      // Forklift
      // ::
      const operativeForklift: Ref<string> = ref('');
      const backupForklift: Ref<string> = ref('');
      // ::
      // Tractor
      // ::
      const traktors: Ref<Array<Traktor>> = ref([
        {
          id: 0,
          chassis: '',
          supplier: '',
          description: '',
        },
      ]);
      const removeTraktor = (traktorId: number) => {
        traktors.value = traktors.value.filter((traktor: Traktor) => traktor.id !== traktorId);
      };
      const addTraktor = (): void => {
        const lastTraktorId = traktors.value.length;
        traktors.value.push({
          id: lastTraktorId,
          chassis: '',
          supplier: '',
          description: '',
        });
      };
      // Remove empty traktors
      const removeEmptyTraktors = (): void => {
        traktors.value = traktors.value.filter(
          (traktor: Traktor) => !(traktor.chassis === '' && traktor.supplier === '' && traktor.description === '')
        );
      };
      // ::
      // Pickup
      // ::
      const pickups: Ref<Array<Pickup>> = ref([
        {
          id: 0,
          pickup_id: '',
          description: '',
        },
      ]);
      const removePickup = (pickupId: number) => {
        pickups.value = pickups.value.filter((pickup: Pickup) => pickup.id !== pickupId);
      };
      const addPickup = (): void => {
        const lastTraktorId = pickups.value.length;
        pickups.value.push({
          id: lastTraktorId,
          pickup_id: '',
          description: '',
        });
      };
      // Remove Empty Pickups
      const removeEmptyPickups = (): void => {
        pickups.value = pickups.value.filter((pickup: Pickup) => pickup.pickup_id !== '' && pickup.description !== '');
      };
      // ::
      // Equipment
      // ::

      // rigmats, conex, generators, tower, cabin
      const rigmats: Ref<number> = ref(0);
      const conex: Ref<number> = ref(0);
      const generators: Ref<number> = ref(0);
      const tower: Ref<number> = ref(0);
      const cabin: Ref<number> = ref(0);

      // Is the Equipment section is full
      const isEquipmentFull = computed(() => {
        return !!(
          operativeCradle.value &&
          // backupCradle.value &&
          operativeForklift.value &&
          // backupForklift.value &&
          traktors.value.length > 0 &&
          traktors.value[0].chassis &&
          traktors.value[0].description &&
          traktors.value[0].supplier &&
          pickups.value.length > 0 &&
          pickups.value[0].pickup_id &&
          pickups.value[0].description
        );
      });

      return {
        isEquipmentFull,
        operativeCradle,
        backupCradle,
        operativeForklift,
        backupForklift,
        traktors,
        removeTraktor,
        addTraktor,
        pickups,
        removePickup,
        addPickup,
        rigmats,
        conex,
        generators,
        tower,
        cabin,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
      /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
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

  .input-block select,
  .input-block input {
    @apply w-full rounded mb-3 p-2;
  }

  .pit-block {
    @apply flex mt-1 items-center w-full mb-3;
    & select,
    & input {
      @apply rounded p-2 max-w-md inline-block w-full;
    }
  }

  fieldset {
    @apply mb-6;
  }
  label {
    @apply text-sm;
  }
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }
</style>
