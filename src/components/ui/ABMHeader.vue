<template>
    <header>
        <h2>{{ title }}</h2>
        <router-link :to="link">
            <el-tooltip effect="dark" content="Ctrl + C">
                <PrimaryBtn :btn="'pill'" size="sm">
                    <span> {{ btnText }} </span>
                    <Icon :icon="icon" class="h-5 w-5" />
                </PrimaryBtn>
            </el-tooltip>
        </router-link>
    </header>
    <hr class="mb-4 border-gray-300" />
</template>

<script setup lang="ts">
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    const props = defineProps({
        title: {
            type: String,
            default: 'ABM',
        },
        link: {
            type: String,
            default: '#',
        },
        icon: {
            type: String,
            default: 'PlusCircle',
        },
        btnText: {
            type: String,
            default: 'Crear',
        },
    });

    const { btnText, link, title } = toRefs(props);
    const router = useRouter();

    const { Ctrl_C } = useMagicKeys();
    whenever(Ctrl_C, () => {
        console.log(`${btnText.value} ${title.value}`);
        router.push(link.value);
    });
</script>

<style scoped>
    header {
        @apply flex justify-start space-x-4 items-center mb-4;
    }
    h2 {
        @apply text-2xl font-semibold text-gray-900;
    }
</style>
