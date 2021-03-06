<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nueva orden de trabajo</h1>
        </header>
        <section class="bg-second-0 rounded-md shadow-sm">
            <nav class="flex justify-between">
                <button class="section-tab" :selected="WO_section === 'orden'" @click="changeSection('orden')">
                    <span> Orden </span>
                    <CheckCircleIcon v-if="isOrderFull" class="w-5 h-5" />
                </button>
                <button
                    class="section-tab"
                    :selected="WO_section === 'equipamiento'"
                    @click="changeSection('equipamiento')"
                >
                    <span> Equipamiento </span>
                    <CheckCircleIcon v-if="isEquipmentFull" class="w-5 h-5" />
                </button>
                <button class="section-tab" :selected="WO_section === 'rrhh'" @click="changeSection('rrhh')">
                    <span> RRHH </span>
                    <!-- <CheckCircleIcon v-if="isRRHHFull" class="w-5 h-5" /> -->
                </button>
            </nav>
            <OrderSection
                v-if="WO_section === 'orden'"
                v-model:client-id="clientId"
                v-model:service-company-id="serviceCompanyId"
                v-model:pad="pad"
                v-model:pits="pits"
                v-model:is-full="isOrderFull"
            />
            <EquipmentSection
                v-else-if="WO_section === 'equipamiento'"
                v-model:operative-cradle-id="operativeCradleId"
                v-model:backup-cradle-id="backupCradleId"
                v-model:operative-forklift-id="operativeForkliftId"
                v-model:backup-forklift-id="backupForkliftId"
                v-model:traktors="traktors"
                v-model:pickups="pickups"
                v-model:rigmats="rigmats"
                v-model:conex="conex"
                v-model:generators="generators"
                v-model:tower="tower"
                v-model:cabin="cabin"
                v-model:is-full="isEquipmentFull"
            />
            <RRHHSection v-else-if="WO_section === 'rrhh'" v-model:crews="crews" v-model:is-full="isRRHHFull" />
            <footer
                :class="isLastSection() ? 'justify-between' : 'justify-end'"
                class="mt-8 p-4 gap-3 flex flex-col md:flex-row"
            >
                <section v-if="isLastSection()" class="pb-4 mb-2 border-b md:pb-0 md:mb-0 md:border-none">
                    <GhostBtn
                        btn="text-green-700  border !border-green-700 hover:bg-second-100"
                        @click.prevent="addCrew"
                    >
                        Agregar Crew
                    </GhostBtn>
                </section>
            </footer>
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end">
            <section class="gap-6 flex flex-wrap items-right">
                <SecondaryBtn btn="wide" :is-loading="isLoading" @click.prevent="$router.push('/orden-de-trabajo')"
                    >Cancelar</SecondaryBtn
                >
                <GhostBtn
                    btn="text-green-700 border !border-green-700 hover:bg-second-200"
                    :is-loading="isLoading"
                    @click="save()"
                >
                    <BookmarkIcon class="w-6 h-6 md:w-4 md:h-4" />
                    <span> Guardar Provisorio </span>
                </GhostBtn>
                <PrimaryBtn
                    v-if="!isLastSection()"
                    btn="wide"
                    :loading="isLoading"
                    :is-loading="isLoading"
                    @click="nextSection"
                >
                    Siguiente
                </PrimaryBtn>
                <PrimaryBtn
                    v-else
                    btn="wide"
                    :disabled="!isAllFull"
                    :is-loading="isLoading"
                    @click="isAllFull && save(false)"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
        <SuccessModal
            :open="showModal"
            text="¡La orden de trabajo fue guardada con éxito!"
            @close="$router.push('/orden-de-trabajo')"
            @main="$router.push('/orden-de-trabajo')"
        />
        <ErrorModal
            :open="showErrorModal"
            text="Hubo un problema al intentar guardar."
            @close="toggleErrorModal()"
            @main="toggleErrorModal()"
        />
        <ErrorModal
            :open="showApiErrorModal"
            text="¡Ups! Hubo un problema y no pudimos guardar la orden de trabajo."
            @close="toggleApiErrorModal()"
            @main="toggleApiErrorModal()"
        />
    </Layout>
</template>

