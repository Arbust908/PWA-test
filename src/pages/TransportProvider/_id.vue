<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">
                Proveedor de transporte - ID {{ id }}
            </h1>
        </header>
        <section class="flex flex-wrap md:flex-nowrap">
            <section class="w-full md:w-8/12">
                <nav v-if="!showDrivers" class="flex justify-between max-w-2xl bg-white">
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
                <section
                    v-if="activeSection === 'driver' && !showDrivers"
                    class="bg-white rounded-md max-w-2xl shadow-sm"
                >
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
                <section v-if="showDrivers" class="w-full md:w-4/12 mt-12 flex flex-col gap-y-4 md:hidden">
                    <label class="input flex" for="search">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 7.29583 11.5892 8.49572 10.8907 9.47653L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.47653 10.8907C8.49572 11.5892 7.29583 12 6 12C2.68629 12 0 9.31371 0 6Z"
                                fill="#9CA3AF"
                            />
                        </svg>
                        <input
                            id="search"
                            v-model="searchDriver"
                            class="search-input"
                            type="text"
                            placeholder="Buscar"
                        />
                    </label>
                    <button class="flex items-center w-[250px] gap-2 py-2" @click.prevent="toggleDriverShown">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 0C5.37097 0 0 5.37097 0 12C0 18.629 5.37097 24 12 24C18.629 24 24 18.629 24 12C24 5.37097 18.629 0 12 0ZM18.9677 13.3548C18.9677 13.6742 18.7065 13.9355 18.3871 13.9355H13.9355V18.3871C13.9355 18.7065 13.6742 18.9677 13.3548 18.9677H10.6452C10.3258 18.9677 10.0645 18.7065 10.0645 18.3871V13.9355H5.6129C5.29355 13.9355 5.03226 13.6742 5.03226 13.3548V10.6452C5.03226 10.3258 5.29355 10.0645 5.6129 10.0645H10.0645V5.6129C10.0645 5.29355 10.3258 5.03226 10.6452 5.03226H13.3548C13.6742 5.03226 13.9355 5.29355 13.9355 5.6129V10.0645H18.3871C18.7065 10.0645 18.9677 10.3258 18.9677 10.6452V13.3548Z"
                                fill="#8DC881"
                            />
                        </svg>
                        <h2 class="font-semibold">Agregar Transportista</h2>
                    </button>
                    <DriverCard
                        v-for="(driver, index) in filteredDrivers"
                        :key="index"
                        :name="driver.name"
                        :phone="driver.phone"
                        :email="driver.email"
                        :vehicle-type="driver.vehicleType"
                        :transport-id="driver.transportId"
                        :transport-id2="driver.transportId2"
                        :observations="driver.observations"
                        @delete-driver="deleteDriver(index)"
                        @edit-driver="editDriver(index)"
                    />
                </section>
                <footer class="mt-[32px] gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
                    <SideBtn
                        v-if="activeSection === 'driver' && drivers.length"
                        class="md:hidden"
                        btn="full"
                        @click="toggleDriverShown"
                    >
                        {{ showDrivers ? 'Volver' : driverTabText }}
                    </SideBtn>
                    <section v-if="!showDrivers" class="w-full space-x-3 flex items-center justify-end">
                        <SecondaryBtn btn="wide" @click.prevent="$router.push('/proveedores-de-transporte')">
                            Cancelar
                        </SecondaryBtn>
                        <PrimaryBtn
                            btn="wide"
                            :disabled="!isFull ? 'yes' : null"
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
                    :transport-id2="driver.transportId2"
                    :observations="driver.observations"
                    @delete-driver="deleteDriver(index)"
                    @edit-driver="editDriver(index)"
                />
            </section>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { computed, reactive, ref } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useTitle, useBreakpoints, breakpointsTailwind } from '@vueuse/core';

    import TransportProviderFrom from '@/components/transportProvider/providerForm.vue';
    import TransportProviderDriverForm from '@/components/transportProvider/driverForm.vue';
    import DriverCard from '@/components/transportProvider/DriverCard.vue';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import SideBtn from '@/components/ui/buttons/SideBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
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
            SecondaryBtn,
            PrimaryBtn,
            TransportProviderFrom,
            TransportProviderDriverForm,
            SideBtn,
        },
        setup() {
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const id = Number(route.params.id);
            useTitle(`Proveedor de Transporte ${id} <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });

            const transportProviders: Array<TransportProvider> = JSON.parse(
                JSON.stringify(store.state.transportProviders.all)
            );
            const currentTransportProvider: TransportProvider = transportProviders.find((sp) => {
                return sp.id == id;
            });

            let activeSection = ref('provider');

            const changeSection = (option: string) => {
                return (activeSection.value = option);
            };

            const driversShown = ref(false);
            const toggleDriverShown = () => {
                return (driversShown.value = !driversShown.value);
            };
            const breakpoints = useBreakpoints(breakpointsTailwind);
            const maxMD = breakpoints.smaller('md');
            const showDrivers = computed(() => {
                console.log(maxMD.value);

                return driversShown.value && maxMD.value;
            });

            const drivers: Array<Driver> = reactive(currentTransportProvider.drivers);

            const searchDriver = ref('');

            const filteredDrivers = computed(() => {
                return drivers.filter((driver) => {
                    return driver.name.toLowerCase().includes(searchDriver.value.toLowerCase());
                });
            });

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

            const deleteDriver = async (index: number) => {
                let response = await axios
                    .delete(`${api}/driver/${drivers[index].id}`)
                    .then((res) => {
                        if (res.status === 200) {
                            return res.data.data;
                        }

                        return [];
                    })
                    .catch((err) => {
                        console.log(err);

                        return;
                    })
                    .finally(() => {
                        drivers.splice(index, 1);
                    });

                return {
                    response,
                };
            };

            const editDriver = (index: number) => {
                const driver = { ...drivers[index] };
                deleteDriver(index);

                if (activeSection.value === 'provider') {
                    changeSection('driver');
                }
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
                name: currentTransportProvider.name,
                legalId: currentTransportProvider.legalId,
                address: currentTransportProvider.address,
                observations: currentTransportProvider.observations,
                companyRepresentativeId: currentTransportProvider.companyRepresentativeId,
            });

            const companyRepresentative: CompanyRepresentative = reactive({
                name: currentTransportProvider.companyRepresentative.name,
                phone: currentTransportProvider.companyRepresentative.phone,
                email: currentTransportProvider.companyRepresentative.email,
            });

            const transportProviderFull: ComputedRef<boolean> = computed(() => {
                return !!(
                    newTransportProvider.name !== '' &&
                    newTransportProvider.address !== '0' &&
                    newTransportProvider.legalId >= 0
                );
            });

            const hasFullNewDriver: ComputedRef<boolean> = computed(() => {
                return !!(
                    newDriver.name !== '' &&
                    newDriver.phone !== '0' &&
                    newDriver.email !== '' &&
                    newDriver.vehicleType !== '' &&
                    newDriver.transportId !== ''
                );
            });

            const repFull: ComputedRef<boolean> = computed(() => {
                return !!(
                    companyRepresentative.name !== '' &&
                    companyRepresentative.phone !== '' &&
                    companyRepresentative.email !== ''
                );
            });

            const isFull: ComputedRef<boolean> = computed(() => {
                return transportProviderFull.value && repFull.value;
            });

            const driverTabText = computed(() => {
                return `Transportista${drivers.length > 1 ? `s (${drivers.length})` : ''}`;
            });

            const update = async () => {
                if (hasFullNewDriver.value) {
                    addDriver();
                }
                const { drivers, ...newTProv } = currentTransportProvider;

                const { data: tpData } = useAxios(
                    `/transportProvider/${id}`,
                    { method: 'PUT', data: newTransportProvider },
                    instance
                );
                const { data: rep } = useAxios(
                    `/companyRepresentative/${currentTransportProvider.companyRepresentativeId}`,
                    { method: 'PUT', data: companyRepresentative },
                    instance
                );
                drivers.forEach((driver) => {
                    if (driver.id) {
                        useAxios(`/driver/${driver.id}`, { method: 'PUT', data: driver }, instance);
                    } else {
                        const { id, ...newDriver } = driver;
                        newDriver.transportProviderId = currentTransportProvider.id;
                        const { data } = useAxios(`/driver/`, { method: 'POST', data: newDriver }, instance);
                    }
                });
                setTimeout(() => {
                    router.push('/proveedores-de-transporte');
                }, 1000);
            };

            return {
                newTransportProvider,
                isFull,
                companyRepresentative,
                activeSection,
                changeSection,
                drivers,
                addDriver,
                newDriver,
                hasFullNewDriver,
                deleteDriver,
                editDriver,
                id,
                currentTransportProvider,
                update,
                driversShown,
                showDrivers,
                driverTabText,
                toggleDriverShown,
                searchDriver,
                filteredDrivers,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';
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

    .input {
        @apply bg-white flex-row;
    }
    .search-input {
        @apply bg-transparent border-none text-sm p-0 ml-2;
    }
</style>
