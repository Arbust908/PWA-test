<template>
    <FieldGroup>
        <FieldLegend>Contacto principal</FieldLegend>
        <FieldInput
            class="col-span-full"
            title="Nombre y apellido"
            field-name="sandRepName"
            placeholder=""
            :data="repName"
            require-validation
            entity="sandProvider"
            @update:data="repName = $event"
        />
        <FieldInput
            class="col-span-full"
            title="Teléfono"
            field-name="sandRepPhone"
            placeholder="Ingrese sólo números"
            mask="#*"
            :data="repPhone"
            require-validation
            validation-type="numeric"
            entity="sandProvider"
            @update:data="repPhone = $event"
        />
        <FieldInput
            class="col-span-full"
            title="Email"
            field-name="sandRepEmail"
            placeholder="empresa@mail.com"
            :data="repEmail"
            require-validation
            validation-type="email"
            entity="sandProvider"
            @update:data="repEmail = $event"
        />
    </FieldGroup>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useVModels } from '@vueuse/core';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            FieldTextArea,
            FieldLegend,
            Icon,
        },
        props: {
            repName: {
                type: String,
                default: '',
            },
            repPhone: {
                type: String,
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
