<template>
    <Modal type="off" :open="showModal" @close="$emit('close')">
        <template #body>
            <h2 class="text-base text-black font-bold text-left">Orden de pedido</h2>
            <div class="w-full max-w-sm text-left text-gray-800">
                <div class="bg-gray-100 mt-3 rounded-r-md pt-3 pl-4 pb-4 border-l-4 border-green-500 border-t-0">
                    <h3 class="font-bold text-black text-base">Arenas {{ po.sandProvider.name }}</h3>
                    <ul>
                        <li v-for="(so, index) in po.sandOrders" :key="index" class="ml-2 text-black text-sm list-none">
                            {{ so.amount }}t - {{ getSandType(so?.sandTypeId) }} -
                            {{ so.boxId !== '' ? so.boxId : 'Sin ID de caja' }}
                        </li>
                    </ul>
                </div>
                <div class="bg-gray-100 mt-3 rounded-r-md pt-3 pl-4 pb-4 border-l-4 border-green-500 border-t-0">
                    <h3 class="font-bold text-black text-base">Transporte {{ po.transportProvider.name }}</h3>
                    <li v-for="(tp, i) in po.transportOrders" :key="i" class="ml-2 text-black text-sm list-none mt-2">
                        <p>Patente: {{ tp.licensePlate }} - Cantidad: {{ tp.boxAmount }}</p>
                        <p>Observaciones: {{ tp.observations !== '' ? ' - ' + tp.observations : null }}</p>
                    </li>
                </div>
            </div>
        </template>
        <template #btn>
            <input
                id="checkbox"
                v-model="checked"
                type="checkbox"
                class="outline-none appearance-none focus:outline-none"
            />
            <label for="checkbox">Descargar como .pdf</label>
            <div class="w-full flex gap-x-6 justify-end">
                <SecondaryBtn @click.prevent="$emit('close')"> Volver </SecondaryBtn>
                <PrimaryBtn @click.prevent="$emit('confirm')" @click="checked && downloadPDF(po)">
                    Confirmar
                </PrimaryBtn>
            </div>
        </template>
        <div ref="content">
            <h1>TEST</h1>
        </div>
    </Modal>
</template>

<script lang="ts">
    import { defineComponent, ref, watchEffect } from 'vue';
    import Modal from '@/components/modal/General.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import { isEven } from '@/helpers/iteretionHelpers';
    import jsPDF from 'jspdf';
    export default defineComponent({
        components: {
            Modal,
            PrimaryBtn,
            SecondaryBtn,
        },
        props: {
            po: {
                type: Object,
                required: true,
            },
            showModal: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const getSandType = (sandTypeId: number) => {
                const sandType = props.po.sands.find((st) => st.id === sandTypeId);

                return sandType ? sandType.type : 'Sin tipo de arena';
            };
            const content = ref(null);
            watchEffect(() => {
                console.log(content.value);
            });

            const checked = ref(false);

            const downloadPDF = (po) => {
                const doc = new jsPDF();
                console.log('po', po);

                const id = 'ID-123';
                const spName = po.sandProvider.name;
                const sandOrder = JSON.stringify(po.sandOrders);

                const tpName = po.transportProvider.name;
                const transportOrder = JSON.stringify(po.transportOrders);

                doc.text('Orden de pedido', 10, 10);

                doc.text('Provedor de Arena: ' + spName, 10, 20);
                doc.text(sandOrder, 10, 26);

                doc.text('Provedoor de Transporte: ' + tpName, 10, 35);
                doc.text(transportOrder, 10, 41);

                doc.save('OrdenDePedido' + id + '.pdf');
            };

            return {
                getSandType,
                isEven,
                downloadPDF,
                checked,
            };
        },
    });
</script>

<style scoped>
    #checkbox {
        outline: none;
        text-decoration: none;
    }
</style>
