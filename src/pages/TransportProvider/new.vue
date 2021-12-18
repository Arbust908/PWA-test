<template>
    <Layout>
        <ABMFormTitle title="Nuevo proveedor de transporte" />
        <section class="flex flex-wrap md:flex-nowrap">
            <!-- main Section -->
            <section class="w-full md:w-8/12">
                <nav v-if="!isClicked" class="flex justify-between max-w-2xl bg-white">
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
                <section
                    v-if="activeSection === 'provider' && !isClicked"
                    class="bg-white rounded-md max-w-2xl shadow-sm"
                >
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
                <section
                    v-if="activeSection === 'driver' && !isClicked"
                    class="bg-white rounded-md max-w-2xl shadow-sm"
                >
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
                <!-- mobile transportProviders Cards -->
                <section v-if="showDrivers" class="w-full md:w-4/12 mt-12 flex flex-col gap-y-4 md:hidden">
                    <button
                        :class="'flex items-center w-[250px] gap-2'"
                        @click="
                            driversShown = !driversShown;
                            isClicked = !isClicked;
                        "
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 0C5.37097 0 0 5.37097 0 12C0 18.629 5.37097 24 12 24C18.629 24 24 18.629 24 12C24 5.37097 18.629 0 12 0ZM18.9677 13.3548C18.9677 13.6742 18.7065 13.9355 18.3871 13.9355H13.9355V18.3871C13.9355 18.7065 13.6742 18.9677 13.3548 18.9677H10.6452C10.3258 18.9677 10.0645 18.7065 10.0645 18.3871V13.9355H5.6129C5.29355 13.9355 5.03226 13.6742 5.03226 13.3548V10.6452C5.03226 10.3258 5.29355 10.0645 5.6129 10.0645H10.0645V5.6129C10.0645 5.29355 10.3258 5.03226 10.6452 5.03226H13.3548C13.6742 5.03226 13.9355 5.29355 13.9355 5.6129V10.0645H18.3871C18.7065 10.0645 18.9677 10.3258 18.9677 10.6452V13.3548Z"
                                fill="#8DC881"
                            />
                        </svg>

                        <h2 class="font-semibold">Agregar Transportista</h2>
                    </button>
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
                        @edit-driver="
                            editDriver(index);
                            driversShown = !driversShown;
                            isClicked = !isClicked;
                        "
                    />
                </section>
                <!-- *** -->
                <footer class="mt-8 gap-3 flex flex-col justify-end max-w-2xl">
                    <SideBtn
                        v-if="drivers.length && !isClicked"
                        class="md:hidden"
                        btn="full"
                        @click="
                            driversShown = !driversShown;
                            isClicked = !isClicked;
                        "
                    >
                        {{ driverTabText }}
                    </SideBtn>
                    <SecondaryBtn
                        v-if="isClicked"
                        class="md:hidden"
                        btn="wide"
                        @click="
                            driversShown = !driversShown;
                            isClicked = !isClicked;
                        "
                    >
                        Volver
                    </SecondaryBtn>
                    <!-- button Section -->
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
            <!-- desktop transportProvider Card -->
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
            :open="showErrorCuitModal"
            title="Ya existe un cliente con este CUIT"
            text="El cliente que intentas guardar fue creado anteriormente"
            @close="showErrorCuitModal = false"
            @main="showErrorCuitModal = false"
        />
        <SuccessModal
            :open="showSuccessModal"
            title="¡El proveedor fue guardado con éxito!"
            @close="$router.push('/proveedores-de-transporte')"
            @main="$router.push('/proveedores-de-transporte')"
        />
    </Layout>
</template>

<script lang="ts">
    import axios from 'axios';
    import { TransportProvider, CompanyRepresentative, Driver } from '@/interfaces/sandflow';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { useValidator } from '@/helpers/useValidator';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import DriverCard from '@/components/transportProvider/DriverCard.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import SideBtn from '@/components/ui/buttons/SideBtn.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import TransportProviderDriverForm from '@/components/transportProvider/driverForm.vue';
    import TransportProviderFrom from '@/components/transportProvider/providerForm.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            ABMFormTitle,
            DriverCard,
            ErrorModal,
            Layout,
            PrimaryBtn,
            SecondaryBtn,
            SideBtn,
            SuccessModal,
            TransportProviderDriverForm,
            TransportProviderFrom,
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
                if (driversShown.value === true) {
                    return driversShown.value;
                }
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
                drivers.splice(index, 1);
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
            const isClicked = ref(false);
            const driverTabText = computed(() => {
                if (drivers.length > 1 && !isClicked.value) {
                    return `Ver Transportistas (${drivers.length})`;
                } else if (drivers.length == 1 && !isClicked.value) {
                    return `Ver Transportista`;
                }
            });

            function conLog() {
                console.log(driverTabText.value);
                console.log('drivers shown: ', driversShown.value);
                console.log('isClicked: ', isClicked.value);
            }

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
                            if (newData && newData.data) {
                                const tpId = newData.data.id;
                                const tpSave = reactive({ ...newData.data });
                                const driversDone = reactive([]);
                                drivers.forEach((driver) => {
                                    const { id, ...newDriver } = driver;
                                    newDriver.transportProviderId = tpId;
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
                isClicked,
                conLog,
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
        @apply border-b border-gray-200 pb-6;
    }
    label:not(.toggle) {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
</style>
