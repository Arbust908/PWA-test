<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import InputCompo from './InputCompo.vue';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import axios from 'axios';
    export default {
        components: {
            Layout,
            InputCompo,
        },
        setup() {
            console.log('Eventos.vue');

            function randomIntFromInterval(min, max) {
                // min and max included
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            onMounted(async () => {
                console.log('Eventos.vue mounted');
                console.log('Eventos.vue async');
                // isLoading.value = true;
                const randomUser = randomIntFromInterval(1, 10);
                const {
                    data,
                    isFinished: isF,
                    isLoading: isL,
                } = useAxios(`https://jsonplaceholder.typicode.com/users/${randomUser}`);
                watchEffect(() => {
                    if (data.value) {
                        user.nombre = data.value.name;
                        user.mail = data.value.email;
                        user.numero = data.value.phone;
                    }
                    isLoading.value = isL.value;
                    hasSearch.value = isF.value;
                });
                // await axios
                //     .get(`https://jsonplaceholder.typicode.com/users/${randomUser}`)
                //     .then((response) => {
                //         console.log(response);
                //         console.log(response.data);
                //         console.log(response.status);
                //         user.nombre = response.data.name;
                //         user.mail = response.data.email;
                //         user.numero = response.data.phone;
                //     })
                //     .catch((error) => {
                //         console.log('ES u error');
                //         console.log(error.message);
                //         // Disparar modal de error
                //     })
                //     .finally(() => {
                //         console.log('finally');
                //         isLoading.value = false;
                //         hasSearch.value = true;
                //     });
            });
            const hasSearch = ref(false);
            const isLoading = ref(false);
            const misClases = ref('bg-gray-600');
            const user = reactive({
                nombre: '',
                mail: '',
                numero: 0,
            });

            const changeClass = () => {
                misClases.value = 'bg-red-500';
            };
            const reset = () => {
                user.nombre = '';
                user.mail = '';
                user.numero = 0;
            };
            const send = () => {
                const res = axios.post('/api/users', user);
                axios.post('https://jsonplaceholder.typicode.com/users/', user).then((response) => {
                    console.log(response);
                    console.log(response.data);
                    console.log(response.status);
                });
            };
            const change = (e) => {
                console.log(e);
            };

            return {
                user,
                changeClass,
                reset,
                send,
                change,
                misClases,
                isLoading,
                hasSearch,
            };
        },
    };
</script>

<template>
    <Layout>
        <section :class="isLoading ? 'bg-gray-300' : null" class="grid grid-cols-2 gap-4">
            <button
                :class="misClases"
                class="rounded px-2 text-white col-span-full"
                @mouseenter="changeClass()"
                @click="reset"
            >
                Reset Me
            </button>
            <!-- v-model="miDate" -->
            <InputCompo v-if="hasSearch" v-model="user.nombre" input-name="Name" label-name="Nombre" />
            <InputCompo
                v-if="hasSearch"
                :model-value="user.mail"
                input-name="Mail"
                label-name="Mail"
                @update:model-value="user.mail = $event.toUpperCase()"
            />
            <InputCompo
                v-if="hasSearch"
                :model-value="user.numero"
                input-name="Num"
                label-name="Numero"
                @update:model-value="user.numero = Number($event)"
            />
            <input v-model="user.nombre" type="text" />
            <hr class="col-span-full border-gray-300" />
            <div class="col-span-full">
                {{ user.nombre }} - {{ user.mail }} -
                {{ user.numero + 1 }}
            </div>
            <button
                :class="misClases"
                class="rounded px-2 text-white col-span-full"
                @mouseenter="changeClass()"
                @click="send"
            >
                Send Me
            </button>
        </section>
    </Layout>
</template>

<style scoped></style>
