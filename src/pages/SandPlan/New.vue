<template>
    <Layout class="bg-white sm:bg-gray-100">
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0 sm:mt-4">Planificación de arenas</h1>
        </header>
        <section>
            <form method="POST" action="/" class="py-4">
                <FieldGroup class="grid-cols-6 md:grid-cols-12 max-w-2xl">
                    <ClientPitCombo
                        :client-id="currentSandPlan.companyId"
                        :pit-id="currentSandPlan.pitId"
                        @update:clientId="currentSandPlan.companyId = $event"
                        @update:pitId="currentSandPlan.pitId = $event"
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
                        <button class="flex items-center" @click.prevent="addStage">
                            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                            <span class="font-bold"> Agregar etapa </span>
                        </button>
                    </section>
                    <section class="flex space-x-4">
                        <Icon
                            icon="ChevronUp"
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
                            <div class="overflow-hidden">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <StageHeader />
                                    </thead>
                                    <tbody v-show="currentOpened" class="divide-y">
                                        <SandPlanStage
                                            v-for="(stage, Key) in inProgressStages"
                                            :key="Key"
                                            :pos="Key + 1"
                                            :stage="stage"
                                            :editing="editingStage"
                                            :sands="sands"
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
                    class="flex justify-between px-3 pb-3 pt-4 pr-3 rounded-t-lg border-b-1 border-solid border-black bg-gray-100"
                >
                    <section class="flex space-x-4 pr-3">
                        <h2 class="font-semibold">
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
                                icon="ChevronUp"
                                outline
                                :opened="currentOpened"
                                :class="currentOpened ? 'rotate-180' : null"
                                class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer mr-1"
                            />
                        </button>
                    </section>
                </header>
                <div v-show="currentOpened" class="pr-8 pl-2 border-2 border-solid">
                    <ResposiveTableSandPlan
                        v-for="(stage, Key) in inProgressStages"
                        :key="Key"
                        class="mt-2"
                        :pos="Key + 1"
                        :stage="stage"
                        :editing="editingStage"
                        :sands="sands"
                        editing-key="innerId"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                    />
                </div>
            </form>
        </section>
        <section class="bg-white rounded-md shadow-sm mt-4 hidden sm:block">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4">
                <header class="flex justify-between">
                    <section class="flex space-x-4">
                        <h2 class="text-2xl font-bold">
                            <span>Etapas finalizadas</span>
                        </h2>
                    </section>
                    <section class="flex space-x-4">
                        <Icon
                            icon="ChevronUp"
                            outline
                            :opened="finishedOpened"
                            :class="finishedOpened ? 'rotate-180' : null"
                            class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer"
                            @click.prevent="toggleFinOp"
                        />
                    </section>
                </header>
                <div class="flex flex-col">
                    <div class="overflow-x-auto">
                        <div class="align-middle inline-block min-w-full">
                            <div class="overflow-hidden">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <StageHeader />
                                    </thead>
                                    <tbody v-show="finishedOpened" class="divide-y">
                                        <SandPlanStage
                                            v-for="(stage, Key) in finishedStages"
                                            :key="Key"
                                            :stage="stage"
                                            :editing="editingStage"
                                            :sands="sands"
                                            @editStage="editStage"
                                            @saveStage="saveStage"
                                            @duplicateStage="duplicateStage"
                                            @deleteStage="deleteStage"
                                        />
                                        <StageEmptyState v-if="finishedStages.length <= 0" />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <section class="bg-white rounded-md shadow-sm mt-4 block sm:hidden">
            <form method="POST" action="/" class="flex flex-col rounded border-solid border-black">
                <header
                    class="flex justify-between px-3 pb-3 pt-4 pr-4 rounded-t-lg border-b-1 border-solid border-black bg-gray-100"
                >
                    <section class="flex space-x-4 pr-3 mt-2">
                        <h2 class="font-semibold">
                            <span class="pl-6">Etapas Finalizadas</span>
                        </h2>
                    </section>
                    <section class="flex space-x-4 pr-3">
                        <Icon
                            icon="ChevronUp"
                            outline
                            :opened="finishedOpened"
                            :class="finishedOpened ? 'rotate-180' : null"
                            class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer"
                            @click.prevent="toggleFinOp"
                        />
                    </section>
                </header>
                <div v-show="finishedOpened" class="flex flex-col p-4 border-2 border-solid">
                    <ResposiveTableSandPlan
                        v-for="(stage, Key) in finishedStages"
                        :key="Key"
                        :pos="Key + 1"
                        :stage="stage"
                        :sands="sands"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                    />
                    <StageEmptyState v-if="finishedStages.length <= 0" />
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
        <Modal type="off" :open="showModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="CheckCircle" class="h-[60px] w-[60px] mb-5 text-green-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >La planificación de arenas ha sido guardada con éxito</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn @click.prevent="$router.push('/planificacion-de-arena')">Continuar</PrimaryBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-700" />
                    <span class="text-center text-base border-none text-gray-900">
                        Hubo un problema al intentar guardar.
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        Por favor, verifica los datos ingresados e intenta nuevamente
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center cursor-pointer">
                    <WarningBtn @click.prevent="toggleErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showApiErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡Ups! Hubo un problema y no pudimos guardar la planificación.
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        Por favor, intentá nuevamente en unos minutos.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleApiErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, reactive, computed, ComputedRef, toRaw, watch, watchEffect, defineAsyncComponent } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useActions } from 'vuex-composition-helpers';
    import { useTitle } from '@vueuse/core';

    import Layout from '@/layouts/Main.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandPlanStage from '@/components/sandPlan/StageRow.vue';
    import StageEmptyState from '@/components/sandPlan/StageEmptyState.vue';
    import StageHeader from '@/components/sandPlan/StageHeader.vue';
    import ResposiveTableSandPlan from '@/components/sandPlan/ResponsiveTableSandPlan.vue';
    import { Pit, Company, SandPlan } from '@/interfaces/sandflow';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { useToggle } from '@vueuse/core';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';

    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    export default {
        components: {
            Layout,
            GhostBtn,
            CircularBtn,
            PrimaryBtn,
            SecondaryBtn,
            Icon,
            SandPlanStage,
            StageEmptyState,
            StageHeader,
            FieldGroup,
            ClientPitCombo,
            ResposiveTableSandPlan,
            Modal,
        },
        setup() {
            useTitle('Nueva Planificación de arenas <> Sandflow');
            // Init
            const windowWidth = window.innerWidth;
            const store = useStore();
            const router = useRouter();
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
                        quantity1: 0,
                        sandId2: -1,
                        quantity2: 0,
                        sandId3: -1,
                        quantity3: 0,
                        sandPlanId: 0,
                        status: 0,
                    },
                ],
            });

            const addStage = () => {
                if (currentSandPlan.stages?.length >= 39) {
                    // Disparar modal. No se puede mas de 40 etapas
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
                console.groupCollapsed('selectedPitName');
                console.log(currentSandPlan.pitId);
                console.log(pits.value);
                console.log(pits.value.find((pit) => pit.id == currentSandPlan.pitId));
                console.groupEnd();

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

            // << SAND
            const isFull = computed(() => {
                const noZeroSandTypeNull =
                    (currentSandPlan.stages[0].sandId1 !== null && currentSandPlan.stages[0].sandId1 !== -1) ||
                    (currentSandPlan.stages[0].sandId2 !== null && currentSandPlan.stages[0].sandId2 !== -1) ||
                    (currentSandPlan.stages[0].sandId3 !== null && currentSandPlan.stages[0].sandId3 !== -1);
                const noZeroSandTypeZero =
                    currentSandPlan.stages[0].quantity1 !== 0 ||
                    currentSandPlan.stages[0].quantity2 !== 0 ||
                    currentSandPlan.stages[0].quantity3 !== 0;

                return !!(
                    currentSandPlan.companyId >= 0 &&
                    currentSandPlan.pitId >= 0 &&
                    currentSandPlan.stages.length > 0 &&
                    currentSandPlan.stages.length <= 40 &&
                    noZeroSandTypeNull &&
                    noZeroSandTypeZero
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
                    if (stage.sandId1 === -1) {
                        stage.sandId1 = null;
                    }

                    if (stage.sandId2 === -1) {
                        stage.sandId2 = null;
                    }

                    if (stage.sandId3 === -1) {
                        stage.sandId3 = null;
                    }

                    return stage;
                });

                currentSandPlan.stages = currentSandPlan.stages.filter((stage) => {
                    const noSandTypeNull =
                        (stage.sandId1 !== null && stage.quantity1 > 0) ||
                        (stage.sandId2 !== null && stage.quantity2 > 0) ||
                        (stage.sandId3 !== null && stage.quantity3 > 0);

                    return noSandTypeNull;
                });
                const { data } = useAxios('/sandPlan', { method: 'POST', data: currentSandPlan }, instance);
                watch(data, (apiData) => {
                    if (apiData && apiData.data) {
                        const sandPlanId = apiData.data.id;
                        currentSandPlan.id = sandPlanId;

                        currentSandPlan.stages.forEach((stage) => {
                            console.log(stage);
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
                                        quantity1: stage.quantity1,
                                        quantity2: stage.quantity2,
                                        quantity3: stage.quantity3,
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
                windowWidth,
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
