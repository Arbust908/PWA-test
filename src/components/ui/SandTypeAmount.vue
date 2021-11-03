<template>
    <td>
        <FieldSelect
            :field-name="`sandType${mod}`"
            placeholder="Seleccionar"
            endpoint="/sand"
            endpoint-key="type"
            :data="sandId"
            @update:data="sandId = $event"
        />
        <FieldWithSides
            :field-name="`sandQuantity${mod}`"
            placeholder="X t"
            type="number"
            :post="{ title: 'Peso en Toneladas', value: 't' }"
            :data="quantity"
            @update:data="quantity = $event"
        />
    </td>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useVModels } from '@vueuse/core';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';

    export default defineComponent({
        components: {
            FieldSelect,
            FieldWithSides,
        },
        props: {
            sandId: {
                type: Number,
                default: -1,
            },
            quantity: {
                type: Number,
                default: 0,
            },
            mod: {
                type: [Number, String],
                default: '',
            },
        },
        setup(props, { emit }) {
            const { sandId, quantity } = useVModels(props, emit);

            return {
                FieldSelect,
                FieldWithSides,
                sandId,
                quantity,
            };
        },
    });
</script>

<style lang="scss" scoped>
    td {
        @apply text-gray-500 px-3 py-4 whitespace-nowrap text-sm max-w-[8rem];
    }
</style>
