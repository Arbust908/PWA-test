<template>
  <div class="input-pack">
    <label :for="naming"> {{ title }} </label>
    <div class="mt-1">
      <input
        :id="naming"
        :name="naming"
        :type="type"
        :inputmode="inputmode"
        autocomplete="new-password"
        :required="required"
      />
      <p v-if="error.password">
        {{ error_msg }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { reactive, computed, ComputedRef } from 'vue';
  // Input Mode
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
  export default {
    props: {
      naming: {
        type: String,
        default: 'input',
      },
      type: {
        type: String,
        default: 'text',
      },
      inputmode: {
        type: String,
        default: 'text',
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const state = reactive({
        input_errors: [],
        inputType: props.type,
      });

      const things: ComputedRef<string> = computed(() => {
        return state.input_errors[0];
      });

      return {
        state,
        things,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .input-pack {
    & > label {
      @apply block text-sm font-medium text-gray-700;
    }
    & input {
      @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
    }
  }
</style>
