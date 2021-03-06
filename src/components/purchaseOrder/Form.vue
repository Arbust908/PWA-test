<template>
    <ABMFormTitle title="Orden de pedido" />
    <PDF v-show="showPDF" ref="pdf" :info="pdfInfo" @close="redirectIndex" />
    <section class="bg-white rounded-md overflow-y-auto pl-px">
        <form method="POST" action="/" class="flex-col gap-4">
            <FieldLegend>Arena</FieldLegend>
            <FieldSelect
                v-model:data="sandProviderId"
                class="max-w-sm my-4"
                field-name="sandProvider"
                title="Centro de carga de arena"
                placeholder="Seleccionar centro de carga"
                endpoint="/sandProvider"
                validation-type="empty"
                :select-class="useFirstSP"
                @change="changeProvider"
                @click="useFirstSP = true"
            />
            <FieldGroup v-for="(box, orderKey) in selectedBoxes" :key="box.boxId" class="max-w-3xl relative">
                <FieldSelect
                    class="col-span-7 sm:col-span-4"
                    :title="orderKey === 0 ? 'Tipo' : ''"
                    field-name="sandType"
                    placeholder="Tipo de Arena"
                    endpoint-key="type"
                    validation-type="empty"
                    :data="sandProviderId > 0 ? box.sandTypeId : -1"
                    :endpoint-data="filteredSandTypes"
                    :select-class="useFirstST"
                    @update:data="box.sandTypeId = $event"
                    @click="useFirstST = true"
                />
                <FieldWithSides
                    :data="sandProviderId > 0 ? box.amount : 0"
                    :title="orderKey === 0 ? 'Cantidad' : ''"
                    class="col-span-7 sm:col-span-3"
                    field-name="sandQuantity"
                    placeholder="Arena"
                    type="number"
                    mask="####"
                    validation-type="empty"
                    :number-validation="useFirstSQ"
                    :post="{ title: '0', value: 't', width: '3rem' }"
                    @update:data="box.amount = $event"
                />
                <FieldInput
                    :title="orderKey === 0 ? 'ID de caja' : ''"
                    class="col-span-7 sm:col-span-4"
                    field-name="sandBoxId"
                    placeholder="ID"
                    :maxlength="10"
                    :data="box.boxId"
                    is-readonly
                    @update:data="box.boxId = $event"
                />
            </FieldGroup>
            <FieldGroup class="max-w-3xl relative">
                <FieldLegend class="mt-2">Transporte</FieldLegend>
                <div class="col-span-12 md:col-span-6">
                    <FieldSelect
                        v-model:data="transportProviderId"
                        field-name="transportProvider"
                        title="Proveedor"
                        placeholder="Selecciona proveedor"
                        endpoint="/transportProvider"
                        validation-type="empty"
                        :select-class="useFirstTP"
                    />
                </div>

                <FieldGroup class="col-span-full relative">
                    <div class="col-span-12 sm:col-span-5 md:col-span-6">
                        <FieldSelect
                            title="Conductores"
                            field-name="transportProvider2"
                            placeholder="Seleccionar Conductor"
                            validation-type="empty"
                            :endpoint-data="filteredDrivers"
                            :data="driverId"
                            :select-class="useFirstDriver"
                            @update:data="
                                driverId = $event;
                                transportOrder.driverId = $event;
                            "
                            @click="useFirstDriver = true"
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
                        :data="selectedBoxes.length"
                        @update:data="transportOrder.boxAmount = $event"
                    />
                    <div class="col-span-6 sm:block"></div>
                    <FieldInput
                        v-model:data="transportOrder.observations"
                        title="Observaciones"
                        class="col-span-12 md:col-span-6"
                        field-name="observations"
                        placeholder="Ej: chasis chico"
                        is-optional
                    />
                </FieldGroup>
            </FieldGroup>
            <FieldGroup class="max-w-3xl relative flex-wrap">
                <FieldLegend class="mt-2">Observaciones</FieldLegend>
                <section class="flex gap-2 xl:gap-8 sm:flex-row items-start col-span-12 flex-wrap">
                    <label class="col-span-3">
                        <p class="text-sm mb-2">Fecha de entrega</p>
                        <DatePicker v-model="localDate" validation-type="empty" @date-object="dateObject = $event" />
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
                    v-model:data="packageObservations"
                    title="Observaciones"
                    class="col-span-12 sm:col-span-8 xl:col-span-7"
                    field-name="observations"
                    :rows="3"
                    placeholder=""
                    is-optional
                />
            </FieldGroup>
        </form>
    </section>

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
</template>

