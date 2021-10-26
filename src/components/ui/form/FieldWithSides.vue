<template>
    <label :for="fieldName">
        <FieldTitle v-if="title" :title="title" :is-optional="isOptional" />
        <div class="input_side">
            <span v-if="pre" class="pre" :title="pre.title">{{ pre.value }}</span>
            <input
                :id="fieldName"
                v-model="value"
                v-maska="mask"
                :class="[pre ? null : 'n-pre', post ? null : 'n-post']"
                :type="type"
                :name="fieldName"
                :placeholder="placeholder"
            />
            <span v-if="post" class="post text-center" :title="post.title">{{ post.value }}</span>
        </div>
    </label>
</template>

<script>
    import { defineComponent, watch } from 'vue';
    import { useVModel, useCssVar } from '@vueuse/core';
    import { maska } from 'maska';
    import FieldTitle from '@/components/ui/form/FieldTitle.vue';
    export default defineComponent({
        name: 'FieldInput',
        directives: { maska },
        components: { FieldTitle },
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
        },
        setup(props, { emit }) {
            const value = useVModel(props, 'data', emit);
            const cssPre = useCssVar('--pre', 0);
            const cssPost = useCssVar('--post', 0);

            if (props.pre) {
                cssPre.value = props.pre.width ?? '20%';
            }

            if (props.post) {
                cssPost.value = props.post.width ?? '20%';
            }

            return {
                value,
                ...props,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';
</style>
