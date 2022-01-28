<template>
    <Layout class="bg-white sm:bg-gray-100">
        <ABMFormTitle title="Planificación de arenas" />
        <section>
            <form method="POST" action="/" class="py-4">
                <FieldGroup class="grid-cols-6 md:grid-cols-12 max-w-2xl">
                    <ClientPitCombo
                        v-model:client-id="currentSandPlan.companyId"
                        v-model:pit-id="currentSandPlan.pitId"
                    />
                </FieldGroup>
            </form>
        </section>
        <section class="bg-white rounded-md shadow-sm mb-14 hidden sm:block">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4">
                <header class="flex justify-between">
                    <section class="flex space-x-4">
                        <h2 class="text-2xl font-bold space-x-2">
                            <span>Pozo</span>
                            <span>{{ selectedPitName }}</span>
                        </h2>
                        <button
                            :class="
                                currentSandPlan.stages.length < 40
                                    ? 'flex items-right'
                                    : 'flex items-right cursor-not-allowed'
                            "
                            @click.prevent="addStage"
                        >
                            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                            <span class="flex self-center font-bold mb-1"> Agregar etapa </span>
                        </button>
                    </section>
                    <section class="flex space-x-4">
                        <Icon
                            icon="ChevronDown"
                            outline
                            :opened="currentOpened"
                            :class="currentOpened ? 'rotate-180' : null"
                            class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer"
                            @click.prevent="toggleCurOp"
                        />
                    </section>
                </header>
                <div class="flex flex-col">
                    <div class="overflow-x-auto">
                        <div class="align-middle inline-block min-w-full">
                            <div class="h-full">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <StageHeader />
                                    </thead>
                                    <tbody v-show="currentOpened" class="divide-y">
                                        <SandPlanStage
                                            v-for="(stage, Key) in inProgressStages"
                                            :class="isNotLast(Key, inProgressStages) && 'border-b border-gray-200'"
                                            :key="Key"
                                            :pos="Key"
                                            :stage="stage"
                                            :editing="editingStage"
                                            :sands="sands"
                                            :stages-amount="currentSandPlan.stages.length"
                                            @editStage="editStage"
                                            @saveStage="saveStage"
                                            @duplicateStage="duplicateStage"
                                            @deleteStage="deleteStage"
                                        />
                                        <StageEmptyState v-if="inProgressStages.length <= 0" />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <section class="bg-white rounded-md shadow-sm block sm:hidden">
            <form method="POST" action="/" class="flex flex-col rounded border-solid border-black">
                <header
                    class="flex justify-between px-3 pb-3 pt-4 border-2 border-b-0 border-solid bg-gray-100 rounded-t-lg"
                >
                    <section class="flex space-x-4 self-center">
                        <h2 class="font-bold">
                            <span class="pl-6">Pozo</span>
                            <span>{{ selectedPitName }}</span>
                        </h2>
                    </section>
                    <section class="flex space-x-4 pr-3">
                        <button class="flex items-right" @click.prevent="addStage">
                            <Icon icon="PlusCircle" class="w-7 h-7 m-auto text-green-500 mr-1" />
                        </button>
                        <button
                            :title="currentOpened ? 'Ocultar Etapas' : 'Mostrar Etapas'"
                            @click.prevent="toggleCurOp"
                        >
                            <Icon
                                icon="ChevronDown"
                                outline
                                :opened="currentOpened"
                                :class="currentOpened ? 'rotate-180' : null"
                                class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer mr-1"
                            />
                        </button>
                    </section>
                </header>
                <div v-show="currentOpened" class="pr-8 pl-2 border-2 border-solid rounded-b-lg">
                    <ResponsiveTableSandPlan
                        v-for="(stage, Key) in inProgressStages"
                        :key="Key"
                        :pos="Key"
                        :stage="stage"
                        :editing="editingStage"
                        :sands="sands"
                        :stages-amount="currentSandPlan.stages.length - 1"
                        editing-key="innerId"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                    />
                </div>
            </form>
        </section>
        <!-- *** -->
        <footer class="mt-8 space-x-3 flex justify-end">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/planificacion-de-arena')"> Cancelar </SecondaryBtn>
            <PrimaryBtn btn="wide" size="md" :disabled="!isFull" @click.prevent="isFull ? save() : toggleErrorModal()">
                Guardar
            </PrimaryBtn>
        </footer>

        <SuccessModal
            :open="showModal"
            text="La planificación de arenas ha sido guardada con éxito"
            @close="$router.push('/planificacion-de-arena')"
            @main="$router.push('/planificacion-de-arena')"
        />
        <ErrorModal
            :open="showErrorModal"
            title="Hubo un problema al intentar guardar."
            text="Por favor, verifica los datos ingresados e intenta nuevamente."
            @close="toggleErrorModal()"
            @main="toggleErrorModal()"
        />
        <ErrorModal
            :open="showApiErrorModal"
            title="¡Ups! Hubo un problema y no pudimos guardar la planificación."
            text="Por favor, intentá nuevamente en unos minutos."
            @close="toggleApiErrorModal()"
            @main="toggleApiErrorModal()"
        />
    </Layout>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Pit, Company, SandPlan } from '@/interfaces/sandflow';
    import { useActions } from 'vuex-composition-helpers';
    import { useAxios } from '@vueuse/integrations/useAxios';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import ResponsiveTableSandPlan from '@/components/sandPlan/ResponsiveTableSandPlan.vue';
    import SandPlanStage from '@/components/sandPlan/StageRow.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import StageEmptyState from '@/components/sandPlan/StageEmptyState.vue';
    import StageHeader from '@/components/sandPlan/StageHeader.vue';
    import { isNotLast } from '@/helpers/iteretionHelpers';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            ABMFormTitle,
            ClientPitCombo,
            FieldGroup,
            Icon,
            Layout,
            PrimaryBtn,
            ResponsiveTableSandPlan,
            SandPlanStage,
            SecondaryBtn,
            StageEmptyState,
            StageHeader,
            SuccessModal,
            ErrorModal,
        },
        setup() {
            useTitle('Nueva Planificación de arenas <> Sandflow');
            // Init
            const instance = axios.create({
                baseURL: api,
            });

            const currentSandPlan: SandPlan = reactive({
                companyId: -1,
                pitId: -1,
                stagesAmount: 1,
                status: 'started',
                stages: [
                    {
                        id: 0,
                        stage: 1,
                        sandId1: -1,
                        quantity1: null,
                        sandId2: -1,
                        quantity2: null,
                        sandId3: -1,
                        quantity3: null,
                        sandId4: -1,
                        quantity4: null,
                        sandPlanId: 0,
                        status: 0,
                    },
                ],
            });

            const addStage = () => {
                if (currentSandPlan.stages?.length >= 40) {
                    return;
                }
                const defaultStage = {
                    id: 0,
                    stage: 1,
                    sandId1: -1,
                    quantity1: null,
                    sandId2: -1,
                    quantity2: null,
                    sandId3: -1,
                    quantity3: null,
                    sandId4: -1,
                    quantity4: null,
                    sandPlanId: 0,
                    status: 0,
                };
                duplicateStage(defaultStage);
            };

            const inProgressStages = computed(() => {
                return currentSandPlan.stages.filter((stage) => stage.status < 2);
            });
            const finishedStages = computed(() => {
                return currentSandPlan.stages.filter((stage) => stage.status >= 2);
            });
            const editingStage = ref(0);

            const editStage = (stage) => {
                editingStage.value = stage.id;
            };

            const saveStage = (stage) => {
                if (stage.sandId1 === -1 || stage.quantity1 < 1 || stage.quantity1 == null) {
                    stage.sandId1 = null;
                    stage.quantity1 = null;
                }

                if (stage.sandId2 === -1 || stage.quantity2 < 1 || stage.quantity2 == null) {
                    stage.sandId2 = null;
                    stage.quantity2 = null;
                }

                if (stage.sandId3 === -1 || stage.quantity3 < 1 || stage.quantity3 == null) {
                    stage.sandId3 = null;
                    stage.quantity3 = null;
                }

                if (stage.sandId4 === -1 || stage.quantity4 < 1 || stage.quantity4 == null) {
                    stage.sandId4 = null;
                    stage.quantity4 = null;
                }
                currentSandPlan.stages[stage.id] = stage;
                editingStage.value = -1;
            };
            const duplicateStage = (stage) => {
                const lastStage = currentSandPlan.stages[currentSandPlan.stages.length - 1];
                const lastStageId = { id: lastStage.id + 1 };
                const lastStageStage = { stage: lastStage.stage + 1 };
                const newStatus = { status: 0 };
                const newStage = {
                    ...stage,
                    ...lastStageId,
                    ...lastStageStage,
                    ...newStatus,
                };
                currentSandPlan.stages.push(newStage);
                editStage(newStage);
            };
            const deleteStage = (stage) => {
                const stageId = stage.id;
                currentSandPlan.stages = currentSandPlan.stages.filter((s) => s.id !== stageId);
            };

            const currentOpened: Ref<boolean> = ref(true);
            const toggleCurOp = useToggle(currentOpened);
            const finishedOpened: Ref<boolean> = ref(true);
            const toggleFinOp = useToggle(finishedOpened);
            // :: CLIENT
            const clients = ref([] as Array<Company>);
            const backupClients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);
            watch(companiesData, (companiesApi, prevCount) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                    backupClients.value = companiesApi.data;
                }
            });
            // << CLIENT
            // :: PITS
            const pits = ref([] as Array<Pit>);
            const backupPits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);
            watch(pitsData, (pitApi, prevCount) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                    backupPits.value = pitApi.data;
                }
            });
            const selectedPitName = computed(() => {
                return currentSandPlan.pitId >= 0 ? pits.value.find((pit) => pit.id == currentSandPlan.pitId).name : '';
            });

            // << PITS
            // :: SAND
            const sands = ref([] as Array<Pit>);
            const { data: sandsData } = useAxios('/sand', instance);
            watch(sandsData, (sandApi, prevCount) => {
                if (sandApi && sandApi.data) {
                    sands.value = sandApi.data;
                }
            });

            const minSandsAmount = (stages) => {
                let check = false;
                stages.forEach((stage) => {
                    if (
                        stage.sandId1 !== null &&
                        stage.sandId1 !== -1 &&
                        stage.quantity1 > 0 &&
                        stage.sandId2 !== null &&
                        stage.sandId2 !== -1 &&
                        stage.quantity2 > 0
                    ) {
                        check = true;
                    } else {
                        check = false;
                    }
                });

                return check;
            };

            // << SAND
            const isFull = computed(() => {
                const minSands = minSandsAmount(currentSandPlan.stages);

                const noZeroSandTypeNull =
                    (currentSandPlan.stages[0].sandId1 !== null && currentSandPlan.stages[0].sandId1 !== -1) ||
                    (currentSandPlan.stages[0].sandId2 !== null && currentSandPlan.stages[0].sandId2 !== -1) ||
                    (currentSandPlan.stages[0].sandId3 !== null && currentSandPlan.stages[0].sandId3 !== -1) ||
                    (currentSandPlan.stages[0].sandId4 !== null && currentSandPlan.stages[0].sandId4 !== -1);
                const noZeroSandTypeZero =
                    currentSandPlan.stages[0].quantity1 !== 0 ||
                    currentSandPlan.stages[0].quantity2 !== 0 ||
                    currentSandPlan.stages[0].quantity3 !== 0 ||
                    currentSandPlan.stages[0].quantity4 !== 0;

                return !!(
                    currentSandPlan.companyId >= 0 &&
                    currentSandPlan.pitId >= 0 &&
                    currentSandPlan.stages.length > 0 &&
                    currentSandPlan.stages.length <= 40 &&
                    noZeroSandTypeNull &&
                    noZeroSandTypeZero &&
                    minSands
                );
            });

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            const { saveSandPlan } = useActions(['saveSandPlan']);

            const save = (): void => {
                currentSandPlan.stages.map((stage) => {
                    if (stage.sandId1 === -1 || stage.quantity1 < 1 || stage.quantity1 == null) {
                        stage.sandId1 = null;
                        stage.quantity1 = null;
                    }

                    if (stage.sandId2 === -1 || stage.quantity2 < 1 || stage.quantity2 == null) {
                        stage.sandId2 = null;
                        stage.quantity2 = null;
                    }

                    if (stage.sandId3 === -1 || stage.quantity3 < 1 || stage.quantity3 == null) {
                        stage.sandId3 = null;
                        stage.quantity3 = null;
                    }

                    if (stage.sandId4 === -1 || stage.quantity4 < 1 || stage.quantity4 == null) {
                        stage.sandId4 = null;
                        stage.quantity4 = null;
                    }

                    return stage;
                });

                currentSandPlan.stages = currentSandPlan.stages.filter((stage) => {
                    const noSandTypeNull =
                        (stage.sandId1 !== null && stage.quantity1 > 0) ||
                        (stage.sandId2 !== null && stage.quantity2 > 0) ||
                        (stage.sandId3 !== null && stage.quantity3 > 0) ||
                        (stage.sandId4 !== null && stage.quantity4 > 0);
                    return noSandTypeNull;
                });

                const { data } = useAxios('/sandPlan', { method: 'POST', data: currentSandPlan }, instance);
                watch(data, (apiData) => {
                    if (apiData && apiData.data) {
                        const sandPlanId = apiData.data.id;
                        currentSandPlan.id = sandPlanId;

                        currentSandPlan.stages.forEach((stage) => {
                            const { data } = useAxios(
                                '/sandStage',
                                {
                                    method: 'POST',
                                    data: {
                                        sandPlanId: sandPlanId,
                                        stage: stage.stage,
                                        sandId1: stage.sandId1,
                                        sandId2: stage.sandId2,
                                        sandId3: stage.sandId3,
                                        sandId4: stage.sandId4,
                                        quantity1: stage.quantity1,
                                        quantity2: stage.quantity2,
                                        quantity3: stage.quantity3,
                                        quantity4: stage.quantity4,
                                    },
                                },
                                instance
                            );
                        });

                        saveSandPlan({ ...currentSandPlan });
                        toggleModal();
                    }
                });
            };

            return {
                currentSandPlan,
                inProgressStages,
                finishedStages,
                editingStage,
                editStage,
                saveStage,
                duplicateStage,
                deleteStage,
                currentOpened,
                toggleCurOp,
                finishedOpened,
                toggleFinOp,
                clients,
                pits,
                selectedPitName,
                sands,
                save,
                isFull,
                addStage,
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
                isNotLast,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 mt-1 flex shadow-sm;
    }
    input:read-only {
        @apply bg-gray-200 border cursor-not-allowed;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
    .amountWrapper {
        @apply mt-1 flex rounded shadow-sm;
    }
    .amountInput {
        @apply flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm;
    }
    .amountInput__unit {
        @apply inline-flex items-center px-3 rounded-r border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm;
    }
    // Quizas hay que armar algo externo para los estilos de boton
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
        }
        &__options {
            @apply border-transparent text-gray-800 bg-transparent hover:bg-gray-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
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
</style>