<script setup lang="ts">
    import { Ref } from 'vue';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import {
        Sand,
        SandProvider,
        PurchaseOrder,
        TransportProvider,
        TransportOrder,
        SandOrderBox,
    } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import DatePicker from '@/components/ui/form/DatePicker.vue';
    import OrderModal from '@/components/purchaseOrder/Modal.vue';
    import TimePicker from '@/components/ui/form/TimePicker.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';

    import PDF from '@/components/purchaseOrder/PDF.vue';

    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));
    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const GhostBtn = defineAsyncComponent(() => import('@/components/ui/buttons/GhostBtn.vue'));
    const api = import.meta.env.VITE_API_URL || '/api';

    const props = defineProps({
        companyClientId: {
            type: Number,
            required: true,
        },
        pitId: {
            type: Number,
            required: true,
        },
        selectedBoxes: {
            type: Array,
            default: () => [],
        },
        confirmPurchaseOrder: {
            type: Boolean,
            default: false,
        },
    });
    const emit = defineEmits(['updateQueueItem', 'orderIsComplete']);
    const { companyClientId, pitId, selectedBoxes, confirmPurchaseOrder } = toRefs(props);
    watch(confirmPurchaseOrder, (newVal) => {
        if (newVal) {
            confirm();
        }
    });

    const instance = axios.create({
        baseURL: api,
    });
    const showModal = ref(false);
    const sandProviderId = ref(-1);

    const filteredDrivers = computed(() => {
        if (transportProviderId.value > -1) {
            const driversFiltered = drivers.value.filter(
                (driver) => driver.transportProviderId === transportProviderId.value
            );

            return driversFiltered;
        }

        return [];
    });

    const drivers = ref([]);
    const driverId = ref(-1);
    const savingOrder = ref(false);

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
            transportOrder.value.driverId = newValue;
            const driverIndex = drivers.value.findIndex((driver) => driver.id === newValue);
            driverName.value = drivers.value[driverIndex].name;
        }
    });

    const filteredSandTypes = ref([]);

    const changeProvider = () => {
        const provider = sandProviders.value.find((sandProvider) => {
            return sandProvider.id == sandProviderId.value;
        });

        filteredSandTypes.value = provider?.meshType;
    };
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

    const useFirstSP = ref(false);

    const defaultTransportOrder = {
        boxAmount: 1,
        driverId: 0,
        innerId: 0,
        observations: '',
        purchaseOrderId: -1,
    };

    const transportOrder: Ref<TransportOrder> = ref({
        ...defaultTransportOrder,
    });

    const sandProviders = ref([] as Array<SandProvider>);
    const { data: sandProvidersData } = useAxios('/sandProvider', instance);
    watch(sandProvidersData, (sPData) => {
        if (sPData && sPData.data) {
            sandProviders.value = sPData.data;
        }
    });

    const sandTypes = ref([] as Array<Sand>);
    const { data: sandTypesData } = useAxios('/sand', instance);
    const useFirstST = ref(false);

    watch(sandTypesData, (sOData) => {
        if (sOData && sOData.data) {
            sandTypes.value = sOData.data;
        }
    });

    const useFirstSQ = ref(false);

    // :: TransportProvider
    const transportProviders = ref([] as TransportProvider[]);
    const { data: tPData } = useAxios('/transportProvider', instance);
    watch(tPData, (newData) => {
        if (newData && newData.data) {
            transportProviders.value = newData.data;
        }
    });
    const transportProviderId: Ref<number> = ref(-1);
    const useFirstTP = ref(false);
    const useFirstDriver = ref(false);

    const po = ref(null as any);

    /** Setea la data de la orden y levanta el modal */
    const confirm = () => {
        const sp = sandProviders.value.find((sandP) => {
            return sandP.id === sandProviderId.value;
        });
        const tp = transportProviders.value.find((transportP) => {
            return transportP.id === transportProviderId.value;
        });
        po.value = {
            sandProvider: { ...sp },
            sandOrders: [...props.selectedBoxes],
            sands: [...sandTypes.value],
            transportProvider: { ...tp },
            transportOrders: [transportOrder.value],
        };
        showModal.value = true;
    };

    const _saveTO = (poId: number) => {
        transportOrder.value.purchaseOrderId = poId;
        useAxios('/transportOrder', { method: 'POST', data: transportOrder.value }, instance);
    };
    const _saveSO = (poId: number) => {
        const sandOrderToDo = props.selectedBoxes.map((box: any) => {
            // Finalizamos la orden de pedido
            const oldBox = { ...box };
            oldBox.status = 100;

            if (oldBox && oldBox.location && typeof oldBox.location !== 'string') {
                oldBox.location = JSON.stringify(oldBox.location);
            }
            useAxios(`/sandOrder/${oldBox.id}`, { method: 'PUT', data: oldBox }, instance);
            const { id, location, ...newSO } = box;
            newSO.purchaseOrderId = poId;
            newSO.sandProviderId = box.sandProviderId;
            newSO.status = 0;

            console.log(newSO);

            // Creamos la nueva
            // if (newSO && newSO.location && typeof newSO.location !== 'string') {
            //     newSO.location = JSON.stringify({});
            // }

            return axios
                .post(`${api}/sandOrder/`, newSO)
                .then((response) => {
                    return response.data.data;
                })
                .catch((err) => console.error(err));
            // useAxios('/sandOrder', { method: 'POST', data: newSO }, instance);
        });

        return Promise.all(sandOrderToDo);
    };

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
            // companyClientId: companyClientId.value,
            pitId: pitId.value,
            sandProviderId: sandProviderId.value,
            transportProviderId: transportProviderId.value,
            deliveryTime: newDate,
            packageObservations: packageObservations.value,
            driverId: driverId.value,
        };

        return purchaseOrder;
    };

    const purchaseId = ref(0);
    const companies = ref([]);
    const { data: companiesData } = useAxios('/company', instance);
    watch(companiesData, (companiesIfno) => {
        if (companiesIfno && companiesIfno.data) {
            companies.value = companiesIfno.data;
        }
    });
    const pits = ref([]);
    const { data: pitsData } = useAxios('/pit', instance);
    watch(pitsData, (pitsInfo) => {
        if (pitsInfo && pitsInfo.data) {
            pits.value = pitsInfo.data;
        }
    });

    onMounted(async () => {
        const apiDrivers = await axios.get(`${api}/driver`);
        drivers.value = apiDrivers.data.data;
        const apiOrders = await axios.get(`${api}/purchaseOrder`);
        purchaseId.value = apiOrders.data.data?.at(-1)?.id + 1 || 1;
    });

    const getLastId = async () => {
        const result = await axios.get(`${api}/purchaseOrder`);

        return result.data.data?.at(-1)?.id + 1 || 1;
    };

    /**
     *
     */
    const save = async (sendEmails = false): Promise<void> => {
        savingOrder.value = true;
        const order = ref(null);
        // Formateamos la orden de pedido
        const purchaseOrder: any = _formatPO();
        // get last id
        const lastId = await getLastId();
        let newPdfInfo: any = pdfInfo.value;
        newPdfInfo = purchaseOrder;
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
            // openErrorGral.value = true;
        });
        savingOrder.value = false;

        if (result?.status === 200) {
            const poId = result.data.data.id;
            purchaseId.value = poId;
            titleSuccess.value = `La orden de pedido #${poId} ha sido generada con éxito`;
            showModal.value = false;
            openSuccess.value = true;
            _saveTO(poId);
            const newSO = await _saveSO(poId);
            //
            purchaseOrder.purchaseOrderId = poId;
            purchaseOrder.plates = filteredPlates.value[0];
            purchaseOrder.sandOrders = newSO;
            emit('updateQueueItem', purchaseOrder);
        }

        /*
        // deberia tener el resultado HTML del pdf
        const pdfContent = await pdf.value?.getFileContent();
        const orderToCreate = purchaseOrder as any;
        orderToCreate.pdfContent = pdfContent;

        // Creamos via API la orden de pedido
        const pODone = ref(null);
        const error = ref(null);
        pODone.value = await axios
            .post(`${api}/purchaseOrder`, orderToCreate)
            .then((response) => {
                console.log(response);

                return response.data.data;
            })
            .catch((err) => {
                error.value = err;
                console.error(err);

                return err;
            });

        order.value = pODone.value;
        const poId = pODone.value?.id;
        titleSuccess.value = `La orden de pedido #${poId} ha sido generada con éxito`;
        _saveTO(poId);
        const newSO = await _saveSO(poId);

        if (error?.value != undefined) {
            showModal.value = false;
            openErrorGral.value = true;
        } else {
            showModal.value = false;
            openSuccess.value = true;
        }
        */

        // orderToCreate.purchaseOrderId = poId;
        // orderToCreate.plates = filteredPlates.value[0];
        // orderToCreate.sandOrders = newSO;
        // emit('updateQueueItem', orderToCreate);
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

    const showPDF = ref(false);
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

    watchEffect(() => {
        const hasSandProvider = sandProviderId.value !== -1;
        const hasTransportProvider = transportProviderId.value !== -1;

        const sandOrdersAreFull =
            selectedBoxes.value.length > 0 &&
            selectedBoxes.value.every((box: any) => {
                return box.boxId !== '' && box.amount !== 0 && box.amount > 1 && box.sandTypeId !== -1;
            });

        const hasTimeAndDate = localDate.value !== '' && localDate.value.length === 10 && localTime.value > 0;
        const transportOrderIsFull =
            Number(transportOrder.value.boxAmount) > 0 &&
            Number(transportOrder.value.boxAmount) < 3 &&
            transportOrder.value.driverId !== -1;

        if (hasTransportProvider && hasSandProvider && sandOrdersAreFull && hasTimeAndDate && transportOrderIsFull) {
            emit('orderIsComplete');
        }
    });

    const pdf = ref(null as any);
    const downloadPDF = async () => {
        showPDF.value = true;
        await pdf.value?.download();
        showPDF.value = false;
    };

    const router = useRouter();
    const redirectIndex = () => {
        router.go(0);
    };
</script>

<style lang="scss" scoped>
    fieldset:not(:last-of-type) {
        @apply border-b border-gray-200 pb-6;
    }
</style>
