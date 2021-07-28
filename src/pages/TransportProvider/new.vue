<template>
  <Layout>
    <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Nuevo proovedor de transporte</h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 w-full flex flex-col lg:flex-row">
        <fieldset class="flex flex-col  w-full">
          <div class="input-block p-4">
            <label for="name" class="">Nombre</label>
            <div class="mt-1">
              <input v-model="newTransportProvider.name" class="w-full rounded-md shadow" name="name" type="text" placeholder="Nombre" />
            </div>
          </div>
          <div class="input-block p-4">
            <label for="providerNotificationId" class=""> ProviderNotificationID </label>
            <div class="mt-1">
              <select name="providerNotificationId" v-model="newTransportProvider.providerNotificationId" class="w-full rounded-md shadow">
                <option v-for="provider in providers" :key="provider.id" :value="provider.id">{{provider.sandProvider.name}}</option>
              </select>
            </div>
          </div>
          <div class="input-block p-4">
            <label for="amount" class="">Cantidad de cajas</label>
            <div class="mt-1">
              <div class="mt-1">
                <input v-model="newTransportProvider.amount" class="w-full rounded-md shadow" name="amount" type="text" placeholder="Cantidad de cajas" />
              </div>
            </div>
          </div>
          <div class="input-block p-4">
            <label for="observations" class=""> Observaciones </label>
            <div class="mt-1">
              <textarea v-model="newTransportProvider.observations" class="w-full rounded-md shadow px-3 py-2 focus:outline-none" rows="5" name="observations" type="text" placeholder="Observaciones"></textarea>
            </div>
          </div>
        </fieldset>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <button @click.prevent="goToIndex">Cancelar</button>
          <GhostBtn class="btn__draft" @click="save()">
            <BookmarkIcon class="w-4 h-4" />
            <span> Guardar Provisorio </span>
          </GhostBtn>
          <PrimaryBtn
            :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
            @click="isFull && save(true)"
            :disabled="!isFull"
          >
            Finalizar
          </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { BookmarkIcon, TrashIcon, CheckCircleIcon } from '@heroicons/vue/outline';
import { PlusIcon } from '@heroicons/vue/solid';
import Layout from '@/layouts/Main.vue';
import GhostBtn from '@/components/ui/GhostBtn.vue';
import CircularBtn from '@/components/ui/CircularBtn.vue';
import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';

import axios from 'axios'
import { TransportProvider } from '@/interfaces/TransportProvider';
const api = 'https://sandflow-staging.bitpatagonia.com/api';

export default {
  components: {
    Layout,
    GhostBtn,
    BookmarkIcon,
    TrashIcon,
    PlusIcon,
    CheckCircleIcon,
    CircularBtn,
    PrimaryBtn
  },
  setup() {
    const store = useStore();
    const router = useRouter();
   
    const newTransportProvider: TransportProvider = reactive({
      id: 0,
      name: "",
      providerNotificationId: "",
      amount: 0,
      observations: "",
    })     

    const providers = ref([])    

    onMounted(async () => {
      providers.value = await axios
        .get(`${api}/providerNotification`)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.status === 200) {
            return res.data.data;
          }
          return {};
        })
    })

    const goToIndex = (): void => {
      router.push('/proveedores-de-transporte');
    };

    const isFull = computed(() => {
      return !!(
        newTransportProvider.name !== "" && 
        newTransportProvider.providerNotificationId !== "" && 
        newTransportProvider.amount !== 0 && 
        newTransportProvider.observations !== ""
      )
    })

    const save = async () => {
      let tpDB = await axios
        .post(`${api}/transportProvider`, newTransportProvider)
        .catch((err) => {
          console.log(err);
        })
        .then((res) => {
          if (res.status === 200) {
            newTransportProvider.id = res.data.data.id
            return res.data;
          }
          return {};
        })
        .finally(() => {
      });

      // Update Transport Provider
      store.dispatch('saveTransportProvider', newTransportProvider);
      router.push('/proveedores-de-transporte');
    };

    return {
      newTransportProvider,
      goToIndex,
      save,
      providers,
      isFull
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
