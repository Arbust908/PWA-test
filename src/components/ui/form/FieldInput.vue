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
      @blur="checkValidation(false)"
    />
    <InvalidInputLabel v-if="!isValid && wasInputEntered" :validationType="validationType" :charAmount="charAmount"/>
  </label>
</template>

<script>
  import { computed, defineComponent, onMounted, onUpdated, ref, toRefs, watchEffect } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { maska } from 'maska';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  import useVuelidate from '@vuelidate/core'
  import {required, email, minLength, maxLength, numeric} from '@vuelidate/validators'
  import InvalidInputLabel from '../InvalidInputLabel.vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router'

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
      },
      entity: {
        type: String,
        required: false
      }
    },
    setup(props, { emit }) {
      const value = useVModel(props, 'data', emit);
      const store = useStore()
      const {requireValidation, fieldName, entity} = toRefs(props)
      const wasInputEntered = ref(false)
      const validationType = ref(props.validationType || "empty")
      const charAmount = ref(props.charAmount || null)
      const validationRules = ref({})
      const state = {
        [fieldName.value]: value
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

      const v$ = useVuelidate(validationRules, state)
      const isValid = ref(null)
      const route = useRoute()

      const updateValidationState = (fieldName,validationsPassed,entity) => {
        store.dispatch(`${entity}UpdateValidation`, {fieldName,validationsPassed,entity})
      }

      const validationsHandler = (valid) => {
        if(isValid.value == valid) return
        else {
          isValid.value = valid
          updateValidationState(fieldName.value,valid,entity.value)
        }
      }

      const checkValidation = (isTheFirstUse) => {
        if(!requireValidation.value) return
        if(!isTheFirstUse && !wasInputEntered.value) wasInputEntered.value = true
        v$.value.$invalid ? validationsHandler(false) : validationsHandler(true)
      }

      onMounted(() => { 
        // Si es new, ejecuta.
        if(route.path.includes('nuevo')) checkValidation(true)
      })
      
      onUpdated(() => {
        // Si es edit, ejecuta.
        if(!route.path.includes('nuevo')) checkValidation(true)
      })

      return {  
        value,
        ...props,
        v$,
        fieldName,
        isValid,
        wasInputEntered,
        validationType,
        charAmount,
        checkValidation
      };
    },
  });
</script>

<style lang="scss" scoped>
  @import '@/assets/inputs.scss';
</style>
