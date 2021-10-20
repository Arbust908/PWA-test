<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">
                Proveedor de transporte - ID {{ id }}
            </h1>
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
                <section class="bg-white rounded-md max-w-2xl shadow-sm" v-if="activeSection === 'provider'">
                    <TransportProviderFrom
                        :tpName="newTransportProvider.name"
                        :tpId="newTransportProvider.legalId"
                        :tpAddress="newTransportProvider.address"
                        :tpObservations="newTransportProvider.observations"
                        :crName="companyRepresentative.name"
                        :crPhone="companyRepresentative.phone"
                        :crEmail="companyRepresentative.email"
                        @update:tpName="newTransportProvider.name = $event"
                        @update:tpId="newTransportProvider.legalId = $event"
                        @update:tpAddress="newTransportProvider.address = $event"
                        @update:tpObservations="newTransportProvider.observations = $event"
                        @update:crName="companyRepresentative.name = $event"
                        @update:crPhone="companyRepresentative.phone = $event"
                        @update:crEmail="companyRepresentative.email = $event"
                    />
                    <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
                        <section class="space-x-6 flex items-center justify-end">
                            <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')"> Cancelar </NoneBtn>
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
                <section class="bg-white rounded-md max-w-2xl shadow-sm" v-if="activeSection === 'driver'">
                    <form method="POST" action="/" class="p-4 max-w-lg">
                        <TransportProviderDriverForm
                            :driverName="newDriver.name"
                            :driverPhone="newDriver.phone"
                            :driverEmail="newDriver.email"
                            :driverTType="newDriver.vehicleType"
                            :driverTId="newDriver.transportId"
                            :driverObs="newDriver.observations"
                            @update:driverName="newDriver.name = $event"
                            @update:driverPhone="newDriver.phone = $event"
                            @update:driverEmail="newDriver.email = $event"
                            @update:driverTType="newDriver.vehicleType = $event"
                            @update:driverTId="newDriver.transportId = $event"
                            @update:driverObs="newDriver.observations = $event"
                        />
                        <div
                            :class="[
                                'flex',
                                'items-center',
                                'cursor-pointer',
                                hasFullNewDriver ? null : 'text-gray-200',
                            ]"
                            @click="hasFullNewDriver && addDriver()"
                        >
                            <Icon icon="Plus" type="outline" class="w-5 h-5" />
                            <h2>Agregar Transportista</h2>
                        </div>
                    </form>
                    <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
                        <section class="space-x-6 flex items-center justify-end">
                            <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')"> Cancelar </NoneBtn>
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
            </section>
            <section class="w-4/12 mt-12 ml-4 flex flex-col gap-y-4">
                <DriverCard
                    v-for="(driver, index) in drivers"
                    :key="index"
                    :name="driver.name"
                    :phone="driver.phone"
                    :email="driver.email"
                    :vehicleType="driver.vehicleType"
                    :transportId="driver.transportId"
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
    import { useRouter, useRoute } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import TransportProviderFrom from '@/components/transportProvider/providerForm.vue';
    import TransportProviderDriverForm from '@/components/transportProvider/driverForm.vue';
    import DriverCard from '@/components/transportProvider/DriverCard.vue';
    import Layout from '@/layouts/Main.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
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
            NoneBtn,
            PrimaryBtn,
            TransportProviderFrom,
            TransportProviderDriverForm,
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
            console.log('ctp', currentTransportProvider);

            let activeSection = ref('provider');

            const changeSection = (option: String) => {
                return (activeSection.value = option);
            };

            console.log(currentTransportProvider.drivers);
            const drivers: Array<Driver> = reactive(currentTransportProvider.drivers);
            console.log(drivers);

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
                if (hasFullNewDriver) {
                    drivers.push(driver);
                }
                cleanNewDriver();
            };

            const deleteDriver = async (index: number) => {
                console.log(drivers[index].id);
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
            console.log(newTransportProvider.legalId);

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

            const update = async () => {
                if (hasFullNewDriver) {
                    addDriver();
                }
                const { drivers, ...newTProv } = currentTransportProvider;

                console.log('newTraPro', newTransportProvider);
                console.log('newComRep', companyRepresentative);

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
                        console.log('driver tiene ID, y aexiste');
                        useAxios(`/driver/${driver.id}`, { method: 'PUT', data: driver }, instance);
                    } else {
                        const { id, ...newDriver } = driver;
                        newDriver.transportProviderId = currentTransportProvider.id;
                        console.log('newDriver', newDriver);
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
                Icon,
                addDriver,
                newDriver,
                hasFullNewDriver,
                deleteDriver,
                editDriver,
                id,
                currentTransportProvider,
                update,
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
