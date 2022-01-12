<template>
    <Layout>
        <ABMFormTitle :title="`${editedCompany.name || 'Cliente'}`" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4 max-w-md">
                <CompanyForm
                    v-model:name="editedCompany.name"
                    v-model:legalId="editedCompany.legalId"
                    v-model:address="editedCompany.address"
                    v-model:isOperator="editedCompany.isOperator"
                    v-model:observations="editedCompany.observations"
                />
                <RepFrom
                    v-model:repName="editedCompany.companyRepresentative.name"
                    v-model:repPhone="editedCompany.companyRepresentative.phone"
                    v-model:repEmail="editedCompany.companyRepresentative.email"
                    rep-entity="client"
                />
            </form>
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="goToIndex"> Cancelar </SecondaryBtn>
                <PrimaryBtn btn="wide" :disabled="!isValidated" @click="isValidated && update()">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            :open="showErrorCuitModal"
            title="Ya existe un cliente con este CUIT"
            text="El cliente que intentas guardar fue creado anteriormente."
            @close="showErrorCuitModal = false"
            @main="showErrorCuitModal = false"
        />
        <SuccessModal
            :open="showSuccessModal"
            title="El cliente fue guardado con éxito."
            @close="goToIndex"
            @main="goToIndex"
        />
    </Layout>
</template>

<script setup lang="ts">
    import { Company } from '@/interfaces/sandflow';
    import { useValidator } from '@/helpers/useValidator';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    // AXIOS
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import RepFrom from '@/components/company/RepFrom.vue';
    import CompanyForm from '@/components/company/CompanyForm.vue';

    const route = useRoute();
    const store = useStore();
    const router = useRouter();

    const companies: Array<Company> = JSON.parse(JSON.stringify(store.state.client.all));

    const id = Number(route.params.id);
    useTitle(`Cliente ${id} <> Sandflow`);

    const currentCompany = companies.find((company) => {
        return company.id == id;
    });

    const editedCompany = ref({ ...currentCompany });

    const goToIndex = () => {
        router.push('/clientes');
    };

    const isValidated = ref(false);

    watchEffect(async () => {
        isValidated.value = (await useValidator(store, 'client')) ? true : false;
    });

    const showErrorCuitModal = ref(false);
    const showSuccessModal = ref(false);

    const update = async () => {
        const legalIdExists = await checkIfExists('legalId', editedCompany.value.legalId);

        if (legalIdExists) {
            showErrorCuitModal.value = true;

            return;
        }

        const loading = ref(true);
        let companyData = {
            id: Number(id),
            name: editedCompany.value.name,
            address: editedCompany.value.address,
            legalId: editedCompany.value.legalId,
            isOperator: editedCompany.value.isOperator,
            childId: null,
            observations: editedCompany.value.observations,
            companyRepresentativeId: Number(editedCompany.value.companyRepresentativeId),
        };

        let company = await axios
            .put(`${apiUrl}/company/${id}`, companyData)
            .catch((err) => {
                console.log(err);
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.data;
                }

                return {};
            })
            .finally(() => {
                loading.value = false;
            });

        let companyRepresentative = await axios
            .put(
                `${apiUrl}/companyRepresentative/${companyData.companyRepresentativeId}`,
                editedCompany.value.companyRepresentative
            )
            .catch((err) => {
                console.log(err);
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.data;
                }

                return {};
            })
            .finally(() => {
                loading.value = false;
            });

        store.dispatch('updateClient', editedCompany.value);
        showSuccessModal.value = true;
    };

    const checkIfExists = async (field: string, value: string) => {
        const apiResponse = await axios.get(`${apiUrl}/company?${field}=${value}`);
        const companies = apiResponse.data.data;

        return companies.filter((company) => company.legalId !== editedCompany.value.legalId).length > 0;
    };
</script>
