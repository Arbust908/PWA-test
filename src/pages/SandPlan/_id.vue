<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Planificación de arenas</h1>
        </header>
        <section>
            <form method="POST" action="/" class="py-4">
                <FieldGroup class="grid-cols-6 md:grid-cols-12 max-w-2xl">
                    <ClientPitCombo
                        :clientId="currentSandPlan.companyId"
                        :pitId="currentSandPlan.pitId"
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
                            @click="toggleCurOp"
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
                                            editingKey="innerId"
                                            @editStage="editStage"
                                            @saveStage="saveStage"
                                            @duplicateStage="duplicateStage"
                                            @deleteStage="deleteStage"
                                            @upgrade="upgrade"
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
                <header class="flex justify-between px-3 pb-3 pt-4 border-b-1 border-solid border-black">
                    <section class="flex space-x-4">
                        <h2 class="font-semibold">
                            <span class="pl-6">Pozo</span>
                            <span>{{ selectedPitName }}</span>
                        </h2>
                    </section>
                    <section class="flex space-x-4">
                        <button class="flex items-right" @click.prevent="addStage">
                            <Icon icon="PlusCircle" class="w-7 h-7 m-auto text-green-500 mr-1" />
                        </button>
                        <button
                            @click.prevent="toggleCurOp"
                            :title="currentOpened ? 'Ocultar Etapas' : 'Mostrar Etapas'"
                        >
                            <Icon
                                icon="ChevronUp"
                                outline
                                :opened="currentOpened"
                                :class="currentOpened ? 'rotate-180' : null"
                                class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer"
                            />
                        </button>
                    </section>
                </header>
                <div class="flex flex-col p-4" v-show="currentOpened">
                    <ResposiveTableSandPlan
                        v-for="(stage, Key) in inProgressStages"
                        :key="Key"
                        :pos="Key + 1"
                        :stage="stage"
                        :editing="editingStage"
                        :sands="sands"
                        editingKey="innerId"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                        @upgrade="upgrade"
                    />
                </div>
            </form>
        </section>
        <section class="bg-white rounded-md shadow-sm hidden sm:block">
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
                            @click="toggleFinOp"
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
                                            @upgrade="upgrade"
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
                <header class="flex justify-between px-3 pb-3 pt-4 border-b-1 border-solid border-black">
                    <section class="flex space-x-4">
                        <h2 class="font-semibold">
                            <span class="pl-6">Etapas Finalizadas</span>
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
                <div class="flex flex-col p-4" v-show="finishedOpened">
                    <ResposiveTableSandPlan
                        v-for="(stage, Key) in finishedStages"
                        :key="Key"
                        :pos="Key + 1"
                        :stage="stage"
                        :editing="editingStage"
                        :sands="sands"
                        @editStage="editStage"
                        @saveStage="saveStage"
                        @duplicateStage="duplicateStage"
                        @deleteStage="deleteStage"
                        @upgrade="upgrade"
                    />
                    <StageEmptyState v-if="finishedStages.length <= 0" />
                </div>
            </form>
        </section>
        <footer class="p-4 space-x-8 flex justify-end">
            <NoneBtn @click.prevent="$router.push('/planificacion-de-arena')"> Cancelar </NoneBtn>
            <PrimaryBtn :disabled="!isFull ? 'yes' : null" @click.prevent="isFull && save()"> Guardar </PrimaryBtn>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, reactive, computed, ComputedRef, toRaw, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useState, useActions } from 'vuex-composition-helpers';
    import { useTitle } from '@vueuse/core';

    import Layout from '@/layouts/Main.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandPlanStage from '@/components/sandPlan/StageRow.vue';
    import StageEmptyState from '@/components/sandPlan/StageEmptyState.vue';
    import StageHeader from '@/components/sandPlan/StageHeader.vue';
    import {
        PurchaseOrder,
        SandProvider,
        SandOrder,
        TransportProvider,
        Pit,
        Company,
    } from '@/interfaces/sandflow.Types.ts';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { useToggle } from '@vueuse/core';
    const api = import.meta.env.VITE_API_URL || '/api';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import ResposiveTableSandPlan from '@/components/sandPlan/ResponsiveTableSandPlan.vue';

    export default {
        components: {
            Layout,
            GhostBtn,
            CircularBtn,
            PrimaryBtn,
            SandPlanStage,
            StageEmptyState,
            StageHeader,
            FieldGroup,
            ClientPitCombo,
            Icon,
            NoneBtn,
            ResposiveTableSandPlan,
        },
        setup() {
            // Init
            const windowWidth = window.innerWidth;
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const id = route.params.id;
            useTitle(`Planificación de Arena ${id} <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });
            const defaultStage = {
                innerId: 0,
                stage: null,
                sandId1: -1,
                quantity1: null,
                sandId2: -1,
                quantity2: null,
                sandId3: -1,
                quantity3: null,
                sandPlanId: 0,
                status: 0,
            };
            const currentSandPlan = reactive({
                id: -1,
                companyId: -1,
                pitId: -1,
                stagesAmount: 1,
                stages: [{ ...defaultStage }],
            });

            const vuexSPs = JSON.parse(JSON.stringify(store.state.sandPlan.all));
            const vuexSP = vuexSPs.find((sp) => {
                return sp.id == id;
            });

            const buckupStages = ref([]);
            if (!vuexSP || true) {
                const { data: spData } = useAxios('/sandPlan/' + id, instance);
                watch(spData, (sandplanApi, prevCount) => {
                    if (sandplanApi && sandplanApi.data) {
                        const sp = { ...currentSandPlan, ...sandplanApi.data };
                        currentSandPlan.id = Number(sp.id);
                        currentSandPlan.companyId = Number(sp.companyId);
                        currentSandPlan.pitId = Number(sp.pitId);
                        currentSandPlan.stagesAmount = sp.stagesAmount;

                        const formatedStages = sp.stages.map((stage) => {
                            return { ...stage, innerId: Number(stage.id) };
                        });

                        formatedStages.sort((a, b) => {
                            return a.stage - b.stage;
                        });

                        console.log('stages', sp.stages);
                        currentSandPlan.stages = formatedStages;
                        console.log('formatedStages', formatedStages);
                        buckupStages.value = sp.stages;
                    }
                });
            } else {
                const sp = { ...currentSandPlan, ...vuexSP };
                // console.log('VUEX', sp);
                currentSandPlan.companyId = sp.companyId;
                currentSandPlan.pitId = sp.pitId;
                currentSandPlan.stagesAmount = sp.stagesAmount;
                currentSandPlan.stages = sp.stages;
                currentSandPlan.id = sp.id;
                console.log('SP Vuex', currentSandPlan);
            }

            const addStage = () => {
                console.log('DEFAULT', defaultStage);
                duplicateStage(defaultStage);
            };

            const inProgressStages = computed(() => {
                return currentSandPlan.stages;
            });
            const finishedStages = computed(() => {
                return currentSandPlan.stages.filter((stage) => stage.status >= 2) || [];
            });
            const lastStage = currentSandPlan.stages[currentSandPlan.stages.length - 1];
            const lastStageId = lastStage ? Number(lastStage.innerId) : -1;
            const editingStage = ref(lastStageId);

            const editStage = (stage) => {
                editingStage.value = Number(stage.innerId);
            };
            const saveStage = (stage) => {
                // currentSandPlan.stages[stage.innerId] = stage;
                editingStage.value = -1;
            };
            const duplicateStage = (stage) => {
                const lastStage = currentSandPlan.stages[currentSandPlan.stages.length - 1];
                // SOLUCION TEMPORAL PARA DUPLICADO DE INNER ID
                const lastStageId = { innerId: Number(lastStage.innerId) + 100000 || 0 };
                const lastStageStage = { stage: lastStage.stage + 1 };
                const newStatus = { status: 0 };
                console.log(lastStage, lastStageId, lastStageStage, newStatus);
                const newStage = {
                    ...stage,
                    ...lastStageId,
                    ...lastStageStage,
                    ...newStatus,
                };
                console.log('NEWSTAGE', newStage);
                currentSandPlan.stages.push(newStage);
                editStage(newStage);
            };
            const stagesToDelete = ref([]);
            const deleteStage = (stage) => {
                const stageId = stage.innerId;
                const isDB = stage.id ?? false;
                console.log(isDB);
                console.log(stageId, isDB);
                currentSandPlan.stages = currentSandPlan.stages.filter((s) => s.innerId !== stageId);
                if (isDB) {
                    stagesToDelete.value.push(stageId);
                    console.log(stagesToDelete.value);
                }
            };
            const upgrade = (stage) => {
                currentSandPlan.stages.map((s) => {
                    if (s.innerId === stage.innerId) {
                        s.status += 1;
                    }
                    return s;
                });
            };

            const currentOpened: Ref<boolean> = ref(true);
            const toggleCurOp = useToggle(currentOpened);
            const finishedOpened: Ref<boolean> = ref(false);
            const toggleFinOp = useToggle(finishedOpened);
            // :: CLIENT
            const clients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);
            watch(companiesData, (companiesApi, prevCount) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                }
            });
            // << CLIENT
            // :: PITS
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);
            watch(pitsData, (pitApi, prevCount) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                }
            });
            const selectedPitName = computed(() => {
                console.log('computed-pitId', currentSandPlan.pitId);
                return Number(currentSandPlan.pitId) >= 0
                    ? pits.value.find((pit) => pit.id == currentSandPlan.pitId)?.name || 'Pit'
                    : '';
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
                return true;
            });
            const { updateSandPlan } = useActions(['updateSandPlan']);
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

                currentSandPlan.stages.forEach((stage) => {
                    const { data } = useAxios(
                        '/sandStage/' + stage.id,
                        {
                            method: 'PUT',
                            data: {
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

                const { data } = useAxios(
                    '/sandPlan/' + currentSandPlan.id,
                    {
                        method: 'PUT',
                        data: {
                            companyId: currentSandPlan.companyId,
                            pitId: currentSandPlan.pitId,
                            id: currentSandPlan.id,
                            stagesAmount: currentSandPlan.stagesAmount,
                            stages: currentSandPlan.stages,
                        },
                    },
                    instance
                );
                watch(data, (apiData) => {
                    if (apiData && apiData.data) {
                        const sandPlanId = apiData.data.id;
                        currentSandPlan.id = sandPlanId;
                        console.log('toDeltete', stagesToDelete.value);
                        const deletingStages = stagesToDelete.value;
                        deletingStages.map((id) => {
                            const { data } = useAxios('/sandStage/' + id, { method: 'DELETE' }, instance);
                        });

                        currentSandPlan.stages.map((stage) => {
                            const { ...sandStage } = stage;
                            sandStage.sandPlanId = sandPlanId;
                            // console.log('Sand Stage', sandStage);
                            if (sandStage.action === 'create') {
                                sandStage.action = 'update';
                                const { data } = useAxios(
                                    '/sandStage/' + sandStage.id,
                                    { method: 'PUT', data: sandStage },
                                    instance
                                );
                            } else {
                                const { id, ...newStage } = sandStage;
                                newStage.action = 'create';
                                if (!sandStage.id) {
                                    const { data } = useAxios(
                                        '/sandStage',
                                        { method: 'POST', data: newStage },
                                        instance
                                    );
                                }
                            }
                        });
                        console.log(currentSandPlan);
                        updateSandPlan(currentSandPlan);
                        router.push('/planificacion-de-arena');
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
                // upgrade,
                windowWidth,
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
