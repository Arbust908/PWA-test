<template>
    <Layout>
        <ABMFormTitle :title="`${role.name}`" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <Form :role="role" />
            {{ role }}
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex md:flex-row-reverse justify-between max-w-2xl">
            <section class="space-x-3 flex items-center justify-end">
                <!-- <SecondaryBtn btn="wide" @click.prevent="goToIndex">Cancelar</SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :disabled="!isValidated"
                    @click="isValidated && getForkliftsAndCheckIfNameExists()"
                >
                    Finalizar
                </PrimaryBtn> -->
            </section>
        </footer>
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import Form from '@/components/role/Form.vue';
    import { useGlobalStore } from '@/store/global.pinia';
    import { useRoleStore } from '@/store/role.pinia';
    import { storeToRefs } from 'pinia';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    const router = useRouter();
    const route = useRoute();
    const id = route.params.id;
    const globalStore = useGlobalStore();
    const { isLoading } = storeToRefs(globalStore);
    const roleStore = useRoleStore();
    const { getSelected: role, roles, selectedId } = storeToRefs(roleStore);
    useTitle(`<> Rol de ${role.value.name}`);

    isLoading.value = true;
    selectedId.value = Number(id);
    // Lamado a la api
    await axios
        .get(`${api}/role`)
        .then((res) => {
            if (res.status == 200) {
                roles.value = res.data?.data;
                isLoading.value = false;

                return res.data.data;
            }
        })
        .catch((err) => {
            console.error(err);
        });
</script>

<style scoped lang="scss"></style>
