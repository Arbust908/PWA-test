<template>
    <Layout>
        <ABMFormTitle title="Orden de pedido" />
        <PDF v-show="showPDF" ref="pdf" :info="pdfInfo" @close="redirectIndex" />

        <section class="bg-white rounded-md shadow-sm">
            <form method="POST" action="/" class="p-3 sm:p-4 flex-col gap-4">
                <FieldGroup class="max-w-2xl border-none">
                    <ClientPitCombo
                        :client-id="companyClientId"
                        :pit-id="pitId"
                        @update:clientId="companyClientId = $event"
                        @update:pitId="pitId = $event"
                    />
                </FieldGroup>
                <FieldLegend>Arena</FieldLegend>
                <template v-for="(providerId, sandProvidersKey) in sandProvidersIds" :key="sandProvidersKey">
                    <div class="max-w-2xl w-full grid grid-cols-12 gap-6 gap-y-0 mb-4">
                        <FieldSelect
                            class="col-span-12 mt-5 md:col-span-6"
                            field-name="sandProvider"
                            title="Centro de carga de arena"
                            placeholder="Seleccionar centro de carga"
                            endpoint="/sandProvider"
                            :data="providerId.id"
                            :select-class="useFirstSP"
                            @update:data="providerId.id = $event"
                            @change="changeProvider"
                            @click="useFirstSP = true"
                        />
                        <div class="col-span-12 m-0 p-0 gap-0">
                            <InvalidInputLabel
                                v-if="providerId.id === -1 && useFirstSP === true"
                                validation-type="empty"
                            />
                        </div>
                    </div>
                    <FieldGroup
                        v-for="(order, orderKey) in providerId.sandOrders"
                        :key="orderKey"
                        class="max-w-3xl relative"
                        :class="isFirst(orderKey) ? null : ' mt-5'"
                    >
                        <div class="col-span-12 sm:col-span-3">
                            <FieldSelect
                                :title="orderKey === 0 ? 'Tipo' : ''"
                                field-name="sandType"
                                placeholder="Tipo de Arena"
                                endpoint-key="type"
                                :data="order.sandTypeId"
                                :endpoint-data="filteredSandTypes"
                                :select-class="useFirstST"
                                @update:data="order.sandTypeId = $event"
                                @click="useFirstST = true"
                            />
                        </div>
                        <FieldWithSides
                            :title="orderKey === 0 ? 'Cantidad' : ''"
                            class="col-span-7 sm:col-span-3"
                            field-name="sandQuantity"
                            placeholder="0 t"
                            type="number"
                            mask="####"
                            validation-type="empty"
                            :number-validation="useFirstSQ"
                            :post="{ title: '0', value: 't', width: '3rem' }"
                            :data="order.amount"
                            @update:data="order.amount = $event"
                            @click="useFirstSQ = true"
                        />
                        <FieldInput
                            :title="orderKey === 0 ? 'ID de caja' : ''"
                            class="col-span-7 sm:col-span-4"
                            field-name="sandBoxId"
                            placeholder="ID"
                            :maxlength="10"
                            is-optional
                            :data="order.boxId"
                            @update:data="order.boxId = $event"
                        />
                        <div :class="isFirst(orderKey) ? 'mt-7' : 'mt-3'" class="col-span-1 md:col-span-2">
                            <AddDeleteBtn
                                v-if="useIfNotLonly(providerId.sandOrders)"
                                purpose="remove"
                                @click.prevent="removeOrder(order.id, providerId.innerId)"
                            />
                            <!-- Arena Section -->
                            <AddDeleteBtn
                                v-if="isLast(orderKey, providerId.sandOrders) && soLength < 2"
                                purpose="add"
                                @click.prevent="
                                    addOrder(providerId.innerId);
                                    useFirstST = false;
                                "
                            />
                        </div>
                    </FieldGroup>
                </template>
                <FieldGroup class="max-w-3xl relative">
                    <FieldLegend class="mt-2">Transporte</FieldLegend>
                    <div class="col-span-12 md:col-span-6">
                        <FieldSelect
                            field-name="transportProvider"
                            title="Proveedor"
                            placeholder="Selecciona proveedor"
                            endpoint="/transportProvider"
                            :data="transportProviderId"
                            :select-class="useFirstTP"
                            @update:data="transportProviderId = $event"
                            @click="useFirstTP = true"
                        />
                        <InvalidInputLabel
                            v-if="transportProviderId === -1 && useFirstTP === true"
                            validation-type="empty"
                        />
                    </div>

                    <FieldGroup v-for="(to, toKey) in TransportOrders" :key="toKey" class="col-span-full relative">
                        <div class="col-span-12 sm:col-span-5 md:col-span-6">
                            <FieldSelect
                                title="Conductores"
                                field-name="transportProvider2"
                                placeholder="Seleccionar Conductor"
                                :endpoint-data="filteredDrivers"
                                :data="driverId"
                                :select-class="useFirstDriver"
                                @update:data="
                                    driverId = $event;
                                    to.driverId = $event;
                                "
                                @click="useFirstDriver = true"
                            />
                            <InvalidInputLabel
                                v-if="driverId === -1 && useFirstDriver === true"
                                validation-type="empty"
                            />
                        </div>

                        <FieldInput
                            title="Patente camión"
                            class="col-span-6 sm:col-span-3"
                            field-name="trasportPatent"
                            placeholder="AA123AA"
                            is-readonly
                            :data="filteredPlates[0]"
                        />
                        <FieldInput
                            title="Patente acoplado"
                            class="col-span-6 sm:col-span-3"
                            field-name="trasportPatent"
                            placeholder="101AA123AA"
                            is-readonly
                            :data="filteredPlates[1]"
                        />
                        <FieldInput
                            title="Cantidad de cajas"
                            class="col-span-6 sm:col-span-3"
                            field-name="boxAmount"
                            placeholder="0"
                            type="number"
                            is-readonly
                            :data="to.boxAmount"
                            @update:data="to.boxAmount = $event"
                        />
                        <div class="col-span-6 sm:block"></div>
                        <FieldInput
                            title="Observaciones"
                            class="col-span-12 md:col-span-6"
                            field-name="observations"
                            placeholder="Ej: chasis chico"
                            is-optional
                            :data="to.observations"
                            @update:data="to.observations = $event"
                        />
                    </FieldGroup>
                </FieldGroup>
                <FieldGroup v-for="(to, toKey) in TransportOrders" :key="toKey" class="max-w-3xl relative flex-wrap">
                    <FieldLegend class="mt-2">Observaciones</FieldLegend>
                    <section class="flex gap-4 xl:gap-8 sm:flex-row items-start col-span-12 flex-wrap">
                        <label class="col-span-3">
                            <p class="text-sm mb-2">Fecha de entrega</p>
                            <DatePicker
                                v-model="localDate"
                                validation-type="empty"
                                @date-object="dateObject = $event"
                            />
                        </label>
                        <label class="col-span-3">
                            <p class="text-sm mb-2">Hora de entrega</p>
                            <TimePicker
                                :timetrack="localTime"
                                @update:timetrack="
                                    localTime = $event;
                                    time();
                                "
                            />
                        </label>
                    </section>

                    <FieldTextArea
                        title="Observaciones"
                        class="col-span-12 sm:col-span-8 xl:col-span-7"
                        field-name="observations"
                        :rows="3"
                        placeholder=""
                        is-optional
                        :data="packageObservations"
                        @update:data="
                            packageObservations = $event;
                            pObservations();
                        "
                    />
                </FieldGroup>
            </form>
        </section>
        <!-- *** -->
        <footer class="mt-8 space-x-3 flex justify-end">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/orden-de-pedido')"> Cancelar </SecondaryBtn>
            <PrimaryBtn btn="wide" :disabled="!isFull" @click.prevent="isFull && confirm()"> Crear Orden </PrimaryBtn>
        </footer>

        <OrderModal
            v-if="showModal"
            :show-modal="showModal"
            :driver="driverName"
            :po-id="purchaseId"
            :po="po"
            :plates="filteredPlates"
            :loading="savingOrder"
            @close="showModal = false"
            @confirm="save"
        />

        <SuccessModal
            :open="openSuccess"
            :title="titleSuccess"
            @main="
                downloadPDF();
                openSuccess = false;
            "
        />
        <ErrorModal :open="openError" :title="titleErrorGral" :text="textErrorGral" @main="openError = false" />
        <ErrorModal :open="openErrorGral" :title="titleError" :text="textError" @main="openErrorGral = false" />
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { useIfNotLonly, isFirst, isLast } from '@/helpers/iteretionHelpers';
    import {
        Sand,
        SandOrder,
        SandProvider,
        PurchaseOrder,
        TransportProvider,
        TransportOrder,
        Company,
        Pit,
    } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import OrderModal from '@/components/purchaseOrder/Modal.vue';
    import TimePicker from '@/components/ui/form/TimePicker.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import DatePicker from '@/components/ui/form/DatePicker.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';

    import PDF from '@/components/purchaseOrder/PDF.vue';

    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));
    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const api = import.meta.env.VITE_API_URL || '/api';

    const drivers = ref([]);
    const driverId = ref(-1);

    const pdf = ref(null);
    const savingOrder = ref(false);
    const showPDF = ref(false);

    const downloadPDF = async () => {
        showPDF.value = true;
        await pdf.value?.download();
        showPDF.value = false;
    };

    const filteredDrivers = computed(() => {
        driverId.value = -1;

        if (transportProviderId.value > -1) {
            const driversFiltered = drivers.value.filter(
                (driver) => driver.transportProviderId === transportProviderId.value
            );

            return driversFiltered;
        }

        return [];
    });

    const filteredPlates = computed(() => {
        if (driverId.value > -1) {
            let platesFiltered = filteredDrivers.value.filter((plate) => plate.id === driverId.value);
            const platesArray = [platesFiltered[0].transportId, platesFiltered[0].transportId2];

            return platesArray;
        }

        return [];
    });

    const driverName = ref('');

    watch(driverId, (newValue) => {
        if (newValue > -1) {
            TransportOrders.value[0].driverId = newValue;
            const driverIndex = drivers.value.findIndex((driver) => driver.id === newValue);
            driverName.value = drivers.value[driverIndex].name;
        }
    });

    onMounted(async () => {
        // TODO: StoreLogic
        const result = await axios.get(`${api}/driver`);
        drivers.value = result.data.data;
        const result2 = await axios.get(`${api}/sandProvider`);
    });

    useTitle('Nueva orden de pedido <> Sandflow');
    const localDate = ref('');
    const localTime = ref(1609416000000); //09:00 AM
    const dateObject = ref('');
    const packageObservations = ref('');

    let dateTime = { hours: 9, minutes: 0 };

    function time() {
        let date = new Date(localTime.value);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        dateTime = { hours: hours, minutes: minutes };
    }

    const router = useRouter();
    const instance = axios.create({
        baseURL: api,
    });
    const showModal = ref(false);
    const sandProvidersIds = ref([
        {
            innerId: 0,
            id: -1,
            sandOrders: [
                {
                    id: 0,
                    sandTypeId: -1,
                    amount: null,
                    boxId: '',
                },
            ],
        },
    ] as Array<Object>);

    const filteredSandTypes = ref([]);

    const changeProvider = () => {
        const [provider] = sandProviders.value.filter((sandProvider) => {
            if (sandProvider.id == sandProvidersIds.value[0].id) {
                return sandProvider;
            }
        });
        filteredSandTypes.value = provider.meshType;
    };

    const useFirstSP = ref(false);

    const defaultTransportOrder = {
        innerId: 0,
        boxAmount: 1,
        observations: '',
        purchaseOrderId: -1,
        driverId: 0,
    };

    const TransportOrders: Ref<Array<TransportOrder>> = ref([
        {
            ...defaultTransportOrder,
        },
    ]);
    const sandProviders = ref([] as Array<SandProvider>);
    const { data: sandProvidersData } = useAxios('/sandProvider', instance);
    watch(sandProvidersData, (sPData) => {
        if (sPData && sPData.data) {
            sandProviders.value = sPData.data;
        }
    });
    const companyClientId = ref(-1);
    const pitId = ref(-1);

    const sandTypes = ref([] as Array<Sand>);
    const { data: sandTypesData } = useAxios('/sand', instance);
    const useFirstST = ref(false);

    watch(sandTypesData, (sOData) => {
        if (sOData && sOData.data) {
            sandTypes.value = sOData.data;
        }
    });
    const soLength = ref(0);

    const removeOrder = (id: number, providerOrderId: number): void => {
        const currentSPI = sandProvidersIds.value.find((spi: any) => spi.innerId === providerOrderId);
        currentSPI.sandOrders = currentSPI.sandOrders.filter((order) => order.id !== id);
        soLength.value -= 1;
        TransportOrders.value[0].boxAmount = soLength.value;
    };

    const addOrder = (providerOrderId: number): void => {
        const currentSPI = sandProvidersIds.value.find((spi: any) => spi.innerId === providerOrderId);
        const sandOrder = currentSPI.sandOrders;
        const lastSandOrder = sandOrder[sandOrder.length - 1];
        const newId = lastSandOrder.id + 1;
        sandOrder.push({
            id: newId,
            sandTypeId: -1,
            amount: null,
            boxId: '',
        });
        soLength.value = sandOrder.length;
        TransportOrders.value[0].boxAmount = soLength.value;
    };

    const useFirstSQ = ref(false);

    // :: TransportProvider
    const transportProviders = ref([] as TransportProvider[]);
    const { data: tPData } = useAxios('/transportProvider', instance);
    watch(tPData, (newData) => {
        if (newData && newData.data) {
            transportProviders.value = newData.data;
        }
    });
    const transportProviderId = ref(-1);
    // >> TransportProvider
    const useFirstTP = ref(false);
    const useFirstDriver = ref(false);

    const isFull = computed(() => {
        const hasPit = pitId.value >= 0;
        const hasClient = companyClientId.value >= 0;
        const validSandProviderIds =
            sandProvidersIds.value &&
            sandProvidersIds.value.every((spi) => {
                return spi.id >= 0;
            });
        const validSandOrders =
            sandProvidersIds.value &&
            sandProvidersIds.value.every((spi) => {
                return (
                    spi.sandOrders &&
                    spi.sandOrders.every((so) => {
                        return so.sandTypeId >= 0 && so.amount > 0;
                    })
                );
            });
        const hasTransport = transportProviderId.value >= 0;
        const hasTransportOrders = !!(
            TransportOrders.value.length > 0 &&
            TransportOrders.value.every((to) => {
                return to.boxAmount > 0;
            })
        );

        return !!(hasPit && hasClient && validSandProviderIds && validSandOrders && hasTransport && hasTransportOrders);
    });
    const po = ref({} as PurchaseOrder);
    const confirm = () => {
        const sp = sandProviders.value.find((sandP) => {
            return sandP.id === sandProvidersIds.value[0].id;
        });
        const tp = transportProviders.value.find((transportP) => {
            return transportP.id === transportProviderId.value;
        });
        po.value = {
            sandProvider: { ...sp },
            sandOrders: [...sandProvidersIds.value[0].sandOrders],
            sands: [...sandTypes.value],
            transportProvider: { ...tp },
            transportOrders: TransportOrders.value,
        };
        showModal.value = true;
    };

    const _saveTO = (poId: number) => {
        TransportOrders.value.forEach((to) => {
            to.purchaseOrderId = poId;
            useAxios('/transportOrder', { method: 'POST', data: to }, instance);
        });
    };
    const _saveSO = (poId: number) => {
        sandProvidersIds.value.map((spI) => {
            // Guradamos via api las ordenes de sand
            spI.sandOrders.map((sO: SandOrder) => {
                const { id, ...newSO } = sO;
                newSO.purchaseOrderId = poId;
                newSO.sandProviderId = spI.id;
                useAxios('/sandOrder', { method: 'POST', data: newSO }, instance);
            });
        });
    };

    let pObs = '';

    function pObservations() {
        pObs = packageObservations.value;
    }

    const _formatPO = () => {
        const newDate = new Date(
            dateObject.value.year,
            dateObject.value.month,
            dateObject.value.day,
            dateTime.hours,
            dateTime.minutes
        );

        const purchaseOrder: PurchaseOrder = {
            companyId: companyClientId.value,
            companyClientId: companyClientId.value,
            pitId: pitId.value,
            sandProviderId: sandProvidersIds.value[0].id,
            transportProviderId: transportProviderId.value,
            deliveryTime: newDate,
            packageObservations: pObs,
            driverId: driverId.value,
        };

        return purchaseOrder;
    };

    const purchaseId = ref(0);
    const companies = ref([] as Company[]);
    const { data: companiesData } = useAxios('/company', instance);
    watch(companiesData, (companiesIfno) => {
        if (companiesIfno && companiesIfno.data) {
            companies.value = companiesIfno.data;
        }
    });
    const pits = ref([] as Pit[]);
    const { data: pitsData } = useAxios('/pit', instance);
    watch(pitsData, (pitsInfo) => {
        if (pitsInfo && pitsInfo.data) {
            pits.value = pitsInfo.data;
        }
    });

    onMounted(async () => {
        purchaseId.value = await getLastId();
    });

    const getLastId = async () => {
        const result = await axios.get(`${api}/purchaseOrder`);

        return result.data.data?.at(-1)?.id + 1 || 1;
    };

    const save = async (sendEmails = false) => {
        if (isFull.value) {
            savingOrder.value = true;
            // Formateamos la orden de pedido
            const purchaseOrder: any = _formatPO();
            console.log(purchaseOrder);
            // get last id
            const lastId = await getLastId();
            let newPdfInfo: any = pdfInfo.value;
            newPdfInfo = purchaseOrder;
            console.log(newPdfInfo);
            // newPdfInfo.purchaseOrder.id = lastId;

            purchaseOrder.sendEmails = sendEmails;

            if (sendEmails) {
                // solo si se envian mails se envia el content del pdf
                const pdfContent = await pdf.value?.getFileContent();
                purchaseOrder.pdfContent = pdfContent;
            }

            // Creamos via API la orden de pedido
            const result = await axios.post(`${api}/purchaseOrder`, purchaseOrder).catch((err) => {
                showModal.value = false;
                openErrorGral.value = true;
            });

            savingOrder.value = false;

            if (result?.status === 200) {
                const poId = result.data.data.id;
                purchaseId.value = poId;
                titleSuccess.value = `La orden de pedido #${poId} ha sido generada con éxito`;
                showModal.value = false;
                openSuccess.value = true;
                _saveTO(poId);
                _saveSO(poId);
            }
        }
    };
    // >> Success y Error Modal
    const openSuccess = ref(false);
    const openError = ref(false);
    const openErrorGral = ref(false);

    const titleSuccess = ref('');
    const titleError = '¡Ups! Hubo un problema y no pudimos guardar la orden de pedido.'; //error interno
    const textError = 'Por favor, intentá nuevamente en unos minutos.';
    const titleErrorGral = 'Hubo un problema al intentar generar la orden.'; //error Usuario
    const textErrorGral = 'Por favor, verifica los datos ingresados e intenta nuevamente';

    const pdfInfo = computed(() => {
        const emptyThing = {
            name: 'none',
        };
        const client =
            companies.value.find((c) => {
                return c.id === companyClientId.value;
            }) || emptyThing;
        const pit =
            pits.value.find((p) => {
                return p.id === pitId.value;
            }) || emptyThing;

        return {
            purchaseOrder: {
                id: purchaseId.value,
                ...po.value,
                plates: filteredPlates.value,
            },
            client: client.name,
            pit: pit.name,
            localDate: localDate.value,
            localTime: localTime.value,
            observation: packageObservations.value,
        };
    });

    const redirectIndex = () => {
        router.push('/orden-de-pedido');
    };
</script>

<style lang="scss" scoped>
    fieldset:not(:last-of-type) {
        @apply border-b border-gray-200 pb-6;
    }
</style>
