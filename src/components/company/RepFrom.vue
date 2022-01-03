<template>
    <FieldGroup>
        <FieldLegend>Contacto principal</FieldLegend>
        <FieldInput
            v-model:data="name"
            class="col-span-full"
            title="Nombre y apellido"
            field-name="sandRepName"
            placeholder="Nombre de representante"
            require-validation
            :entity="repEntity"
        />
        <FieldInput
            v-model:data="phone"
            class="col-span-full"
            title="Teléfono"
            field-name="sandRepPhone"
            placeholder="Ingrese sólo números"
            mask="#*"
            require-validation
            validation-type="numeric"
            :entity="repEntity"
        />
        <FieldInput
            v-model:data="mail"
            class="col-span-full"
            title="Email"
            field-name="sandRepEmail"
            placeholder="empresa@mail.com"
            require-validation
            validation-type="email"
            :entity="repEntity"
        />
    </FieldGroup>
</template>

<script setup lang="ts">
    // *** SandProvider y TransportProvider tambien usan, deberiamos hacerlo genetico
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';

    const props = defineProps({
        repName: {
            type: String,
            default: '',
        },
        repPhone: {
            type: String,
            default: '',
        },
        repEmail: {
            type: String,
            default: '',
        },
        repEntity: {
            type: String,
            default: '',
        },
    });

    const emits = defineEmits(['update:repName', 'update:repPhone', 'update:repEmail']);
    const { repName: name, repPhone: phone, repEmail: mail } = useVModels(props, emits);
</script>
