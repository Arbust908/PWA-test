<template>
    <Layout>
        <ABMFormTitle title="Destino de cajas vacias" />
        <FieldGroup class="max-w-4xl items-start mb-4">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
        </FieldGroup>
        <div class="flex flex-row justify-between">
            <section class="bg-white rounded-md shadow-sm w-2/5 mr-10">
                <ABMFormTitle title="Cajas vacias" class="p-4" />
                <div class="px-10 py-6" v-if="clientId > 0 && pitId > 0">
                    <BoxCard
                        v-for="box in boxes"
                        :key="box.sandOrder.boxId"
                        :boxId="box.sandOrder.boxId"
                        :estacion="box.origin"
                        :selectedBoxesForTrucks="selectedBoxesForTrucks"
                        :selectedBoxesForDeposit="selectedBoxesForDeposit"
                        @deposit="deposit(box)"
                        @truck="truck(box)"
                    />
                </div>
                <div v-else class="flex flex-row bg-gray-100 m-4 p-4 rounded text-center text-sm text-black">
                    <Icon icon="ExclamationCircle" type="outline" class="w-5 h-5" />
                    <p class="ml-2">No hay cajas vacias por retirar</p>
                </div>
            </section>

            <section class="bg-white rounded-md shadow-sm max-w-4xl w-3/5 p-4">
                <ABMFormTitle title="Detalle" />
                <img v-if="clientId < 0 || pitId < 0" src="@/assets/imgs/cajasvacias.png" alt="" />
                <div v-show="activeSection === null" class="p-6 m-6 rounded-lg border-2 text-center">
                    <p>Seleccione depósito ó camión para comenzar</p>
                </div>
                <PurchaseOrderForm
                    v-if="activeSection === 'PurchaseOrder'"
                    :company-client-id="clientId"
                    :pit-id="pitId"
                    :selectedBoxes="selectedBoxesForTrucks"
                />
                <DepositGrid
                    v-if="activeSection === 'Deposit'"
                    class="w-full flex flex-col gap-5"
                    :selected-box="choosedBox"
                    :boxes="selectedBoxesForDeposit"
                    :rows="row"
                    :cols="col"
                    :floor="floor"
                    :deposit="warehouse.layout || {}"
                />
            </section>
        </div>
        <footer class="mt-8 space-x-3 flex justify-end">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/')">Cancelar</SecondaryBtn>
            <PrimaryBtn btn="wide" size="md"> Confirmar </PrimaryBtn>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import { useRouter, useRoute } from 'vue-router';
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/EmptyBox/EmptyBox.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PurchaseOrderForm from '@/components/purchaseOrder/Form.vue';
    import { formatDeposit, defaultBox, getInDepoBoxes } from '@/helpers/useWarehouse';
    import {
        getPurchaseOrders,
        getSandOrders,
        getWarehouses,
        getCradles,
        getWorkOrders,
        getSand,
    } from '@/helpers/useGetEntities';
    import { Warehouse } from '@/interfaces/sandflow';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            ABMFormTitle,
            ClientPitCombo,
            FieldGroup,
            PrimaryBtn,
            SecondaryBtn,
            DepositGrid,
            BoxCard,
            Icon,
            PurchaseOrderForm,
        },

        setup() {
            useTitle('Destino de cajas vacias');

            let activeSection = ref(null);

            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });

            // :: CLIENT
            const clientId = ref(-1);
            const clients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);
            watch(companiesData, (companiesApi) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                }
            });

            const selectedClientName = computed(() => {
                return clientId.value >= 0 && clients.value.length > 0
                    ? clients.value.find((client) => client.id === clientId.value)?.name
                    : '';
            });

            // :: PITS
            const pitId = ref(-1);
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);
            watch(pitsData, (pitApi) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                }
            });
            const selectedPitName = computed(() => {
                return pitId.value >= 0 && pits.value.length > 0
                    ? pits.value.find((pit) => pit.id === pitId.value)?.name
                    : '';
            });

            const showPurchaseOrder = ref(false);
            const showDepositGrid = ref(false);
            // :: BOXES
            // let boxes = ref([]);

            const getQueueItem = async () => {
                boxes.value = [];
                boxes.value = await axios
                    .get(`${apiUrl}/queueitem?=status10&pitId=${pitId.value}`)
                    .then((res) => {
                        return res.data.data;
                    })
                    .catch((err) => console.error(err));
            };

            const boxes = ref([]);

            const selectedBoxesForTrucks = ref([]);
            const selectedBoxesForDeposit = ref([]);

            const deposit = (box) => {
                choosedBox.value = box;
                if (selectedBoxesForDeposit.value.filter((check) => check.boxId === box.boxId).length > 0) {
                    selectedBoxesForDeposit.value = selectedBoxesForDeposit.value.filter(
                        (check) => check.boxId !== box.boxId
                    );
                } else {
                    selectedBoxesForDeposit.value.push(box);
                }

                if (selectedBoxesForDeposit.value.length > 0) {
                    activeSection.value = 'Deposit';
                } else {
                    activeSection.value = null;
                }
            };

            const truck = (box) => {
                console.log('AA', box.sandOrder);
                console.log(selectedBoxesForTrucks.value);
                if (selectedBoxesForTrucks.value.filter((check) => check.boxId === box.sandOrder.boxId).length > 0) {
                    selectedBoxesForTrucks.value = selectedBoxesForTrucks.value.filter(
                        (check) => check.boxId !== box.sandOrder.boxId
                    );
                } else {
                    console.log('llega');
                    selectedBoxesForTrucks.value.push(box.sandOrder);
                }

                if (selectedBoxesForTrucks.value.length > 0) {
                    activeSection.value = 'PurchaseOrder';
                } else {
                    activeSection.value = null;
                }
                console.log('selected', selectedBoxesForTrucks.value);
                console.log('length', selectedBoxesForTrucks.value.length);
            };

            // :: DEPOSIT
            const warehouses = ref([]);
            const warehouse = ref({});

            const floor = ref(0);
            const row = ref(0);
            const col = ref(0);

            const choosedBox = ref({
                ...defaultBox,
            });

            const assingWareHouseValue = async () => {
                warehouse.value = await warehouses.value.find((singleWarehouse) => {
                    return (
                        parseInt(singleWarehouse.clientCompanyId) == clientId.value &&
                        parseInt(singleWarehouse.pitId) == pitId.value
                    );
                });
            };

            const assignDepositLayout = async () => {
                const { col: fCol, floor: fFloor, row: fRow } = await formatDeposit(warehouse.value?.layout);
                col.value = fCol;
                floor.value = fFloor;
                row.value = fRow;
            };

            watchEffect(async () => {
                if (clientId.value >= 0 && pitId.value >= 0) {
                    await assingWareHouseValue();
                    await assignDepositLayout();
                    await getQueueItem();
                }

                boxes.value = boxes.value.map((box) => {
                    if (box.location && JSON.parse(box.location)) {
                        box.location = JSON.parse(box.location);
                        box.location.been_set = true;
                    }
                    return box;
                });
            });

            onMounted(async () => {
                warehouses.value = await getWarehouses();
            });

            return {
                clients,
                clientId,
                pitId,
                print,
                boxes,
                truck,
                deposit,
                showPurchaseOrder,
                showDepositGrid,
                selectedBoxesForTrucks,
                selectedBoxesForDeposit,
                floor,
                col,
                row,
                warehouse,
                choosedBox,
                activeSection,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
