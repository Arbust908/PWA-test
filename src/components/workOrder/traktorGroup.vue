<template>
    <FieldGroup class="relative col-span-full max-w-fit items-center flex">
        <FieldSelect
            v-model:data="traktor.supplier"
            class="col-span-full sm:col-span-6 lg:col-span-3"
            field-name="transportProvider"
            title="Proveedor"
            placeholder="Selecciona Proveedor"
            endpoint="/transportProvider"
            @change="sendDrivers"
        />
        <FieldSelect
            v-model:data="traktor.chassis"
            class="col-span-full sm:col-span-6 lg:col-span-3"
            field-name="driverProvider"
            title="Transportistas"
            placeholder="Selecciona Transportista"
            :endpoint-data="driversFiltered"
        />
        <FieldInput
            class="col-span-full sm:col-span-6 lg:col-span-2"
            field-name="chassis"
            title="Patente camión"
            placeholder="AA123AA"
            is-readonly
            :data="filteredPlates[0]"
        />
        <FieldInput
            class="col-span-full sm:col-span-6 lg:col-span-2"
            field-name="chassis"
            title="Patente Acoplado"
            placeholder="101AA123AA"
            is-readonly
            :data="filteredPlates[1]"
        />
        <FieldInput
            v-model:data="traktor.description"
            class="col-span-9 sm:col-span-6 lg:col-span-10"
            :title="traktorI === firstTraktorIndex ? 'Descripción' : null"
            field-name="description"
            placeholder="Descripción de tractor"
            is-optional
        />
        <CircularBtn
            v-if="traktorLength > 1"
            class="btn__delete"
            :class="traktorI == 0 ? 'mt-6' : 'mt-2'"
            size="sm"
            @click.prevent="$emit('removeTraktor', traktor.innerId)"
        >
            <Icon icon="Trash" class="w-6 h-6" />
        </CircularBtn>
    </FieldGroup>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref } from 'vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import axios from 'axios';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            FieldInput,
            FieldGroup,
            FieldSelect,
            CircularBtn,
            Icon,
        },
        props: {
            traktor: {
                type: Object,
                required: true,
            },
            traktorLength: {
                type: Number,
                default: 0,
            },
            firstTraktorIndex: {
                type: Number,
                default: 0,
            },
        },
        emits: ['update: traktor', 'removeTraktor'],
        setup(props, { emit }) {
            const traktor = useVModel(props, 'traktor', emit);

            const drivers = ref([]);
            const driversFiltered = ref([]);

            onMounted(async () => {
                const result = await axios.get(`${api}/driver`);
                drivers.value = result.data.data;
            });

            const sendDrivers = () => {
                traktor.value.chassis = -1;

                if (traktor.value.supplier > -1) {
                    driversFiltered.value = drivers.value.filter(
                        (driver) => driver.transportProviderId === traktor.value.supplier
                    );

                    return driversFiltered;
                }
                driversFiltered.value = [];

                return [];
            };

            const filteredPlates = computed(() => {
                if (traktor.value.chassis > -1) {
                    let driverFinded = driversFiltered.value.find((driver) => driver.id === traktor.value.chassis);

                    if (driverFinded) {
                        const platesArray = [driverFinded.transportId, driverFinded.transportId2];

                        return platesArray;
                    }
                }

                return [];
            });

            return {
                sendDrivers,
                driversFiltered,
                filteredPlates,
                traktor,
            };
        },
    });
</script>
