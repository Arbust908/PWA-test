<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo proveedor de transporte</h1>
        </header>
        <section class="flex flex-wrap md:flex-nowrap">
            <section class="w-full md:w-8/12">
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
                        <span> Unidades </span>
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
                            :driver-t-id2="newDriver.transportProviderId2"
                            :driver-obs="newDriver.observations"
                            @update:driverName="newDriver.name = $event"
                            @update:driverPhone="newDriver.phone = $event"
                            @update:driverEmail="newDriver.email = $event"
                            @update:driverTType="newDriver.vehicleType = $event"
                            @update:driverTId="newDriver.transportId = $event"
                            @update:driverTId2="newDriver.transportProviderId2 = $event"
                            @update:driverObs="newDriver.observations = $event"
                            @add-driver="addDriver()"
                        />
                    </form>
                </section>
                <section v-if="showDrivers" class="w-full md:w-4/12 mt-12 flex flex-col gap-y-4 md:hidden">
                    <DriverCard
                        v-for="(driver, index) in drivers"
                        :key="index"
                        :name="driver.name"
                        :phone="driver.phone"
                        :email="driver.email"
                        :vehicle-type="driver.vehicleType"
                        :transport-id="driver.transportId"
                        :transport-id2="driver.transportProviderId2"
                        :observations="driver.observations"
                        @delete-driver="deleteDriver(index)"
                        @edit-driver="editDriver(index)"
                    />
                </section>
                <footer class="mt-[32px] gap-3 flex flex-col justify-end max-w-2xl">
                    <SideBtn v-if="drivers.length" class="md:hidden" btn="full" @click="driversShown = !driversShown">
                        {{ showDrivers ? driverTabText : 'Volver' }}
                    </SideBtn>
                    <section v-if="!showDrivers" class="w-full space-x-3 flex items-center justify-end">
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
            <section class="hidden w-full md:w-4/12 mt-12 ml-4 md:flex flex-col gap-y-4">
                <DriverCard
                    v-for="(driver, index) in drivers"
                    :key="index"
                    :name="driver.name"
                    :phone="driver.phone"
                    :email="driver.email"
                    :vehicle-type="driver.vehicleType"
                    :transport-id="driver.transportId"
                    :transport-id2="driver.transportProviderId2"
                    :observations="driver.observations"
                    @delete-driver="deleteDriver(index)"
                    @edit-driver="editDriver(index)"
                />
            </section>
        </section>

        <ErrorModal
            class="xs:w-[480px] xs:h-[248] !py-3"
            :open="showErrorCuitModal"
            title="Ya existe un cliente con este CUIT"
            text="El cliente que intentas guardar fue creado anteriormente"
            @close="showErrorCuitModal = false"
            @action="showErrorCuitModal = false"
        />
        <SuccessModal
            class="xs:w-[480px] xs:h-[260px] py-4"
            :open="showSuccessModal"
            title="¡El proveedor fue guardado con éxito!"
            @close="$router.push('/proveedores-de-transporte')"
            @action="$router.push('/proveedores-de-transporte')"
        />
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
    import SideBtn from '@/components/ui/buttons/SideBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';

    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const api = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { TransportProvider, CompanyRepresentative, Driver } from '@/interfaces/sandflow';

    export default {
        components: {
            DriverCard,
            Layout,
            PrimaryBtn,
            SecondaryBtn,
            SideBtn,
            TransportProviderDriverForm,
            TransportProviderFrom,
            SuccessModal,
            ErrorModal,
        },
        setup() {
            const store = useStore();
            const router = useRouter();
            useTitle(`Nuevo Proveedor de Transporte <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });
            const showSuccessModal = ref(false);
            const showErrorCuitModal = ref(false);

            let activeSection = ref('provider');

            const changeSection = (option: string) => {
                return (activeSection.value = option);
            };
            const driversShown = ref(false);
            const showDrivers = computed(() => {
                const windowWidth = window.innerWidth;

                return driversShown.value && windowWidth > 768;
            });

            const drivers: Array<Driver> = reactive([]);

            let newDriver = reactive({
                name: '',
                phone: '',
                email: '',
                vehicleType: '',
                transportId: '',
                // transportId2: '',
                transportProviderId2: '',
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
                // newDriver.transportId2 = driver.transportId2;
                newDriver.transportProviderId2 = driver.transportProviderId2;
                newDriver.observations = driver.observations;
            };

            const cleanNewDriver = () => {
                newDriver.name = '';
                newDriver.phone = '';
                newDriver.email = '';
                newDriver.vehicleType = '';
                newDriver.transportId = '';
                // newDriver.transportId2 = '';
                newDriver.transportProviderId2 = '';
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
                    newDriver.transportId !== '' &&
                    // newDriver.transportId2 !== '' &&
                    newDriver.transportProviderId2 !== ''
                );
            });

            const driverTabText = computed(() => {
                return `Transportista${drivers.length > 1 ? `s (${drivers.length})` : ''}`;
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
                watch(compRepData, async (apiData) => {
                    console.log(apiData);

                    if (apiData && apiData.data) {
                        newTransportProvider.companyRepresentativeId = apiData.data.id;
                        const legalIdExists = await checkIfExists('legalId', newTransportProvider.legalId);

                        if (legalIdExists) {
                            showErrorCuitModal.value = true;

                            return;
                        }

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
                                showSuccessModal.value = true;
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

            const checkIfExists = async (field: string, value: string) => {
                const apiResponse = await axios.get(`${api}/transportProvider?${field}=${value}`);

                const transportProviders = apiResponse.data.data;

                return transportProviders.length > 0;
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
                driverTabText,
                showDrivers,
                driversShown,
                showSuccessModal,
                showErrorCuitModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
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
