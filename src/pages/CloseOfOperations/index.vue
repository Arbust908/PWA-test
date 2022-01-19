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
                is-optional
            />
            <FieldSelect
                v-model:data="workOrderId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Orden de trabajo"
                field-name="workOrder"
                placeholder="Seleccionar pozos"
                endpoint="/workOrder"
                endpoint-key="pad"
                is-optional
            />

            <section class="bg-white col-span-full shadow max-w-[100%]">
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
                                type="checkbox"
                                class="outline-none focus:outline-none text-green-500 rounded mr-2"
                            />
                            <span> {{ sandPlan.pit.name }} </span>
                        </div>
                        <div class="my-4 text-center">
                            <span>
                                {{ sandPlan.stages.find((currentStage) => currentStage.status === 0).stage }} /
                                {{ sandPlan.stages.length }}
                            </span>
                        </div>
                        <div class="my-4 text-center">
                            <Badge
                                v-if="sandPlan.stages[0].status === 0"
                                class="bg-blue-700 rounded-lg"
                                text="EN PROGRESO"
                            />
                            <Badge v-else text="COMPLETA" />
                        </div>
                        <div class="my-4 pl-4 text-left font-bold">
                            <span>
                                {{
                                    sandPlan.stages[0].quantity1 +
                                    sandPlan.stages[0].quantity2 +
                                    sandPlan.stages[0].quantity3 +
                                    sandPlan.stages[0].quantity4
                                }}
                                t
                            </span>
                        </div>
                    </article>
                </div>
            </section>
            <!-- <section class="xs:block">
                <CloseOperationTable v-for="sandPlan in filteredSandPlans" :key="sandPlan.id" :sand-plan="sandPlan" />
            </section> -->

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
        </FieldGroup>
    </Layout>
</template>

<script setup lang="ts">
    import axios from 'axios';

    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';
    import CloseOperationTable from '@/components/closeOfOperation/CloseOperationTable.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('Cierre de operaciones <> Sandflow');

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const workOrderId = ref(-1);
    const pits = ref([]);
    const sandPlans = ref([]);
    const filteredSandPlans = ref([]);
    const stagesAmount = ref(0);

    const getSandPlans = async () => {
        if (clientId.value > 0) {
            const url = `/pit?companyId=${clientId.value}`;
            const response = await axios.get(`${api}/${url}`).catch((err) => {
                return false;
            });

            const result = await axios.get(`${api}/sandPlan`).catch((err) => {
                return false;
            });

            pits.value = response.data.data;
            console.log('pits', pits.value);

            sandPlans.value = result.data.data;
            console.log('sandplans', sandPlans.value);

            getFilteredSandPlans();
        }
    };

    const getFilteredSandPlans = () => {
        filteredSandPlans.value = sandPlans.value.filter((sandPlan) => sandPlan.company.id === clientId.value);
        console.log('filteredSandPlans', filteredSandPlans.value);
    };
</script>

<style scoped></style>
