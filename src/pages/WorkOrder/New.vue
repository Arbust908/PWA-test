<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Orden de Trabjao - #1234</h1>
      <GhostBtn class="btn__draft" @click="save()">
        <BookmarkIcon class="w-5 h-5" />
        <span> Guardar Provisorio </span>
      </GhostBtn>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <nav class="flex justify-between">
        <button class="section-tab" :selected="WO_section === 'orden'" @click="changeSection('orden')">Orden</button>
        <button class="section-tab" :selected="WO_section === 'equipamento'" @click="changeSection('equipamento')">
          Equipamento
        </button>
        <button class="section-tab" :selected="WO_section === 'rrhh'" @click="changeSection('rrhh')">RRHH</button>
      </nav>
      <form v-if="WO_section === 'orden'" method="POST" action="/" class="p-4 max-w-lg">
        <fieldset>
          <div class="input-block">
            <label for="client" class=""> Cliente </label>
            <div class="mt-1">
              <select name="client">
                <option selected disabled>ej: Nasta</option>
                <option value="ypf">YPF</option>
                <option value="ypf2">YPF2</option>
                <option value="ypf3">YPF3</option>
              </select>
            </div>
          </div>
          <div class="input-block">
            <label for="service_co" class=""> Operadora / Empresa de Servicios </label>
            <div class="mt-1">
              <select name="service_co">
                <option selected disabled>ej: Pipele</option>
                <option value="ypf">YPF</option>
                <option value="ypf2">YPF2</option>
                <option value="ypf3">YPF3</option>
              </select>
            </div>
          </div>
          <div class="input-block">
            <label for="pad" class=""> PAD </label>
            <div class="mt-1">
              <input name="pad" type="text" placeholder="ej: 12313" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Pozos</legend>
          <section class="input-block_multi">
            <label for="pit" class=""> Pozo </label>
            <div v-for="pit in pits" :key="pit.id" class="pit-block">
              <input name="pit" type="text" :value="pit.name" placeholder="nombre del Pozo" />
              <CircularBtn class="btn__delete" size="sm" @click="removePit(pit.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
            <div class="pit-block mt-1">
              <input name="pit" type="text" placeholder="nombre del Pozo" v-model="new_pit_name" />
              <CircularBtn class="btn__delete invisible">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
            <button class="mt-1 flex items-center" @click.prevent="addPit">
              <CircularBtn class="btn__add" size="xs">
                <PlusIcon class="w-5 h-5" />
              </CircularBtn>
              <span class="font-bold text-lg"> Agregar pozo </span>
            </button>
          </section>
        </fieldset>
      </form>
      <form v-else-if="WO_section === 'equipamento'" method="POST" action="/" class="p-4">
        <section class="md:flex md:justify-between max-w-4xl gap-4">
          <fieldset class="w-full max-w-sm">
            <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Cradle</legend>
            <section>
              <div class="input-block">
                <label for="cradle_main" class=""> Operativo </label>
                <div class="mt-1">
                  <select name="cradle_main">
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select>
                </div>
              </div>
              <div class="input-block">
                <label for="cradle_backup" class=""> Backup </label>
                <div class="mt-1">
                  <select name="cradle_backup">
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select>
                </div>
              </div>
            </section>
          </fieldset>
          <fieldset class="w-full max-w-sm">
            <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Forklift</legend>
            <section>
              <div class="input-block">
                <label for="client" class=""> Operativo </label>
                <div class="mt-1">
                  <select name="client">
                    <option value="roklim">Roklim</option>
                    <option value="salmin">Salmin</option>
                    <option value="eroba">Eroba</option>
                  </select>
                </div>
              </div>
              <div class="input-block">
                <label for="client" class=""> Backup </label>
                <div class="mt-1">
                  <select name="client">
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select>
                </div>
              </div>
            </section>
          </fieldset>
        </section>
        <fieldset>
          <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Tractor / Chasis</legend>
          <section class="divide-y">
            <article v-for="traktor in traktors" :key="traktor.id" class="pt-2 pb-3 lg:flex lg:gap-4 lg:items-center">
              <div class="">
                <label for="client" class=""> ID Tractor / Chasis </label>
                <div class="pit-block">
                  <input name="pit" type="text" placeholder="#47AGH" />
                  <CircularBtn class="btn__delete btn__mobile-only" size="sm" @click="removeTraktor(traktor.id)">
                    <TrashIcon class="w-5 h-5" />
                  </CircularBtn>
                </div>
              </div>
              <div class="input-block lg:w-5/12">
                <label for="client" class=""> Proveedor </label>
                <div class="mt-1">
                  <select name="client">
                    <option selected disabled>Proveedor</option>
                    <option value="10223">Transportes Zaraza SRL</option>
                    <option value="10224">Montoto Logistica SRL</option>
                    <option value="10225">E Inc</option>
                  </select>
                </div>
              </div>
              <div class="input-block">
                <label for="client" class=""> Descripción </label>
                <div class="mt-1">
                  <input name="" type="text" placeholder="Tractor rojo" />
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
                <label for="client" class=""> ID Pickup </label>
                <div class="pit-block">
                  <input name="pit" type="text" />
                  <CircularBtn class="btn__delete btn__mobile-only" size="sm" @click="removePickup(pickup.id)">
                    <TrashIcon class="w-5 h-5" />
                  </CircularBtn>
                </div>
              </div>
              <div class="input-block lg:w-8/12">
                <label for="client" class=""> Descripción </label>
                <div class="mt-1">
                  <input name="" type="text" />
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
              <label for="pad" class=""> Rigmats </label>
              <div class="mt-1">
                <input name="pad" type="number" placeholder="0" />
              </div>
            </div>
            <div class="input-block">
              <label for="pad" class=""> Conex </label>
              <div class="mt-1">
                <input name="pad" type="number" placeholder="0" />
              </div>
            </div>
            <div class="input-block">
              <label for="pad" class=""> Generador de apoyo </label>
              <div class="mt-1">
                <input name="pad" type="number" placeholder="0" />
              </div>
            </div>
            <div class="input-block">
              <label for="pad" class=""> Torre de iluminación </label>
              <div class="mt-1">
                <input name="pad" type="number" placeholder="0" />
              </div>
            </div>
            <div class="input-block col-span-2">
              <label for="pad" class=""> Cabina de operador cradle </label>
              <div class="mt-1">
                <input name="pad" type="number" placeholder="0" />
              </div>
            </div>
          </section>
        </fieldset>
      </form>
      <form v-else-if="WO_section === 'rrhh'" method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-4">
        <fieldset v-for="crew in crews" :key="crew.id" class="max-w-sm w-full">
          <legend class="flex justify-between items-center font-bold text-2xl pb-4 border-b mb-3 w-full">
            <span>{{ crew.title }}</span>
            <select class="rounded" name="client" :time="crew.time">
              <option value="7">7:00 PM</option>
              <option value="8">8:00 PM</option>
              <option value="9">9:00 PM</option>
            </select>
          </legend>
          <section class="divide-y">
            <article v-for="people in crew.resources" :key="people.id" class="pt-2 pb-3">
              <div class="">
                <label for="client" class=""> Rol </label>
                <div class="pit-block">
                  <select name="client">
                    <option selected disabled>Lead Operator</option>
                    <option value="7">7:00 PM</option>
                    <option value="8">8:00 PM</option>
                    <option value="9">9:00 PM</option>
                  </select>
                  <CircularBtn class="btn__delete" size="sm" @click="removeResource(crew.id, people.id)">
                    <TrashIcon class="w-5 h-5" />
                  </CircularBtn>
                </div>
              </div>
              <div class="input-block">
                <div class="mt-1">
                  <select name="client">
                    <option selected disabled>Selecciona Rol</option>
                    <option value="7">7:00 PM</option>
                    <option value="8">8:00 PM</option>
                    <option value="9">9:00 PM</option>
                  </select>
                </div>
              </div>
            </article>
          </section>
          <button class="mt-1 flex items-center" @click.prevent="addResource(crew.id)">
            <CircularBtn class="btn__add" size="xs">
              <PlusIcon class="w-4 h-4" />
            </CircularBtn>
            <span class="font-bold text-lg"> Agregar otro </span>
          </button>
        </fieldset>
        <button
          class="max-w-sm w-full bg-gray-200 border-2 border-transparent rounded group hover:border-gray-400 p-4"
          @click.prevent="addCrew"
        >
          <div class="text-gray-500 font-bold text-2xl w-full flex justify-center items-center flex-col gap-4">
            <span class="group-hover:text-gray-600">Agregar Crew</span>
            <CircularBtn class="btn__add--special" size="sm">
              <PlusIcon class="w-6 h-6" />
            </CircularBtn>
          </div>
        </button>
      </form>
      <footer class="p-4 space-x-8 flex justify-end">
        <button @click.prevent="goToShowAll">Cancelar</button>
        <PrimaryBtn v-if="!isLastSection()" @click="nextSection"> Siguiente </PrimaryBtn>
        <PrimaryBtn v-else @click="save(true)"> Finalizar </PrimaryBtn>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
