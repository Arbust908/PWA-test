<template>
    <Layout>
        <ABMFormTitle title="Cierre de operaciones" />
        <FieldGroup class="pt-3 px-4 pb-4 gap-y-3">
            <FieldSelect
                v-model:data="clientId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Cliente"
                field-name="client"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                @change="getSandPlans"
            />
            <FieldSelect
                v-model:data="operatorId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Operadora / Empresa de Servicios"
                field-name="operator"
                placeholder="Seleccionar operadora"
                endpoint="/company?isOperator=1"
                :is-disabled="disabledOperator"
                is-optional
                @change="filterByOperator"
            />
            <div class="col-span-12 md:col-span-5 xl:col-span-4">
                <PadSelector
                    v-model:woId="woId"
                    shared-classes="col-span-12"
                    is-optional
                    :is-disabled="disabledPad"
                    :client-id="clientId"
                />
            </div>

            <section class="bg-white col-span-full shadow max-w-[100%] hidden sm:block">
                <header class="grid grid-cols-4 text-sm rounded-t border-b py-3">
                    <span class="pl-8 text-left">POZO</span>
                    <span class="text-center">ETAPAS</span>
                    <span class="text-center">ESTADO</span>
                    <span class="pl-4 text-left">TONELADAS</span>
                </header>
                <div v-if="!pits || pits.length <= 0" class="rounded-b w-full p-6 text-center text-gray-400 italic">
                    <span>Seleccione un cliente</span>
                </div>
                <div v-else class="divide-y rounded-b border-x border-b">
                    <article
                        v-for="sandPlan in filteredSandPlans"
                        :key="sandPlan.id"
                        class="grid grid-cols-4 py-2 text-sm"
                    >
                        <div class="my-4 text-left pl-8">
                            <input
                                id="checkbox"
                                v-model="sandPlan.isSelected"
                                type="checkbox"
                                class="outline-none focus:outline-none text-green-500 rounded mr-2"
                                @change="addCheckedPits(sandPlan, sandPlan.isSelected)"
                            />
                            <span> {{ sandPlan.pit.name }} </span>
                        </div>
                        <div class="my-4 text-center">
                            <span>{{ getPlanCurrentStage(sandPlan) }} / {{ getPlanTotalStages(sandPlan) }}</span>
                        </div>
                        <div class="my-4 text-center">
                            <Badge
                                v-if="sandPlan.stages[0]?.status === 0"
                                class="bg-blue-600 rounded-lg"
                                text="EN PROGRESO"
                            />
                            <Badge v-else text="COMPLETA" />
                        </div>
                        <div class="my-4 text-left pl-4 font-bold">
                            <span>{{ checkSandStages(sandPlan) }}t</span>
                        </div>
                    </article>
                    <article
                        v-if="filteredSandPlans.length <= 0"
                        class="rounded-b w-full p-6 text-center text-gray-400 italic"
                    >
                        <span>No hay planificaciones</span>
                    </article>
                </div>
            </section>
            <!-- mobile -->
            <section v-if="clientId > -1" class="col-span-full block sm:hidden">
                <form
                    v-for="sandPlan in filteredSandPlans"
                    :key="sandPlan.id"
                    class="flex flex-col shadow-sm overflow-hidden rounded-lg bg-white mb-6"
                >
                    <div>
                        <header class="flex justify-between px-3 pb-3 pt-4 bg-gray-200">
                            <section class="flex space-x-4 self-center">
                                <input
                                    id="checkbox"
                                    v-model="sandPlan.isSelected"
                                    type="checkbox"
                                    class="outline-none focus:outline-none text-green-500 rounded ml-4 mt-1"
                                    @change="addCheckedPits(sandPlan, sandPlan.isSelected)"
                                />
                                <h2 class="font-bold">
                                    <span class="">Pozo {{ sandPlan.pit.name }}</span>
                                </h2>
                            </section>
                            <section class="flex space-x-4 pr-3">
                                <button @click.prevent="setOpened(sandPlan.id)">
                                    <Icon
                                        icon="ChevronDown"
                                        outline
                                        :opened="currentOpened.includes(sandPlan.id)"
                                        :class="currentOpened.includes(sandPlan.id) ? 'rotate-180' : null"
                                        class="w-8 h-8 text-gray-600 transition transform duration-300 ease-out cursor-pointer mr-1"
                                    />
                                </button>
                            </section>
                        </header>
                        <div
                            v-show="currentOpened.includes(sandPlan.id)"
                            class="pr-8 pl-2 border-2 border-solid rounded-b-lg"
                        >
                            <CloseOperationTable :sand-plan="sandPlan" class="my-4 w-full" />
                        </div>
                    </div>
                </form>
                <article
                    v-if="filteredSandPlans.length <= 0"
                    class="rounded border-2 border-dashed col-span-full p-6 text-center text-gray-500 block sm:hidden"
                >
                    <span>No hay planificaciones</span>
                </article>
            </section>
            <section
                v-else
                class="rounded border-2 border-dashed col-span-full p-6 text-center text-gray-500 block sm:hidden"
            >
                <span>Seleccione un cliente</span>
            </section>
        </FieldGroup>
        <footer class="footerDesktop">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/home')"> Cancelar </SecondaryBtn>
            <PrimaryBtn btn="wide" size="md" @click.prevent="toggleModal()"> Finalizar Operación </PrimaryBtn>
        </footer>

        <CloseOperationModal
            v-if="showModal"
            :show-modal="showModal"
            :sand-plans="endingSandPlanPits"
            @close="showModal = false"
            @confirm="closeTheOperation"
        />
        <!-- QUe hacemos con estos modales? -->
        <SuccessModal
            :open="openSuccess"
            text="El cierre de operación #1234 ha sido generado con éxito"
            @close="$router.go(0)"
            @main="$router.go(0)"
        />
        <ErrorModal
            :open="showErrorModal"
            title="¡Ups! Hubo un problema al intentar guardar el cierre."
            text="Por favor, intentá nuevamente en unos minutos."
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

