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
    </label>
</template>

<script setup lang="ts">
    import { maska as vMaska } from 'maska';
    import FieldTitle from '@/components/ui/form/FieldTitle.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    const props = defineProps({
        data: {
            type: [String, Number],
            default: 0,
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
            default: 1,
        },
    });

    const emits = defineEmits([]);

    const value = useVModel(props, 'data', emits);
    const cssPre = useCssVar('--pre', 0);
    const cssPost = useCssVar('--post', 0);

    watch(value, (data, oldData) => {
        if (Number(data) < 1 && props.maxNumberAmount) {
            value.value = 1;
        } else if (Number(data) > props.maxNumberAmount) {
            value.value = props.maxNumberAmount;
        } else {
            value.value = Number(data);
        }
    });

    if (props.pre) {
        cssPre.value = props.pre.width ?? '20%';
    }

    if (props.post) {
        cssPost.value = props.post.width ?? '20%';
    }

    const used = ref(false);
    const usedInput = () => {
        used.value = true;
    };

    const numberValidation = computed(() => {
        return props.numberValidation && Number(value.value) <= 0 ? true : null;
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/inputs.scss';

    .error {
        @apply border-red-500;
    }
</style>
