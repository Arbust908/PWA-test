<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Orden de Trabjao - {{ woID }}</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <nav class="flex justify-between">
        <button class="section-tab" :selected="WO_section === 'orden'" @click="changeSection('orden')">
          <span> Orden </span>
          <CheckCircleIcon v-if="isOrderFull" class="w-5 h-5" />
        </button>
        <button class="section-tab" :selected="WO_section === 'equipamento'" @click="changeSection('equipamento')">
          <span> Equipamento </span>
          <CheckCircleIcon v-if="isEquipmentFull" class="w-5 h-5" />
        </button>
        <button class="section-tab" :selected="WO_section === 'rrhh'" @click="changeSection('rrhh')">
          <span> RRHH </span>
          <CheckCircleIcon v-if="isRRHHFull" class="w-5 h-5" />
        </button>
      </nav>
      <form v-if="WO_section === 'orden'" method="POST" action="/" class="p-4 max-w-lg">
        <fieldset>
          <div class="input-block">
            <label for="client" class=""> Cliente </label>
            <div class="mt-1">
              <select v-model="client" name="client">
                <option selected disabled value="">ej: Nasta</option>
                <option value="ypf">YPF</option>
                <option value="ypf2">YPF2</option>
                <option value="ypf3">YPF3</option>
              </select>
            </div>
          </div>
          <div class="input-block">
            <label for="service_co" class=""> Operadora / Empresa de Servicios </label>
            <div class="mt-1">
              <select v-model="service_co" name="service_co">
                <option selected disabled value="">ej: Pipele</option>
                <option value="ypf">YPF</option>
                <option value="ypf2">YPF2</option>
                <option value="ypf3">YPF3</option>
              </select>
            </div>
          </div>
          <div class="input-block">
            <label for="pad" class=""> PAD </label>
            <div class="mt-1">
              <input v-model="pad" name="pad" type="text" placeholder="ej: 12313" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend class="font-bold text-2xl pb-1 border-b mb-3 w-full">Pozos</legend>
          <section class="input-block_multi">
            <label for="pit" class=""> Pozo </label>
            <div v-for="(pit, key) in pits" :key="pit.id" class="pit-block">
              <input :name="`pit-${pit.id}`" type="text" v-model="pits[key].name" placeholder="Nuevo Pozo" />
              <CircularBtn v-if="key !== pits.length - 1" class="btn__delete" size="sm" @click="removePit(pit.id)">
                <TrashIcon class="w-5 h-5" />
              </CircularBtn>
              <CircularBtn v-else class="btn__delete invisible" size="sm">
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
                  <select v-model="operativeCradle" name="cradle_main">
                    <option selected disabled value="">Cradle Operativo</option>
                    <option value="aplt">Aplt</option>
                    <option value="rotum">Rotum</option>
                    <option value="xacje">Xacje</option>
                  </select>
                </div>
              </div>
              <div class="input-block">
                <label for="cradle_backup" class=""> Backup </label>
                <div class="mt-1">
                  <select v-model="backupCradle" name="cradle_backup">
                    <option selected disabled value="">Backup Cradle</option>
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
                  <select v-model="operativeForklift" name="client">
                    <option selected disabled value="">Forklift Operativo</option>
                    <option value="roklim">Roklim</option>
                    <option value="salmin">Salmin</option>
                    <option value="eroba">Eroba</option>
                  </select>
                </div>
              </div>
              <div class="input-block">
                <label for="client" class=""> Backup </label>
                <div class="mt-1">
                  <select v-model="backupForklift" name="client">
                    <option selected disabled value="">Backup Forklift</option>
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
                  <select v-model="traktor.supplier" :name="`tractor-${traktor.id}-proveedor`">
                    <option selected disabled value="">Proveedor</option>
                    <option value="10223">Transportes Zaraza SRL</option>
                    <option value="10224">Montoto Logistica SRL</option>
                    <option value="10225">E Inc</option>
                  </select>
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
                  <input
                    v-model="pickup.chassis"
                    :name="`pickup-${pickup.id}-chassis`"
                    type="text"
                    placeholder="#456"
                  />
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
      <form v-else-if="WO_section === 'rrhh'" method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-32">
        <fieldset v-for="crew in crews" :key="crew.id" class="max-w-sm w-full">
          <legend class="flex justify-between items-center font-bold text-2xl pb-4 border-b mb-3 w-full">
            <span>{{ crew.title }}</span>
          </legend>
          <section class="flex gap-3">
            <div class="flex flex-col w-full">
              <label :for="`crew-${crew.id}-start-time`">Hora de Inicio</label>
              <select class="rounded" :name="`crew-${crew.id}-start-time`" v-model="crew.start_time">
                <option selected disabled value="">ej 5:30 AM</option>
                <option value="7">7:00 PM</option>
                <option value="8">8:00 PM</option>
                <option value="9">9:00 PM</option>
              </select>
            </div>
            <div class="flex flex-col w-full">
              <label :for="`crew-${crew.id}-end-time`">Hora de Fin</label>
              <select class="rounded" :name="`crew-${crew.id}-end-time`" v-model="crew.end_time">
                <option selected disabled value="">ej 5:30 AM</option>
                <option value="7">7:00 PM</option>
                <option value="8">8:00 PM</option>
                <option value="9">9:00 PM</option>
              </select>
            </div>
          </section>
          <section class="divide-y">
            <article v-for="people in crew.resources" :key="people.id" class="pt-2 pb-3">
              <div class="">
                <label :for="`crew-${crew.id}-${people.id}-rol`" class=""> Rol </label>
                <div class="pit-block relative">
                  <select v-model="people.rol" :name="`crew-${crew.id}-${people.id}-rol`">
                    <option selected disabled value="">Lead Operator</option>
                    <option value="7">7:00 PM</option>
                    <option value="8">8:00 PM</option>
                    <option value="9">9:00 PM</option>
                  </select>
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
                    <select v-model="people.name" :name="`crew-${crew.id}-${people.id}-name`">
                      <option selected disabled value="">Selecciona Empleado</option>
                      <option value="7">7:00 PM</option>
                      <option value="8">8:00 PM</option>
                      <option value="9">9:00 PM</option>
                    </select>
                  </label>
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
      </form>
      <footer class="p-4 flex justify-between">
        <section class="space-x-8">
          <GhostBtn v-if="isLastSection()" class="btn__draft" @click.prevent="addCrew"> Agregar Crew </GhostBtn>
        </section>
        <section class="space-x-6 flex items-center">
          <button @click.prevent="goToIndex">Cancelar</button>
          <GhostBtn class="btn__draft" @click="save()">
            <BookmarkIcon class="w-5 h-5" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn v-if="!isLastSection()" @click="nextSection"> Siguiente </PrimaryBtn>
          <PrimaryBtn v-else @click="save(true)"> Finalizar </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
