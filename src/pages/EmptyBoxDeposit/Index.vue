<template>
    <Layout>
        <ABMFormTitle title="Depósito de cajas vacias" />
        <FieldGroup class="max-w-4xl items-start mb-4">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
        </FieldGroup>
        <div class="flex flex-row justify-between">
            <section class="bg-white rounded-md mr-10 shadow-sm mb-14 max-w-4xl w-3/5 h-full">
                <div class="w-full max-w-sm border-dashed border-4 rounded-xl p-5 mx-auto my-10">
                    <span>Seleccione cliente y pozo para comenzar.</span>
                </div>
            </section>

            <section class="bg-white rounded-md shadow-sm mb-14 w-2/5">
                <h1 class="text-center mt-4">Cajas Seleccionadas</h1>
            </section>
        </div>
    </Layout>
</template>

<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            ABMFormTitle,
            ClientPitCombo,
            FieldGroup,
        },

        setup() {
            useTitle('Depósito de cajas vacias');

            const instance = axios.create({
                baseURL: apiUrl,
            });

            // :: CLIENT
            const clientId = ref(-1);
            const clients = ref([] as Array<Company>);
            const { data: companiesData } = useAxios('/company', instance);

            watch(companiesData, (companiesApi) => {
                if (companiesApi && companiesApi.data) {
                    clients.value = companiesApi.data;
                }
            });

            const selectedClientName = computed(() => {
                return clientId.value >= 0 ? clients.value.find((pit) => pit.id === clientId.value).name : '';
            });
            // << CLIENT

            // :: PITS
            const pitId = ref(-1);
            const pits = ref([] as Array<Pit>);
            const { data: pitsData } = useAxios('/pit', instance);

            watch(pitsData, (pitApi) => {
                if (pitApi && pitApi.data) {
                    pits.value = pitApi.data;
                }
            });

            const selectedPitName = computed(() => {
                return pitId.value >= 0 ? pits.value.find((pit) => pit.id === pitId.value).name : '';
            });
            // << PITS

            return {
                clients,
                pits,
                clientId,
                pitId,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
