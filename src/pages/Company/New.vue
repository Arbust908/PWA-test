<template>
    <Layout>
        <ABMFormTitle title="Nuevo cliente" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4 max-w-md">
                <CompanyForm
                    v-model:name="newClient.name"
                    v-model:legalId="newClient.legalId"
                    v-model:address="newClient.address"
                    v-model:isOperator="newClient.isOperator"
                    v-model:observations="newClient.observations"
                />
                <RepFrom
                    v-model:repName="newClient.companyRepresentative.name"
                    v-model:repPhone="newClient.companyRepresentative.phone"
                    v-model:repEmail="newClient.companyRepresentative.email"
                    rep-entity="client"
                />
            </form>
        </section>
        <!-- *** Cambiar todos por un componente de ABM Footer -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="goToIndex"> Cancelar </SecondaryBtn>
                <PrimaryBtn btn="wide" :disabled="!isValidated" @click="isValidated && save()"> Finalizar </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            :open="showErrorCuitModal"
            title="Ya existe un cliente con este CUIT"
            text="El cliente que intentas guardar fue creado anteriormente"
            @close="showErrorCuitModal = false"
            @main="showErrorCuitModal = false"
        />
        <SuccessModal
            :open="showSuccessModal"
            title="El cliente fue guardado con éxito"
            @close="goToIndex"
            @main="goToIndex"
        />
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { useValidator } from '@/helpers/useValidator';
    // AXIOS
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // TIPOS
    import { Company } from '@/interfaces/sandflow';

    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import RepFrom from '@/components/company/RepFrom.vue';
    import CompanyForm from '@/components/company/CompanyForm.vue';

    useTitle('Nuevo Cliente <> Sandflow');
    const router = useRouter();
    const store = useStore();
    const instance = axios.create({
        baseURL: apiUrl,
    });

    const goToIndex = () => {
        router.push('/clientes');
    };

    const showErrorCuitModal = ref(false);
    const showSuccessModal = ref(false);

    const newClient = ref({
        name: '',
        address: '',
        legalId: '',
        isOperator: false,
        observations: '',
        companyRepresentative: {
            email: '',
            name: '',
            phone: '',
        },
        sandPlans: [],
    });

    const isValidated = ref(false);

    watchEffect(async () => {
        isValidated.value = (await useValidator(store, 'client')) ? true : false;
    });

    const save = async () => {
        const legalIdExists = await checkIfExists('legalId', newClient.value.legalId);

        if (legalIdExists) {
            showErrorCuitModal.value = true;

            return;
        }
        const { data: CRdata } = useAxios(
            '/companyRepresentative',
            { method: 'POST', data: newClient.value.companyRepresentative },
            instance
        );
        watch(CRdata, (newVal, _) => {
            if (newVal && newVal.data) {
                newClient.value.companyRepresentativeId = newVal.data.id;
                newClient.value.companyRepresentative = newVal.data;
                const { data: Cdata } = useAxios('/company', { method: 'POST', data: newClient.value }, instance);
                watch(Cdata, (newVal, _) => {
                    if (newVal && newVal.data) {
                        store.dispatch('saveClient', newClient.value);
                        showSuccessModal.value = true;
                    }
                });
            }
        });
    };

    const checkIfExists = async (field: string, value: string) => {
        //TODO: Refactor with useStoreLogic ? (useStoreLogic not accept filters)
        const apiResponse = await axios.get(`${apiUrl}/company?${field}=${value}`);
        const companies = apiResponse.data.data;

        return companies.length > 0;
    };
</script>
