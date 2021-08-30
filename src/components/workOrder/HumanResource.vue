<template>
  <form method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-20">
    <FieldGroup
      v-for="(crew, key) in crews"
      :key="crew.id"
      class="max-w-sm w-full"
    >
      <FieldLegend>
        <span>{{ crew.title }}</span>
        <CircularBtn
          v-if="key !== 0"
          class="btn__delete"
          @click="removeCrew(crew.id)"
        >
          <TrashIcon class="w-5 h-5" />
        </CircularBtn>
      </FieldLegend>
      <section
        class="flex gap-2 flex-col sm:flex-row items-start mb-4 col-span-full"
      >
        <div class="flex flex-col">
          <label :for="`crew-${crew.id}-start-time`">Hora de Inicio</label>
          <TimePicker
            :timetrack="Number(crew.timeStart)"
            @update:timetrack="crew.timeStart = $event"
          />
        </div>
        <div class="flex flex-col">
          <label :for="`crew-${crew.id}-end-time`">Hora de Fin</label>
          <TimePicker
            :timetrack="Number(crew.timeEnd)"
            @update:timetrack="crew.timeEnd = $event"
          />
        </div>
      </section>
      <section class="col-span-full">
        <FieldGroup
          v-for="(people, peopleI) in crew.resources"
          :key="people.id"
          class="pt-2 pb-3"
        >
          <!-- TODO: Pasaria a FiledSelect si tuvieramos ABM de roles y Usuarios -->
          <FieldInput
            class="col-span-full"
            :title="peopleI === 0 ? 'Rol' : null"
            :fieldName="`crew-${crew.id}-${people.id}-role`"
            placeholder="Rol"
            :data="people.role"
            @update:data="people.role = $event"
          />
          <span v-if="notLast(peopleI, people) && notOnly(people)">
            <CircularBtn
              v-if="peopleI !== 0"
              class="btn__delete md:absolute md:right-[-3rem]"
              size="sm"
              @click="removeResource(crew.id, people.id)"
            >
              <Icon icon="Trash" class="w-5 h-5" />
            </CircularBtn>
          </span>
          <FieldInput
            class="col-span-full"
            :fieldName="`crew-${crew.id}-${people.id}-name`"
            placeholder="Empleado"
            :data="people.name"
            @update:data="people.name = $event"
          />
        </FieldGroup>
      </section>
      <span class="col-span-12">
        <button
          class="mt-1 flex items-center"
          @click.prevent="addResource(crew.id)"
        >
          <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
          <span class="font-bold text-lg"> Agregar otro </span>
        </button>
      </span>
    </FieldGroup>
  </form>
</template>

<script lang="ts">
  import { ref, Ref, computed } from 'vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

  import TimePicker from '@/components/ui/form/TimePicker.vue';

  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';

  import {
    Pit,
    Traktor,
    Pickup,
    HumanResource,
    Crew,
    WorkOrder,
  } from '@/interfaces/WorkOrder';

  import axios from 'axios';
  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      FieldGroup,
      FieldInput,
      FieldLegend,
      CircularBtn,
      GhostBtn,
      Layout,
      PrimaryBtn,
      Icon,
      TimePicker,
    },
    setup() {
      // ::
      // Crew
      // ::
      const resource: Ref<Array<HumanResource>> = ref([
        {
          id: 0,
          rol: '',
          name: '',
        },
      ]);
      const crews: Ref<Array<Crew>> = ref([
        {
          id: 1,
          start_time: '',
          end_time: '',
          title: 'Crew A',
          resources: resource,
        },
      ]);
      const removeResource = (crewId: number, peopleId: number) => {
        const selectedCrew = crews.value.find(
          (crew: Crew) => crew.id === crewId
        );
        selectedCrew.resources = selectedCrew.resources.filter(
          (resource: HumanResource) => resource.id !== peopleId
        );
      };
      const addResource = (crewId: number): void => {
        const selectedCrew = crews.value.find(
          (crew: Crew) => crew.id === crewId
        );
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
        crews.value.push({
          id: lastId,
          start_time: '',
          end_time: '',
          title: `Crew ${crewLetter}`,
          resources: [],
        });
        addResource(lastId);
      };
      const removeCrew = (crewId: number): void => {
        crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
      };
      // Remove empty Crews
      const removeEmptyCrews = (): void => {
        crews.value = crews.value
          .map((crew: Crew) => removeEmptyResource(crew.id))
          .filter(
            (crew: Crew) =>
              !(
                crew.resources.length <= 0 &&
                crew.start_time === '' &&
                crew.end_time === ''
              )
          );
      };
      // Remove Empty Resource
      const removeEmptyResource = (crewId: number): void => {
        const selectedCrew = crews.value.find(
          (crew: Crew) => crew.id === crewId
        );
        selectedCrew.resources = selectedCrew.resources.filter(
          (resource: HumanResource) =>
            resource.rol !== '' && resource.name !== ''
        );
        return selectedCrew;
      };

      const notLast = (crewInnerId: number, crewList: Array<HumanResource>) => {
        return;
      };
      const notOnly = (crewList: Array<HumanResource>) => {
        return crewList.length > 1;
      };

      // Is the RRHH section is full
      const isRRHHFull = computed(() => {
        return !!(
          crews.value.length > 0 &&
          crews.value[0].start_time &&
          crews.value[0].end_time
        );
      });

      return {
        isRRHHFull,
        removeResource,
        addResource,
        crews,
        removeCrew,
        addCrew,
        notLast,
        notOnly,
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
</style>
