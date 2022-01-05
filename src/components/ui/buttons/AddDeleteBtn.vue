<template>
    <CircularBtn size="sm" :btn="purposeRender ? 'bg-green-500 !px-0' : '!px-0'">
        <Icon v-if="purposeRender" icon="Plus" class="w-5 h-5 text-white" />
        <TrashIcon v-else />
    </CircularBtn>
</template>

<script>
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import TrashIcon from '@/components/ui/buttons/TrashIcon.vue';
    export default {
        components: {
            CircularBtn,
            Icon,
            TrashIcon,
        },

        props: {
            purpose: {
                type: String,
                required: true,
                default: 'add',
            },
        },

        setup(props) {
            const purposeRender = computed(() => {
                if (props.purpose === 'add') {
                    return true;
                } else {
                    return false;
                }
            });

            return {
                purposeRender,
            };
        },
    };
</script>
