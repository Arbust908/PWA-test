<template>
    <form method="POST" action="/" class="p-4" @submit.prevent>
        <FieldGroup>
            <FieldInput
                v-model:data="newType"
                class="col-span-full"
                field-name="sandMesh"
                placeholder="Ingrese tipo de malla"
                title="Tipo de malla"
                require-validation
                entity="sand"
            />
            <FieldTextArea
                v-model:data="newObs"
                class="col-span-full"
                field-name="observations"
                placeholder="Observaciones..."
                title="Observaciones"
                :rows="5"
                is-optional
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            FieldTextArea,
        },
        props: {
            type: {
                type: String,
                default: '',
            },
            observations: {
                type: String,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { type: newType, observations: newObs } = useVModels(props, emit);

            return {
                newType,
                newObs,
            };
        },
    });
</script>

<style></style>
