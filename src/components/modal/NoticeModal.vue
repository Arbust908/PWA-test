<template>
    <Modal
        v-bind="$attrs"
        :open="open"
        modal-classes="gap-4 text-center max-w-[444px] font-body"
        @close="$emit('close')"
    >
        <div class="icon--box">
            <Icon :icon="iconType" :class="iconClass" class="icon" />
        </div>
        <h2>{{ title }}</h2>
        <span :class="textClass"> {{ text }} </span>
        <footer v-if="btnText">
            <PrimaryBtn :btn="`wide ${btnClass}`" @click="$emit('main')">
                {{ btnText }}
            </PrimaryBtn>
        </footer>
    </Modal>
</template>

<script lang="ts">
    import Modal from '@/components/modal/General.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

    export default {
        components: {
            Modal,
            Icon,
            PrimaryBtn,
        },
        inheritAttrs: false,
        props: {
            title: {
                type: String,
                default: '',
            },
            text: {
                type: String,
                default: '',
            },
            textClass: {
                type: String,
                default: '',
            },
            open: {
                type: Boolean,
                default: false,
            },
            btn: {
                type: [Object, String],
                default: 'Volver',
            },
            icon: {
                type: [Object, String],
                default: 'QuestionMarkCircle',
            },
        },
        emits: ['close', 'main'],
        setup({ btn, icon }) {
            const btnClass = ref('');
            const btnText = ref('');

            if (typeof btn === 'string') {
                btnText.value = btn;
            } else {
                btnClass.value = btn.classes || '';
                btnText.value = btn.text || '';
            }
            const iconClass = ref('');
            const iconType = ref('');

            if (typeof icon === 'string') {
                iconType.value = icon;
            } else {
                iconClass.value = icon.classes || '';
                iconType.value = icon.type || '';
            }

            return {
                btnClass,
                btnText,
                iconClass,
                iconType,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .icon {
        @apply h-14 w-14;
        &--box {
            @apply flex flex-col justify-center items-center;
        }
    }
    h2 {
        @apply text-lg font-medium mx-5 text-gray-900;
    }
    span {
        @apply text-sm;
    }
    footer {
        @apply flex justify-center;
    }
</style>
