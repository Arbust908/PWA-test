<template>
    <TransitionRoot as="template" :show="open">
        <Dialog
            as="div"
            static
            class="fixed z-10 top-10 inset-x-0 md:inset-0 overflow-y-auto"
            :open="open"
            @close="$emit('close')"
        >
            <!-- <div class="block min-h-screen pt-4 px-4 text-center"> -->
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <TransitionChild
                    as="template"
                    enter="ease-out duration-200"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay
                        class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-sm"
                    />
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
                    <section class="modal__card" :class="modalClasses" v-bind="$attrs">
                        <slot></slot>
                    </section>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts">
    import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue';

    export default {
        components: {
            Dialog,
            DialogOverlay,
            TransitionChild,
            TransitionRoot,
        },
        inheritAttrs: false,
        props: {
            open: {
                type: Boolean,
                required: true,
            },
            modalClasses: {
                type: String,
                default: 'max-w-xl',
            },
        },
        emits: ['close'],
        setup(props: any) {
            return {
                ...toRefs(props),
            };
        },
    };
</script>

<style lang="scss">
    .modal {
        &__card {
            @apply inline-flex flex-col bg-second-50 rounded-lg shadow-xl transform transition-all w-full my-8 align-middle p-5;
        }
        &__icon-circle {
            @apply mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:h-10 sm:w-10;
        }
    }
</style>
