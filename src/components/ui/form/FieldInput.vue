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
      @blur="initiateValidators"
    />
    <InvalidInputLabel v-if="!isValid && wasInputEntered" :validationType="validationType" :charAmount="charAmount"/>
  </label>
</template>

<script>
  import { computed, defineComponent, ref, toRefs, watchEffect } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska } from 'maska';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  import useVuelidate from '@vuelidate/core'
  import {required, email, minLength, maxLength, numeric} from '@vuelidate/validators'
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
      },
      charAmount: {
        type: Object,
        required: false
      }
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      const {requireValidation, fieldName} = toRefs(props)
      const wasInputEntered = ref(false)
      const validationType = ref(props.validationType || "empty")
      const charAmount = ref(props.charAmount || null)
      const validationRules = ref({})
      const state = {
        [`${fieldName.value}`]: value
      }

      const getCharsAmountRule = (charsRule) => {
        if(charsRule.min && charsRule.max) {
          return {minLength: minLength(charsRule.min),maxLength: maxLength(charsRule.max),required}
        } 
        if(charsRule.min && !charsRule.max) {
          return {minLength: minLength(charsRule.min),required}
        } 
        if(!charsRule.min && charsRule.max) {
          return {maxLength: maxLength(charsRule.max),required}
        }
      }

      if(requireValidation.value) {
        if(validationType.value == "empty") {
          validationRules.value = {
            [`${fieldName.value}`]: {required}
          }
        }
        if(validationType.value == "numeric") {
          validationRules.value = {
            [`${fieldName.value}`]: {required, numeric}
          }
        }
        if(validationType.value == "email") {
          validationRules.value = {
            [`${fieldName.value}`]: {required, email}
          }
        }
        if(validationType.value == "extension") {
          validationRules.value = {
            [`${fieldName.value}`]: getCharsAmountRule(charAmount.value)
          }
        }
      }

      const updateValidationState = (fieldName,validationsPassed) => {
        emit('update-validation-state',{fieldName,validationsPassed})
      }

      const v$ = useVuelidate(validationRules, state)

      const initiateValidators = () => {
        wasInputEntered.value = true
      }

      const isValid = computed(() => {
        updateValidationState(fieldName.value,false)
        if(!wasInputEntered.value) return false
        if(v$.value.$silentErrors[0]) return false
        
        updateValidationState(fieldName.value,true)
        return true
      })

      return {  
        value,
        ...props,
        v$,
        fieldName,
        isValid,
        initiateValidators,
        wasInputEntered,
        validationType,
        charAmount
      };
    },
  });
</script>

<style lang="scss" scoped>
  @import '@/assets/inputs.scss';
</style>
