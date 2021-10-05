<template>
  <label :for="fieldName">
    <FieldTitle v-if="title" :title="title" :isOptional="isOptional" />
    <textarea
      :id="fieldName"
      :class="[isFixed ? 'resize-none' : null, !isValid && wasInputEntered ? 'invalid' : null]"
      class="input"
      :name="fieldName"
      :placeholder="placeholder"
      v-model="value"
      :rows="rows"
      @blur="initiateValidations"
    >
    </textarea>
    <InvalidInputLabel v-if="!isValid && wasInputEntered" :validationType="validationType"/>
  </label>
</template>

<script>
  import { defineComponent, computed, toRefs, ref } from 'vue';
  import { useVModel } from '@vueuse/core';
  import FieldTitle from '@/components/ui/form/FieldTitle.vue';
  import useVuelidate from '@vuelidate/core'
  import {required, email} from '@vuelidate/validators'
  import InvalidInputLabel from '../InvalidInputLabel.vue';

  export default defineComponent({
    name: 'FieldInput',
    components: {
      FieldTitle,
      InvalidInputLabel
    },
    props: {
      data: {
        default: '',
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
      rows: {
        type: Number,
        default: 4,
      },
      isOptional: {
        type: Boolean,
        default: false,
      },
      isFixed: {
        type: Boolean,
        default: false,
      },
      requireValidation: {
        type: Boolean,
        require: false,
      },
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
  .input:not(.invalid) {
    transition: all 100ms ease-out;
  }
  .invalid {
    transition: all 500ms ease-out;
    @apply border border-red-500;
  }
</style>
