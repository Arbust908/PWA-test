<template>
  <form method="POST" action="/" class="p-4 max-w-lg">
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
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { BookmarkIcon, TrashIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

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
  },
  setup() {
    // Pozos
    const pits: Ref<Array<Pit>> = ref([]);
    const new_pit_name: Ref<string> = ref('');
    const removePit = (pitId: number) => {
      pits.value = pits.value.filter((pit) => pit.id !== pitId);
    };
    const addPit = () => {
      const lastPitId = pits.value.length;
      console.log(new_pit_name.value);
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
