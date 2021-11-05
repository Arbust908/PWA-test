<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Orden de trabajo - {{ woID }}</h1>
        </header>
        <section class="bg-second-0 rounded-md shadow-sm">
            <nav class="flex justify-between">
                <button class="section-tab" :selected="WO_section === 'orden'" @click="changeSection('orden')">
                    <span> Orden </span>
                    <CheckCircleIcon v-if="isOrderFull" class="w-5 h-5" />
                </button>
                <button
                    class="section-tab"
                    :selected="WO_section === 'equipamento'"
                    @click="changeSection('equipamento')"
                >
                    <span> Equipamento </span>
                    <CheckCircleIcon v-if="isEquipmentFull" class="w-5 h-5" />
                </button>
                <button class="section-tab" :selected="WO_section === 'rrhh'" @click="changeSection('rrhh')">
                    <span> RRHH </span>
                    <CheckCircleIcon v-if="isRRHHFull" class="w-5 h-5" />
                </button>
            </nav>
            <OrderSection
                v-if="WO_section === 'orden'"
                :client-id="clientId"
                :service-company-id="serviceCompanyId"
                :pad="pad"
                :pits="pits"
                :is-full="isOrderFull"
                @update:clientId="clientId = $event"
                @update:serviceCompanyId="serviceCompanyId = $event"
                @update:pad="pad = $event"
                @update:pits="pits = $event"
                @update:isFull="isOrderFull = $event"
            />
            <EquipmentSection
                v-else-if="WO_section === 'equipamento'"
                :operative-cradle-id="operativeCradleId"
                :backup-cradle-id="backupCradleId"
                :operative-forklift-id="operativeForkliftId"
                :backup-forklift-id="backupForkliftId"
                :traktors="traktors"
                :pickups="pickups"
                :rigmats="rigmats"
                :conex="conex"
                :generators="generators"
                :tower="tower"
                :cabin="cabin"
                :is-full="isEquipmentFull"
                @update:operativeCradleId="operativeCradleId = $event"
                @update:backupCradleId="backupCradleId = $event"
                @update:operativeForkliftId="operativeForkliftId = $event"
                @update:backupForkliftId="backupForkliftId = $event"
                @update:traktors="traktors = $event"
                @update:pickups="pickups = $event"
                @update:rigmats="rigmats = $event"
                @update:conex="conex = $event"
                @update:generators="generators = $event"
                @update:tower="tower = $event"
                @update:cabin="cabin = $event"
                @update:isFull="isEquipmentFull = $event"
            />
            <RRHHSection
                v-else-if="WO_section === 'rrhh'"
                :crews="crews"
                :is-full="isRRHHFull"
                @update:crews="crews = $event"
                @update:isFull="isRRHHFull = $event"
            />
            <footer class="p-4 gap-3 flex flex-col md:flex-row justify-between">
                <section>
                    <GhostBtn v-if="isLastSection()" @click.prevent="addCrew"> Agregar Crew </GhostBtn>
                </section>
                <section class="space-x-6 flex items-center justify-end">
                    <NoneBtn @click.prevent="$router.push('/orden-de-trabajo')"> Cancelar </NoneBtn>
                    <GhostBtn @click="save()">
                        <BookmarkIcon class="w-4 h-4" />
                        <span> Guardar Provisorio </span>
                    </GhostBtn>
                    <PrimaryBtn v-if="!isLastSection()" @click="nextSection"> Siguiente </PrimaryBtn>
                    <PrimaryBtn v-else :disabled="!isAllFull ? 'yes' : null" @click="isAllFull && save(false)">
                        Finalizar
                    </PrimaryBtn>
                </section>
            </footer>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { ref, watch, computed, onMounted, reactive } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useToggle, useTitle } from '@vueuse/core';
    import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';
    import EquipmentSection from '@/components/workOrder/Equipment.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import OrderSection from '@/components/workOrder/Order.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import RRHHSection from '@/components/workOrder/HumanResource.vue';

    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const api = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { Pit, Traktor, Pickup, HumanResource, Crew, WorkOrder } from '@/interfaces/sandflow';
    import { compareCrews, compareResource } from '@/helpers/compareCrews';

    export default {
        components: {
            BookmarkIcon,
            CheckCircleIcon,
            EquipmentSection,
            GhostBtn,
            Layout,
            NoneBtn,
            OrderSection,
            PrimaryBtn,
            RRHHSection,
        },
        setup() {
            // Init
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const id = route.params.id;
            useTitle(`Orden de Trabajo ${id} <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });
            const isLoading = ref(false);
            const toggleLoading = useToggle(isLoading);
            const isDraft = ref(true);
            const toggleDraft = useToggle(isDraft);
            const workOrders: Array<WorkOrder> = JSON.parse(JSON.stringify(store.state.workOrders.all));
            let currentWorkOrder = workOrders.find((wo) => {
                return wo.id == id;
            });
            onMounted(async () => {
                const { data } = await useAxios(`/workOrder/${id}`, instance);
                console.log(data);
                currentWorkOrder = data;
            });
            let newCWO = ref(currentWorkOrder);

            const woID = ref(newCWO.value.id);
            const client = ref(newCWO.value.client);
            const serviceCompany = ref(newCWO.value.serviceCompany);
            const pad = ref(newCWO.value.pad);
            const pits = ref(newCWO.value.pits);
            const operativeCradle = ref(newCWO.value.operativeCradle);
            const backupCradle = ref(newCWO.value.backupCradle);
            const operativeForklift = ref(newCWO.value.operativeForklift);
            const backupForklift = ref(newCWO.value.backupForklift);
            const traktors = ref(newCWO.value.traktors);

            const pickups = ref(newCWO.value.pickups);

            const crew = ref(newCWO.value.crew);
            const backupCrew = ref(JSON.parse(JSON.stringify(newCWO.value.crew)));

            const rigmats = ref(newCWO.value.rigmats);
            const conex = ref(newCWO.value.conex);
            const generators = ref(newCWO.value.generators);
            const tower = ref(newCWO.value.tower);
            const cabin = ref(newCWO.value.cabin);

            const clientId = ref(Number(client.value));
            const serviceCompanyId = ref(Number(serviceCompany.value));
            const operativeCradleId = ref(Number(operativeCradle.value));
            const backupCradleId = ref(Number(backupCradle.value));
            const operativeForkliftId = ref(Number(operativeForklift.value));
            const backupForkliftId = ref(Number(backupForklift.value));

            const crews = crew;

            // Crew
            const removeResource = (crewId: number, peopleId: number) => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                selectedCrew.resources.value = selectedCrew.resources.value.filter(
                    (resource: HumanResource) => resource.id !== peopleId
                );
            };
            const addResource = (crewId: number): void => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                const lastId = selectedCrew.resources.length;
                selectedCrew.resources.push({
                    id: lastId,
                    rol: '',
                    name: '',
                } as HumanResource);
            };
            const addCrew = (): void => {
                const lastCrew = crews.value[crews.value.length - 1];
                const lastId = lastCrew.id + 1 || 1;
                const makeNextCrewLetter = () => {
                    const lastLetter = lastCrew.title ? lastCrew.title.split(' ')[1] : 'A';
                    const letterNum = lastLetter.charCodeAt(0);

                    return String.fromCharCode(letterNum + 1);
                };
                const crewLetter = makeNextCrewLetter();
                const start_time = new Date().setHours(7);
                const end_time = new Date().setHours(16);
                crews.value.push({
                    id: lastId,
                    start_time,
                    end_time,
                    title: `Crew ${crewLetter}`,
                    resources: [],
                });
                addResource(lastId);
            };
            const removeCrew = (crewId: number): void => {
                crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
            };

            if (crews && crews.value) {
                if (crews.value.length === 0) {
                    addCrew();
                }
            } else {
                console.log('Else crews', crews);
            }
            // Sections
            const WO_section = ref('orden');
            const section_order = ['orden', 'equipamento', 'rrhh'];
            const changeSection = (new_section: string): void => {
                WO_section.value = new_section;
            };
            const currentSectionIndex = (): number => {
                return section_order.indexOf(WO_section.value);
            };
            const isLastSection = (): boolean => {
                return currentSectionIndex() >= section_order.length - 1;
            };
            const nextSection = (): void => {
                if (isLastSection()) {
                    WO_section.value = section_order[section_order.length - 1];
                }
                WO_section.value = section_order[currentSectionIndex() + 1];
            };
            // Is the Order section is full
            const isOrderFull = ref(false);
            // Is the Equipment section is full
            const isEquipmentFull = ref(false);
            // Is the RRHH section is full
            const isRRHHFull = computed(() => {
                return !!(
                    crews.value &&
                    crews.value.length > 0 &&
                    crews.value[0].timeStart &&
                    crews.value[0].timeEnd &&
                    crews.value[0].resources &&
                    crews.value[0].resources.length > 0 &&
                    crews.value[0].resources[0].role !== '' &&
                    crews.value[0].resources[0].name !== ''
                );
            });
            // Is all sections full
            const isAllFull = computed(() => {
                return isOrderFull.value && isEquipmentFull.value && isRRHHFull.value;
            });
            // Remove Empty pits
            const removeEmptyPits = () => {
                if (!isDraft.value) {
                    const savedPit = pits.value[0];
                }
                pits.value = pits.value.filter((pit: Pit) => pit.name !== '');

                if (!isDraft.value && pits.value.length === 0) {
                    pits.value.push(savedPit);
                }
            };
            // Remove empty traktors
            const removeEmptyTraktors = (): void => {
                if (!isDraft.value) {
                    const savedTraktor = traktors.value[0];
                }
                traktors.value = traktors.value.filter(
                    (traktor: Traktor) =>
                        !(traktor.chassis === '' && traktor.supplier === '' && traktor.description === '')
                );

                if (!isDraft.value && traktors.value.length === 0) {
                    traktors.value.push(savedTraktor);
                }
            };
            const removeEmptyPickups = (): void => {
                if (!isDraft.value) {
                    const savedPickup = pickups.value[0];
                }
                pickups.value = pickups.value.filter(
                    (pickup: Pickup) => pickup.pickup_id !== '' && pickup.description !== ''
                );

                if (!isDraft.value && pickups.value.length === 0) {
                    pickups.value.push(savedPickup);
                }
            };
            // Remove empty Crews
            const removeEmptyCrews = (): void => {
                if (!isDraft.value) {
                    const savedCrew = crews.value[0];
                }
                crews.value = crews.value
                    .map((crew: Crew) => removeEmptyResource(crew.id))
                    .filter((crew: Crew) => {
                        console.log(crew);

                        return !(crew.resources.length <= 0 && crew.timeStart === '' && crew.timeEnd === '');
                    });

                if (!isDraft.value && crews.value.length === 0) {
                    crews.value.push(savedCrew);
                }
            };
            // Remove Empty Resource
            const removeEmptyResource = (crewId: number): void => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);

                if (!isDraft.value) {
                    const saveResourse = selectedCrew.resources[0];
                }
                selectedCrew.resources = selectedCrew.resources.filter(
                    (resource: HumanResource) => resource.rol !== '' && resource.name !== ''
                );

                if (!isDraft.value && selectedCrew.resources.length === 0) {
                    selectedCrew.resources.push(saveResourse);
                }

                return selectedCrew;
            };
            const removeAllEmptys = (): void => {
                removeEmptyPits();
                removeEmptyTraktors();
                removeEmptyPickups();
                removeEmptyCrews();
            };

            const save = async (draft = true) => {
                toggleLoading(true);
                toggleDraft(draft);
                // removeAllEmptys();
                const newWO = {
                    id: woID.value,
                    client: client.value,
                    serviceCompany: serviceCompany.value,
                    clientId: clientId.value,
                    serviceCompanyId: serviceCompanyId.value,
                    pad: pad.value,
                    operativeCradleId: operativeCradleId.value,
                    backupCradleId: backupCradleId.value,
                    operativeForkliftId: operativeForkliftId.value,
                    backupForkliftId: backupForkliftId.value,
                    crews: crews.value,
                    rigmats: rigmats.value,
                    conex: conex.value,
                    generators: generators.value,
                    tower: tower.value,
                    cabin: cabin.value,
                    draft,
                };
                const { data: WODone } = useAxios(`/workOrder/${woID.value}`, { method: 'PUT', data: newWO }, instance);
                watch(WODone, (newVal, _) => {
                    if (newVal && newVal.data && newVal.data.id) {
                        if (pits.value.length > 0) {
                            const isPitsFinished = ref([]);
                            pits.value.forEach((pit: Pit) => {
                                if (!pit.id) {
                                    const { data } = useAxios(
                                        `/pit/${pit.id}`,
                                        {
                                            method: 'POST',
                                            data: { ...pit, workOrderId: newVal.data.id },
                                        },
                                        instance
                                    );
                                    isPitsFinished.value.push(data);
                                    newVal.data.pits.push(pit);
                                } else {
                                    const { data } = useAxios(`/pit/${pit.id}`, { method: 'PUT', data: pit }, instance);
                                    isPitsFinished.value.push(data);
                                    newVal.data.pits = newVal.data.pits.map((p) => {
                                        if (p.id === pit.id) {
                                            return pit;
                                        }

                                        return p;
                                    });
                                }
                            });
                        }

                        if (traktors.value.length > 0) {
                            const isTraktorsFinished = ref([]);
                            traktors.value.forEach((traktor) => {
                                if (!traktor.id) {
                                    const { data } = useAxios(
                                        `/traktor/`,
                                        {
                                            method: 'POST',
                                            data: { ...traktor, workOrderId: newVal.data.id },
                                        },
                                        instance
                                    );
                                    isTraktorsFinished.value.push(data);
                                    newVal.data.traktors.push(traktor);
                                } else {
                                    const { data } = useAxios(
                                        `/traktor/${traktor.id}`,
                                        { method: 'PUT', data: traktor },
                                        instance
                                    );
                                    isTraktorsFinished.value.push(data);
                                    newVal.data.traktors = newVal.data.traktors.map((trak) => {
                                        if (trak.id === traktor.id) {
                                            return traktor;
                                        }

                                        return trak;
                                    });
                                }
                            });
                        }

                        if (pickups.value.length > 0) {
                            const isPickupFinished = ref([]);
                            pickups.value.forEach((pickup) => {
                                if (!pickup.id) {
                                    const { data } = useAxios(
                                        `/pickup/`,
                                        {
                                            method: 'POST',
                                            data: { ...pickup, workOrderId: newVal.data.id },
                                        },
                                        instance
                                    );
                                    isPickupFinished.value.push(data.value);
                                    newVal.data.pickups.push(pickup);
                                } else {
                                    const { data } = useAxios(
                                        `/pickup/${pickup.id}`,
                                        { method: 'PUT', data: pickup },
                                        instance
                                    );
                                    isPickupFinished.value.push(data);
                                    newVal.data.pickups = newVal.data.pickups.map((pick) => {
                                        if (pick.id === pickup.id) {
                                            return pickup;
                                        }

                                        return pick;
                                    });
                                }
                            });
                        }

                        if (crews.value.length > 0) {
                            const isCrewsFinished = ref([]);
                            const comparedCrews = compareCrews(crews.value, backupCrew.value);
                            console.log('edited', crews.value);
                            console.log('backup', backupCrew.value);
                            console.log('comparedCrews', comparedCrews);
                            comparedCrews.changed.forEach((crewToUpdate) => {
                                const { ...newCrew } = crewToUpdate;
                                console.log('newCrew', newCrew);
                                console.log('crewToUpdate', crewToUpdate);
                                newCrew.workOrderId = newVal.data.id;
                                const { data } = useAxios(
                                    `/crew/${newCrew.id}`,
                                    { method: 'PUT', data: newCrew },
                                    instance
                                );
                                isCrewsFinished.value.push(data);
                                const oldResources = backupCrew.value.find((crew) => crew.id === newCrew.id).resources;
                                const comparedResources = compareResource(newCrew.resources, oldResources);
                                console.log(comparedResources);
                                comparedResources.new.forEach((resource) => {
                                    const crewId = newCrew.id;
                                    const { id: resourseId, ...newResource } = resource;
                                    newResource.crewId = crewId;
                                    useAxios('/humanResource', { method: 'POST', data: newResource }, instance);
                                });
                                comparedResources.changed.forEach((resource) => {
                                    const crewId = newCrew.id;
                                    const { ...newResource } = resource;
                                    newResource.crewId = crewId;
                                    useAxios(
                                        `/humanResource/${newResource.id}`,
                                        { method: 'PUT', data: newResource },
                                        instance
                                    );
                                });
                                comparedResources.deleted.forEach((resource) => {
                                    useAxios(`/humanResource/${resource.id}`, { method: 'DELETE' }, instance);
                                });
                            });
                            comparedCrews.deleted.forEach((crewToDelete) => {
                                const { id: crewId } = crewToDelete;
                                useAxios(`/crew/${crewId}`, { method: 'DELETE' }, instance);
                            });
                            comparedCrews.new.forEach((crewToCreate) => {
                                const { id: innerCrewId, ...newCrew } = crewToCreate;
                                newCrew.workOrderId = newVal.data.id;
                                const { data } = useAxios('/crew', { method: 'POST', data: newCrew }, instance);
                                isCrewsFinished.value.push(data);
                                watch(data, (newVal, _) => {
                                    crew.value.resources.forEach((resource) => {
                                        const crewId = newVal.data.id;
                                        const { id, ...newResource } = resource;
                                        newResource.crewId = crewId;
                                        const { data: dataRH } = useAxios(
                                            '/humanResource',
                                            { method: 'POST', data: newResource },
                                            instance
                                        );
                                    });
                                });
                            });
                            // comparedCrews.unchanged Nothing to do

                            crews.value.forEach((crew) => {
                                const { id, ...newCrew } = crew;
                                // console.log(newVal)
                                // console.log(newVal.data)
                                newCrew.workOrderId = newVal.data.id;
                                const { data } = useAxios('/crew', { method: 'POST', data: newCrew }, instance);
                                isCrewsFinished.value.push(data);
                                watch(data, (newVal, _) => {
                                    crew.resources.forEach((resource) => {
                                        const crewId = newVal.data.id;
                                        const { id, ...newResource } = resource;
                                        newResource.crewId = crewId;
                                        const { data: dataRH } = useAxios(
                                            '/humanResource',
                                            { method: 'POST', data: newResource },
                                            instance
                                        );
                                    });
                                });
                            });
                            console.log(isCrewsFinished.value);
                        }

                        store.dispatch('updateWorkOrder', newVal.data);
                        setTimeout(() => {
                            toggleLoading(false);
                            setTimeout(() => {
                                // Modal de procesasando?
                                router.push('/orden-de-trabajo');
                            }, 100);
                        }, 1000);
                    }
                });
            };

            return {
                woID,
                WO_section,
                changeSection,
                nextSection,
                isLastSection,
                isOrderFull,
                isEquipmentFull,
                isRRHHFull,
                client,
                serviceCompany,
                clientId,
                serviceCompanyId,
                pad,
                pits,
                operativeCradleId,
                backupCradleId,
                operativeForkliftId,
                backupForkliftId,
                traktors,
                pickups,
                rigmats,
                conex,
                generators,
                tower,
                cabin,
                removeResource,
                addResource,
                crews,
                removeCrew,
                addCrew,
                save,
                isAllFull,
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
