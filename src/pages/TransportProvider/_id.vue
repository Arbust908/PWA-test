<template>
    <Layout>
        <ABMFormTitle :title="`Proveedor de transporte - ID ${id}`" />
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
                        <span> Unidades </span>
                    </button>
                </nav>
                <section v-if="activeSection === 'provider'" class="bg-white rounded-md max-w-2xl shadow-sm">
                    <TransportProviderFrom
                        v-model:tp-name="newTransportProvider.name"
                        v-model:tp-id="newTransportProvider.legalId"
                        v-model:tp-address="newTransportProvider.address"
                        v-model:tp-observations="newTransportProvider.observations"
                        v-model:cr-name="companyRepresentative.name"
                        v-model:cr-phone="companyRepresentative.phone"
                        v-model:cr-email="companyRepresentative.email"
                    />
                </section>
                <section v-if="activeSection === 'driver'" class="bg-white rounded-md max-w-2xl shadow-sm">
                    <form method="POST" action="/" class="p-4 max-w-lg">
                        <TransportProviderDriverForm
                            v-model:driver-name="newDriver.name"
                            v-model:driver-phone="newDriver.phone"
                            v-model:driver-email="newDriver.email"
                            v-model:driver-t-type="newDriver.vehicleType"
                            v-model:driver-t-id="newDriver.transportId"
                            v-model:driver-t-id2="newDriver.transportId2"
                            v-model:driver-obs="newDriver.observations"
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
                        :transport-id2="driver.transportId2"
                        :observations="driver.observations"
                        @delete-driver="deleteDriver(index)"
                        @edit-driver="editDriver(index)"
                    />
                </section>
                <!-- *** -->
                <footer class="mt-8 gap-3 flex flex-col justify-end max-w-2xl">
                    <SideBtn v-if="drivers.length" class="md:hidden" btn="full" @click="driversShown = !driversShown">
                        {{ showDrivers ? driverTabText : 'Volver' }}
                    </SideBtn>
                    <section v-if="!showDrivers" class="w-full space-x-3 flex items-center justify-end">
                        <SecondaryBtn
                            btn="wide"
                            @click.prevent="driverRestore(), $router.push('/proveedores-de-transporte')"
                        >
                            Cancelar
                        </SecondaryBtn>
                        <PrimaryBtn
                            btn="wide"
                            :disabled="!isFull"
                            :is-loading="isLoading"
                            @click="
                                hasFullNewDriver && addDriver();
                                isFull && update();
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
    import axios from 'axios';
    import { TransportProvider, CompanyRepresentative, Driver } from '@/interfaces/sandflow';
    import { useAxios } from '@vueuse/integrations/useAxios';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import DriverCard from '@/components/transportProvider/DriverCard.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import TransportProviderDriverForm from '@/components/transportProvider/driverForm.vue';
    import TransportProviderFrom from '@/components/transportProvider/providerForm.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            ABMFormTitle,
            DriverCard,
            Layout,
            PrimaryBtn,
            SecondaryBtn,
            TransportProviderDriverForm,
            TransportProviderFrom,
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

            const transportProviders = ref([]);
            const currentTransportProvider = ref({});
            const drivers = ref([]);
            const newTransportProvider = ref({});
            const companyRepresentative = ref({});

            onMounted(async () => {
                // TODO: StoreLogic
                const result = await axios.get(`${api}/transportProvider`);
                transportProviders.value = result.data.data;
                currentTransportProvider.value = transportProviders.value.find((sp) => {
                    return sp.id == id;
                });
                drivers.value = currentTransportProvider.value.drivers;
                newTransportProvider.value = reactive({
                    name: currentTransportProvider.value.name,
                    legalId: currentTransportProvider.value.legalId,
                    address: currentTransportProvider.value.address,
                    observations: currentTransportProvider.value.observations,
                    companyRepresentativeId: currentTransportProvider.value.companyRepresentativeId,
                });
                companyRepresentative.value = reactive({
                    name: currentTransportProvider.value.companyRepresentative.name,
                    phone: currentTransportProvider.value.companyRepresentative.phone,
                    email: currentTransportProvider.value.companyRepresentative.email,
                });
            });

            let activeSection = ref('provider');

            const changeSection = (option: string) => {
                activeSection.value = option;
            };

            const driversShown = ref(false);
            const showDrivers = computed(() => {
                const windowWidth = window.innerWidth;

                return driversShown.value && windowWidth > 768;
            });

            let newDriver = reactive({
                name: '',
                phone: '',
                email: '',
                vehicleType: '',
                transportId: '',
                transportId2: '',
                observations: '',
            });

            const addDriver = () => {
                const driver = { ...newDriver };

                if (hasFullNewDriver.value) {
                    drivers.value.push(driver);
                }
                cleanNewDriver();
            };

            const deleteDriver = async (index: number) => {
                let response = await axios
                    .delete(`${api}/driver/${drivers.value[index].id}`)
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
                        drivers.value.splice(index, 1);
                    });

                return {
                    response,
                };
            };

            const backUpDriver = ref(false);

            const editDriver = (index: number) => {
                const driver = { ...drivers.value[index] };
                backUpDriver.value = true;
                deleteDriver(index);

                if (activeSection.value === 'provider') {
                    changeSection('driver');
                }
                newDriver.name = driver.name;
                newDriver.phone = driver.phone;
                newDriver.email = driver.email;
                newDriver.vehicleType = driver.vehicleType;
                newDriver.transportId = driver.transportId;
                newDriver.transportId2 = driver.transportId2;
                newDriver.observations = driver.observations;
            };

            const driverRestore = () => {
                if (backUpDriver.value === true) {
                    addDriver();
                    update();
                } else {
                    console.log('Nothing to push');
                }
            };

            const cleanNewDriver = () => {
                newDriver.name = '';
                newDriver.phone = '';
                newDriver.email = '';
                newDriver.vehicleType = '';
                newDriver.transportId = '';
                newDriver.transportId2 = '';
                newDriver.observations = '';
            };

            const driverTabText = computed(() => {
                return `Transportista${drivers.value.length > 1 ? `s (${drivers.value.length})` : ''}`;
            });

            const transportProviderFull: ComputedRef<boolean> = computed(() => {
                return !!(
                    newTransportProvider.value.name !== '' &&
                    newTransportProvider.value.address !== '0' &&
                    newTransportProvider.value.legalId >= 0
                );
            });

            const hasFullNewDriver: ComputedRef<boolean> = computed(() => {
                return !!(
                    newDriver.name !== '' &&
                    newDriver.phone !== '0' &&
                    newDriver.email !== '' &&
                    newDriver.vehicleType !== '' &&
                    newDriver.transportId !== '' &&
                    newDriver.transportId2 !== ''
                );
            });

            const repFull: ComputedRef<boolean> = computed(() => {
                return !!(
                    companyRepresentative.value.name !== '' &&
                    companyRepresentative.value.phone !== '' &&
                    companyRepresentative.value.email !== ''
                );
            });

            const isFull: ComputedRef<boolean> = computed(() => {
                return transportProviderFull.value && repFull.value;
            });
            const isLoading = ref(false);
            const update = async () => {
                isLoading.value = true;
                changeSection('provider');

                if (hasFullNewDriver.value) {
                    addDriver();
                }
                const { drivers, ...newTProv } = currentTransportProvider.value;

                const { data: tpData } = useAxios(
                    `/transportProvider/${id}`,
                    { method: 'PUT', data: newTransportProvider.value },
                    instance
                );
                const { data: rep } = useAxios(
                    `/companyRepresentative/${currentTransportProvider.value.companyRepresentativeId}`,
                    { method: 'PUT', data: companyRepresentative.value },
                    instance
                );
                drivers.forEach((driver) => {
                    if (driver.id) {
                        useAxios(`/driver/${driver.id}`, { method: 'PUT', data: driver }, instance);
                    } else {
                        const { id, ...newDriver } = driver;
                        newDriver.transportProviderId = currentTransportProvider.value.id;
                        const { data } = useAxios(`/driver/`, { method: 'POST', data: newDriver }, instance);
                    }
                });
                setTimeout(() => {
                    isLoading.value = false;
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
                driverRestore,
                id,
                currentTransportProvider,
                update,
                driverTabText,
                showDrivers,
                driversShown,
                isLoading,
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

    fieldset {
        @apply mb-6;
    }
    label {
        @apply text-sm;
    }
    .equip-grid {
        @apply grid gap-4 grid-cols-2 md:grid-cols-3;
    }
</style>
