<template>
    <form method="POST" action="/" class="p-4 max-w-lg">
        <FieldGroup>
            <FieldInput
                class="col-span-full"
                field-name="transportName"
                placeholder=""
                title="Nombre / Razón social"
                :data="tpName"
                require-validation
                entity="transportProvider"
                @update:data="tpName = $event"
            />
            <FieldInput
                class="col-span-full"
                field-name="transportId"
                placeholder="Ingresar sólo números"
                title="CUIT / CUIL"
                mask="#*"
                :data="tpId"
                require-validation
                entity="transportProvider"
                validation-type="extension"
                :char-amount="{ min: 11, max: 11 }"
                @update:data="tpId = $event"
            />
            <FieldInput
                class="col-span-full"
                field-name="address"
                placeholder="Ingresar Domicilio"
                title="Domicilio"
                :data="tpAddress"
                @update:data="tpAddress = $event"
            />
            <FieldTextArea
                class="col-span-full"
                field-name="observations"
                placeholder=""
                title="Observaciones"
                :rows="5"
                is-fixed
                is-optional
                :data="tpObservations"
                @update:data="tpObservations = $event"
            />
        </FieldGroup>
        <FieldGroup>
            <FieldLegend>Contacto principal</FieldLegend>
            <FieldInput
                class="col-span-full"
                title="Nombre y apellido"
                field-name="repName"
                placeholder=""
                :data="crName"
                require-validation
                entity="transportProvider"
                @update:data="crName = $event"
            />
            <FieldInput
                class="col-span-full"
                title="Teléfono"
                field-name="repTel"
                placeholder="Ingresar sólo números"
                mask="#*"
                :data="crPhone"
                require-validation
                entity="transportProvider"
                @update:data="crPhone = $event"
            />
            <FieldInput
                class="col-span-full"
                title="Mail"
                field-name="repEmail"
                placeholder="empresa@mail.com"
                :data="crEmail"
                require-validation
                entity="transportProvider"
                validation-type="email"
                @update:data="crEmail = $event"
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    // *** SandProvider y TransportProvider tambien usan, deberiamos hacerlo genetico
    import { defineComponent } from 'vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import { useVModels } from '@vueuse/core';
    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            FieldLegend,
            FieldTextArea,
        },
        props: {
            tpName: {
                type: String,
                default: '',
            },
            tpId: {
                type: [String, Number],
                default: '12345678901',
            },
            tpAddress: {
                type: String,
                default: '',
            },
            tpObservations: {
                type: String,
                default: '',
            },
            crName: {
                type: String,
                default: '',
            },
            crPhone: {
                type: String,
                default: '123456789',
            },
            crEmail: {
                type: String,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { tpName, tpId, tpAddress, tpObservations, crName, crPhone, crEmail } = useVModels(props, emit);

            return {
                tpName,
                tpId,
                tpAddress,
                tpObservations,
                crName,
                crPhone,
                crEmail,
            };
        },
    });
</script>

<style lang="scss" scoped>
    fieldset:not(:last-of-type) {
        @apply border-b border-transparent pb-6;
    }
    h2 {
        @apply text-lg font-medium;
    }
</style>
