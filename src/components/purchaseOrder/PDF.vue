<template>
    <div>
        <section
            id="toPDF"
            ref="toPDF"
            style="
                border-radius: 0.5rem;
                padding-left: 1.5rem;
                padding-right: 1.5rem;
                padding-top: 1.75rem;
                width: 595px;
                height: 838px;
                margin-left: auto;
                margin-right: auto;
                background-color: rgb(255, 255, 255);
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                position: relative;
            "
        >
            <header>
                <h2 style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 1.5rem">
                    Orden de pedido -
                    <span style="color: hsl(151, 65%, 30%)">{{ '#' + info.purchaseOrder.id }}</span>
                </h2>
                <dl style="display: flex; margin-bottom: 2rem">
                    <dt style="font-weight: 500; margin-right: 0.25rem">Cliente</dt>
                    <dd style="font-weight: 400; color: rgb(107 114 128); margin-right: 2rem">{{ info.client }}</dd>
                    <dt style="font-weight: 500; margin-right: 0.25rem">Pozo</dt>
                    <dd style="font-weight: 400; color: rgb(107 114 128); margin-right: 2rem">{{ info.pit }}</dd>
                </dl>
            </header>
            <main>
                <section style="margin-bottom: 1.25rem">
                    <h3
                        style="
                            font-weight: 700;
                            color: #117e49;
                            margin-bottom: 1.25rem;
                            text-transform: uppercase;
                            font-size: 1.125rem;
                            line-height: 1.75rem;
                        "
                    >
                        Arena
                    </h3>
                    <article
                        style="
                            padding-top: 0.75rem;
                            padding-bottom: 0.75rem;
                            padding-left: 1.25rem;
                            background-color: #f9f9f9;
                            border-left-width: 2px;
                            border-color: hsl(151, 65%, 30%);
                        "
                    >
                        <h4 style="font-weight: 700">{{ sandProviderName }}</h4>
                        <dl
                            v-for="arena in sandOrders"
                            :key="arena?.id"
                            style="margin-bottom: 0.5rem; display: flex; flex-direction: column"
                        >
                            <dt style="display: flex; align-items: center; gap: 0.25rem; font-weight: 500">
                                <span
                                    style="
                                        width: 0.5rem;
                                        height: 0.5rem;
                                        background-color: hsl(151, 65%, 50%);
                                        border-radius: 9999px;
                                        display: inline-block;
                                    "
                                />
                                Pedido:
                            </dt>
                            <dd
                                style="
                                    display: flex;
                                    align-items: center;
                                    gap: 0.25rem;
                                    margin-left: 0.75rem;
                                    font-weight: 400;
                                    color: rgb(107 114 128);
                                    margin-right: 2rem;
                                "
                            >
                                {{ arena?.amount }}t - {{ arena?.sandType }} - {{ arena?.boxId }}
                            </dd>
                        </dl>
                    </article>
                </section>
                <section style="margin-bottom: 1.25rem">
                    <h3
                        style="
                            font-weight: 700;
                            color: #117e49;
                            margin-bottom: 1.25rem;
                            text-transform: uppercase;
                            font-size: 1.125rem;
                            line-height: 1.75rem;
                        "
                    >
                        Transporte
                    </h3>
                    <article
                        style="
                            padding-top: 0.75rem;
                            padding-bottom: 0.75rem;
                            padding-left: 1.25rem;
                            background-color: #f9f9f9;
                            border-left-width: 2px;
                            border-color: hsl(151, 65%, 30%);
                        "
                    >
                        <h4 style="font-weight: 700">{{ transportProviderName }}</h4>
                        <p v-for="line in formatTransportOrder" :key="line" style="margin-top: 0.25rem">{{ line }}</p>
                    </article>
                </section>
                <hr style="border-color: rgb(209 213 219); margin-top: 2.5rem; margin-bottom: 2.5rem" />
                <section style="font-size: 0.875rem; line-height: 1.25rem">
                    <h3
                        style="
                            font-size: 0.875rem;
                            line-height: 1.25rem;
                            font-weight: 700;
                            margin-bottom: 1.25rem;
                            text-transform: uppercase;
                        "
                    >
                        Observaciones
                    </h3>
                    <dl style="font-size: 0.875rem; line-height: 1.25rem; margin-bottom: 0.75rem">
                        <dt style="font-weight: 500; margin-right: 0.25rem; display: inline">Fecha de entrega:</dt>
                        <dd style="font-weight: 400; color: rgb(107 114 128); margin-right: 2rem; display: inline">
                            {{ localDate }}
                        </dd>
                        <dt style="font-weight: 500; margin-right: 0.25rem; display: inline">Hora de entrega:</dt>
                        <dd style="font-weight: 400; color: rgb(107 114 128); margin-right: 2rem; display: inline">
                            {{ formatedTime }}
                        </dd>
                    </dl>
                    <p style="font-size: 0.875rem; line-height: 1.25rem">Observaciones: {{ info.observation }}</p>
                </section>
            </main>
            <footer
                style="
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    column-gap: 75px;
                    position: absolute;
                    bottom: 2.5rem;
                    left: 0px;
                    right: 0px;
                "
            >
                <p style="text-align: center; padding-top: 0.75rem; border-top-width: 1px">Responsable de carga</p>
                <p style="text-align: center; padding-top: 0.75rem; border-top-width: 1px">Confirma recepción</p>
            </footer>
        </section>
    </div>