<script lang="ts">
    import { BookmarkIcon, CheckCircleIcon } from '@heroicons/vue/outline';
    import OrderSection from '@/components/workOrder/Order.vue';
    import EquipmentSection from '@/components/workOrder/Equipment.vue';
    import RRHHSection from '@/components/workOrder/HumanResource.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { getLast } from '@/helpers/iteretionHelpers';
    import { validateOrder, validateEquipment, validateHumanResourses } from '@/helpers/useWorkOrder';
    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const api = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { Pit, Traktor, Pickup, HumanResource, Crew } from '@/interfaces/sandflow';
    // MODAL
    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));

    export default {
        components: {
            BookmarkIcon,
            CheckCircleIcon,
            EquipmentSection,
            ErrorModal,
            GhostBtn,
            Layout,
            OrderSection,
            PrimaryBtn,
            RRHHSection,
            SecondaryBtn,
            SuccessModal,
        },
        setup() {
            // Init
            const router = useRouter();
            useTitle(`Nueva Orden de Trabajo <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });
            const isLoading = ref(false);
            const toggleLoading = useToggle(isLoading);
            const isDraft = ref(true);
            const toggleDraft = useToggle(isDraft);
            // ORDEN
            const clientId: Ref<number> = ref(-1);
            const serviceCompanyId: Ref<number> = ref(-1);
            const pad: Ref<string> = ref('');
            const pits: Ref<Array<Pit>> = ref([
                {
                    id: 0,
                    name: '',
                },
            ]);
            const removeEmptyPits = () => {
                if (!isDraft.value) {
                    const savedPit = pits.value[0];
                }
                pits.value = pits.value.filter((pit: Pit) => pit.name !== '');

                if (!isDraft.value && pits.value.length === 0) {
                    pits.value.push(savedPit);
                }
            };
            // EQUIPO
            const operativeCradleId: Ref<number> = ref(-1);
            const backupCradleId: Ref<number> = ref(-1);
            const operativeForkliftId: Ref<number> = ref(-1);
            const backupForkliftId: Ref<number> = ref(-1);
            const traktors: Ref<Array<Traktor>> = ref([]);
            const pickups: Ref<Array<Pickup>> = ref([]);
            const rigmats: Ref<number> = ref(0);
            const conex: Ref<number> = ref(0);
            const generators: Ref<number> = ref(0);
            const tower: Ref<number> = ref(0);
            const cabin: Ref<number> = ref(0);

            // :: >>> Crew
            // :: Human Resource
            const resource: Ref<Array<HumanResource>> = ref([
                {
                    id: 0,
                    role: -1,
                    name: -1,
                },
            ]);
            const removeResource = (crewId: number, peopleId: number) => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                selectedCrew.resources = selectedCrew.resources.filter(
                    (resource: HumanResource) => resource.id !== peopleId
                );
            };
            const addResource = (crewId: number) => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);

                if (!selectedCrew) {
                    return new Error('No crew selected');
                }

                const lastResource = getLast(selectedCrew.resources);
                const lastId = lastResource?.id + 1 || 0; // ***
                const newResource: HumanResource = { id: lastId, role: -1, name: -1, crewId: selectedCrew.id };

                selectedCrew.resources.push(newResource);
            };
            const removeEmptyCrews = (): void => {
                if (!isDraft.value) {
                    const savedCrew = crews.value[0];
                }
                crews.value = crews.value
                    .map((crew: Crew) => removeEmptyResource(crew.id))
                    .filter((crew: Crew) => {
                        return !(crew.resources.length <= 0 && crew.timeStart === '' && crew.timeEnd === '');
                    });

                if (!isDraft.value && crews.value.length === 0) {
                    crews.value.push(savedCrew);
                }
            };
            // :: Crew
            const crews: Ref<Array<Crew>> = ref([
                {
                    id: 1,
                    timeStart: new Date().setHours(7),
                    timeEnd: new Date().setHours(19),
                    title: 'Crew A',
                    resources: resource,
                },
            ]);
            const addCrew = (): void => {
                const lastCrew = getLast(crews.value);
                const lastId = lastCrew?.id + 1 || 2;
                const numberForLetter = Math.max(Math.min(lastId + 64, 90), 65);
                const crewLetter = String.fromCharCode(numberForLetter);
                const timeStart = new Date().setHours(7);
                const timeEnd = new Date().setHours(19);
                const newCrew = {
                    id: lastId,
                    timeStart,
                    timeEnd,
                    title: `Crew ${crewLetter}`,
                    resources: [],
                };
                crews.value.push(newCrew);
                addResource(newCrew.id);
            };
            const removeCrew = (crewId: number) => {
                crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
            };
            const removeEmptyResource = (crewId: number): void => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);

                if (!isDraft.value) {
                    const saveResourse = selectedCrew.resources[0];
                }
                selectedCrew.resources = selectedCrew.resources.filter(
                    (resource: HumanResource) => resource.role !== -1 && resource.name !== -1
                );

                if (!isDraft.value && selectedCrew.resources.length === 0) {
                    selectedCrew.resources.push(saveResourse);
                }

                return selectedCrew;
            };
            // :: >>> Sections
            const WO_section = ref('orden');
            const section_order = ['orden', 'equipamiento', 'rrhh'];
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

            // MODAL
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            const save = async (draft = true) => {
                toggleLoading(true);
                toggleDraft(draft);
                // crews.value.map((crew: Crew) => {
                //     crew.resources.map((rrhh: HumanResource) => {
                //         console.log('resource', rrhh);
                //     });
                // });

                // removeAllEmptys();
                const newWO = {
                    client: clientId.value,
                    clientId: clientId.value,
                    serviceCompany: serviceCompanyId.value,
                    serviceCompanyId: serviceCompanyId.value,
                    pad: pad.value,
                    pits: pits.value,
                    operativeCradleId: operativeCradleId.value,
                    backupCradleId: backupCradleId.value,
                    operativeForkliftId: operativeForkliftId.value,
                    backupForkliftId: backupForkliftId.value,
                    operativeCradle: operativeCradleId.value,
                    backupCradle: backupCradleId.value,
                    operativeForklift: operativeForkliftId.value,
                    backupForklift: backupForkliftId.value,
                    traktors: traktors.value,
                    pickups: pickups.value,
                    crews: crews.value,
                    rigmats: rigmats.value,
                    conex: conex.value,
                    generators: generators.value,
                    tower: tower.value,
                    cabin: cabin.value,
                    draft: isDraft.value,
                };

                try {
                    const { data: WODone } = useAxios('/workOrder', { method: 'POST', data: newWO }, instance);
                    watch(WODone, async (newVal, _) => {
                        if (newVal && newVal.data && newVal.data.id) {
                            const workOrderId = Number(newVal.data.id);

                            if (pits.value.length > 0) {
                                pits.value.forEach((pit: Pit) => {
                                    const { id, ...newPit } = pit;
                                    newPit.companyId = newWO.clientId;
                                    newPit.workOrderId = workOrderId;
                                    const { data } = useAxios('/pit', { method: 'POST', data: newPit }, instance);
                                });
                            }

                            if (traktors.value.length > 0) {
                                for (const traktor of traktors.value) {
                                    const { id, ...newTraktor } = traktor;
                                    newTraktor.workOrderId = workOrderId;
                                    newTraktor.supplier = String(newTraktor.supplier);
                                    newTraktor.chassis = String(newTraktor.chassis);
                                    await axios.post(api + '/traktor', newTraktor);
                                }
                            }

                            if (pickups.value.length > 0) {
                                for (const pickup of pickups.value) {
                                    const { id, ...newPickup } = pickup;
                                    newPickup.workOrderId = workOrderId;
                                    await axios.post(api + '/pickup', newPickup);
                                }
                            }

                            if (crews.value.length > 0) {
                                for (const crew of crews.value) {
                                    const { id, ...newCrew } = crew;
                                    newCrew.workOrderId = workOrderId;
                                    const createdCrew = await axios.post(api + '/crew', newCrew);
                                    for (const rrhh of crew.resources) {
                                        const crewId = createdCrew.data.data.id;
                                        const { id, ...newResource } = rrhh;
                                        newResource.crewId = crewId;
                                        newResource.name = String(newResource.name);
                                        newResource.role = String(newResource.role);
                                        await axios.post(api + '/humanResource', newResource);
                                    }
                                }
                            }
                        }
                        toggleModal();
                    });
                } catch (error) {
                    toggleApiErrorModal();
                    console.log(error);
                }
            };

            return {
                WO_section,
                changeSection,
                nextSection,
                isLastSection,
                isOrderFull,
                isEquipmentFull,
                isRRHHFull,
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
                isLoading,
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .section-tab {
        @apply pb-2 pt-4 border-b-4 w-full font-medium text-gray-400 flex justify-center items-center gap-2;
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

    .vc-time-date {
        @apply hidden;
    }
</style>
