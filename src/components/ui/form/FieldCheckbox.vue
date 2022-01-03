<template>
    <label :for="fieldName">
        <input
            :id="fieldName"
            v-model="value"
            class="input"
            type="checkbox"
            :name="fieldName"
            :placeholder="placeholder"
            @blur="checkValidation(false)"
        />
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <InvalidInputLabel
            v-if="v$.$invalid && wasInputEntered"
            :validation-type="validationType"
            :char-amount="charAmount"
        />
    </label>
</template>

<script lang="ts">
    import { maska } from 'maska';
    import FieldTitle from '@/components/ui/form/FieldTitle.vue';
    import useVuelidate from '@vuelidate/core';
    import { required, email, minLength, maxLength, numeric } from '@vuelidate/validators';
    import InvalidInputLabel from '../InvalidInputLabel.vue';
    import { useStore } from 'vuex';
    import { useRoute } from 'vue-router';

    export default defineComponent({
        name: 'FieldInput',
        directives: { maska },
        components: {
            FieldTitle,
            InvalidInputLabel,
        },
        props: {
            data: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'text',
            },
            fieldName: {
                type: String,
                default: 'input',
            },
            placeholder: {
                type: String,
                default: 'Input',
            },
            title: {
                type: [String, null],
                default: null,
            },
            mask: {
                type: [String, Array],
                default: '',
            },
            isOptional: {
                type: Boolean,
                default: false,
            },
            isReadonly: {
                type: Boolean,
                default: false,
            },
            requireValidation: {
                type: Boolean,
                default: false,
            },
            validationType: {
                type: String,
                default: 'empty',
            },
            charAmount: {
                type: Object,
                default: null,
            },
            entity: {
                type: String,
                default: '',
            },
            silenced: {
                type: Boolean,
                default: null,
            },
            maxlength: {
                type: Number,
                default: null,
            },
        },
        setup(props, { emit }) {
            const value = useVModel(props, 'data', emit);
            const store = useStore();
            const { fieldName, entity, silenced, validationType, charAmount, requireValidation } = toRefs(props);
            const wasInputEntered = ref(false);
            const validationRules = ref({});
            const state = {
                [fieldName.value]: value,
            };

            const getCharsAmountRule = (charsRule) => {
                if (charsRule.min && charsRule.max) {
                    return { minLength: minLength(charsRule.min), maxLength: maxLength(charsRule.max), required };
                }

                if (charsRule.min && !charsRule.max) {
                    return { minLength: minLength(charsRule.min), required };
                }

                if (!charsRule.min && charsRule.max) {
                    return { maxLength: maxLength(charsRule.max), required };
                }
            };

            if (requireValidation.value) {
                if (validationType.value == 'empty') {
                    validationRules.value = {
                        [`${fieldName.value}`]: { required },
                    };
                }

                if (validationType.value == 'numeric') {
                    validationRules.value = {
                        [`${fieldName.value}`]: { required, numeric },
                    };
                }

                if (validationType.value == 'email') {
                    validationRules.value = {
                        [`${fieldName.value}`]: { required, email },
                    };
                }

                if (validationType.value == 'extension') {
                    validationRules.value = {
                        [`${fieldName.value}`]: getCharsAmountRule(charAmount.value),
                    };
                }
            }

            const v$ = useVuelidate(validationRules, state);
            const route = useRoute();

            const updateValidationState = (fieldName, validationsPassed, entity) => {
                if (silenced.value || entity.value) {
                    return;
                }
                store.dispatch(`${entity}UpdateValidation`, { fieldName, validationsPassed, entity });
            };

            const checkValidation = (isTheFirstUse) => {
                if (!requireValidation.value) {
                    return;
                }

                if (!isTheFirstUse && !wasInputEntered.value) {
                    wasInputEntered.value = true;
                }
                updateValidationState(fieldName.value, !v$.value.$invalid, entity.value);
            };

            watch(silenced, (newSilencedVal, oldSilencedVal) => {
                if (oldSilencedVal == true && newSilencedVal == false) {
                    updateValidationState(fieldName.value, !v$.value.$invalid, entity.value);
                }

                if (oldSilencedVal == false && newSilencedVal == true) {
                    wasInputEntered.value = false;
                    store.dispatch(`${entity.value}DeleteValidation`, fieldName.value);
                }
            });

            onMounted(() => {
                // Si es new, ejecuta.
                if (route.path.includes('nuevo') || route.path.includes('nueva')) {
                    checkValidation(true);
                }
            });

            onUpdated(() => {
                // Si es edit, ejecuta.
                if (!route.path.includes('nuevo') && !route.path.includes('nueva')) {
                    checkValidation(true);
                }
            });

            return {
                value,
                ...props,
                v$,
                fieldName,
                wasInputEntered,
                validationType,
                charAmount,
                checkValidation,
                silenced,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';
    label {
        @apply flex-row gap-2 items-center;
    }
</style>
