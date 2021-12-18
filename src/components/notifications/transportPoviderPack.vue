<script setup lang="ts">
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';

    const props = defineProps({
        transportProviderId: {
            type: Number,
            required: true,
        },
        amount: {
            type: [Number, String],
            default: 0,
        },
        observation: {
            type: String,
            default: '',
        },
    });
    const emits = defineEmits(['update:transportProviderId', 'update:amount', 'update:observation']);

    const { transportProviderId: tpId, amount: amu, observation: obs } = useVModels(props, emits);
</script>

<template>
    <fieldset class="py-2 w-full grid grid-cols-12 gap-3 md:gap-4">
        <h2 class="col-span-full text-xl mt-4">Transporte</h2>
        <FieldSelect
            v-model:data="tpId"
            title="Proveedor"
            class="col-span-full sm:col-span-5"
            :field-name="`transportProvider`"
            placeholder="Seleccionar"
            endpoint="/transportProvider"
        />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldInput
                v-model:data="amu"
                class="col-span-full sm:col-span-3 bg-transparent"
                :field-name="`transportAmount`"
                title="Camiones"
                placeholder="Camiones"
                mask="####"
                required-validation
                validation-type="extension"
                :char-amount="{ min: 1, max: 4 }"
            />
            <FieldInput
                v-model:data="obs"
                class="col-span-full sm:col-span-5"
                :field-name="`transportObservations`"
                placeholder="Observaciones"
                title="Observaciones"
                is-optional
            />
        </div>
    </fieldset>
</template>

<style scoped></style>
