<template>
    <Modal :open="showModal" modal-classes="max-w-[440px]" @close="$emit('close')">
        <h2 class="text-base text-black font-bold text-left">Orden de pedido - #{{ poId }}</h2>
        <div class="w-full max-w-sm text-left text-gray-800">
            <div class="bg-gray-100 mt-3 rounded-r-md pt-3 pl-4 pb-4 border-l-4 border-green-500 border-t-0">
                <h3 class="font-bold text-black text-base mb-2">Arenas {{ po.sandProvider.name }}</h3>
                <ul>
                    Pedido:
                    <li v-for="(so, index) in po.sandOrders" :key="index" class="ml-0 text-black text-sm list-none">
                        {{ so.amount }}t - arena #{{ getSandType(so?.sandTypeId) }} -
                        {{ so.boxId !== '' ? `ID ${so.boxId}` : 'Sin ID de caja' }}
                    </li>
                </ul>
            </div>
            <div class="bg-gray-100 mt-3 rounded-r-md pt-3 pl-4 pb-4 border-l-4 border-green-500 border-t-0">
                <h3 class="font-bold text-black text-base">Transporte: {{ po.transportProvider.name }}</h3>
                <li v-for="(tp, i) in po.transportOrders" :key="i" class="ml-0 text-black text-sm list-none mt-2">
                    <p>{{ driver }} - Cantidad: {{ tp.boxAmount }}</p>
                    <p>
                        Patente: {{ plates[0] }} - Acoplado: {{ plates[1] }} {{ tp.observations && '-' }}
                        {{ tp.observations }}
                    </p>
                </li>
            </div>
        </div>
        <div class="flex items-center">
            <input
                id="checkbox"
                v-model="checked"
                type="checkbox"
                class="outline-none focus:outline-none text-green-500 rounded mr-2"
            />
            <label for="checkbox">Enviar mail a proveedores</label>
        </div>
        <div class="w-full flex gap-x-6 justify-end mt-3">
            <SecondaryBtn @click.prevent="$emit('close')"> Volver </SecondaryBtn>
            <PrimaryBtn @click.prevent="$emit('confirm')" :is-loading="loading" @click="checked && downloadPDF(po)">
                Confirmar
            </PrimaryBtn>
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
            driver: {
                type: String,
                required: true,
            },
            poId: {
                type: Number,
                required: true,
            },
            plates: {
                type: Array,
                required: true,
            },
            loading: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const getSandType = (sandTypeId: number) => {
                const sandType = props.po.sands.find((st) => st.id === sandTypeId);

                return sandType ? sandType.type : 'Sin tipo de arena';
            };
            const content = ref(null);

            const checked = ref(true);

            const downloadPDF = (po) => {
                return;
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
