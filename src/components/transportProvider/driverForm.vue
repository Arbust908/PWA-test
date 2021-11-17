<template>
    <FieldGroup>
        <FieldInput
            class="col-span-full"
            title="Nombre y apellido"
            field-name="driverName"
            placeholder="Ingresar conductor"
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
            placeholder="+11 1234 5678"
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
            placeholder="empresa@mail.com"
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
            placeholder="Doble carga"
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
            placeholder="patente del camion"
            :data="driverTId"
            require-validation
            :silenced="silenced"
            entity="transportProvider"
            @update:data="driverTId = $event"
        />
        <FieldInput
            class="col-span-6"
            title="Patente acoplado"
            field-name="driverVehicleId"
            placeholder="patente del acoplado"
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
            placeholder="Observaciones..."
            :rows="5"
            is-fixed
            is-optional
            :data="driverObs"
            @update:data="driverObs = $event"
        />
        <button
            :class="['flex items-center w-[250px]', driverFull ? null : 'text-gray-200 cursor-not-allowed']"
            @click.prevent="driverFull && addDriver()"
        >
            <Icon icon="Plus" type="outline" class="w-5 h-5" />
            <h2>Agregar Transportista</h2>
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
