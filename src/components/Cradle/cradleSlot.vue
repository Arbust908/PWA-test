<template>
    <article v-if="box.boxId" class="slot" :class="isClicked ? 'ring' : null" @click.self="isClickedAndSelected">
        <span class="station-title-full" @click.self="isClickedAndSelected">
            Estación {{ index + 1 }} - {{ box.boxId }}</span
        >
        <div class="cradle-status-wrapper">
            <!-- checkbox section  -->
            <div class="cradle-status-wrapper">
                <span class="cradle-status" @click.prevent="$emit('changeCradleSlotStatus', [index, '1'])">
                    <div class="icon-wrapper check" :class="[box.status == '1' ? 'active' : '']">
                        <Icon v-if="box.status == '1'" icon="Check" class="icon" />
                    </div>
                    En ejecución
                </span>
                <span class="cradle-status" @click.prevent="$emit('changeCradleSlotStatus', [index, '2'])">
                    <div class="icon-wrapper pause" :class="[box.status == '2' ? 'active' : '']">
                        <Icon v-if="box.status == '2'" icon="Pause" type="outline" class="icon" />
                    </div>
                    Pausa
                </span>
                <span class="cradle-status" @click.prevent="$emit('changeCradleSlotStatus', [index, '3'])">
                    <div class="icon-wrapper empty" :class="[box.status == '3' ? 'active' : '']">
                        <Icon v-if="box.status == '3'" icon="Minus" class="icon" />
                    </div>
                    Vacía
                </span>
                <span class="cradle-status" @click.prevent="$emit('changeCradleSlotStatus', [index, '0'])">
                    <div class="icon-wrapper unavailable" :class="[box.status == '0' ? 'active' : '']">
                        <Icon v-if="box.status == '0'" icon="X" class="icon" />
                    </div>
                    No disponible
                </span>
            </div>

            <hr class="border-gray-300" />
            <div class="cradle-data-wrapper" @click.self="isClickedAndSelected">
                <span class="cradle-data">
                    <Icon icon="InformationCircle" class="icon" />
                    {{ box.amount }}T peso remito
                </span>
                <!-- <span class="cradle-data">
                    <Icon icon="InformationCircle" class="icon" />
                    10T peso actual
                </span> -->
                <span class="cradle-data">
                    <Icon icon="InformationCircle" class="icon" />
                    Arena: {{ box.sandType }}
                </span>
            </div>
        </div>
    </article>
    <article v-else-if="box && box.boxId === null">
        <div class="slot empty">
            <span class="station-title">Estación {{ index + 1 }}</span>
            <span class="copy">Sin Caja</span>
        </div>
    </article>
    <article v-else>
        <div class="slot empty">
            <span class="station-title">Estación {{ index + 1 }}</span>
            <span class="copy">Seleccione cliente, pozo y cradle.</span>
        </div>
    </article>
</template>

<script setup lang="ts">
    import Icon from '@/components/icon/TheAllIcon.vue';

    const props = defineProps({
        cradles: {
            type: Array,
            default: () => [],
        },
        cradleId: {
            type: Number,
            default: -1,
        },
        cradleSlots: {
            type: Array,
            default: () => [],
        },
        box: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    });
    const emits = defineEmits(['changeCradleSlotStatus', 'selectedSlots']);

    const isClicked = ref(false);
    const isClickedAndSelected = () => {
        isClicked.value = !isClicked.value;
        emits('selectedSlots');
    };
</script>

<style lang="scss" scoped>
    .cradle-data-wrapper,
    .cradle-status-wrapper {
        @apply flex flex-col text-left justify-between mb-4 pl-3;
    }
    .cradle-data-wrapper {
        @apply mt-4;
    }
    .cradle-status {
        @apply flex mb-2;
        & .icon-wrapper {
            border-radius: 100%;
            @apply mr-4 w-5 h-5 flex items-center justify-center;

            & .icon {
                @apply w-5 h-5;
            }

            &.check {
                @apply text-green-600 border-green-600 border-2;
            }

            &.pause {
                @apply text-yellow-600 border-yellow-600;
                &.active {
                    transform: translate(-2px, -2px);
                    @apply w-6 h-6 mr-3;

                    & .icon {
                        @apply w-6 h-6;
                    }
                }
            }
            &.empty {
                @apply text-gray-600 border-gray-600 border-2;
            }

            &.unavailable {
                @apply text-red-600 border-red-600 border-2;
            }

            &:not(.active) {
                @apply border-gray-600 border-2;
            }
        }

        &:not(:first-child) {
            @apply mt-2;
        }
    }
    .cradle-data {
        @apply text-purple-600 flex items-center py-2;

        & .icon {
            @apply mr-1 w-6 h-6 text-purple-600;
        }

        &:not(:first-child) {
            @apply mt-2;
        }
    }
    .cradle-slots {
        @apply pl-12 pr-12 pb-12 grid grid-cols-1 gap-4  items-center;

        @screen lg {
            @apply grid-cols-4;
        }

        .slot {
            height: 25rem;
            max-width: 220px;
            @apply border-dashed border-2 border-second-300 rounded-lg p-4 cursor-pointer flex flex-col text-center;

            &:not(.empty) {
                @apply bg-gray-100 border-none;
            }

            &.without-box {
                @apply text-gray-100 bg-white justify-center items-center border-dashed border-2 border-second-300 cursor-default;

                .station-title {
                    @apply pb-0 pt-0;
                }
            }

            .station-title {
                @apply text-lg font-bold text-gray-400 pb-8 pt-4;
            }
            .station-title-full {
                @apply text-lg font-bold text-gray-700 pb-8 pt-4;
            }

            .copy {
                @apply text-lg;
            }
        }
    }
</style>
