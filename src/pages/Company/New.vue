<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">
        Nuevo Cliente
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm max-w-2xl">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4 max-w-md">
        <FieldGroup>
          <FieldInput
            class="col-span-full"
            fieldName="name"
            placeholder="Nombre y apellido / Razón social"
            title="Nombre y apellido / Razón social"
            :data="newClient.name"
            @update:data="newClient.name = $event"
            requireValidation
            entity="client"
          />
          <FieldInput
            class="col-span-full"
            fieldName="legalId"
            placeholder="CUIL / CUIT"
            mask="#*"
            title="CUIL / CUIT"
            :data="newClient.legalId"
            @update:data="newClient.legalId = $event"
            requireValidation
            entity="client"
            validationType="extension"
            :charAmount="{min: 11,max:11}"
          />
          <FieldInput
            class="col-span-full"
            fieldName="address"
            placeholder="Domicilio"
            title="Domicilio"
            :data="newClient.address"
            @update:data="newClient.address = $event"
            requireValidation
            entity="client"
          />
          <toggle
            label="Es operadora"
            @handle-toggle-state="handleToggleState"
          />
          <textarea
            class="col-span-full resize-none rounded-md input"
            fieldName="observations"
            rows="4"
            placeholder="Observaciones..."
            title="Observaciones"
            v-model="newClient.observations"
          ></textarea>
        </FieldGroup>
        <FieldGroup>
          <FieldLegend>Contacto principal</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="nr-name"
            placeholder="Nombre de representante"
            title="Nombre"
            :data="newClient.companyRepresentative.name"
            @update:data="newClient.companyRepresentative.name = $event"
            requireValidation
            entity="client"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-phone"
            placeholder="+11 1111 1111"
            mask="#*"
            title="Teléfono"
            :data="newClient.companyRepresentative.phone"
            @update:data="newClient.companyRepresentative.phone = $event"
            requireValidation
            entity="client"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-email"
            placeholder="empresa@mail.com"
            title="Email"
            :data="newClient.companyRepresentative.email"
            @update:data="newClient.companyRepresentative.email = $event"
            requireValidation
            entity="client"
            validationType="email"
          />
        </FieldGroup>
      </form>

      <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
        <section class="w-full space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="$router.push('/clientes')">
            Cancelar
          </NoneBtn>
          <PrimaryBtn
            :class="isValidated ? null : 'opacity-50 cursor-not-allowed'"
            @click="isValidated && save()"
            :disabled="!isValidated"
          >
            Finalizar
          </PrimaryBtn>
        </section>
      </footer>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { reactive, toRefs, computed, defineComponent, watch, ref, watchEffect } from 'vue';
  import Toggle from '@/components/ui/Toggle.vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { useTitle } from '@vueuse/core';
  import Layout from '@/layouts/Main.vue';
  import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import {useValidator} from '@/helpers/useValidator'
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import { Company, companyRepresentative } from '@/interfaces/sandflow';

  export default {
    components: {
      Layout,
      BookmarkIcon,
      CheckCircleIcon,
      NoneBtn,
      PrimaryBtn,
      FieldGroup,
      FieldInput,
      FieldLegend,
      Toggle,
    },
    setup() {
      useTitle('Nuevo Cliente <> Sandflow');
      const router = useRouter();
      const store = useStore();
      const instance = axios.create({
        baseURL: apiUrl,
      });

      const goToIndex = () => {
        router.push('/clientes');
      };

      const newClient: Company = ref({
        name: '',
        address: '',
        legalId: '',
        isOperator: false,
        observations: '',
        companyRepresentative: {
          email: '',
          name: '',
          phone: '',
        },
        sandPlans: [],
      });

      const handleToggleState = () => {
        newClient.value.isOperator = !newClient.value.isOperator;
      };

      const isValidated = ref(false)

      watchEffect(async() => {
        isValidated.value = await useValidator(store,'client') ? true : false
      })

      const save = async () => {
        const { data: CRdata } = useAxios(
          '/companyRepresentative',
          { method: 'POST', data: newClient.value.companyRepresentative },
          instance
        );
        watch(CRdata, (newVal, _) => {
          if (newVal && newVal.data) {
            newClient.value.companyRepresentativeId = newVal.data.id;
            newClient.value.companyRepresentative = newVal.data;
            const { data: Cdata } = useAxios(
              '/company',
              { method: 'POST', data: newClient.value },
              instance
            );
            watch(Cdata, (newVal, _) => {
              if (newVal && newVal.data) {
                store.dispatch('saveClient', newClient.value);
                router.push('/clientes');
              }
            });
          }
        });
      };

      return {
        goToIndex,
        save,
        newClient,
        isValidated,
        handleToggleState,
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
