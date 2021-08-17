<template>
  <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
    <label class="col-span-full text-xl" for="naming">
      <span>{{ title }}</span>
      <input
        class="input"
        :id="naming"
        :name="naming"
        :type="type"
        listId="listID"
        :required="required"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <datalist v-show="withList" id="listID">
        <option v-for="(item, itemKey) in list" :key="itemKey" :value="item">
          {{ item }}
        </option>
      </datalist>
      <!-- <datalist id="idasd">
      <option value="30/40"></option>
      <option value="50/100">Arena #30/40</option>
    </datalist> -->
    </label>
  </fieldset>
</template>
<script lang="ts">
  import { reactive, computed, ComputedRef } from 'vue';
  import { title } from 'process';
  // Input Mode
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
  export default {
    props: {
      naming: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      required: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
        default: '',
      },
      withList: {
        type: Boolean,
        default: false,
      },
      list: {
        type: Array,
        default: ['Provedor1', 'Marcos', 'Proveedor2'],
      },
      listID: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const state = reactive({
        input_errors: [],
        inputType: props.type,
      });
      const things: ComputedRef<String> = computed(() => {
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
  .input {
    @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
  }
  input:read-only {
    @apply bg-second-200 border cursor-not-allowed;
  }
  fieldset:not(:last-of-type) {
    @apply border-b pb-6;
  }
  label:not(.toggle) {
    @apply flex flex-col;
    span {
      @apply text-sm;
    }
  }
  .toggle {
    @apply flex space-x-3 items-center;
  }
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
    }
    &__options {
      @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
    }
    &__add {
      @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
</style>
