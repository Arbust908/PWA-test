<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-10 inset-0 overflow-y-auto" :open="open" @close="$emit('close')">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-md"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="
              inline-block
              align-bottom
              bg-second-50
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6
            "
          >
            <div>
              <div
                v-if="type === 'error'"
                class="
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  bg-red-100
                  sm:h-10 sm:w-10
                "
              >
                <ExclamationIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div
                v-else-if="type === 'success'"
                class="
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:h-10 sm:w-10
                  bg-green-100
                "
              >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div v-else-if="type === 'off'"></div>
              <div
                v-else
                class="
                  mx-auto
                  flex-shrink-0 flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  sm:h-10 sm:w-10
                  bg-second-200
                "
              >
                <QuestionMarkCircleIcon class="h-6 w-6 text-second-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-second-900">
                  {{ title }}
                </DialogTitle>
                <div class="mt-2 text-sm text-second-500">
                  <slot name="body"></slot>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <slot name="btn"></slot>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
  import { ref, toRefs } from 'vue';
  import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import { CheckIcon, QuestionMarkCircleIcon, ExclamationIcon } from '@heroicons/vue/outline';

  export default {
    components: {
      Dialog,
      DialogOverlay,
      DialogTitle,
      TransitionChild,
      TransitionRoot,
      CheckIcon,
      QuestionMarkCircleIcon,
      ExclamationIcon,
    },
    props: {
      title: String,
      type: {
        type: String,
        default: 'info',
        validate: (value) => ['error', 'success', 'info', 'off'].includes(value),
      },
      open: Boolean,
    },
    setup(props) {
      return {
        ...toRefs(props),
      };
    },
  };
</script>
