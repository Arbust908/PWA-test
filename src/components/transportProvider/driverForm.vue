<template>
    <FieldGroup>
        <FieldInput
            class="col-span-full"
            title="Nombre y apellido"
            field-name="driverName"
            placeholder=""
            :data="driverName"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverName = $event"
            @change="validationHandler"
        />
        <FieldInput
            class="col-span-full"
            field-name="driverPhone"
            placeholder="Ingrese sólo números"
            mask="#*"
            title="Teléfono"
            :data="driverPhone"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverPhone = $event"
        />
        <FieldInput
            class="col-span-full"
            field-name="driverEmail"
            placeholder="transportista@gmail.com"
            title="Email"
            :data="driverEmail"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            validation-type="email"
            @update:data="driverEmail = $event"
        />
        <FieldInput
            class="col-span-full"
            title="Tipo de transporte"
            field-name="driverVehicleType"
            placeholder=""
            :data="driverTType"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverTType = $event"
        />
        <FieldInput
            class="col-span-6"
            title="Patente camión"
            field-name="driverVehicleId"
            placeholder=""
            :data="driverTId"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverTId = $event"
        />
        <FieldInput
            class="col-span-6"
            title="Patente acoplado"
            field-name="driverVehicleId2"
            placeholder=""
            :data="driverTId2"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverTId2 = $event"
        />
        <FieldTextArea
            class="col-span-full"
            title="Observaciones"
            field-name="observations"
            placeholder=""
            :rows="5"
            is-fixed
            is-optional
            :data="driverObs"
            @update:data="driverObs = $event"
        />
        <button
            :class="['flex items-center w-[250px] gap-2', driverFull ? null : 'text-gray-200 cursor-not-allowed']"
            @click.prevent="driverFull && addDriver()"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 0C5.37097 0 0 5.37097 0 12C0 18.629 5.37097 24 12 24C18.629 24 24 18.629 24 12C24 5.37097 18.629 0 12 0ZM18.9677 13.3548C18.9677 13.6742 18.7065 13.9355 18.3871 13.9355H13.9355V18.3871C13.9355 18.7065 13.6742 18.9677 13.3548 18.9677H10.6452C10.3258 18.9677 10.0645 18.7065 10.0645 18.3871V13.9355H5.6129C5.29355 13.9355 5.03226 13.6742 5.03226 13.3548V10.6452C5.03226 10.3258 5.29355 10.0645 5.6129 10.0645H10.0645V5.6129C10.0645 5.29355 10.3258 5.03226 10.6452 5.03226H13.3548C13.6742 5.03226 13.9355 5.29355 13.9355 5.6129V10.0645H18.3871C18.7065 10.0645 18.9677 10.3258 18.9677 10.6452V13.3548Z"
                    fill="#8DC881"
                />
            </svg>

            <h2 class="font-semibold">Agregar Transportista</h2>
        </button>
    </FieldGroup>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import { useVModels } from '@vueuse/core';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            Icon,
            FieldTextArea,
        },
        props: {
            driverName: {
                type: String,
                default: '',
            },
            driverPhone: {
                type: String,
                default: '123456789',
            },
            driverEmail: {
                type: String,
                default: '',
            },
            driverTType: {
                type: String,
                default: '',
            },
            driverTId: {
                type: String,
                default: '',
            },
            driverTId2: {
                type: String,
                default: '',
            },
            driverObs: {
                type: String,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { driverName, driverPhone, driverEmail, driverTType, driverTId, driverTId2, driverObs } = useVModels(
                props,
                emit
            );

            const silenced = ref(true);

            const validationHandler = () => {
                silenced.value = false;
            };

            const addDriver = () => {
                silenced.value = true;
                emit('add-driver');
            };

            const driverFull: ComputedRef<boolean> = computed(() => {
                return (
                    driverName.value !== '' &&
                    driverPhone.value !== '' &&
                    driverEmail.value !== '' &&
                    driverTType.value !== '' &&
                    driverTId.value !== '' &&
                    driverTId2.value !== ''
                );
            });

            return {
                driverName,
                driverPhone,
                driverEmail,
                driverTType,
                driverTId,
                driverTId2,
                driverObs,
                silenced,
                validationHandler,
                driverFull,
                addDriver,
                Icon,
            };
        },
    });
</script>
