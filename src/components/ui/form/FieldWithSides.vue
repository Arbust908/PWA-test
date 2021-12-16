<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <div class="input_side">
            <span v-if="pre" class="pre" :title="pre.title">{{ pre.value }}</span>
            <input
                :id="fieldName"
                v-model="value"
                v-maska="mask"
                :maxlength="maxlength"
                :class="[pre ? null : 'n-pre', post ? null : 'n-post']"
                :type="type"
                :name="fieldName"
                :placeholder="placeholder"
                @blur="checkValidation(false)"
            />
            <span v-if="post" class="post text-center" :title="post.title">{{ post.value }}</span>
        </div>
        <InvalidInputLabel
            v-if="v$.$invalid && wasInputEntered"
            :validation-type="validationType"
            :char-amount="charAmount"
        />
        <!-- v-if con la validacion -->
        <!-- Lo dejamos -->
    </label>
</template>

<script>
    import { defineComponent, ref, toRefs, watch, onMounted, onUpdated } from 'vue';
    import { useRoute } from 'vue-router';
    import { useVModel, useCssVar } from '@vueuse/core';
    import { maska } from 'maska';
    import FieldTitle from '@/components/ui/form/FieldTitle.vue';
    import useVuelidate from '@vuelidate/core';
    import InvalidInputLabel from '../InvalidInputLabel.vue';
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
            pre: {
                type: Object,
                default: null,
            },
            post: {
                type: Object,
                default: null,
            },
            maxlength: {
                type: Number,
                required: false,
                default: null,
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
            const route = useRoute();
            const value = useVModel(props, 'data', emit);
            const cssPre = useCssVar('--pre', 0);
            const cssPost = useCssVar('--post', 0);
            //Validation settings
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

            //Props
            if (props.pre) {
                cssPre.value = props.pre.width ?? '20%';
            }

            if (props.post) {
                cssPost.value = props.post.width ?? '20%';
            }

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
