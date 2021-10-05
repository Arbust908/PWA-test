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
            :data="editedCompany.name"
            @update:data="editedCompany.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="legalId"
            placeholder="CUIL / CUIT"
            mask="#*"
            title="CUIL / CUIT"
            :data="editedCompany.legalId"
            @update:data="editedCompany.legalId = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="address"
            placeholder="Domicilio"
            title="Domicilio"
            :data="editedCompany.address"
            @update:data="editedCompany.address = $event"
          />
          <toggle
            label="Es operadora"
            @handle-toggle-state="handleToggleState"
            :initialState="editedCompany.isOperator"
          />
          <textarea
            class="col-span-full resize-none rounded-md input"
            fieldName="observations"
            rows="4"
            placeholder="Observaciones..."
            title="Observaciones"
            v-model="editedCompany.observations"
          ></textarea>
        </FieldGroup>
        <FieldGroup>
          <FieldLegend>Contacto principal</FieldLegend>
          <FieldInput
            class="col-span-full"
            fieldName="nr-name"
            placeholder="Nombre de representante"
            title="Nombre"
            :data="editedCompany.companyRepresentative.name"
            @update:data="editedCompany.companyRepresentative.name = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-phone"
            placeholder="+11 1111 1111"
            mask="#*"
            title="Teléfono"
            :data="editedCompany.companyRepresentative.phone"
            @update:data="editedCompany.companyRepresentative.phone = $event"
          />
          <FieldInput
            class="col-span-full"
            fieldName="nr-email"
            placeholder="empresa@mail.com"
            title="Email"
            :data="editedCompany.companyRepresentative.email"
            @update:data="editedCompany.companyRepresentative.email = $event"
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
            @click="isFull && update()"
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
  import { useRouter, useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import { ref, computed } from 'vue';
  import { useTitle } from '@vueuse/core';
  import { Company } from '@/interfaces/sandflow';
  import Toggle from '@/components/ui/Toggle.vue';

  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  // AXIOS
  import axios from 'axios';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      Layout,
      PrimaryBtn,
      Toggle,
      NoneBtn,
      FieldGroup,
      FieldInput,
      FieldLegend,
    },
    setup() {
      const route = useRoute();
      const store = useStore();
      const router = useRouter();

      const companies: Array<Company> = JSON.parse(
        JSON.stringify(store.state.client.all)
      );

      const id = Number(route.params.id);
      useTitle(`Cliente ${id} <> Sandflow`);

      const currentCompany: Company = companies.find((company) => {
        return company.id == id;
      });

      const editedCompany: Company = ref({ ...currentCompany });

      const goToIndex = () => {
        router.push('/clientes');
      };

      const handleToggleState = () => {
        editedCompany.value.isOperator = !editedCompany.value.isOperator;
      };

      const isFull = computed(() => {
        return !!(
          editedCompany.value.name !== '' &&
          editedCompany.value.name.length > 3 &&
          editedCompany.value.address.length > 3 &&
          editedCompany.value.legalId >= 0 &&
          editedCompany.value.companyRepresentative?.name &&
          editedCompany.value.companyRepresentative?.name.length > 0 &&
          editedCompany.value.companyRepresentative?.email &&
          editedCompany.value.companyRepresentative?.email.length > 0 &&
          editedCompany.value.companyRepresentative?.phone &&
          editedCompany.value.companyRepresentative?.phone.length > 0
        );
      });

      const update = async () => {
        const loading = ref(true);
        let companyData = {
          id: Number(id),
          name: editedCompany.value.name,
          address: editedCompany.value.address,
          legalId: editedCompany.value.legalId,
          isOperator: editedCompany.value.isOperator,
          childId: null,
          observations: editedCompany.value.observations,
          companyRepresentativeId: Number(
            editedCompany.value.companyRepresentativeId
          ),
        };

        let company = await axios
          .put(`${apiUrl}/company/${id}`, companyData)
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
            `${apiUrl}/companyRepresentative/${companyData.companyRepresentativeId}`,
            editedCompany.value.companyRepresentative
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

        store.dispatch('updateClient', editedCompany.value);
        router.push('/clientes');
      };

      return {
        update,
        goToIndex,
        editedCompany,
        handleToggleState,
        isFull,
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
