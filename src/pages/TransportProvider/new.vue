<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo proveedor de transporte</h1>
        </header>
        <section class="flex">
            <section class="w-8/12">
                <nav class="flex justify-between max-w-2xl bg-white">
                    <button
                        :class="['section-tab', activeSection === 'provider' ? 'active' : '']"
                        :selected="activeSection === 'provider'"
                        @click.prevent="changeSection('provider')"
                    >
                        <span> Proveedor </span>
                    </button>
                    <button
                        :class="['section-tab', activeSection === 'driver' ? 'active' : '']"
                        :selected="activeSection === 'driver'"
                        @click.prevent="changeSection('driver')"
                    >
                        <span> Transportista </span>
                    </button>
                </nav>
                <section v-if="activeSection === 'provider'" class="bg-white rounded-md max-w-2xl shadow-sm">
                    <TransportProviderFrom
                        :tp-name="newTransportProvider.name"
                        :tp-id="newTransportProvider.legalId"
                        :tp-address="newTransportProvider.address"
                        :tp-observations="newTransportProvider.observations"
                        :cr-name="companyRepresentative.name"
                        :cr-phone="companyRepresentative.phone"
                        :cr-email="companyRepresentative.email"
                        @update:tpName="newTransportProvider.name = $event"
                        @update:tpId="newTransportProvider.legalId = $event"
                        @update:tpAddress="newTransportProvider.address = $event"
                        @update:tpObservations="newTransportProvider.observations = $event"
                        @update:crName="companyRepresentative.name = $event"
                        @update:crPhone="companyRepresentative.phone = $event"
                        @update:crEmail="companyRepresentative.email = $event"
                    />
                </section>
                <section v-if="activeSection === 'driver'" class="bg-white rounded-md max-w-2xl shadow-sm">
                    <form method="POST" action="/" class="p-4 max-w-lg">
                        <TransportProviderDriverForm
                            :driver-name="newDriver.name"
                            :driver-phone="newDriver.phone"
                            :driver-email="newDriver.email"
                            :driver-t-type="newDriver.vehicleType"
                            :driver-t-id="newDriver.transportId"
                            :driver-obs="newDriver.observations"
                            @update:driverName="newDriver.name = $event"
                            @update:driverPhone="newDriver.phone = $event"
                            @update:driverEmail="newDriver.email = $event"
                            @update:driverTType="newDriver.vehicleType = $event"
                            @update:driverTId="newDriver.transportId = $event"
                            @update:driverObs="newDriver.observations = $event"
                            @add-driver="addDriver()"
                        />
                    </form>
                </section>
                <footer class="mt-[32px] gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
                    <section class="w-full space-x-3 flex items-center justify-end">
                        <SecondaryBtn btn="wide" @click.prevent="$router.push('/proveedores-de-transporte')">
                            Cancelar
                        </SecondaryBtn>
                        <PrimaryBtn
                            btn="wide"
                            :disabled="!isValidated ? 'yes' : null"
                            @click="
                                hasFullNewDriver && addDriver();
                                isValidated && save();
                            "
                        >
                            Finalizar
                        </PrimaryBtn>
                    </section>
                </footer>
            </section>
            <section class="w-4/12 mt-12 ml-4 flex flex-col gap-y-4">
                <DriverCard
                    v-for="(driver, index) in drivers"
                    :key="index"
                    :name="driver.name"
                    :phone="driver.phone"
                    :email="driver.email"
                    :vehicle-type="driver.vehicleType"
                    :transport-id="driver.transportId"
                    :observations="driver.observations"
                    @delete-driver="deleteDriver(index)"
                    @edit-driver="editDriver(index)"
                />
            </section>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { computed, reactive, watch, ref, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import { useValidator } from '@/helpers/useValidator';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import TransportProviderFrom from '@/components/transportProvider/providerForm.vue';
    import TransportProviderDriverForm from '@/components/transportProvider/driverForm.vue';
    import DriverCard from '@/components/transportProvider/DriverCard.vue';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const api = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { TransportProvider, CompanyRepresentative, Driver } from '@/interfaces/sandflow';

    export default {
        components: {
            CircularBtn,
            DriverCard,
            Icon,
            Layout,
            SecondaryBtn,
            PrimaryBtn,
            TransportProviderFrom,
            TransportProviderDriverForm,
        },
        setup() {
            const store = useStore();
            const router = useRouter();
            useTitle(`Nuevo Proveedor de Transporte <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });

            let activeSection = ref('provider');

            const changeSection = (option: string) => {
                return (activeSection.value = option);
            };

            const drivers: Array<Driver> = reactive([]);

            let newDriver = reactive({
                name: '',
                phone: '',
                email: '',
                vehicleType: '',
                transportId: '',
                observations: '',
            });

            const addDriver = () => {
                const driver = { ...newDriver };

                if (hasFullNewDriver.value) {
                    drivers.push(driver);
                }
                cleanNewDriver();
            };

            const deleteDriver = (index: number) => {
                drivers.splice(index);
            };

            const editDriver = (index: number) => {
                const driver = { ...drivers[index] };
                deleteDriver(index);
                newDriver.name = driver.name;
                newDriver.phone = driver.phone;
                newDriver.email = driver.email;
                newDriver.vehicleType = driver.vehicleType;
                newDriver.transportId = driver.transportId;
                newDriver.observations = driver.observations;
            };

            const cleanNewDriver = () => {
                newDriver.name = '';
                newDriver.phone = '';
                newDriver.email = '';
                newDriver.vehicleType = '';
                newDriver.transportId = '';
                newDriver.observations = '';
            };

            const newTransportProvider: TransportProvider = reactive({
                name: '',
                legalId: null,
                address: '',
                observations: '',
                companyRepresentativeId: -1,
            });

            const companyRepresentative: CompanyRepresentative = reactive({
                name: '',
                phone: '',
                email: '',
            });

            const hasFullNewDriver = computed(() => {
                return !!(
                    newDriver.name !== '' &&
                    newDriver.phone !== '' &&
                    newDriver.email !== '' &&
                    newDriver.vehicleType !== '' &&
                    newDriver.transportId !== ''
                );
            });

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'transportProvider')) ? true : false;
            });

            const save = async () => {
                const representanteDone = ref(false);
                const transportProviderDone = ref(false);

                if (hasFullNewDriver.value) {
                    addDriver();
                }
                //
                const { data: compRepData, isFinished: compRepDone } = useAxios(
                    '/companyRepresentative',
                    { method: 'POST', data: companyRepresentative },
                    instance
                );
                watch(compRepDone, (isDone) => {
                    if (isDone) {
                        representanteDone.value = true;
                    }
                });
                watch(compRepData, (apiData) => {
                    console.log(apiData);

                    if (apiData && apiData.data) {
                        newTransportProvider.companyRepresentativeId = apiData.data.id;
                        const { data, isFinished: transProvDone } = useAxios(
                            '/transportProvider',
                            { method: 'POST', data: newTransportProvider },
                            instance
                        );
                        watch(transProvDone, (isDone) => {
                            if (isDone) {
                                transportProviderDone.value = true;
                            }
                        });
                        watch(data, (newData, _) => {
                            console.log(newData);

                            if (newData && newData.data) {
                                const tpId = newData.data.id;
                                const tpSave = reactive({ ...newData.data });
                                const driversDone = reactive([]);
                                drivers.forEach((driver) => {
                                    const { id, ...newDriver } = driver;
                                    newDriver.transportProviderId = tpId;
                                    console.log('newDriver.transportProviderId', newDriver.transportProviderId);
                                    console.log('new Driver', newDriver);
                                    const { data } = useAxios(
                                        `/driver/`,
                                        { method: 'POST', data: newDriver },
                                        instance
                                    );
                                    watch(data, (newData, _) => {
                                        if (newData && newData.data) {
                                            driversDone.push(newData.data);
                                            tpSave.drivers = driversDone;
                                        }
                                    });
                                });
                                store.dispatch('saveTransportProvider', {
                                    ...tpSave,
                                    companyRepresentative,
                                });
                                router.push('/proveedores-de-transporte');
                            }
                        });
                    }
                });
                watchEffect(() => {
                    if (representanteDone.value && transportProviderDone.value) {
                        console.log('All done');
                    }
                });
            };

            return {
                newTransportProvider,
                isValidated,
                save,
                companyRepresentative,
                activeSection,
                changeSection,
                drivers,
                Icon,
                addDriver,
                newDriver,
                deleteDriver,
                editDriver,
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

    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input:read-only {
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
</style>