// import { ref, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import { ref, Ref } from 'vue';
// import { useState, useGetters, useActions } from '@/store/helpers';
import { useState, useGetters, useActions } from 'vuex-composition-helpers';

import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
import WOOrder from '@/components/workOrder/Order.vue';

import { Pit, Traktor, Pickup, HumanResource, Crew } from '@/interfaces/WorkOrder';

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon,
    PlusIcon,
    CircularBtn,
    PrimaryBtn,
    WOOrder,
  },
  setup() {
    // const nombreDeEstado = computed(() => store.state.estado)
    // const nombreDeGetter = computed(() => store.getters.getter)

    // Con Helpers
    // const { pepe: person } = useState(['pepe']);
    // const { addNewWorkOrder } = useActions(['workOrders/addNewWorkOrder']);
    // const { testAction: accion } = useActions(['testAction']);
    // accion({ name: 'Pancho' });

    // Pozos
    const pits: Ref<Array<Pit>> = ref([]);
    const new_pit_name: Ref<string> = ref('');
    const removePit = (pitId: number) => {
      pits.value = pits.value.filter((pit) => pit.id !== pitId);
    };
    const addPit = () => {
      const lastPitId = pits.value.length;
      pits.value.push({
        id: lastPitId,
        name: new_pit_name.value,
      });
    };
    // Tractor
    const traktors: Ref<Array<Traktor>> = ref([
      {
        id: 0,
        chassis: '',
        supplier: '',
        description: '',
      },
    ]);
    const removeTraktor = (traktorId: number) => {
      traktors.value = traktors.value.filter((traktor) => traktor.id !== traktorId);
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
    // Pickup
    const pickups: Ref<Array<Pickup>> = ref([
      {
        id: 0,
        pickup_id: '',
        description: '',
      },
    ]);
    const removePickup = (pickupId: number) => {
      pickups.value = pickups.value.filter((pickup) => pickup.id !== pickupId);
    };
    const addPickup = (): void => {
      const lastTraktorId = pickups.value.length;
      pickups.value.push({
        id: lastTraktorId,
        pickup_id: '',
        description: '',
      });
    };
    // Recursos Humanos
    const resource: Ref<Array<HumanResource>> = ref([
      {
        id: 0,
        rol: '',
        name: '',
      },
    ]);
    const crews: Ref<Array<Crew>> = ref([{ id: 1, time: '7', title: 'Crew A', resources: resource }]);
    const removeResource = (crewId: number, peopleId: number) => {
      const selectedCrew = crews.value.find((crew) => crew.id === crewId);
      selectedCrew.resources.value = selectedCrew.resources.value.filter((people) => people.id !== peopleId);
    };
    const addResource = (crewId: number): void => {
      const selectedCrew = crews.value.find((crew) => crew.id === crewId);
      const lastId = selectedCrew.resources.length;
      selectedCrew.resources.push({
        id: lastId,
        rol: '',
        name: '',
      } as HumanResource);
    };
    const addCrew = (): void => {
      const lastId = crews.value.length + 1;
      const crewLetter = String.fromCharCode(lastId + 64);
      crews.value.push({ id: lastId, time: '', title: `Crew ${crewLetter}`, resources: [] });
      addResource(lastId);
    };
    // Sections
    const WO_section = ref('orden');
    const section_order = ['orden', 'equipamento', 'rrhh'];
    const changeSection = (new_section: string): void => {
      WO_section.value = new_section;
    };
    const currentSectionIndex = (): number => {
      return section_order.indexOf(WO_section.value);
    };
    const isLastSection = (): boolean => {
      return currentSectionIndex() >= section_order.length - 1;
    };
    const nextSection = (): void => {
      if (isLastSection()) {
        WO_section.value = section_order[section_order.length - 1];
      }
      WO_section.value = section_order[currentSectionIndex() + 1];
    };

    const goToShowAll = () => {
      console.log('Go to show all Work Orders page');
    };

    const save = (isFull = false) => {};

    return {
      WO_section,
      changeSection,
      nextSection,
      isLastSection,
      pits,
      new_pit_name,
      save,
      removePit,
      addPit,
      traktors,
      removeTraktor,
      addTraktor,
      pickups,
      removePickup,
      addPickup,
      resource,
      removeResource,
      addResource,
      crews,
      addCrew,
      goToShowAll,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &__draft {
    @apply self-end mb-3 md:mb-0 border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
  }
  &__delete {
    @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2;
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

.section-tab {
  @apply py-2 border-b-4 w-full font-bold text-gray-400;
}
.section-tab[selected='true'] {
  @apply border-main-500 text-main-500;
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

.equip-grid {
  @apply grid gap-4 grid-cols-2 md:grid-cols-3;
}
</style>
