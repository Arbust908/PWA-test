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
          <Icon icon="Trash" class="w-5 h-5" />
        </CircularBtn>
      </FieldLegend>
      <section
        class="flex gap-2 flex-col sm:flex-row items-start mb-4 col-span-full"
      >
        <label class="flex flex-col" :for="`crew-${crew.id}-start-time`">
          <p>Hora de Inicio</p>
          <TimePicker
            :timetrack="Number(crew.timeStart)"
            @update:timetrack="crew.timeStart = $event"
          />
        </label>
        <label class="flex flex-col" :for="`crew-${crew.id}-end-time`">
          <p>Hora de Fin</p>
          <TimePicker
            :timetrack="Number(crew.timeEnd)"
            @update:timetrack="crew.timeEnd = $event"
          />
        </label>
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

  import { useVModels } from '@vueuse/core';

  import { HumanResource, Crew } from '@/interfaces/sandflow';

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
    props: {
      crews: {
        type: Array,
        default: () => [],
      },
      isFull: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { emit }) {
      const { crews, isFull } = useVModels(props, emit);
      const defaultResource = {
        id: 0,
        name: '',
        role: '',
      };
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
          ...defaultResource,
          id: lastId,
        });
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

      if (crews?.value?.length === 0) {
        addCrew();
      } else if (
        crews?.value?.some((crew: Crew) => crew.resources.length === 0)
      ) {
        crews.value.forEach((crew: Crew) => {
          if (crew.resources.length === 0) {
            addResource(crew.id);
          }
        });
      }

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
  @import '@/assets/button.scss';
</style>
