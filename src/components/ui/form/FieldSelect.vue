<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <!-- TODO: Options con entrada cheta -->
        <!-- TODO: StoreLogic -->

        <el-select
            :id="fieldName"
            class="searchSelect mt-2"
            :popper-class="'font-title text-base border-0'"
            :fit-input-width="false"
            v-model.number="value"
            :class="selectClasses"
            :name="fieldName"
            :disabled="isDisabled"
            @blur="$emit('is-blured')"
            @change="$emit('change', value)"
            @visible-change="$emit('click')"
            filterable
            placeholder="placeholder"
        >
            <el-option selected :key="-1" :label="placeholder" :value="-1"> </el-option>
            <el-option v-for="(res, i) in resources" :key="res?.id" :label="res[endpointKey]" :value="res?.id" />
            <el-option v-for="(res, i) in epData" :key="res?.id" :label="res[endpointKey]" :value="res?.id" />
        </el-select>
    </label>
</template>

<script>
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
                type: [Array, Object, Boolean, String, Number],
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
            // ***
            onlyVisible: {
                type: Boolean,
                default: true,
            },
            selectClass: {
                type: Boolean,
            },
        },
        setup(props, { emit }) {
            const value = useVModel(props, 'data', emit);
            if (value.value == null) {
                value.value = -1;
            }
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

            if (props.endpoint !== '/' && props.endpoint !== null) {
                resources = getApiVal();
            }

            const noOptionSelected = computed(() => value.value === -1);

            const selectClasses = computed(() => {
                return props.selectClass && props.requireValidation && value.value === -1 ? 'error' : null;
            });

            return {
                value,
                resources,
                epData,
                ...props,
                noOptionSelected,
                selectClasses,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';
    .unselected {
        color: #a6a6a6;
    }
    .unselected option {
        color: black;
    }
    .unselected option:first-child {
        color: #a6a6a6;
    }
    .error {
        @apply border-red-500;
    }
</style>

<style>
    .error.el-select .el-input__inner {
        @apply border border-red-500;
    }
    .searchSelect .el-input .el-input__inner {
        @apply h-12 text-base text-black focus:border-indigo-500 ease-out duration-75;
    }
    .searchSelect .icon {
        @apply text-black font-black;
    }
    -el-popper {
        @apply mt-0;
    }
    .el-select-dropdown__item.selected {
        @apply text-white bg-blue-500 font-normal;
    }
</style>
