<template>
    <form method="POST" action="/" class="p-4" @submit.prevent>
        <FieldGroup>
            <FieldInput
                class="col-span-full"
                field-name="sandMesh"
                placeholder="Ingrese tipo de malla"
                title="Tipo de malla"
                :data="type"
                require-validation
                entity="sand"
                @update:data="type = $event"
            />
            <FieldTextArea
                class="col-span-full"
                field-name="observations"
                placeholder="Observaciones..."
                title="Observaciones"
                :rows="5"
                is-optional
                :data="observations"
                @update:data="observations = $event"
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import { useVModels } from '@vueuse/core';
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
            const { type, observations } = useVModels(props, emit);

            return {
                type,
                observations,
            };
        },
    });
</script>

<style></style>
