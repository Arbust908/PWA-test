<template>
    <form method="POST" action="/" class="p-4 w-full flex flex-col lg:flex-row" @submit.prevent>
        <FieldGroup>
            <FieldInput
                class="col-span-full"
                field-name="name"
                placeholder="Nombre de Forklift"
                title="Nombre"
                :data="forklift.name"
                require-validation
                entity="forklift"
                @update:data="forklift.name = $event"
            />
            <FieldTextArea
                class="col-span-full"
                field-name="observations"
                placeholder="Observaciones..."
                title="Observaciones"
                :rows="5"
                is-optional
                :data="forklift.observations"
                @update:data="forklift.observations = $event"
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { useVModel } from '@vueuse/core';
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
            forklift: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            const forklift = useVModel(props, 'forklift', emit);

            return {
                forklift,
            };
        },
    });
</script>
