<template>
    <article class="card">
        <div class="box-card-and-id flex flex-col items-center">
            <BoxIcon class="icon" />
        </div>
        <div class="flex flex-col justify-between">
            <div>
                <p class="text-sm font-bold mt-1 text-gray-700">Caja: {{ boxId }}</p>
                <p class="text-sm font-bold mt-1 text-gray-700">Estación: {{ estacion }}</p>
            </div>
            <div class="mt-4 flex flex-row justify-between">
                <button
                    v-if="selectedBoxesForTrucks.length < 2"
                    :class="clickedDeposit ? 'clicked' : 'button'"
                    @click="deposit"
                >
                    Depósito
                </button>
                <button v-else class="button cursor-not-allowed">Depósito</button>

                <button
                    v-if="selectedBoxesForDeposit.length < 1"
                    :class="clickedTruck ? 'clicked' : 'button'"
                    @click="truck"
                >
                    Camion
                </button>
                <button v-else class="button cursor-not-allowed">Camion</button>
                <!-- <button :class="clickedTruck ? 'clicked' : 'button'" @click="truck">Camion</button> -->
            </div>
        </div>
    </article>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed } from 'vue';
    import BoxIcon from '@/components/depositDesign/BoxIcon.vue';

    export default defineComponent({
        name: 'BoxCard',
        components: {
            BoxIcon,
        },
        props: {
            boxId: {
                type: Number,
                required: true,
            },
            estacion: {
                type: String,
                required: true,
            },
            selectedBoxesForTrucks: {
                type: Array,
                default: () => [],
            },
            selectedBoxesForDeposit: {
                type: Array,
                default: () => [],
            },
            // choosedBox: {
            //     type: Object,
            //     required: false,
            //     default: () => {
            //         return {};
            //     },
            // },
        },
        setup(props, { emit }) {
            const { boxId, estacion } = useVModels(props, emit);

            const clickedDeposit = ref(false);
            const clickedTruck = ref(false);

            const choosedBox = ref({
                id: boxId.value,
                estacion: estacion.value,
            });

            const deposit = () => {
                emit('deposit');
                clickedTruck.value = false;
                clickedDeposit.value = !clickedDeposit.value;
            };

            const truck = () => {
                emit('truck');
                clickedDeposit.value = false;
                clickedTruck.value = !clickedTruck.value;
            };

            return {
                deposit,
                truck,
                choosedBox,
                clickedDeposit,
                clickedTruck,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .card {
        @apply p-4 mt-2 rounded-2xl flex gap-6 bg-second-400 text-second-0 bg-white border-2 border-green-500;
        & .icon {
            @apply w-20 h-20 text-second-400;
        }
    }

    .button {
        @apply text-xs rounded-md p-1 mr-1 bg-gray-400 text-white text-center;
    }

    .clicked {
        @apply text-xs rounded-md p-1 mr-1 bg-green-500 text-white text-center;
    }
</style>
