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
          <!-- <CheckCircleIcon v-if="isRRHHFull" class="w-5 h-5" /> -->
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
      <RRHHSection
        v-else-if="WO_section === 'rrhh'"
        :crews="crews"
        :isFull="isRRHHFull"
        @update:crews="crews = $event"
        @update:isFull="isRRHHFull = $event"
      />
      <footer
        :class="isLastSection() ? 'justify-between' : 'justify-end'"
        class="p-4 gap-3 flex flex-col md:flex-row"
      >
        <section
          v-if="isLastSection()"
          class="pb-4 mb-2 border-b md:pb-0 md:mb-0 md:border-none"
        >
          <GhostBtn
            class="w-full border-2 rounded border-green-600 border-opacity-60 md:w-auto justify-center sm:border-0"
            @click.prevent="addCrew"
          >
            Agregar Crew
          </GhostBtn>
        </section>
        <section
          class="
            gap-6
            flex flex-wrap
            items-center
            justify-center
            sm:justify-end
          "
        >
          <NoneBtn
            class="order-last sm:order-none"
            
            @click.prevent="$router.push('/orden-de-trabajo')"
          >
            Cancelar
          </NoneBtn>
          <GhostBtn class="w-1/2 md:w-max" @click="save()">
            <BookmarkIcon class="w-6 h-6 md:w-4 h-4" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn v-if="isLoading"  disabled>
            Guardando...
          </PrimaryBtn>
          <PrimaryBtn
            v-else-if="!isLastSection()"
            
            @click="nextSection"
          >
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
  import { useToggle, useTitle } from '@vueuse/core';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import { PlusIcon } from '@heroicons/vue/solid';
  import OrderSection from '@/components/workOrder/Order.vue';
  import EquipmentSection from '@/components/workOrder/Equipment.vue';
  import RRHHSection from '@/components/workOrder/HumanResource.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
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
      RRHHSection,
    },
    setup() {
      // Init
      const store = useStore();
      const router = useRouter();
      useTitle(`Nueva Orden de Trabajo <> Sandflow`);
      const instance = axios.create({
        baseURL: api,
      });
      const isLoading = ref(false);
      const toggleLoading = useToggle(isLoading);
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
      // watch(traktors, (newVal, oldVal) => {
      //   if (newVal.length <= oldVal.length) {
      //     traktors.value = oldVal;
      //   }
      // });
      const pickups: Ref<Array<Pickup>> = ref([]);
      // watch(pickups, (newVal, oldVal) => {
      //   if (newVal.length <= oldVal.length) {
      //     pickups.value = oldVal;
      //   }
      // });
      const rigmats: Ref<number> = ref(0);
      const conex: Ref<number> = ref(0);
      const generators: Ref<number> = ref(0);
      const tower: Ref<number> = ref(0);
      const cabin: Ref<number> = ref(0);

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
        toggleLoading(true);
        toggleDraft(draft);
        console.log('isDraft', isDraft.value);
        // removeAllEmptys();
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
          draft: isDraft.value,
        };
        try {
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
                  const { data, isFinished } = useAxios(
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
              // store.dispatch('saveWorkOrder', newVal.data);
              setTimeout(() => {
                toggleLoading(false);
                setTimeout(() => {
                  // Modal de procesasando?
                  router.push('/orden-de-trabajo');
                }, 100);
              }, 1000);
            }
          });
        } catch (error) {
          console.log(error);
        }
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
        isLoading,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/button.scss';
  .section-tab {
    @apply pb-2 pt-4 border-b-4 w-full font-medium text-gray-400 flex justify-center items-center gap-2;
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
