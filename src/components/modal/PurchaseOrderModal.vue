<template>
    <TransitionRoot as="template" :show="open">
        <Dialog
            as="div"
            static
            class="fixed z-10 top-10 inset-x-0 md:inset-0 overflow-y-auto"
            :open="open"
            @close="$emit('close')"
        >
            <div class="block min-h-screen pt-4 px-4 text-center">
                <!-- <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"> -->
                <TransitionChild
                    as="template"
                    enter="ease-out duration-200"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" />
                </TransitionChild>

                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden sm:inline-block align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <TransitionChild
                    as="template"
                    enter="ease-out duration-200"
                    enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enter-to="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 translate-y-0 sm:scale-100"
                    leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        class="
                            inline-block
                            bg-second-50
                            rounded-lg
                            text-left
                            overflow-hidden
                            shadow-xl
                            transform
                            transition-all
                            w-[315px]
                            sm:w-[440px]
                            my-8
                            align-middle
                            p-6
                        "
                        v-bind="$attrs"
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
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M24 0C10.752 0 0 10.752 0 24C0 37.248 10.752 48 24 48C37.248 48 48 37.248 48 24C48 10.752 37.248 0 24 0ZM26.4 36H21.6V31.2H26.4V36ZM26.4 26.4H21.6V12H26.4V26.4Z"
                                        fill="#BE1A3B"
                                    />
                                </svg>
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
                                    rounded-full
                                    h-10
                                    w-10
                                    bg-second-200
                                "
                            >
                                <QuestionMarkCircleIcon class="h-6 w-6 text-second-600" aria-hidden="true" />
                            </div>
                            <div class="text-center">
                                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-second-900">
                                    {{ title }}
                                </DialogTitle>
                                <div class="text-sm text-second-500">
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
        inheritAttrs: false,
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
