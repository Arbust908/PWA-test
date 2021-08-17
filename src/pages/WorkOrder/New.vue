<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nueva orden de trabajo
      </h1>
    </header>
    <section class="bg-second-0 rounded-md shadow-sm">
      <nav class="flex justify-between">
        <button
          class="section-tab"
          :selected="WO_section === 'orden'"
          @click="changeSection('orden')"
        >
          <span> Orden </span>
          <CheckCircleIcon v-if="isOrderFull" class="w-5 h-5" />
        </button>
        <button
          class="section-tab"
          :selected="WO_section === 'equipamento'"
          @click="changeSection('equipamento')"
        >
          <span> Equipamento </span>
          <CheckCircleIcon v-if="isEquipmentFull" class="w-5 h-5" />
        </button>
        <button
          class="section-tab"
          :selected="WO_section === 'rrhh'"
          @click="changeSection('rrhh')"
        >
          <span> RRHH </span>
          <CheckCircleIcon v-if="isRRHHFull" class="w-5 h-5" />
        </button>
      </nav>
      <OrderSection
        v-if="WO_section === 'orden'"
        :clientId="clientId"
        :serviceCompanyId="serviceCompanyId"
        :pad="pad"
        :pits="pits"
        :isFull="isOrderFull"
        @update:clientId="clientId = $event"
        @update:serviceCompanyId="serviceCompanyId = $event"
        @update:pad="pad = $event"
        @update:pits="pits = $event"
        @update:isFull="isOrderFull = $event"
      />
      <EquipmentSection
        v-else-if="WO_section === 'equipamento'"
        :operativeCradleId="operativeCradleId"
        :backupCradleId="backupCradleId"
        :operativeForkliftId="operativeForkliftId"
        :backupForkliftId="backupForkliftId"
        :traktors="traktors"
        :pickups="pickups"
        :rigmats="rigmats"
        :conex="conex"
        :generators="generators"
        :tower="tower"
        :cabin="cabin"
        :isFull="isEquipmentFull"
        @update:operativeCradleId="operativeCradleId = $event"
        @update:backupCradleId="backupCradleId = $event"
        @update:operativeForkliftId="operativeForkliftId = $event"
        @update:backupForkliftId="backupForkliftId = $event"
        @update:traktors="traktors = $event"
        @update:pickups="pickups = $event"
        @update:rigmats="rigmats = $event"
        @update:conex="conex = $event"
        @update:generators="generators = $event"
        @update:tower="tower = $event"
        @update:cabin="cabin = $event"
        @update:isFull="isEquipmentFull = $event"
      />
      <form
        v-else-if="WO_section === 'rrhh'"
        method="POST"
        action="/"
        class="p-4 md:flex md:flex-wrap md:gap-24 2xl:gap-32"
      >
        <fieldset
          v-for="(crew, key) in crews"
          :key="crew.id"
          class="max-w-sm w-full"
        >
          <h2
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
          </h2>
          <section class="flex gap-2 flex-col xl:flex-row items-start mb-4">
            <div class="flex flex-col">
              <label :for="`crew-${crew.id}-start-time`">Hora de Inicio</label>
              <TimePicker
                :timetrack="crew.timeStart"
                @update:timetrack="crew.timeStart = $event"
              />
            </div>
            <div class="flex flex-col">
              <label :for="`crew-${crew.id}-end-time`">Hora de Fin</label>
              <TimePicker
                :timetrack="crew.timeEnd"
                @update:timetrack="crew.timeEnd = $event"
              />
            </div>
          </section>
          <section class="divide-y">
            <article
              v-for="(people, peopleI) in crew.resources"
              :key="people.id"
              class="pt-2 pb-3"
            >
              <div class="">
                <label :for="`crew-${crew.id}-${people.id}-role`" class="">
                  Rol
                </label>
                <div class="pit-block relative">
                  <input
                    v-model="people.role"
                    :name="`crew-${crew.id}-${people.id}-role`"
                    type="text"
                    placeholder="Rol"
                  />
                  <CircularBtn
                    v-if="peopleI !== 0"
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
      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section>
          <GhostBtn
            v-if="isLastSection()"
            class="btn__draft"
            @click.prevent="addCrew"
          >
            Agregar Crew
          </GhostBtn>
        </section>
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/orden-de-trabajo')">
            Cancelar
          </NoneBtn>
          <GhostBtn class="btn__draft" @click="save()">
            <BookmarkIcon class="w-4 h-4" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn v-if="!isLastSection()" @click="nextSection">
            Siguiente
          </PrimaryBtn>
          <PrimaryBtn
            v-else
            :class="isAllFull ? null : 'opacity-50 cursor-not-allowed'"
            :disabled="!isAllFull"
            @click="isAllFull && save(false)"
          >
            Finalizar
          </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { ref, Ref, computed, ComputedRef, watchEffect, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useToggle } from '@vueuse/core';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import OrderSection from '@/components/workOrder/Order.vue';
  import EquipmentSection from '@/components/workOrder/Equipment.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import TimePicker from '@/components/ui/form/TimePicker.vue';
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const api = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import {
    Pit,
    Traktor,
    Pickup,
    HumanResource,
    Crew,
    WorkOrder,
  } from '@/interfaces/sandflow';

  export default {
    components: {
      BookmarkIcon,
      CircularBtn,
      GhostBtn,
      Layout,
      CheckCircleIcon,
      PlusIcon,
      PrimaryBtn,
      TrashIcon,
      TimePicker,
      NoneBtn,
      OrderSection,
      EquipmentSection,
    },
    setup() {
      // Init
      const store = useStore();
      const router = useRouter();
      const instance = axios.create({
        baseURL: api,
      });
      const isDraft = ref(true);
      const toggleDraft = useToggle(isDraft);
      // ORDEN
      const clientId: Ref<number> = ref(-1);
      const serviceCompanyId: Ref<number> = ref(-1);
      const pad: Ref<string> = ref('');
      const pits: Ref<Array<Pit>> = ref([
        {
          id: 0,
          name: '',
        },
      ]);
      const removeEmptyPits = () => {
        if (!isDraft.value) {
          const savedPit = pits.value[0];
        }
        pits.value = pits.value.filter((pit: Pit) => pit.name !== '');
        if (!isDraft.value && pits.value.length === 0) {
          pits.value.push(savedPit);
        }
      };
      // EQUIPO
      const operativeCradleId: Ref<number> = ref(-1);
      const backupCradleId: Ref<number> = ref(-1);
      const operativeForkliftId: Ref<number> = ref(-1);
      const backupForkliftId: Ref<number> = ref(-1);
      const traktors: Ref<Array<Traktor>> = ref([]);
      const pickups: Ref<Array<Pickup>> = ref([]);
      const rigmats: Ref<number> = ref(0);
      const conex: Ref<number> = ref(0);
      const generators: Ref<number> = ref(0);
      const tower: Ref<number> = ref(0);
      const cabin: Ref<number> = ref(0);

      const removeEmptyTraktors = (): void => {
        if (!isDraft.value) {
          const savedTraktor = traktors.value[0];
        }
        traktors.value = traktors.value.filter(
          (traktor: Traktor) =>
            !(
              traktor.chassis === '' &&
              traktor.supplier === '' &&
              traktor.description === ''
            )
        );
        if (!isDraft.value && traktors.value.length === 0) {
          traktors.value.push(savedTraktor);
        }
      };
      const removeEmptyPickups = (): void => {
        if (!isDraft.value) {
          const savedPickup = pickups.value[0];
        }
        pickups.value = pickups.value.filter(
          (pickup: Pickup) =>
            pickup.pickup_id !== '' && pickup.description !== ''
        );
        if (!isDraft.value && pickups.value.length === 0) {
          pickups.value.push(savedPickup);
        }
      };

      // :: >>> Crew
      // :: Human Resource
      const resource: Ref<Array<HumanResource>> = ref([
        {
          id: 0,
          role: '',
          name: '',
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
        if (!selectedCrew) {
          return new Error('No crew selected');
        }
        const lastId = selectedCrew.resources.length;
        selectedCrew.resources.push({
          id: lastId,
          role: '',
          name: '',
        } as HumanResource);
      };
      const removeEmptyCrews = (): void => {
        if (!isDraft.value) {
          const savedCrew = crews.value[0];
        }
        crews.value = crews.value
          .map((crew: Crew) => removeEmptyResource(crew.id))
          .filter((crew: Crew) => {
            return !(
              crew.resources.length <= 0 &&
              crew.timeStart === '' &&
              crew.timeEnd === ''
            );
          });
        if (!isDraft.value && crews.value.length === 0) {
          crews.value.push(savedCrew);
        }
      };
      // :: Crew
      const crews: Ref<Array<Crew>> = ref([
        {
          id: 1,
          timeStart: new Date().setHours(7),
          timeEnd: new Date().setHours(19),
          title: 'Crew A',
          resources: resource,
        },
      ]);
      const addCrew = (): void => {
        const lastId = crews.value.length + 1;
        const crewLetter = String.fromCharCode(lastId + 64);
        const timeStart = new Date().setHours(7);
        const timeEnd = new Date().setHours(19);
        crews.value.push({
          id: lastId,
          timeStart,
          timeEnd,
          title: `Crew ${crewLetter}`,
          resources: [],
        });
        addResource(lastId);
      };
      const removeCrew = (crewId: number) => {
        crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
      };
      const removeEmptyResource = (crewId: number): void => {
        const selectedCrew = crews.value.find(
          (crew: Crew) => crew.id === crewId
        );
        if (!isDraft.value) {
          const saveResourse = selectedCrew.resources[0];
        }
        selectedCrew.resources = selectedCrew.resources.filter(
          (resource: HumanResource) =>
            resource.role !== '' && resource.name !== ''
        );
        if (!isDraft.value && selectedCrew.resources.length === 0) {
          selectedCrew.resources.push(saveResourse);
        }
        return selectedCrew;
      };
      // :: >>> Sections
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
      // Is the Order section is full
      const isOrderFull = ref(false);
      // Is the Equipment section is full
      const isEquipmentFull = ref(false);
      // Is the RRHH section is full
      const isRRHHFull: ComputedRef<boolean> = computed(() => {
        return !!(
          crews.value.length > 0 &&
          crews.value[0].timeStart &&
          crews.value[0].timeEnd &&
          crews.value[0].resources.length > 0 &&
          crews.value[0].resources[0].role !== '' &&
          crews.value[0].resources[0].name !== ''
        );
      });
      // Is all sections full
      const isAllFull = computed(() => {
        return isOrderFull.value && isEquipmentFull.value && isRRHHFull.value;
      });
      const removeAllEmptys = (): void => {
        removeEmptyPits();
        removeEmptyTraktors();
        removeEmptyPickups();
        removeEmptyCrews();
      };
      // :: SAVE
      const save = async (draft = true) => {
        toggleDraft(draft);
        removeAllEmptys();
        const newWO = {
          client: clientId.value,
          clientId: clientId.value,
          serviceCompany: serviceCompanyId.value,
          serviceCompanyId: serviceCompanyId.value,
          pad: pad.value,
          pits: pits.value,
          operativeCradleId: operativeCradleId.value,
          backupCradleId: backupCradleId.value,
          operativeForkliftId: operativeForkliftId.value,
          backupForkliftId: backupForkliftId.value,
          operativeCradle: operativeCradleId.value,
          backupCradle: backupCradleId.value,
          operativeForklift: operativeForkliftId.value,
          backupForklift: backupForkliftId.value,
          traktors: traktors.value,
          pickups: pickups.value,
          crews: crews.value,
          rigmats: rigmats.value,
          conex: conex.value,
          generators: generators.value,
          tower: tower.value,
          cabin: cabin.value,
          draft,
        };
        const { data: WODone } = useAxios(
          '/workOrder',
          { method: 'POST', data: newWO },
          instance
        );
        watch(WODone, (newVal, _) => {
          console.log('nuevo', newVal);
          if (newVal && newVal.data && newVal.data.id) {
            const workOrderId = Number(newVal.data.id);
            console.log('nuevo id', newVal.data.id);
            if (pits.value.length > 0) {
              const isPitsFinished = ref([]);
              pits.value.forEach((pit: Pit) => {
                console.log(pit);
                const { id, ...newPit } = pit;
                newPit.companyId = newWO.clientId;
                newPit.workOrderId = workOrderId;
                console.log('NewPit', newPit);
                const { data } = useAxios(
                  '/pit',
                  { method: 'POST', data: newPit },
                  instance
                );
                isPitsFinished.value.push(data);
              });
              console.log(isPitsFinished.value);
            }
            if (traktors.value.length > 0) {
              const isTraktorsFinished = ref([]);
              traktors.value.forEach((traktor) => {
                console.log(traktor);
                const { id, ...newTraktor } = traktor;
                newTraktor.workOrderId = workOrderId;
                const { data } = useAxios(
                  '/traktor',
                  { method: 'POST', data: newTraktor },
                  instance
                );
                isTraktorsFinished.value.push(data);
              });
              console.log(isTraktorsFinished.value);
            }
            if (pickups.value.length > 0) {
              const isPickupFinished = ref([]);
              pickups.value.forEach((pickup) => {
                const { id, ...newPickup } = pickup;
                newPickup.workOrderId = workOrderId;
                const { data } = useAxios(
                  '/pickup',
                  { method: 'POST', data: newPickup },
                  instance
                );
                isPickupFinished.value.push(data);
              });
            }
            if (crews.value.length > 0) {
              const isCrewsFinished = ref([]);
              crews.value.forEach((crew) => {
                const { id, ...newCrew } = crew;
                newCrew.workOrderId = workOrderId;
                console.log('crew', newCrew);
                const { data } = useAxios(
                  '/crew',
                  { method: 'POST', data: newCrew },
                  instance
                );
                isCrewsFinished.value.push(data);
                watch(data, (newVal, _) => {
                  crew.resources.forEach((resource) => {
                    const crewId = newVal.data.id;
                    const { id, ...newResource } = resource;
                    newResource.crewId = crewId;
                    const { data: dataRH } = useAxios(
                      '/humanResource',
                      { method: 'POST', data: newResource },
                      instance
                    );
                  });
                });
              });
              console.log(isCrewsFinished.value);
            }
            store.dispatch('saveWorkOrder', newVal.data);
            router.push('/orden-de-trabajo');
          }
        });
      };

      return {
        WO_section,
        changeSection,
        nextSection,
        isLastSection,
        isOrderFull,
        isEquipmentFull,
        isRRHHFull,
        clientId,
        serviceCompanyId,
        pad,
        pits,
        operativeCradleId,
        backupCradleId,
        operativeForkliftId,
        backupForkliftId,
        traktors,
        pickups,
        rigmats,
        conex,
        generators,
        tower,
        cabin,
        removeResource,
        addResource,
        crews,
        removeCrew,
        addCrew,
        save,
        isAllFull,
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
  .section-tab {
    @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
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
  label {
    @apply text-sm;
  }
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }

  .vc-time-date {
    @apply hidden;
  }
</style>
