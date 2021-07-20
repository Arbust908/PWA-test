<template>
  <form method="POST" action="/" class="p-4 max-w-lg">
    <fieldset>
      <div class="input-block">
        <label for="client" class=""> Cliente </label>
        <div class="mt-1">
          <input v-model="client" name="client" type="text" placeholder="Nombre de cliente" />
          <!-- <select v-model="client" name="client">
            <option selected disabled value="">ej: Nasta</option>
            <option value="ypf">YPF</option>
            <option value="ypf2">YPF2</option>
            <option value="ypf3">YPF3</option>
          </select> -->
        </div>
      </div>
      <div class="input-block">
        <label for="service_co" class=""> Operadora / Empresa de Servicios </label>
        <div class="mt-1">
          <input v-model="service_co" name="service_co" type="text" placeholder="Nombre de Operadora" />
          <!-- <select v-model="service_co" name="service_co">
            <option selected disabled value="">ej: Pipele</option>
            <option value="ypf">YPF</option>
            <option value="ypf2">YPF2</option>
            <option value="ypf3">YPF3</option>
          </select> -->
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
</template>

<script lang="ts">
import { ref, Ref, computed } from 'vue';
import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import Layout from '@/layouts/Main.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
import { Pit } from '@/interfaces/WorkOrder';

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
    // Cliente
    const client: Ref<String> = ref('');
    // Service Company
    const service_co: Ref<String> = ref('');
    // PAD
    const pad: Ref<String> = ref('');
    // Pozos
    const pits: Ref<Array<Pit>> = ref([
      {
        id: 0,
        name: '',
      },
    ]);

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
    // Remove Empty pits
    const removeEmptyPits = () => {
      pits.value = pits.value.filter((pit: Pit) => pit.name !== '');
    };
    // Is the Order section is full
    const isOrderFull = computed(() => {
      return !!(client.value && service_co.value && pad.value && pits.value.length > 0 && pits.value[0].name);
    });

    return {
      isOrderFull,
      client,
      service_co,
      pad,
      pits,
      removePit,
      addPit,
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
