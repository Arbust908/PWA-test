<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nuevo Cliente
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <FieldGroup>
          <FieldLegend>Cliente</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="name"
            placeholder="Nombre y apellido / Razón social"
            mask="S*"
            title="Nombre y apellido / Razón social"
            :data="clientToUpdate.name"
            @update:data="clientToUpdate.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="legalId"
            placeholder="CUIL / CUIT"
            mask="###########"
            title="CUIL / CUIT"
            :data="clientToUpdate.legalId"
            @update:data="clientToUpdate.legalId = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="adress"
            placeholder="Domicilio"
            mask="S*"
            title="Domicilio"
            :data="clientToUpdate.adress"
            @update:data="clientToUpdate.adress = $event"
          />
          <toggle label="Es operadora" @handle-toggle-state="handleToggleState" :initialState="clientToUpdate.isOperator"/>
          <textarea
            class="col-span-full resize-none rounded-md input"
            fieldName="observations"
            rows="4"
            placeholder="Observaciones..."
            title="Observaciones"
            mask="S*"
            :data="clientToUpdate.observations"
            @update:data="clientToUpdate.observations = $event"
          ></textarea>
        </FieldGroup>
        <FieldGroup>
          <FieldLegend>Contacto principal</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="nr-name"
            placeholder="Nombre de representante"
            title="Nombre"
            mask="S*"
            :data="clientToUpdate.companyRepresentative.name"
            @update:data="clientToUpdate.companyRepresentative.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-phone"
            placeholder="+11 1111 1111"
            mask="+##-####-####"
            title="Teléfono"
            :data="clientToUpdate.companyRepresentative.phone"
            @update:data="clientToUpdate.companyRepresentative.phone = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-email"
            placeholder="empresa@mail.com"
            mask="X*@X*.X*"
            title="Email"
            :data="clientToUpdate.companyRepresentative.email"
            @update:data="clientToUpdate.companyRepresentative.email = $event"
          />
        </FieldGroup>
      </form>

      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section class="w-full space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/clientes')">
            Cancelar
          </NoneBtn>
          <PrimaryBtn
            :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
            @click="isFull && save()"
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
  import Layout from '@/layouts/Main.vue';
  import { reactive, ref, toRefs } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import InputPack from '@/components/ui/InputPack.vue';
  import { Company } from '@/interfaces/sandflow';
  import axios from 'axios';
  import Toggle from '@/components/ui/Toggle.vue'

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      InputPack,
      PrimaryBtn,
      Toggle
    },
    setup() {
      const route = useRoute();
      const store = useStore();
      const router = useRouter();

      const clients: Array<Company> = JSON.parse(
        JSON.stringify(store.state.client.all)
      );

      const currentClient: Company = clients.find((client) => {
        return client.id == route.params.id;
      });

      const clientToUpdate = reactive({
        name: currentClient.name,
        adress: currentClient.adress,
        legalId: currentClient.legalId,
        isOperator: currentClient.isOperator,
        observations: currentClient.observations,
        companyRepresentative: currentClient.companyRepresentative,
      });

      const goToIndex = () => {
        router.push('/clientes');
      };

      const handleToggleState = () => {
        clientToUpdate.isOperator = !clientToUpdate.isOperator
      }

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
        handleToggleState
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
