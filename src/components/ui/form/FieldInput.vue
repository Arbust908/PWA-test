<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" :isOptional="isOptional" />
    <input
      :id="fieldName"
      class="input"
      :type="type"
      :name="fieldName"
      :placeholder="placeholder"
      :readonly="isReadonly"
      v-model="value"
      v-maska="mask"
      @blur="initiateValidations"
    />
    <InvalidInputLabel v-if="!isValid && wasInputEntered" :validationType="validationType"/>
  </label>
</template>

<script>
  import { computed, defineComponent, ref, toRefs } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska } from 'maska';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  import useVuelidate from '@vuelidate/core'
  import {required, email} from '@vuelidate/validators'
  import InvalidInputLabel from '../InvalidInputLabel.vue';

  export default defineComponent({
    directives: { maska },
    name: 'FieldInput',
    components: {
      FieldTitle,
      InvalidInputLabel    
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
        required: false
      },
      validationType: {
        type: String,
        required: false
      }
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      const {requireValidation, fieldName} = toRefs(props)
      const wasInputEntered = ref(false)
      const validationType = ref(props.validationType || "empty")
      const validationRules = ref({})
      const state = {
        [`${fieldName.value}`]: value
      }

      if(requireValidation.value) {
        validationRules.value = {
          [`${fieldName.value}`]: {required}
        }
      }

      const v$ = useVuelidate(validationRules, state)

      const initiateValidations = () => {
        wasInputEntered.value = true
      }

      const isValid = computed(() => {
        if(!wasInputEntered.value) return true
        if(!v$.value.$silentErrors[0]) return true
        return v$.value.$silentErrors[0].$propertyPath == fieldName ? true : false
      })

      return {
        value,
        ...props,
        v$,
        fieldName,
        isValid,
        initiateValidations,
        wasInputEntered,
        validationType
      };
    },
  });
</script>

<style lang="scss" scoped>
  @import '@/assets/inputs.scss';
</style>
