<template>
    <FieldGroup>
        <FieldInput
            v-model:data="cName"
            class="col-span-full"
            field-name="name"
            placeholder="Nombre y apellido / Razón social"
            title="Nombre y apellido / Razón social"
            require-validation
            entity="client"
        />
        <FieldInput
            v-model:data="cLegalId"
            class="col-span-full"
            field-name="legalId"
            placeholder="CUIL / CUIT"
            mask="#*"
            title="CUIL / CUIT"
            require-validation
            entity="client"
            validation-type="extension"
            :char-amount="{ min: 11, max: 11 }"
        />
        <FieldInput
            v-model:data="cAddress"
            class="col-span-full"
            field-name="address"
            placeholder="Domicilio"
            title="Domicilio"
            require-validation
            entity="client"
        />
        <FieldCheckbox v-model:data="cIsOperator" class="col-span-6" title="Es operadora" field-name="operator" />
        <FieldTextArea
            v-model:data="cObservations"
            class="col-span-full"
            field-name="observations"
            placeholder="Observaciones..."
            title="Observaciones"
            :rows="4"
            is-optional
        />
    </FieldGroup>
</template>

<script setup lang="ts">
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import FieldCheckbox from '@/components/ui/form/FieldCheckbox.vue';

    const props = defineProps({
        name: {
            type: String,
            default: '',
        },
        legalId: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        isOperator: {
            type: Boolean,
            default: false,
        },
        observations: {
            type: String,
            default: '',
        },
    });

    const emits = defineEmits([
        'update:name',
        'update:legalId',
        'update:address',
        'update:isOperator',
        'update:observations',
    ]);

    const {
        name: cName,
        legalId: cLegalId,
        address: cAddress,
        isOperator: cIsOperator,
        observations: cObservations,
    } = useVModels(props, emits);
</script>
