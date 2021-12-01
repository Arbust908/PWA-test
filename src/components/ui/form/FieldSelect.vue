<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <!-- TODO: Dropdown con Busqueda -->
        <!-- TODO: Options con entrada cheta -->
        <!-- TODO: StoreLogic -->
        <select
            :id="fieldName"
            v-model.number="value"
            class="input"
            :class="noOptionSelected && 'unselected'"
            :name="fieldName"
            :disabled="isDisabled"
            @blur="$emit('is-blured')"
        >
            <option selected value="-1">
                {{ placeholder }}
            </option>
            <option v-for="(res, i) in resources" :key="res?.id + i" :value="res?.id">
                {{ res[endpointKey] }}
            </option>
            <option v-for="(res, i) in epData" :key="res?.id + i" :value="res?.id">
                {{ res[endpointKey] }}
            </option>
        </select>
    </label>
</template>

<script>
    import { defineComponent, computed, ref, toRefs, watchEffect } from 'vue';
    import { useVModel } from '@vueuse/core';
    import { useApi } from '@/helpers/useApi';
    import { addVisibleFilter } from '@/helpers/useUrlHelpers';
    import FieldTitle from '@/components/ui/form/FieldTitle.vue';

    export default defineComponent({
        name: 'FieldSelect',
        components: {
            FieldTitle,
        },
        props: {
            data: {
                default: '',
            },
            fieldName: {
                type: String,
                default: 'select',
            },
            placeholder: {
                type: String,
                default: 'Seleccione',
            },
            title: {
                type: String,
                default: null,
            },
            endpoint: {
                type: String,
                default: '/',
            },
            endpointKey: {
                type: String,
                default: 'name',
            },
            endpointData: {
                type: Array,
                default: null,
            },
            isOptional: {
                type: Boolean,
                default: false,
            },
            filteredData: {
                type: Array,
                required: false,
                default: null,
            },
            requireValidation: {
                type: Boolean,
                required: false,
            },
            validationType: {
                type: String,
                required: false,
                default: null,
            },
            entity: {
                type: String,
                required: false,
                default: null,
            },
            isDisabled: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { filteredData } = toRefs(props);
            const value = useVModel(props, 'data', emit);
            const endpointData = useVModel(props, 'endpointData', emit);
            const getApiVal = () => {
                const endpoint = addVisibleFilter(props.endpoint);
                const { read } = useApi(endpoint);

                return read();
            };
            let resources = ref([]);

            const epData = computed(() => {
                return props.endpoint === '/' ? endpointData.value : null;
            });

            if (props.endpoint !== '/' && props.endpoint !== null && !props.filteredData) {
                resources = getApiVal();
                console.log(resources.value);
            }

            watchEffect(() => {
                if (props.filteredData && props.filteredData.length > 0) {
                    resources.value = filteredData.value;
                }
                console.log(resources.value);
            });

            const noOptionSelected = computed(() => value.value === -1);

            return {
                value,
                resources,
                epData,
                filteredData,
                ...props,
                noOptionSelected,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';
</style>

<style scoped>
    .unselected {
        color: #a6a6a6;
    }
    .unselected option {
        color: black;
    }
    .unselected option:first-child {
        color: #a6a6a6;
    }
</style>