import { ref, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

import { Pit, Traktor, Pickup, HumanResource, Crew, WorkOrder } from '@/interfaces/WorkOrder';
import { log } from 'console';

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon,
    PlusIcon,
    CheckCircleIcon,
    CircularBtn,
    PrimaryBtn,
  },
  setup() {
    // Init
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const workOrders: Array<WorkOrder> = store.state.workOrders.all;
    console.log(route.params.id);
    console.log(workOrders);
    const currentWorkOrder: WorkOrder = workOrders.find((wo) => {
      console.log(wo.id);
      console.log(route.params.id);
      return wo.id == route.params.id;
    });
    console.log(currentWorkOrder);
    const {
      id: woID,
      client,
      service_co,
      pad,
      pits,
      operativeCradle,
      backupCradle,
      operativeForklift,
      backupForklift,
      traktors,
      pickups,
      crews,
      rigmats,
      conex,
      generators,
      tower,
      cabin,
    } = currentWorkOrder;

    //Pit
    const removePit = (pitId: number) => {
      pits.value = pits.value.filter((pit: Pit) => pit.id !== pitId);
    };
    const addPit = () => {
      const lastPitId = pits.value.length;
      pits.value.push({
        id: lastPitId,
        name: '',
      });
    };
    //Traktor
    const removeTraktor = (traktorId: number) => {
      traktors.value = traktors.value.filter((traktor: Traktor) => traktor.id !== traktorId);
    };
    const addTraktor = (): void => {
      const lastTraktorId = traktors.value.length;
      traktors.value.push({
        id: lastTraktorId,
        chassis: '',
        description: '',
      });
    };
    // Pickup
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
    // Crew
    const removeResource = (crewId: number, peopleId: number) => {
      const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
      selectedCrew.resources.value = selectedCrew.resources.value.filter(
        (resource: HumanResource) => resource.id !== peopleId
      );
    };
    const addResource = (crewId: number): void => {
      const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
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
      crews.value.push({ id: lastId, start_time: '7', end_time: '9', title: `Crew ${crewLetter}`, resources: [] });
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
    // Is the Order section is full
    const isOrderFull = computed(() => {
      return client.value && service_co.value && pad.value && pits.value.length > 0;
    });
    // Is the Equipment section is full
    const isEquipmentFull = computed(() => {
      return (
        operativeCradle.value &&
        backupCradle.value &&
        operativeForklift.value &&
        backupForklift.value &&
        traktors.value.length > 0 &&
        traktors.value[0].chassis &&
        traktors.value[0].description &&
        traktors.value[0].supplier &&
        pickups.value.length > 0 &&
        pickups.value[0].pickup_id &&
        pickups.value[0].description
      );
    });
    // Is the RRHH section is full
    const isRRHHFull = computed(() => {
      return crews.value[0].start_time && crews.value[0].end_time && crews.value.length > 0;
    });
    // method go to index that goes to the index page
    const goToIndex = (): void => {
      router.push('/ordenes-de-trabajo');
    };

    const save = (isFull = false) => {
      store.dispatch('updateWorkOrder', {
        id: woID,
        client: client.value,
        service_co: service_co.value,
        pad: pad.value,
        pits: pits.value,
        operativeCradle: operativeCradle.value,
        backupCradle: backupCradle.value,
        operativeForklift: operativeForklift.value,
        backupForklift: backupForklift.value,
        traktors: traktors.value,
        pickups: pickups.value,
        crews: crews.value,
        rigmats: rigmats.value,
        conex: conex.value,
        generators: generators.value,
        tower: tower.value,
        cabin: cabin.value,
        isFull: isFull,
      });
    };

    return {
      woID,
      WO_section,
      changeSection,
      nextSection,
      isLastSection,
      isOrderFull,
      isEquipmentFull,
      isRRHHFull,
      client,
      service_co,
      pad,
      pits,
      removePit,
      addPit,
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
      removeResource,
      addResource,
      crews,
      addCrew,
      goToIndex,
      save,
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
</style>
