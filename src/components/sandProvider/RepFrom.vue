<template>
    <FieldGroup>
        <FieldLegend class="font-semibold">Contacto principal</FieldLegend>
        <FieldInput
            v-model:data="repName"
            class="col-span-full"
            title="Nombre y apellido"
            field-name="sandRepName"
            placeholder=""
            require-validation
            entity="sandProvider"
        />
        <FieldInput
            v-model:data="repPhone"
            class="col-span-full"
            title="Teléfono"
            field-name="sandRepPhone"
            placeholder="Ingrese sólo números"
            mask="#*"
            require-validation
            validation-type="numeric"
            entity="sandProvider"
        />
        <FieldInput
            v-model:data="repEmail"
            class="col-span-full"
            title="Email"
            field-name="sandRepEmail"
            placeholder="empresa@mail.com"
            require-validation
            validation-type="email"
            entity="sandProvider"
        />
    </FieldGroup>
</template>

<script lang="ts">
    // *** SandProvider y TransportProvider tambien usan, deberiamos hacerlo genetico
    import { defineComponent } from 'vue';
    import { useVModels } from '@vueuse/core';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        components: {
            FieldLegend,
            FieldInput,
            FieldGroup,
        },
        props: {
            repName: {
                type: String,
                default: '',
            },
            repPhone: {
                type: Number,
                default: 0,
            },
            repEmail: {
                type: String,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { repName, repPhone, repEmail } = useVModels(props, emit);

            return { repName, repPhone, repEmail };
        },
    });
</script>