</template>
<script setup lang="ts">
    import { formatHour, createFromDate } from '@/helpers/useChronos';
    const props = defineProps({
        info: {
            type: Object,
            required: true,
        },
    });
    const emit = defineEmits(['close']);

    const toPDF = ref(null);
    const sandProviderName = computed(() => {
        return props.info.purchaseOrder?.sandProvider?.name;
    });

    const transportProviderName = computed(() => {
        return props.info.purchaseOrder?.transportProvider?.name;
    });

    const sandOrders = computed(() => {
        const so = props.info.purchaseOrder?.sandOrders;
        const sand = props.info.purchaseOrder?.sands;

        if (!so) {
            return [];
        }

        return (
            so.map((order) => {
                const sandType = sand.find((st) => st.id === order.sandTypeId);

                return {
                    amount: order.amount,
                    boxId: order.boxId,
                    sandType: sandType.type,
                };
            }) || []
        );
    });

    const transportOrder = computed(() => {
        const to = props.info.purchaseOrder?.transportOrders && props.info.purchaseOrder?.transportOrders[0];

        if (!to) {
            return null;
        }
        const driverId = to?.driverId;
        const drivers = props.info.purchaseOrder?.transportProvider?.drivers || [];
        const driver = drivers.find((d) => d.id === driverId);

        return {
            ...to,
            driver: driver.name,
            truckId: driver.transportId,
            trailerId: driver.transportId2,
        };
    });

    const formatTransportOrder = computed(() => {
        if (transportOrder.value === null) {
            return [];
        }
        const { driver, truckId, trailerId, boxAmount, observations } = transportOrder.value;
        const boxString = boxAmount > 1 ? 'cajas' : 'caja';

        return [
            `${driver} - Cantidad: ${boxAmount} ${boxString}`,
            `Patente ${truckId} - Acoplado ${trailerId} - ${observations}`,
        ];
    });

    const localDate = computed(() => {
        return props.info.localDate;
    });
    const formatedTime = computed(() => {
        return formatHour(createFromDate(props.info.localTime));
    });
    //
    var worker = html2pdf();
    const pdfOptions = {
        margin: 0,
        image: {
            type: 'jpeg',
            quality: 1,
        },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'px',
            format: [595, 838],
            orientation: 'p',
        },
    };

    const getFileContent = async () => {
        const doc = document.getElementById('toPDF').outerHTML;

        pdfOptions.jsPDF.orientation = trueOrientation(pdfOptions.jsPDF.format);

        const fileContent = await html2pdf().set(pdfOptions).from(doc).toPdf().output();

        return btoa(fileContent);
    };

    const download = async () => {
        const exportFilename = `orden_de_pedido_${props.info.purchaseOrder.id}.pdf`;
        // get outer html
        const doc = document.getElementById('toPDF').outerHTML;

        pdfOptions.jsPDF.orientation = trueOrientation(pdfOptions.jsPDF.format);

        await html2pdf().set(pdfOptions).from(doc).save(exportFilename);

        emit('close');
    };

    const trueOrientation = ([width, height]) => {
        return width > height ? 'l' : 'p';
    };

    defineExpose({
        download,
        getFileContent,
    });
</script>
