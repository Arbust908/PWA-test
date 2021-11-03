<template>
    <component :is="to !== '' ? 'router-link' : 'span'" :to="to" class="nav__card">
        <h3>{{ name }}</h3>
        <Icon :icon="icon" class="nav__pic" />
        <Icon :icon="icon" class="nav__pic--bg" />
        <button v-if="to !== ''">ir</button>
    </component>
</template>

<script lang="ts">
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { defineComponent, toRefs } from 'vue';
    export default defineComponent({
        name: 'PanelControlCard',
        components: {
            Icon,
        },
        props: {
            name: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                default: '',
            },
            icon: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            return {
                ...toRefs(props),
            };
        },
    });
</script>

<style lang="scss" scoped>
    .nav {
        &__card {
            @apply p-2 rounded-lg bg-gray-200 shadow-sm hover:bg-white hover:shadow-lg transition duration-150 ease-out space-y-2 relative overflow-hidden h-32;
            button {
                @apply ml-auto mr-1 px-2 rounded bg-main-300 text-white hover:bg-main-500 hover:shadow transition duration-150 ease-out absolute bottom-2 right-2 capitalize;
            }
            h3 {
                @apply text-xl font-bold;
            }
        }
        &__pic {
            @apply w-10 h-10 text-main-600;
            &--bg {
                @apply w-32 h-32 absolute -top-10 -right-8 opacity-25 text-main-600;
            }
        }
    }
</style>
