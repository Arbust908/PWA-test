<template>
    <Modal :open="showModal" modal-classes="max-w-[440px]" @close="$emit('close')">
        <h2 class="text-base text-black font-bold text-left">Cierre de Operaciones - #1234XYZ</h2>
        <div class="w-full max-w-sm text-left text-gray-800">
            <div
                v-for="sandPlan in sandPlans"
                :key="sandPlan.id"
                class="bg-gray-100 mt-3 rounded-r-md pt-3 pl-4 pb-4 border-l-4 border-green-500 border-t-0"
            >
                <h3 class="font-bold text-black text-base my-2">Pozo {{ sandPlan.pit.name }}</h3>
                <div class="my-2">
                    <span>
                        Etapas: {{ sandPlan.stages.find((currentStage) => currentStage.status === 0).stage }} /
                        {{ sandPlan.stages.length }} -
                        {{
                            sandPlan.stages[0].quantity1 +
                            sandPlan.stages[0].quantity2 +
                            sandPlan.stages[0].quantity3 +
                            sandPlan.stages[0].quantity4
                        }}
                        t
                    </span>
                </div>
            </div>
        </div>
        <div class="w-full flex gap-x-6 justify-end mt-3">
            <SecondaryBtn @click.prevent="$emit('close')"> Volver </SecondaryBtn>
            <PrimaryBtn @click.prevent="$emit('confirm')" @click="log"> Confirmar </PrimaryBtn>
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
            sandPlans: {
                type: Array,
                required: true,
            },
            showModal: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const log = () => {
                console.log('click');
            };

            return {
                log,
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