<script setup lang="ts">
    import axios from 'axios';

    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import PadSelector from '@/components/util/PadSelector.vue';
    import Badge from '@/components/ui/Badge.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import CloseOperationModal from '@/components/closeOfOperation/CloseOperationModal.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import { Pit, SandPlan, SandStage, WorkOrder } from '@/interfaces/sandflow';

    import CloseOperationTable from '@/components/closeOfOperation/CloseOperationTable.vue';
    import { getSandPlan, getWorkOrders, updateStage, updateWorkOrder } from '@/helpers/useGetEntities';

    const api = import.meta.env.VITE_API_URL || '/api';
    useTitle('Cierre de operaciones <> Sandflow');

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const woId = ref(-1);
    const workOrders = ref([] as WorkOrder[]);
    const pits = ref([] as Pit[]);
    const sandPlans = ref([] as SandPlan[]);
    const currentOpened = ref([] as number[]);
    const openSuccess = ref(false);
    const endingSandPlanPits = ref([] as SandPlan[]);
    const disabledOperator = ref(true);
    const disabledPad = ref(true);

    const filteredWorkOrders = computed(() => {
        return workOrders.value.filter((wo) => {
            // TODO si client pasa a ser Id en algun momento el Number es redundante pero hay que cambiarlo.
            return Number(wo.client) === clientId.value;
        });
    });

    const filteredSandPlans = computed(() => {
        const sandPlansToShow = ref(sandPlans.value);
        sandPlansToShow.value = sandPlansToShow.value.filter((sandPlan) => {
            return sandPlan.stages?.every((stage: SandStage) => stage && stage?.status < 2);
        });

        if (clientId.value !== -1) {
            sandPlansToShow.value = sandPlansToShow.value.filter(
                (sandPlan: SandPlan) => sandPlan.company?.id === clientId.value
            );
        }

        if (operatorId.value !== -1) {
            sandPlansToShow.value = sandPlansToShow.value.filter((sandPlan: SandPlan) => {
                const workOrderByOperatorIds = filteredWorkOrders.value
                    .filter((wo: WorkOrder) => Number(wo.serviceCompany) === operatorId.value)
                    .map((wo: WorkOrder) => wo.id);

                return workOrderByOperatorIds.includes(sandPlan?.pit?.workOrderId);
            });
        }

        if (woId.value !== -1) {
            sandPlansToShow.value = sandPlansToShow.value.filter((sandPlan: SandPlan) => {
                return sandPlan?.pit?.workOrderId === woId.value;
            });
        }

        return sandPlansToShow.value;
    });

    const addCheckedPits = (sandPlan: SandPlan, check: boolean) => {
        if (check) {
            endingSandPlanPits.value.push(sandPlan);
        } else {
            endingSandPlanPits.value = endingSandPlanPits.value.filter(
                (EPSandPlan: SandPlan) => EPSandPlan.id !== sandPlan.id
            );
        }
    };

    // Modals
    const showModal = ref(false);
    const toggleModal = useToggle(showModal);
    const showErrorModal = ref(false);
    const toggleErrorModal = useToggle(showErrorModal);
    const showApiErrorModal = ref(false);
    const toggleApiErrorModal = useToggle(showApiErrorModal);

    const setOpened = (id: number): void => {
        if (currentOpened.value.includes(id)) {
            currentOpened.value = currentOpened.value.filter((COid) => COid !== id);
        } else {
            currentOpened.value.push(id);
        }
    };

    const resetOperator = () => {
        operatorId.value = -1;
        disabledPad.value = true;
    };
    const resetPad = () => {
        woId.value = -1;
        disabledOperator.value = true;
    };

    watch(clientId, (newValue) => {
        if (newValue !== -1) {
            disabledOperator.value = false;
            disabledPad.value = false;
        } else {
            resetOperator();
            resetPad();
        }
    });

    const getSandPlans = async () => {
        if (clientId.value > 0) {
            const url = `/pit?companyId=${clientId.value}`;
            const response = await axios.get<Pit[]>(`${api}/${url}`).catch((err) => {
                return false;
            });

            pits.value = response?.data?.data;
        }
    };

    const getPlanCurrentStage = (plan: SandPlan) => {
        if (plan?.stages) {
            const currentStageFull = plan.stages.find((stage: any) => stage.status === 0);

            return currentStageFull?.stage || 0;
        }

        return 0;
    };

    const getPlanTotalStages = (plan: SandPlan) => {
        if (plan?.stages) {
            const totalStages = plan.stages.length;

            return totalStages;
        }

        return 0;
    };

    const checkSandStages = (sandPlan: any) => {
        if (sandPlan.stages.length > 0) {
            const currentStageFull = sandPlan.stages.find((stage: any) => stage.status === 0);

            if (!currentStageFull) {
                return 0;
            }
            console.log(currentStageFull);

            return (
                currentStageFull.quantity1 +
                currentStageFull.quantity2 +
                currentStageFull.quantity3 +
                currentStageFull.quantity4
            );
        }

        return 0;
    };

    const closeTheOperation = async () => {
        console.log('----------------');
        console.log(endingSandPlanPits.value);
        console.log(workOrders.value);
        // Hay que recorrer todos e ir finalizarlos
        // Finalizarlo significa...
        // Cerrar las etapas. Status 100
        // Buscar la orden de trabajo
        // inhabilitar la workOrder y ponerle status 100
        // tambien de la workOrder "liberar" los cradle y forklifts que seian ponerlos como strings vacios
        const operationsToClose = endingSandPlanPits.value.map((sandPlan: SandPlan) => {
            const stagesToEnd = sandPlan?.stages?.map((stage: SandStage) => {
                console.log(stage);
                stage.status = 2;
                stage.visible = false;
                console.log(stage);

                return updateStage(stage);
            });
            const getWorkOrderId = sandPlan?.pit?.workOrderId;
            const thisWorkOrder = workOrders.value.find((wo: WorkOrder) => wo.id === getWorkOrderId);

            if (thisWorkOrder) {
                thisWorkOrder.visible = false;
                thisWorkOrder.operativeCradle = '';
                thisWorkOrder.operativeForklift = '';
                thisWorkOrder.backupCradle = '';
                thisWorkOrder.backupForklift = '';
            }
            console.log(thisWorkOrder);
            console.log(stagesToEnd);
            console.log(getWorkOrderId);
            const woProcess = updateWorkOrder(thisWorkOrder as WorkOrder);

            if (stagesToEnd) {
                return Promise.all(stagesToEnd).then(() => {
                    console.log('Termino');
                });
            }
            Promise.all([woProcess]).then(() => {
                console.log('Termino');
            });

            return;
        });
        console.log('----------------');

        openSuccess.value = true;
    };

    onMounted(async () => {
        sandPlans.value = (await getSandPlan()) as SandPlan[];
        workOrders.value = (await getWorkOrders()) as WorkOrder[];
    });
</script>

<style lang="scss" scoped>
    .footerDesktop {
        @apply mt-4 mr-5 space-x-3 flex justify-end;
    }
</style>
