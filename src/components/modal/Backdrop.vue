<template>
    <TransitionRoot as="template" :show="open">
        <Dialog
            as="div"
            static
            class="fixed z-10 bottom-0 inset-x-0 md:inset-0 overflow-y-auto"
            :open="open"
            @close="$emit('close')"
        >
            <div class="min-h-screen pt-4 px-4 text-center flex justify-center items-end">
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
                            md:rounded-lg
                            rounded-t-lg
                            text-left
                            overflow-hidden
                            shadow-xl
                            transform
                            transition-all
                            w-full
                            mt-8
                            align-middle
                            max-w-sm
                            px-6
                            py-4
                            space-y-4
                        "
                    >
                        <header class="flex justify-between">
                            <DialogTitle as="h3" class="text-lg leading-6 font-medium text-second-900">
                                {{ title }}
                            </DialogTitle>
                            <CircularBtn class="-mt-3 -mr-3" @click="$emit('close')">
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </CircularBtn>
                        </header>
                        <div class="text-sm text-second-500">
                            <slot name="body">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget ex maximus,
                                    porttitor nunc eu, congue nisl.
                                </p>
                            </slot>
                        </div>
                        <footer>
                            <slot name="btn"> </slot>
                        </footer>
                    </div>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts">
    import { toRefs } from 'vue';
    import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import CircularBtn from '../ui/buttons/CircularBtn.vue';

    export default {
        components: {
            Dialog,
            DialogOverlay,
            DialogTitle,
            TransitionChild,
            TransitionRoot,
            SecondaryBtn,
            CircularBtn,
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
        emits: ['close'],
        setup(props: any) {
            return {
                ...toRefs(props),
            };
        },
    };
</script>
