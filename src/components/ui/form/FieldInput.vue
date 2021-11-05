<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <input
            :id="fieldName"
            v-model="value"
            v-maska="mask"
            class="input"
            :type="type"
            :name="fieldName"
            :placeholder="placeholder"
            :readonly="isReadonly"
            @blur="checkValidation(false)"
        />
        <InvalidInputLabel
            v-if="v$.$invalid && wasInputEntered"
            :validation-type="validationType"
            :char-amount="charAmount"
        />
    </label>
</template>

<script>
    import { defineComponent, onMounted, onUpdated, ref, toRefs, watch } from 'vue';
    import { useVModel } from '@vueuse/core';
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
                default: '',
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
                required: false,
            },
            validationType: {
                type: String,
                required: false,
            },
            charAmount: {
                type: Object,
                required: false,
            },
            entity: {
                type: String,
                required: false,
            },
            silenced: {
                type: Boolean,
                required: false,
                default: null,
            },
        },
        setup(props, { emit }) {
            const value = useVModel(props, 'data', emit);
            const store = useStore();
            const { fieldName, entity, silenced } = toRefs(props);
            const requireValidation = ref(props.requireValidation) || false;
            const wasInputEntered = ref(false);
            const validationType = ref(props.validationType || 'empty');
            const charAmount = ref(props.charAmount || null);
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
                if (silenced.value) {
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
</style>
