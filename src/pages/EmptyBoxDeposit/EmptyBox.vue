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
                <div v-if="clientId > -1 && pitId > -1" class="px-10 py-6">
                    <BoxCard
                        v-for="box in boxes"
                        :key="box.boxId"
                        :boxId="box.boxId"
                        :estacion="box.estacion"
                        :selectedBoxesForTrucks="selectedBoxesForTrucks"
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
                <div
                    v-else
                    v-show="selectedBoxesForTrucks.length < 1 && selectedBoxesForDeposit < 1"
                    class="p-6 m-6 rounded-lg border-2 text-center"
                >
                    <p>Seleccione depósito ó camión para comenzar</p>
                </div>
                <PurchaseOrderForm
                    v-if="selectedBoxesForTrucks.length > 0 && selectedBoxesForDeposit.length < 1"
                    :company-client-id="clientId"
                    :pit-id="pitId"
                    :selectedBoxes="selectedBoxesForTrucks"
                />
                <span v-if="selectedBoxesForDeposit.length > 0 && selectedBoxesForTrucks.length < 1">deposito</span>
                <!-- <DepositGrid
                    v-if="warehouse"
                    class="w-full flex flex-col gap-5"
                    :selected-box="choosedBox"
                    :rows="row"
                    :cols="col"
                    :floor="floor"
                    :deposit="warehouse.layout || {}"
                    @select-box="selectBox"
                /> -->
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
            const boxes = ref([
                {
                    boxId: 'AA1',
                    estacion: 'Estacion 1',
                    amount: 0,
                    type: 'Fina',
                    sandTypeId: 1,
                },
                {
                    boxId: 'AB2',
                    estacion: 'Estacion 2',
                    amount: 10,
                    type: 'Gruesa',
                    sandTypeId: 2,
                },
                {
                    boxId: 'AC3',
                    estacion: 'Estacion 3',
                    amount: 0,
                    type: 'Media',
                    sandTypeId: 3,
                },
            ]);

            const selectedBoxesForTrucks = ref([]);
            const selectedBoxesForDeposit = ref([]);

            const deposit = (box) => {
                showPurchaseOrder.value = false;
                showDepositGrid.value = !showDepositGrid.value;

                if (selectedBoxesForDeposit.value.filter((check) => check.boxId === box.boxId).length > 0) {
                    selectedBoxesForDeposit.value = selectedBoxesForDeposit.value.filter(
                        (check) => check.boxId !== box.boxId
                    );
                } else {
                    selectedBoxesForDeposit.value.push(box);
                }
            };

            const truck = (box) => {
                showDepositGrid.value = false;
                showPurchaseOrder.value = !showPurchaseOrder.value;

                if (selectedBoxesForTrucks.value.filter((check) => check.boxId === box.boxId).length > 0) {
                    selectedBoxesForTrucks.value = selectedBoxesForTrucks.value.filter(
                        (check) => check.boxId !== box.boxId
                    );
                } else {
                    selectedBoxesForTrucks.value.push(box);
                }
            };

            // :: DEPOSIT
            const rows: Ref<number> = ref(0);
            const cols: Ref<number> = ref(0);
            const floors: Ref<number> = ref(1);

            const warehouses = ref([]);
            // const dimensions = ref('');

            const getWarehouses = async () => {
                await axios
                    .get(`${apiUrl}/warehouse`)
                    .then((res) => {
                        warehouses.value = res.data.data;
                        console.log(warehouses.value);
                    })
                    .catch((err) => console.error(err));
            };

            onMounted(async () => {
                await getWarehouses();
            });

            return {
                clients,
                pits,
                rows,
                cols,
                floors,
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
            };
        },
    };
</script>

<style lang="scss" scoped></style>
