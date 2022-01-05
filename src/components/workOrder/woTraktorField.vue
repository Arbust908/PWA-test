<template>
    <FieldGroup>
        <FieldLegend>Tractor / Chasis</FieldLegend>
        <TraktorGroup
            v-for="(traktor, traktorI) in traktors"
            :key="traktorI"
            :traktor-length="traktors.length"
            :traktor="traktor"
            @remove-traktor="removeTraktor"
        />

        <button class="mt-1 flex items-center col-span-full sm:col-span-6" @click.prevent="add">
            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
            <span class="font-bold"> Agregar tractor/chasis </span>
        </button>
    </FieldGroup>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, Ref } from 'vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import TraktorGroup from '@/components/workOrder/traktorGroup.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import { useVModel } from '@vueuse/core';
    import axios from 'axios';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        name: 'WoTraktorField',
        components: {
            FieldInput,
            FieldGroup,
            FieldLegend,
            FieldSelect,
            TraktorGroup,
            Icon,
            CircularBtn,
        },
        props: {
            traktors: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:traktors'],
        setup(props, { emit }) {
            const traktors = useVModel(props, 'traktors', emit);
            const tracktorInnerId = ref(0);

            const defaultTraktor = {
                innerId: 0,
                chassis: -1,
                supplier: -1,
                description: '',
            };

            if (traktors.value.length === 0) {
                traktors.value.push({ ...defaultTraktor });
            }

            traktors.value = traktors.value.map((traktor) => {
                traktor.innerId = traktor.innerId ?? tracktorInnerId.value;
                tracktorInnerId.value++;

                return traktor;
            });

            const add = (): void => {
                tracktorInnerId.value++;
                const newTraktorId = tracktorInnerId.value;
                traktors.value.push({
                    innerId: newTraktorId,
                    chassis: -1,
                    supplier: -1,
                    description: '',
                });
            };

            const removeTraktor = (innerId: number) => {
                const newTraktorsArray = ref([]);

                newTraktorsArray.value = traktors.value.filter((Traktor) => Traktor.innerId !== innerId);
                traktors.value = newTraktorsArray.value;
            };

            return {
                traktors,
                tracktorInnerId,
                add,
                removeTraktor,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .icon {
        @apply w-5 h-5;
    }
    .ghost {
        @apply border-none shadow-none;
        & > .icon {
            @apply text-transparent;
        }
    }
</style>
