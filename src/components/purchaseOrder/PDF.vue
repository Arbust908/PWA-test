<template>
    <section id="toPDF" ref="toPDF" class="order">
        <header>
            <h2>
                Orden de pedido -
                <span>{{ '#' + info.purchaseOrder.id }}</span>
            </h2>
            <dl>
                <dt>Cliente</dt>
                <dd>{{ info.client }}</dd>
                <dt>Pozo</dt>
                <dd>{{ info.pit }}</dd>
            </dl>
        </header>
        <main>
            <section class="detalle">
                <h3>Arena</h3>
                <article>
                    <h4>{{ sandProviderName }}</h4>
                    <dl v-for="arena in sandOrders" :key="arena?.id">
                        <dt><span class="dot" /> Pedido:</dt>
                        <dd>{{ arena?.amount }}t - {{ arena?.sandType }} - {{ arena?.boxId }}</dd>
                    </dl>
                </article>
            </section>
            <section class="detalle">
                <h3>Transporte</h3>
                <article class="space-y-1">
                    <h4>{{ transportProviderName }}</h4>
                    <p v-for="line in formatTransportOrder" :key="line">{{ line }}</p>
                </article>
            </section>
            <hr class="my-10" />
            <section class="observaciones">
                <h3>Observaciones</h3>
                <dl>
                    <dt>Fecha de entrega:</dt>
                    <dd>{{ localDate }}</dd>
                    <dt>Hora de entrega:</dt>
                    <dd>{{ formatedTime }}</dd>
                </dl>
                <p>Observaciones:{{ info.observation }}</p>
            </section>
        </main>
        <footer>
            <p>Responsable de carga</p>
            <p>Confirma recepción</p>
        </footer>
    </section>
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
        console.log('Sand order', so);
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
        console.log(to);

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
    const exportFilename = `orden_de_dedido_${props.info.purchaseOrder.id}.pdf`;
    const download = () => {
        const doc = document.querySelector('#toPDF');
        pdfOptions.jsPDF.orientation = trueOrientation(pdfOptions.jsPDF.format);
        console.log('PDF en HTMl', toPDF.value);
        worker.set(pdfOptions).from(doc).save(exportFilename);
    };
    const trueOrientation = ([width, height]) => {
        return width > height ? 'l' : 'p';
    };
    const router = useRouter();
    setTimeout(() => {
        download();
        setTimeout(() => {
            emit('close');
            router.push('/orden-de-pedido');
        }, 1000);
    }, 500);
</script>

<style scoped lang="scss">
    .order {
        @apply rounded-lg px-6 pt-7 w-[595px] h-[838px] mx-auto bg-white shadow relative;
        h2 {
            @apply text-xl font-bold mb-6;
            span {
                @apply text-main-600;
            }
        }

        dl {
            @apply flex mb-8;
            dt {
                @apply font-medium mr-1;
            }
            dd {
                @apply font-normal text-gray-500 mr-8;
            }
        }

        .detalle {
            @apply mb-5;
            dl {
                @apply mb-2 flex flex-col;
                & :is(dt, dd) {
                    @apply flex items-center gap-1;
                }
                dd {
                    @apply ml-3;
                }
                .dot {
                    @apply w-2 h-2 bg-main-400 rounded-full inline-block;
                }
            }
            h3 {
                @apply font-bold text-[#117E49] mb-5 uppercase text-lg;
            }
            article {
                @apply py-3 pl-5 bg-[#f9f9f9] border-l-2 border-main-600;
                h4 {
                    @apply font-bold;
                }
            }
        }

        hr {
            @apply border-gray-300;
        }

        .observaciones {
            @apply text-sm;
            h3 {
                @apply text-sm font-bold mb-5 uppercase;
            }
            dl {
                @apply text-sm mb-3;
            }
            p {
                @apply text-sm;
            }
        }

        footer {
            @apply flex w-full justify-center gap-x-[75px] absolute bottom-10 inset-x-0;
            p {
                @apply text-center pt-3 border-t;
            }
        }
    }
</style>
