<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Cliente - {{ id }}
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Cliente</h2>
          <label class="col-span-12" for="name">
            <span>Nombre</span>
            <input
              id="name"
              v-model="name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre del cliente"
            />
          </label>
          <label class="col-span-12" for="legalName">
            <span>Razón Social</span>
            <input
              id="legalName"
              v-model="legalName"
              class="input"
              type="text"
              name="legalName"
              placeholder="Razón social"
            />
          </label>
          <label class="col-span-12" for="legalId">
            <span>CUIL/CUIT</span>
            <input
              id="legalId"
              v-model="legalId"
              class="input"
              type="text"
              name="legalId"
              placeholder="CUIL / CUIT"
            />
          </label>
          <label class="col-span-12" for="isOperator">
            <span>isOperator</span>
            <input
              id="isOperator"
              v-model="isOperator"
              class=""
              type="checkbox"
              name="isOperator"
              placeholder="isOperator"
            />
          </label>
          <label class="col-span-12" for="observations">
            <span>Observaciones</span>
            <input
              id="observations"
              v-model="observations"
              class="input"
              type="text"
              name="observations"
              placeholder="Observaciones.."
            />
          </label>
        </fieldset>

        <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
          <h2 class="col-span-full text-xl">Representante</h2>

          <label class="col-span-full" for="nr-name">
            <span>Nombre</span>
            <input
              id="nr-name"
              v-model="companyRepresentative.name"
              class="input"
              type="text"
              name="name"
              placeholder="Nombre de representante"
            />
          </label>

          <label class="col-span-full" for="nr-legalId">
            <span>CUIL/CUIT</span>
            <input
              id="nr-legalId"
              v-model="companyRepresentative.legalId"
              class="input"
              type="text"
              name="legalId"
              placeholder="CUIL / CUIT"
            />
          </label>
          <label class="col-span-full" for="phone">
            <span>Teléfono</span>
            <input
              id="nr-phone"
              v-model="companyRepresentative.phone"
              class="input"
              type="text"
              name="phone"
              placeholder="+11 1111 1111"
            />
          </label>
          <label class="col-span-full" for="email">
            <span>Email</span>
            <input
              id="nr-email"
              v-model="companyRepresentative.email"
              class="input"
              type="text"
              name="email"
              placeholder="ejemplo@ejemplo.com"
            />
          </label>
        </fieldset>
      </form>

      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section></section>
        <section class="space-x-6 flex items-center justify-end">
          <button @click="goToIndex">Cancelar</button>
          <PrimaryBtn @click="update"> Finalizar </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import Layout from '@/layouts/Main.vue';
  import { reactive, ref, toRefs } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';
  import GhostBtn from '@/components/ui/GhostBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import InputPack from '@/components/ui/InputPack.vue';
  import { Client } from '@/interfaces/Client';
  import axios from 'axios';

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      InputPack,
      PrimaryBtn,
    },
    setup() {
      const route = useRoute();
      const store = useStore();
      const router = useRouter();

      const clients: Array<Client> = JSON.parse(
        JSON.stringify(store.state.client.all)
      );
      const currentClient: Client = clients.find((client) => {
        return client.id == route.params.id;
      });

      const clientToUpdate = reactive({
        name: currentClient.name,
        legalName: currentClient.legalName,
        legalId: currentClient.legalId,
        isOperator: currentClient.isOperator,
        observations: currentClient.observations,
        companyRepresentative: currentClient.companyRepresentative,
      });

      const goToIndex = () => {
        router.push('/clientes');
      };

      const update = async () => {
        const loading = ref(true);
        let client = await axios
          .put(`${apiUrl}/company/${currentClient.id}`, clientToUpdate)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data;
            }
            return {};
          })
          .finally(() => {
            loading.value = false;
          });

        let companyRepresentative = await axios
          .put(
            `${apiUrl}/companyRepresentative/${currentClient.companyRepresentative.id}`,
            clientToUpdate.companyRepresentative
          )
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            if (res.status === 200) {
              return res.data;
            }
            return {};
          })
          .finally(() => {
            loading.value = false;
          });

        store.dispatch('updateClient', clientToUpdate);
        router.push('/clientes');
      };

      return {
        update,
        goToIndex,
        ...toRefs(clientToUpdate),
      };
    },
  };
</script>

<style lang="scss" scoped>
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  input[type='text']:read-only {
    @apply bg-second-200 border cursor-not-allowed;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
  label:not(.toggle) {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  .toggle {
    @apply flex space-x-3 items-center;
  }
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
    }
    &__options {
      @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
    }
    &__add {
      @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
</style>
