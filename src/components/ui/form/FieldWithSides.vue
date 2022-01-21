<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <div class="input_side">
            <span v-if="pre" class="pre" :title="pre.title">{{ pre.value }}</span>
            <input
                :id="fieldName"
                v-model="value"
                v-maska="mask"
                :class="[numberValidation && used ? 'error' : null, pre ? null : 'n-pre', post ? null : 'n-post']"
                :type="type"
                :name="fieldName"
                :placeholder="placeholder"
                :max="maxNumberAmount"
                @blur="usedInput"
                @click="print"
            />
            <span v-if="post" class="post text-center" :title="post.title">{{ post.value }}</span>
        </div>
        <InvalidInputLabel v-if="numberValidation && used" class="text-xs" :validation-type="validationType" />
        <!-- v-if con la validacion -->
        <!-- Lo dejamos -->
    </label>
</template>

<script>
        import { defineComponent, watch } from 'vue';
        import { useRoute } from 'vue-router';
        import { useVModel, useCssVar } from '@vueuse/core';
        import { maska } from 'maska';
        import FieldTitle from '@/components/ui/form/FieldTitle.vue';
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
                validationType: {
                    type: String,
                    required: true,
                },
                numberValidation: {
                    type: Boolean,
                },
                maxNumberAmount: {
                    type: Number,
                },
            },
    <<<<<<< Updated upstream
    =======
            fieldName: {
                type: String,
                default: 'input',
            },
            placeholder: {
                type: String,
                default: 'Input',
            },
            title: {
                type: String,
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
            validationType: {
                type: String,
                required: true,
            },
            numberValidation: {
                type: Boolean,
                default: false,
            },
            maxNumberAmount: {
                type: Number,
                required: false,
            },
        });
    >>>>>>> Stashed changes

            setup(props, { emit }) {
                const route = useRoute();
                const value = useVModel(props, 'data', emit);
                const cssPre = useCssVar('--pre', 0);
                const cssPost = useCssVar('--post', 0);

                watch(value, (data, oldData) => {
                    if (data < 1 && props.maxNumberAmount) {
                        props.data = 1;
                    } else if (data > props.maxNumberAmount) {
                        value.value = props.maxNumberAmount;
                    } else {
                        value.value = data;
                    }
                });

    <<<<<<< Updated upstream
                if (props.pre) {
                    cssPre.value = props.pre.width ?? '20%';
                }
    =======
        watch(value, (data, oldData) => {
            if (Number(data) < 1 && props.maxNumberAmount) {
                value.value = 0;
            } else if (Number(data) > props.maxNumberAmount) {
                value.value = props.maxNumberAmount;
            } else {
                value.value = Number(data);
            }
        });
    >>>>>>> Stashed changes

                if (props.post) {
                    cssPost.value = props.post.width ?? '20%';
                }

                const used = ref(false);
                const usedInput = () => {
                    used.value = true;
                };

                const numberValidation = computed(() => {
                    return props.numberValidation && value.value <= 0 ? true : null;
                });

                function print() {
                    console.log(props.numberValidation);
                }

                return {
                    value,
                    ...props,
                    numberValidation,
                    usedInput,
                    used,
                    print,
                };
            },
        });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';

    .error {
        @apply border-red-500;
    }
</style>
