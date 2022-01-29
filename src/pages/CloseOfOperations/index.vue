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
                v-if="disabledOperator"
                v-model:data="operatorId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Operadora / Empresa de Servicios"
                field-name="operator"
                placeholder="Seleccionar operadora"
                endpoint="/company?isOperator=1"
                is-optional
                @change="filterByOperator"
            /><FieldSelect
                v-else
                v-model:data="operatorId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Operadora / Empresa de Servicios"
                field-name="operator"
                placeholder="Seleccionar operadora"
                endpoint="/company?isOperator=1"
                is-optional
                is-disabled
                @change="filterByOperator"
            />
            <div class="col-span-12 md:col-span-5 xl:col-span-4">
                <PadSelector
                    v-if="disabledPad"
                    class="col-span-12"
                    is-optional
                    :client-id="clientId"
                    v-model:woId="woId"
                    v-model:work-orders="workOrders"
                />
                <PadSelector
                    v-else
                    class="col-span-12"
                    is-optional
                    is-disabled
                    :client-id="clientId"
                    v-model:woId="woId"
                    v-model:work-orders="workOrders"
                />
            </div>

            <section class="bg-white col-span-full shadow max-w-[100%] hidden sm:block">
                <div class="grid grid-cols-4 text-sm rounded-t border py-3">
                    <span class="ml-8 text-left">POZO</span>
                    <span class="text-center">ETAPAS</span>
                    <span class="text-center">ESTADO</span>
                    <span class="ml-4 text-left">TONELADAS</span>
                </div>
                <div
                    v-if="!pits || pits.length <= 0"
                    class="rounded-b border-x border-b border-dashed w-full p-6 text-center text-gray-400 italic"
                >
                    <span>Seleccione un cliente</span>
                </div>
                <div v-else class="divide-y rounded-b border-x border-b">
                    <article
                        v-for="sandPlan in filteredSandPlans"
                        :key="sandPlan.id"
                        class="grid grid-cols-4 py-2 text-sm"
                    >
                        <div class="my-4 pl-8 text-left">
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
                            <span>{{ checkSandStages(sandPlan) }} {{ currentStage }} / {{ stageTotal }}</span>
                        </div>
                        <div class="my-4 text-center">
                            <Badge
                                v-if="sandPlan.stages[0]?.status === 0"
                                class="bg-blue-600 rounded-lg"
                                text="EN PROGRESO"
                            />
                            <Badge v-else text="COMPLETA" />
                        </div>
                        <div class="my-4 pl-4 text-left font-bold">
                            <span>{{ stageSandAmmount }}t</span>
                        </div>
                    </article>
                </div>
            </section>
            <!-- mobile -->
            <section v-if="clientId > -1" class="col-span-full block sm:hidden">
                <form
                    v-for="sandPlan in filteredSandPlans"
                    :key="sandPlan.id"
                    class="flex flex-col rounded shadow-sm border-solid bg-white border-black mb-6"
                >
                    <div>
                        <header
                            class="flex justify-between px-3 pb-3 pt-4 border-2 border-b-0 border-solid bg-gray-200 rounded-t-lg"
                        >
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
                            <CloseOperationTable :sand-plan="sandPlan" class="my-4" />
                        </div>
                    </div>
                </form>
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
            @confirm="openSuccess = true"
        />

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
    import { SandPlan } from '@/interfaces/sandflow';

    import CloseOperationTable from '@/components/closeOfOperation/CloseOperationTable.vue';
    import { Ref } from 'vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('Cierre de operaciones <> Sandflow');

    defineProps({
        woId: {
            type: Number,
            default: -1,
        },
        workOrders: {
            type: Array,
            default: [],
        },
    });

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const woId = ref(-1);
    const workOrders = ref([]);
    const workOrderId = ref(-1);
    const pits = ref([]);
    const sandPlans = ref([]);
    const filteredSandPlans = ref([]);
    const filteredSandPlansByClient = ref([]);
    const filteredSandPlansByOperator = ref([]);
    const filteredSandPlansByPad = ref([]);
    const stagesAmount = ref(0);
    const currentOpened = ref([]);
    const openSuccess = ref(false);
    const atLeastOne = ref(false);
    const endingSandPlanPits = ref([]);

    watch(workOrders, (newVal) => {
        console.log(newVal);
    });
    const addCheckedPits = (sandPlan, check) => {
        if (check) {
            endingSandPlanPits.value.push(sandPlan);
            console.log('entraInfo', endingSandPlanPits.value);
        } else {
            endingSandPlanPits.value = endingSandPlanPits.value.filter((EPSandPlan) => EPSandPlan.id !== sandPlan.id);
            console.log('saleInfo', endingSandPlanPits.value);
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

    const test = ref(true);
    const disabledOperator = ref(false);

    const getSandPlans = async () => {
        console.log(test.value);
        test.value = false;
        console.log(test.value);
        disabledOperator.value = false;
        disabledPad.value = false;
        filteredSandPlans.value = [];
        operatorId.value = -1;
        woId.value = -1;

        if (clientId.value > 0) {
            const url = `/pit?companyId=${clientId.value}`;
            const response = await axios.get(`${api}/${url}`).catch((err) => {
                return false;
            });

            const result = await axios.get(`${api}/sandPlan`).catch((err) => {
                return false;
            });

            pits.value = response.data.data;

            sandPlans.value = result.data.data;

            filteredSandPlans.value = sandPlans.value.filter(
                (sandPlan: SandPlan) => sandPlan.company.id === clientId.value
            );
            filteredSandPlansByClient.value = filteredSandPlans.value;

            disabledOperator.value = true;
        }
    };

    const workOrderByClient = ref([]);
    const workOrderByOperator = ref([]);
    const workOrderByPad = ref([]);
    const disabledPad = ref(false);

    const filterByOperator = () => {
        if (operatorId.value !== -1) {
            disabledPad.value = true;
            console.log(disabledOperator.value);
            let filterFinished: any = [];
            workOrderByClient.value = workOrders.value.filter(
                (workOrder) => Number(workOrder.client) === clientId.value
            );
            workOrderByOperator.value = workOrderByClient.value.filter(
                (workOrder) => Number(workOrder.serviceCompany) === operatorId.value
            );
            const filter = workOrderByOperator.value.forEach((workOrder) =>
                filteredSandPlansByClient.value.forEach((sandPlan) => {
                    if (sandPlan.pit.workOrderId === workOrder.id) {
                        filterFinished.push(sandPlan);
                    }
                })
            );
            filteredSandPlansByOperator.value = filterFinished;
            filteredSandPlans.value = filteredSandPlansByOperator.value;
        } else {
            disabledPad.value = false;
            filteredSandPlans.value = filteredSandPlansByClient.value;
        }
    };

    watch(woId, (newVal) => {
        if (newVal !== -1) {
            if (filteredSandPlansByOperator.value.length > 0) {
                let filterFinished: any = [];
                workOrderByPad.value = workOrderByOperator.value.filter((workOrder) => Number(workOrder.id) === newVal);
                const filter = workOrderByPad.value.forEach((workOrder) =>
                    filteredSandPlansByOperator.value.forEach((sandPlan) => {
                        if (sandPlan.pit.workOrderId === workOrder.id) {
                            filterFinished.push(sandPlan);
                        }
                    })
                );
                filteredSandPlansByPad.value = filterFinished;
                filteredSandPlans.value = filteredSandPlansByPad.value;
            }
        } else {
            filteredSandPlans.value = filteredSandPlansByOperator.value;
        }
    });

    const currentStage = ref(0);
    const stageTotal = ref(0);
    const stageSandAmmount = ref(0);

    const checkSandStages = (sandPlan: any) => {
        currentStage.value = 0;
        stageTotal.value = 0;
        stageSandAmmount.value = 0;
        const stageQuantities = [];

        if (sandPlan.stages.length > 0) {
            const currentStageFull = sandPlan.stages.find((stage: any) => stage.status === 0);
            currentStage.value = currentStageFull.stage;
            stageTotal.value = sandPlan.stages.length;
            stageQuantities.push(
                currentStageFull.quantity1,
                currentStageFull.quantity2,
                currentStageFull.quantity3,
                currentStageFull.quantity4
            );
            stageQuantities.map((quantity) => {
                if (quantity >= 0) {
                    stageSandAmmount.value += quantity;
                }
            });
        }
    };
</script>

<style lang="scss" scoped>
    .footerDesktop {
        @apply mt-4 mr-5 space-x-3 flex justify-end;
    }
</style>
