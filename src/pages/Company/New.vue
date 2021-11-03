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
                        :data="newClient.name"
                        require-validation
                        entity="client"
                        @update:data="newClient.name = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="legalId"
                        placeholder="CUIL / CUIT"
                        mask="#*"
                        title="CUIL / CUIT"
                        :data="newClient.legalId"
                        require-validation
                        entity="client"
                        validation-type="extension"
                        :char-amount="{ min: 11, max: 11 }"
                        @update:data="newClient.legalId = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="address"
                        placeholder="Domicilio"
                        title="Domicilio"
                        :data="newClient.address"
                        require-validation
                        entity="client"
                        @update:data="newClient.address = $event"
                    />
                    <toggle label="Es operadora" @handle-toggle-state="handleToggleState" />
                    <textarea
                        v-model="newClient.observations"
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
                        :data="newClient.companyRepresentative.name"
                        require-validation
                        entity="client"
                        @update:data="newClient.companyRepresentative.name = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="nr-phone"
                        placeholder="+11 1111 1111"
                        mask="#*"
                        title="Teléfono"
                        :data="newClient.companyRepresentative.phone"
                        require-validation
                        entity="client"
                        @update:data="newClient.companyRepresentative.phone = $event"
                    />
                    <FieldInput
                        class="col-span-full"
                        field-name="nr-email"
                        placeholder="empresa@mail.com"
                        title="Email"
                        :data="newClient.companyRepresentative.email"
                        require-validation
                        entity="client"
                        validation-type="email"
                        @update:data="newClient.companyRepresentative.email = $event"
                    />
                </FieldGroup>
            </form>
        </section>
        <footer class="mt-5 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-6 flex items-center justify-end">
                <SecondaryBtn btn="secondary !px-6" @click.prevent="$router.push('/clientes')"> Cancelar </SecondaryBtn>
                <PrimaryBtn btn="main !px-6" :disabled="!isValidated ? 'yes' : null" @click="isValidated && save()">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { watch, ref, watchEffect } from 'vue';
    import Toggle from '@/components/ui/Toggle.vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import { useValidator } from '@/helpers/useValidator';
    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { Company } from '@/interfaces/sandflow';

    export default {
        components: {
            Layout,
            SecondaryBtn,
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

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'client')) ? true : false;
            });

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

    .toggle {
        @apply flex space-x-3 items-center;
    }
</style>
