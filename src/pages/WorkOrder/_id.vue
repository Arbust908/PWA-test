<template>
    <Layout>
        <ABMFormTitle :title="`Orden de trabajo - ${woID}`" />
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
                v-model:clientId="clientId"
                v-model:service-company-id="serviceCompanyId"
                v-model:pad="pad"
                v-model:pits="pits"
            />
            <EquipmentSection
                v-else-if="WO_section === 'equipamento'"
                v-model:operativeCradleId="operativeCradleId"
                v-model:backupCradleId="backupCradleId"
                v-model:operativeForkliftId="operativeForkliftId"
                v-model:backupForkliftId="backupForkliftId"
                v-model:traktors="traktors"
                v-model:pickups="pickups"
                v-model:rigmats="rigmats"
                v-model:conex="conex"
                v-model:generators="generators"
                v-model:tower="tower"
                v-model:cabin="cabin"
            />
            <RRHHSection v-else-if="WO_section === 'rrhh'" v-model:crews="crews" />
            <section class="mt-8 p-4">
                <GhostBtn
                    v-if="isLastSection()"
                    btn="text-green-700 border !border-green-700 hover:bg-second-200"
                    @click.prevent="addCrew"
                >
                    Agregar Crew
                </GhostBtn>
            </section>
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end">
            <section class="gap-6 flex flex-wrap items-center">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/orden-de-trabajo')"> Cancelar </SecondaryBtn>
                <GhostBtn btn="text-green-700 border !border-green-700 hover:bg-second-200" @click="save()">
                    <BookmarkIcon class="w-6 h-6 md:w-4 md:h-4" />
                    <span> Guardar Provisorio </span>
                </GhostBtn>
                <PrimaryBtn v-if="!isLastSection()" btn="wide" @click="nextSection"> Siguiente </PrimaryBtn>
                <PrimaryBtn v-else btn="wide" :disabled="!isAllFull ? 'yes' : null" @click="isAllFull && save(false)">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Pit, Traktor, Pickup, HumanResource, Crew, WorkOrder } from '@/interfaces/sandflow';
    import { compareCrews, compareResource } from '@/helpers/compareCrews';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { validateOrder, validateEquipment, validateHumanResourses } from '@/helpers/useWorkOrder';
    import { useCompareChanges } from '@/helpers/useCompareChanges';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import EquipmentSection from '@/components/workOrder/Equipment.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import OrderSection from '@/components/workOrder/Order.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import RRHHSection from '@/components/workOrder/HumanResource.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            ABMFormTitle,
            BookmarkIcon,
            CheckCircleIcon,
            EquipmentSection,
            GhostBtn,
            Layout,
            OrderSection,
            PrimaryBtn,
            RRHHSection,
            SecondaryBtn,
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
            /* let currentWorkOrder = workOrders.find((wo) => {
                return wo.id == id;
            }) */ const currentWorkOrder = ref(
                workOrders.find((wo) => {
                    return wo.id == id;
                })
            );

            onMounted(async () => {
                const { data } = await useAxios(`/workOrder/${id}`, instance);
                currentWorkOrder.value = data;
            });
            let newCWO = ref(currentWorkOrder.value);

            const woID = ref(newCWO.value.id);
            const client = ref(newCWO.value.client);
            const serviceCompany = ref(newCWO.value.serviceCompany);
            const pad = ref(newCWO.value.pad);
            const pits = ref(newCWO.value.pits);
            const backupPits = ref(JSON.parse(JSON.stringify(newCWO.value.pits)));
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
            const isOrderFull = computed(() => {
                return validateOrder(clientId.value, pad.value, pits.value);
            });

            // Is the Equipment section is full
            const isEquipmentFull = computed(() => {
                return validateEquipment(
                    operativeCradleId.value,
                    backupCradleId.value,
                    operativeForkliftId.value,
                    backupForkliftId.value,
                    traktors.value,
                    pickups.value
                );
            });

            // Is the RRHH section is full
            const isRRHHFull = computed(() => {
                return validateHumanResourses(crews.value);
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
                    client: clientId.value,
                    serviceCompany: serviceCompany.value,
                    // clientId: clientId.value,
                    serviceCompanyId: serviceCompanyId.value,
                    pad: pad.value,
                    operativeCradle: operativeCradleId.value,
                    backupCradle: backupCradleId.value,
                    operativeForklift: operativeForkliftId.value,
                    backupForklift: backupForkliftId.value,
                    crews: crews.value,
                    rigmats: rigmats.value,
                    conex: conex.value,
                    generators: generators.value,
                    tower: tower.value,
                    cabin: cabin.value,
                    draft,
                };
                const { data: WODone } = useAxios(`/workOrder/${woID.value}`, { method: 'PUT', data: newWO }, instance);
                watch(WODone, async (newVal, _) => {
                    if (newVal && newVal.data && newVal.data.id) {
                        const workOrderId = newVal.data.id;

                        if (pits.value.length > 0) {
                            const actionablePits = useCompareChanges(pits.value, backupPits.value);
                            console.log('actionablePits', actionablePits);
                            const { changed, deleted, create } = actionablePits;
                            changed.forEach(async (pit: Pit) => {
                                await useAxios(`/pit/${pit.id}`, { method: 'PUT', data: pit }, instance);
                            });
                            deleted.forEach(async (pit: Pit) => {
                                await useAxios(`/pit/${pit.id}`, { method: 'DELETE' }, instance);
                            });
                            create.forEach(async (pit: Pit) => {
                                const { id: noUseId, ...newPit } = pit;
                                newPit.companyId = Number(newVal.data.client);
                                newPit.workOrderId = workOrderId;
                                await useAxios(`/pit`, { method: 'POST', data: newPit }, instance);
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
                            const comparedCrews = compareCrews(crews.value, backupCrew.value);
                            for (const crewToUpdate of comparedCrews.changed) {
                                const { ...newCrew } = crewToUpdate;
                                newCrew.workOrderId = newVal.data.id;
                                const updatedCrew = await axios.put(api + `/crew/${newCrew.id}`, newCrew);
                                const oldResources = backupCrew.value.find((crew) => crew.id === newCrew.id).resources;
                                const comparedResources = compareResource(newCrew.resources, oldResources);
                                const uCrewId = updatedCrew.data.data.id;
                                for (const newRH of comparedResources.new) {
                                    const { id, ...newResource } = newRH;
                                    newResource.crewId = uCrewId;
                                    await axios.post(api + '/humanResource', newResource);
                                }
                                for (const changedRH of comparedResources.changed) {
                                    const { id, ...newResource } = changedRH;
                                    newResource.crewId = uCrewId;
                                    console.log('aaa', id);
                                    await axios.put(api + `/humanResource/${id}`, newResource);
                                }
                                for (const deleteRH of comparedResources.deleted) {
                                    await axios.delete(api + `/humanResource/${deleteRH.id}`);
                                }
                            }

                            for (const crewToDelete of comparedCrews.deleted) {
                                await axios.post(api + `/humanResource/${crewToDelete.id}`);
                            }

                            for (const crewToCreate of comparedCrews.new) {
                                const { id, ...newCrew } = crewToCreate;
                                newCrew.workOrderId = newVal.data.id;
                                const createdCrew = await axios.post(api + '/crew', newCrew);
                                for (const rrhh of crewToCreate.resources) {
                                    const crewId = createdCrew.data.data.id;
                                    const { id, ...newResource } = rrhh;
                                    newResource.crewId = crewId;
                                    await axios.post(api + '/humanResource', newResource);
                                }
                            }
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
                backupPits,
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
