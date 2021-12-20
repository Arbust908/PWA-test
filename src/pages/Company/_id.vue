<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo Cliente</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4 max-w-md">
                <FieldGroup>
                    <FieldInput
                        class="col-span-full"
                        field-name="name"
                        placeholder="Nombre y apellido / Razón social"
                        title="Nombre y apellido / Razón social"
                        :data="editedCompany.name"
                        require-validation
                        entity="client"
                        @update:data="editedCompany.name = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="legalId"
                        placeholder="CUIL / CUIT"
                        mask="#*"
                        title="CUIL / CUIT"
                        :data="editedCompany.legalId"
                        require-validation
                        entity="client"
                        validation-type="extension"
                        :char-amount="{ min: 11, max: 11 }"
                        @update:data="editedCompany.legalId = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="address"
                        placeholder="Domicilio"
                        title="Domicilio"
                        :data="editedCompany.address"
                        require-validation
                        entity="client"
                        @update:data="editedCompany.address = $event"
                    />
                    <toggle
                        label="Es operadora"
                        :initial-state="editedCompany.isOperator"
                        @handle-toggle-state="handleToggleState"
                    />
                    <textarea
                        v-model="editedCompany.observations"
                        class="col-span-full resize-none rounded-md input"
                        fieldName="observations"
                        rows="4"
                        placeholder="Observaciones..."
                        title="Observaciones"
                    ></textarea>
                </FieldGroup>
                <FieldGroup>
                    <FieldLegend>Contacto principal</FieldLegend>
                    <FieldInput
                        class="col-span-full"
                        field-name="nr-name"
                        placeholder="Nombre de representante"
                        title="Nombre"
                        :data="editedCompany.companyRepresentative.name"
                        require-validation
                        entity="client"
                        @update:data="editedCompany.companyRepresentative.name = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="nr-phone"
                        placeholder="+11 1111 1111"
                        mask="#*"
                        title="Teléfono"
                        :data="editedCompany.companyRepresentative.phone"
                        require-validation
                        entity="client"
                        @update:data="editedCompany.companyRepresentative.phone = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="nr-email"
                        placeholder="empresa@mail.com"
                        title="Email"
                        :data="editedCompany.companyRepresentative.email"
                        require-validation
                        entity="client"
                        validation-type="email"
                        @update:data="editedCompany.companyRepresentative.email = $event"
                    />
                </FieldGroup>
            </form>
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/clientes')"> Cancelar </SecondaryBtn>

                <PrimaryBtn btn="wide" :disabled="!isValidated" @click="isValidated && update()">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            :open="showErrorCuitModal"
            title="Ya existe un cliente con este CUIT"
            text="El cliente que intentas guardar fue creado anteriormente."
            @close="showErrorCuitModal = false"
            @main="showErrorCuitModal = false"
        />
        <SuccessModal
            :open="showSuccessModal"
            title="El cliente fue guardado con éxito."
            @close="$router.push('/clientes')"
            @main="$router.push('/clientes')"
        />
    </Layout>
</template>

<script lang="ts">
    import { useRouter, useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { ref, watchEffect } from 'vue';
    import { useTitle } from '@vueuse/core';
    import { Company } from '@/interfaces/sandflow';
    import Toggle from '@/components/ui/Toggle.vue';
    import { useValidator } from '@/helpers/useValidator';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    // AXIOS
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            Toggle,
            SecondaryBtn,
            FieldGroup,
            FieldInput,
            FieldLegend,
            ErrorModal,
            SuccessModal,
        },
        setup() {
            const route = useRoute();
            const store = useStore();
            const router = useRouter();

            const companies: Array<Company> = JSON.parse(JSON.stringify(store.state.client.all));

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

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'client')) ? true : false;
            });

            const showErrorCuitModal = ref(false);
            const showSuccessModal = ref(false);

            const update = async () => {
                const legalIdExists = await checkIfExists('legalId', editedCompany.value.legalId);

                if (legalIdExists) {
                    showErrorCuitModal.value = true;

                    return;
                }

                const loading = ref(true);
                let companyData = {
                    id: Number(id),
                    name: editedCompany.value.name,
                    address: editedCompany.value.address,
                    legalId: editedCompany.value.legalId,
                    isOperator: editedCompany.value.isOperator,
                    childId: null,
                    observations: editedCompany.value.observations,
                    companyRepresentativeId: Number(editedCompany.value.companyRepresentativeId),
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
                showSuccessModal.value = true;
            };

            const checkIfExists = async (field: string, value: string) => {
                const apiResponse = await axios.get(`${apiUrl}/company?${field}=${value}`);

                const companies = apiResponse.data.data;

                return companies.filter((company) => company.legalId !== editedCompany.value.legalId).length > 0;
            };

            return {
                update,
                goToIndex,
                editedCompany,
                handleToggleState,
                isValidated,
                showErrorCuitModal,
                showSuccessModal,
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
