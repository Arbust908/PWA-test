<template>
    <div class="d-flex w-60">
        <label class="label"
            ><p>{{ label }}</p></label
        >
        <div class="mt-2">
            <div :class="['switch', isActive ? 'active' : '']" @click="handleToggle">
                <div class="switch-circle"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { toRefs, ref, onMounted } from 'vue';
    export default {
        props: {
            label: {
                type: String,
                required: true,
            },
            initialState: {
                type: Boolean,
                required: false,
            },
        },
        setup(props, { emit }) {
            let { label, initialState } = toRefs(props);

            let isActive = ref(false);

            onMounted(() => {
                if (initialState.value) {
                    isActive.value = initialState.value;
                }
            });

            const handleToggle = () => {
                isActive.value = !isActive.value;
                emit('handle-toggle-state', isActive.value);
            };

            return {
                label,
                isActive,
                handleToggle,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .switch {
        @apply bg-gray-200;
        border: 2px solid rgb(175, 175, 175);
        border-radius: 20px;
        padding: 5px;
        width: 60px;
        cursor: pointer;
        transition: all 500ms ease-in-out;

        .switch-circle {
            height: 20px;
            width: 20px;
            border-radius: 100%;
            @apply bg-gray-400;
            transition: all 500ms ease-in-out;
        }

        &.active {
            transition: all 500ms ease-in-out;
            @apply bg-green-300;
            @apply border-green-500;

            .switch-circle {
                transition: all 500ms ease-in-out;
                transform: translateX(25px);
                @apply bg-green-500;
            }
        }
    }
</style>
