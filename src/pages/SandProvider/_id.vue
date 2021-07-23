<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Proovedor de arena - {{ id }}</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 w-full flex flex-col lg:flex-row">
        <fieldset class="flex flex-col w-full">
          <div class="input-block p-4">
            <label for="name" class=""> Cliente </label>
            <div class="mt-1">
              <input v-model="name" class="w-full rounded-md shadow" name="name" type="text" placeholder="Nombre de cliente" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="legalName" class=""> Razón Social </label>
            <div class="mt-1">
              <input v-model="legalName" class="w-full rounded-md shadow" name="legalName" type="text" placeholder="Razón social del cliente" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="legalId" class=""> CUIT </label>
            <div class="mt-1">
              <input v-model="legalId" class="w-full rounded-md shadow" name="legalId" type="text" placeholder="CUIT de cliente" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="meshType" class=""> Tipo de malla </label>
            <div class="mt-1">
              <input v-model="meshType" class="w-full rounded-md shadow" name="meshType" type="text" placeholder="Tipo de malla" />
            </div>
          </div>
        </fieldset>
        <fieldset class="flex flex-col  w-full">
          <div class="input-block p-4">
            <label for="grains" class=""> Granulado </label>
            <div class="mt-1">
              <input v-model="grains" class="w-full rounded-md shadow" name="grains" type="text" placeholder="Granulado" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="companyRepresentativeId" class=""> CUIT Compañía representante </label>
            <div class="mt-1">
              <input v-model="companyRepresentativeId" class="w-full rounded-md shadow" name="companyRepresentativeId" type="text" placeholder="CUIT Compañía representante" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="observations" class=""> Observaciones </label>
            <div class="mt-1">
              <textarea v-model="observations" class="w-full rounded-md shadow px-3 py-2 focus:outline-none" rows="5" name="observations" type="text" placeholder="Observaciones"></textarea>
            </div>
          </div>
        </fieldset>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <button @click.prevent="goToIndex">Cancelar</button>
          <GhostBtn class="btn__draft" @click="update()">
            <BookmarkIcon class="w-4 h-4" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn @click="update()">
            Finalizar
          </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
import { ref, Ref, computed, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

import { SandProvider, Driver, Vehicle, Sand, Cradle, Forklift, Company } from '@/interfaces/SandProvider';

import axios from 'axios';
const api = 'https://sandflow-qa.bitpatagonia.com/api';

export default {
  components: {
    Layout: Layout,
    GhostBtn: GhostBtn,
    BookmarkIcon: BookmarkIcon,
    TrashIcon: TrashIcon,
    PlusIcon: PlusIcon,
    CheckCircleIcon: CheckCircleIcon,
    CircularBtn: CircularBtn,
    PrimaryBtn: PrimaryBtn,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const sandProviders: Array<SandProvider> = JSON.parse(JSON.stringify(store.state.sandProviders.all));

    const currentSandProvider: SandProvider = sandProviders.find((sp) => {
      return sp.id == route.params.id;
    });

    console.log(currentSandProvider)

    const {
      id,
      name,
      legalName,
      legalId,
      meshType,
      grains,
      observations,
      companyRepresentativeId
    } = toRefs(currentSandProvider);

    const goToIndex = (): void => {
      router.push('/proveedores-de-arena');
    };
   
    // Update Sand Provider
    const update = async () => {
      const updatedSP = {
        id,
        name: name.value,
        legalName: legalName.value,
        legalId: legalId.value,
        meshType: meshType.value,
        grains: grains.value,
        observations: observations.value,
        companyRepresentativeId: companyRepresentativeId.value
      };

      let spDB = await axios
        .put(`${api}/sandProvider/${updatedSP.id}`, updatedSP)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            return res.data;
          }
          return {};
        })
        .finally(() => {
          // loading.value = false;
          console.log("DONE")
        });
      console.log(spDB);
      // Update Work Order
      store.dispatch('updateSandProvider', updatedSP);
      router.push('/proveedores-de-arena');
    }

    return {
      id,
      name,
      legalName,
      legalId,
      meshType,
      grains,
      observations,
      companyRepresentativeId,
      goToIndex,
      update
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
