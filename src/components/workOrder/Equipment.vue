<template>
    <form method="POST" action="/" class="p-4">
        <div class="flex flex-col md:flex-row gap-6 md:gap-8 xl:gap-16">
            <FieldGroup>
                <FieldLegend>Cradle</FieldLegend>
                <FieldSelect
                    v-model:data="operativeCradleId"
                    class="col-span-full"
                    field-name="operativeCradle"
                    placeholder="Selecciona un operativo"
                    title="Operativo"
                    endpoint="/cradle"
                />
                <!-- agregar props con arrays ya filtrados de los que estan en uso -->
                <FieldSelect
                    v-model:data="backupCradleId"
                    class="col-span-full"
                    field-name="backupCradle"
                    placeholder="Selecciona un backup"
                    title="Backup"
                    endpoint="/cradle"
                />
            </FieldGroup>
            <FieldGroup>
                <FieldLegend>Forklift</FieldLegend>
                <FieldSelect
                    v-model:data="operativeForkliftId"
                    class="col-span-full"
                    field-name="operativeForklift"
                    placeholder="Selecciona un operativo"
                    title="Operativo"
                    endpoint="/forklift"
                />
                <FieldSelect
                    v-model:data="backupForkliftId"
                    class="col-span-full"
                    field-name="backupForklift"
                    placeholder="Selecciona un backup"
                    title="Backup"
                    endpoint="/forklift"
                />
            </FieldGroup>
        </div>
        <TracktorField v-model:traktors="traktors" />
        <PickupField :pickups="pickups" @update:pickups="pickups = $event" />
        <FieldGroup class="max-w-lg">
            <FieldLegend>Equipamiento</FieldLegend>
            <FieldInput
                class="col-span-6 sm:col-span-4"
                title="Rigmats"
                field-name="rigmats"
                placeholder="Rigmats"
                mask="#*"
                :data="rigmats"
                @update:data="rigmats = Number($event)"
            />
            <FieldInput
                class="col-span-6 sm:col-span-4"
                title="Conex"
                field-name="conex"
                placeholder="Conex"
                mask="#*"
                :data="conex"
                @update:data="conex = Number($event)"
            />
            <FieldInput
                class="col-span-6 sm:col-span-4"
                title="Generador de apoyo"
                field-name="generators"
                placeholder="Generador de apoyo"
                mask="#*"
                :data="generators"
                @update:data="generators = Number($event)"
            />
            <FieldInput
                class="col-span-6 sm:col-span-4"
                title="Torre de iluminación"
                field-name="tower"
                placeholder="Torre de iluminación"
                mask="#*"
                :data="tower"
                @update:data="tower = Number($event)"
            />
            <FieldInput
                class="col-span-full sm:col-span-4"
                title="Cabina de operador"
                field-name="cabin"
                placeholder="Cabina de operador"
                mask="#*"
                :data="cabin"
                @update:data="cabin = Number($event)"
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { ref, watchEffect, defineComponent, computed } from 'vue';
    import { useVModels } from '@vueuse/core';

    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import TracktorField from '@/components/workOrder/woTraktorField.vue';
    import PickupField from '@/components/workOrder/woPickupField.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import axios from 'axios';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldSelect,
            FieldInput,
            FieldLegend,
            Icon,
            TracktorField,
            PickupField,
            CircularBtn,
        },
        props: {
            operativeCradleId: {
                type: Number,
                required: true,
            },
            backupCradleId: {
                type: Number,
                required: true,
            },
            operativeForkliftId: {
                type: Number,
                required: true,
            },
            backupForkliftId: {
                type: Number,
                required: true,
            },
            traktors: {
                type: Array,
                default: () => [],
            },
            pickups: {
                type: Array,
                default: () => [],
            },
            rigmats: {
                type: Number,
                required: true,
            },
            conex: {
                type: Number,
                required: true,
            },
            generators: {
                type: Number,
                required: true,
            },
            tower: {
                type: Number,
                required: true,
            },
            cabin: {
                type: Number,
                required: true,
            },
            isFull: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const {
                operativeCradleId,
                backupCradleId,
                operativeForkliftId,
                backupForkliftId,
                traktors,
                pickups,
                rigmats,
                conex,
                generators,
                tower,
                cabin,
                isFull,
            } = useVModels(props, emit);

            onMounted(async () => {
                const WOsData = await axios.get(`${api}/workOrder`);
                WOs.value = WOsData.data.data;
                console.log(WOs.value);

                const cradlesData = await axios.get(`${api}/workOrder`);
                backupCradles.value = cradlesData.data.data;
                console.log(backupCradles.value);

                const forkliftData = await axios.get(`${api}/workOrder`);
                backupForklifts.value = forkliftData.data.data;
                console.log(backupForklifts.value);
            });

            const WOs = ref([]);
            const backupCradles = ref([]);
            const backupForklifts = ref([]);

            const firstTracktorFull = computed(() => {
                const trackto = traktors.value[0];

                return trackto.chassis !== -1 && trackto.supplier !== -1;
            });
            const firstPickupFull = computed(() => {
                const pickup = pickups.value[0];

                return pickup.pickup_id !== '';
            });

            watchEffect(() => {
                isFull.value = !!(
                    operativeCradleId.value >= 0 &&
                    operativeForkliftId.value >= 0 &&
                    traktors.value.length &&
                    pickups.value.length &&
                    firstTracktorFull.value &&
                    firstPickupFull.value &&
                    conex.value >= 0 &&
                    generators.value >= 0 &&
                    rigmats.value >= 0 &&
                    tower.value >= 0 &&
                    cabin.value >= 0
                );
            });

            return {
                operativeCradleId,
                backupCradleId,
                operativeForkliftId,
                backupForkliftId,
                traktors,
                pickups,
                rigmats,
                conex,
                generators,
                tower,
                cabin,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .input-block select,
    .input-block input {
        @apply w-full rounded mb-3 p-2;
    }

    .pit-block {
        @apply flex mt-1 items-center w-full mb-3;
        & select,
        & input {
            @apply rounded p-2 max-w-md inline-block w-full;
        }
    }

    fieldset {
        @apply mb-6;
    }
    label {
        @apply text-sm;
    }
</style>
