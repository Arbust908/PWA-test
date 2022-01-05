<template>
    <form method="POST" action="/" class="p-4 max-w-lg">
        <FieldGroup>
            <FieldSelect
                class="col-span-full"
                field-name="name"
                placeholder="Seleccionar cliente"
                title="Cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
            <FieldSelect
                class="col-span-full"
                field-name="serviceCompany"
                placeholder="Seleccionar operadora"
                title="Operadora / Empresa de servicios"
                endpoint="/company?isOperator=1"
                is-optional
                :data="serviceCompanyId"
                @update:data="serviceCompanyId = $event"
            />
            <FieldInput
                class="col-span-full mb-4"
                field-name="observations"
                placeholder="ej: 12313"
                title="PAD"
                :data="pad"
                @update:data="pad = $event"
            />
        </FieldGroup>
        <FieldGroup class="max-w-lg">
            <FieldLegend>Pozos</FieldLegend>
            <PitFields :pits="pits" @update:pits="pits = $event" @removePit="removePit" />
            <button class="mt-1 flex items-center col-span-6" @click.prevent="addPit">
                <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                <span class="font-bold"> Agregar pozo </span>
            </button>
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { watchEffect, defineComponent } from 'vue';
    import { useVModels } from '@vueuse/core';

    import Icon from '@/components/icon/TheAllIcon.vue';

    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import PitFields from '@/components/workOrder/woPitField.vue';

    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import { Pit } from '@/interfaces/sandflow';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldSelect,
            FieldInput,
            FieldLegend,
            PitFields,
            Icon,
            CircularBtn,
        },
        props: {
            clientId: {
                type: Number,
                required: true,
            },
            serviceCompanyId: {
                type: Number,
                required: true,
            },
            pad: {
                type: String,
                default: '',
            },
            pits: {
                type: Array,
                default: () => [],
            },
            isFull: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { clientId, serviceCompanyId, pad, pits, isFull } = useVModels(props, emit);
            console.log(pits.value);
            const removePit = (pitId: number) => {
                pits.value = pits.value.filter((pit: Pit) => {
                    return pit.id !== pitId;
                });
            };
            const addPit = () => {
                const lastPitId = pits.value.length;
                pits.value.push({
                    id: lastPitId,
                    name: '',
                });
            };
            watchEffect(() => {
                isFull.value = !!(
                    clientId.value >= 0 &&
                    pad.value.length > 0 &&
                    pits.value.length > 0 &&
                    pits.value[0].name.length > 0
                );
            });

            return {
                clientId,
                serviceCompanyId,
                pad,
                pits,
                addPit,
                removePit,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
            /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
        }
        &__add {
            @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
        }
        &__add--special {
            @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
        }
        &__mobile-only {
            @apply lg:hidden;
        }
        &__desktop-only {
            @apply hidden lg:inline-flex;
        }
    }
    .input-block select,
    .input-block input {
        @apply w-full rounded mb-3 p-2;
    }

    .pit-block {
        @apply flex mt-1 items-center w-full mb-3;
        & select,
        & input {
            @apply rounded p-2 max-w-md inline-block w-full;
        }
    }

    fieldset {
        @apply mb-6;
    }
    label {
        @apply text-sm;
    }
</style>
