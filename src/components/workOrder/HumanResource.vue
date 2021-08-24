<template>
  <form
    method="POST"
    action="/"
    class="p-4 md:flex md:flex-wrap md:gap-24 2xl:gap-32"
  >
    <fieldset
      v-for="(crew, key) in crews"
      :key="crew.id"
      class="max-w-sm w-full"
    >
      <legend
        class="
          flex
          justify-between
          items-center
          font-bold
          text-2xl
          pb-4
          border-b
          mb-3
          w-full
        "
      >
        <span>{{ crew.title }}</span>
        <CircularBtn
          v-if="key !== 0"
          class="btn__delete"
          size="xs"
          @click="removeCrew(crew.id)"
        >
          <TrashIcon class="w-5 h-5" />
        </CircularBtn>
      </legend>
      <section class="flex gap-6">
        <div class="flex flex-col">
          <label :for="`crew-${crew.id}-start-time`">Hora de Inicio</label>
          <input
            v-model="crew.start_time"
            class="rounded max-w-[8rem]"
            :name="`crew-${crew.id}-start-time`"
            type="text"
            placeholder="00:00"
          />
          <!-- <select class="rounded" :name="`crew-${crew.id}-start-time`" v-model="crew.start_time">
                <option selected disabled value="">ej 5:30 AM</option>
                <option value="7">7:00 PM</option>
                <option value="8">8:00 PM</option>
                <option value="9">9:00 PM</option>
              </select> -->
        </div>
        <div class="flex flex-col">
          <label :for="`crew-${crew.id}-end-time`">Hora de Fin</label>
          <input
            v-model="crew.end_time"
            class="rounded max-w-[8rem]"
            :name="`crew-${crew.id}-end-time`"
            type="text"
            placeholder="00:00"
          />
          <!-- <select class="rounded" :name="`crew-${crew.id}-end-time`" v-model="crew.end_time">
                <option selected disabled value="">ej 5:30 AM</option>
                <option value="7">7:00 PM</option>
                <option value="8">8:00 PM</option>
                <option value="9">9:00 PM</option>
              </select> -->
        </div>
      </section>
      <section class="divide-y">
        <article
          v-for="people in crew.resources"
          :key="people.id"
          class="pt-2 pb-3"
        >
          <div class="">
            <label :for="`crew-${crew.id}-${people.id}-rol`" class="">
              Rol
            </label>
            <div class="pit-block relative">
              <input
                v-model="people.rol"
                :name="`crew-${crew.id}-${people.id}-rol`"
                type="text"
                placeholder="Rol"
              />
              <!-- <select v-model="people.rol" :name="`crew-${crew.id}-${people.id}-rol`">
                    <option selected disabled value="">Lead Operator</option>
                    <option value="7">7:00 PM</option>
                    <option value="8">8:00 PM</option>
                    <option value="9">9:00 PM</option>
                  </select> -->
              <CircularBtn
                class="btn__delete md:absolute md:right-[-3rem]"
                size="sm"
                @click="removeResource(crew.id, people.id)"
              >
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
            </div>
          </div>
          <div class="input-block">
            <div class="mt-1">
              <label :for="`crew-${crew.id}-${people.id}-name`">
                <input
                  v-model="people.name"
                  :name="`crew-${crew.id}-${people.id}-name`"
                  type="text"
                  placeholder="Empleado"
                />
                <!-- <select v-model="people.name" :name="`crew-${crew.id}-${people.id}-name`">
                      <option selected disabled value="">Selecciona Empleado</option>
                      <option value="7">7:00 PM</option>
                      <option value="8">8:00 PM</option>
                      <option value="9">9:00 PM</option>
                    </select> -->
              </label>
            </div>
          </div>
        </article>
      </section>
      <button
        class="mt-1 flex items-center"
        @click.prevent="addResource(crew.id)"
      >
        <CircularBtn class="btn__add" size="xs">
          <PlusIcon class="w-4 h-4" />
        </CircularBtn>
        <span class="font-bold text-lg"> Agregar otro </span>
      </button>
    </fieldset>
  </form>
</template>

<script lang="ts">
  import { ref, Ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

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
