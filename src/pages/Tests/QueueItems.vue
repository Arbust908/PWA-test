<template>
    <Layout>
        <ABMFormTitle title="Queue Items" />
        <section class="flex flex-col gap-6 max-w-lg">
            <h2>Item de Fila nuevo</h2>
            <div class="bg-gray-500 rounded-xl text-emerald-300 font-mono p-6">
                {{ newQueueItem }}
            </div>
            <article class="flex flex-wrap gap-2">
                <FieldInput
                    v-model:data="newQueueItem.origen"
                    field-name="Origen"
                    title="Origen"
                    placeholder="De donde"
                />
                <FieldInput
                    v-model:data="newQueueItem.destination"
                    field-name="Destino"
                    title="Destino"
                    placeholder="A donde"
                />
                <p class="px-2 border rounded my-auto">{{ newQueueItem.status ? 'Para hacer' : 'Finalizado' }}</p>
                <p class="my-auto space-x-4 w-6/12">
                    <span class="font-bold"> {{ newQueueItem.order }} </span>
                    <span v-show="newItemOrder !== newQueueItem.order" class="text-main-600 underline">
                        {{ newItemOrder }}
                    </span>
                </p>
                <GhostBtn
                    v-for="(transaction, key) in QueueTransactions"
                    :key="key"
                    class="w-5/12"
                    @click.prevent="setTo(key)"
                >
                    {{ key }}
                </GhostBtn>
                <SecondaryBtn>Poner el Orden</SecondaryBtn>
            </article>
            <footer class="flex gap-4">
                <NoneBtn>Reset</NoneBtn>
                <PrimaryBtn>Guardar</PrimaryBtn>
            </footer>
        </section>
        <section v-for="(queueGroup, groupName) in dividedQueues" :key="queueGroup.id" class="flex flex-col gap-6 mt-8">
            <h2 v-show="queueGroup.length" class="font-bold text-2xl">
                {{ groupName }}
                <small> {{ queueGroup.length }} </small>
            </h2>
            <dl
                v-for="item in queueGroup"
                :key="item?.id"
                class="rounded bg-indigo-200 text-indigo-500 font-semibold border border-indigo-600 p-6 grid grid-cols-2 max-w-xs"
            >
                <dt>Id:</dt>
                <dd>{{ item?.id }}</dd>
                <dt>Id de Caja</dt>
                <dd>{{ item?.sandOrder?.boxId || 'Sin Id' }}</dd>
                <dt>Peso</dt>
                <dd>{{ item?.sandOrder?.amount }}t</dd>
                <dt>Pozo:</dt>
                <dd>{{ item?.pit?.name }}</dd>
                <dt>Movimiento</dt>
                <dd>
                    <span>{{ item.origin }}</span>
                    <span> => </span>
                    <span>{{ item.destination }}</span>
                </dd>
                <dt>Status:</dt>
                <dd>{{ item?.status }}</dd>
                <dt>Orden:</dt>
                <dd>{{ item?.order }}</dd>
            </dl>
        </section>
        <Backdrop :open="showBD" title="Backdrop" @close="toggleBD()">
            <template #body> </template>
            <template #btn> </template>
        </Backdrop>
    </Layout>
</template>

<script setup lang="ts">
    import Backdrop from '@/components/modal/Backdrop.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { getOrder, separateQueues, QueueTransactions, SteppedQueue } from '@/helpers/useQueueItem';
    import { QueueItem } from '@/interfaces/sandflow';
    import axios from 'axios';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    const api = import.meta.env.VITE_API_URL || '/api';

    const queue: Ref<Array<QueueItem>> = ref([] as Array<QueueItem>);
    const dividedQueues: Ref<SteppedQueue> = ref({} as SteppedQueue);
    const newQueueItem: Reactive<QueueItem> = reactive({
        sandOrderId: -1,
        pitId: -1,
        origin: '',
        destination: '',
        status: 0,
        order: -1,
    });
    const newItemOrder = ref(-1);
    const title = useTitle(`  Queue Item <> Sandflow  `);
    const showBD = ref(false);
    const toggleBD = () => {
        console.log('show BD', showBD.value);
        showBD.value = !showBD.value;
        console.log('show BD', showBD.value);
    };
    const setTo = (to: string) => {
        console.log(to);
        const [deDonde, aDonde] = to.split('A');
        /**
         * Esto es a modo ilustrativo
         * Si es cradle deberia decir "Estacion {Numero}"
         * Si es Camion deberia decir "Camion {Patente}"
         * Si es Deposito deberia ser "F{fila} C{Columna} N{Nivel}"
         */
        newQueueItem.origen = deDonde;
        newQueueItem.destination = aDonde;
        newItemOrder.value = getOrder(queue.value, QueueTransactions[to]);
    };

    setInterval(() => {
        if (title.value) {
            // Shift title string
            title.value = title.value.substring(1) + title.value.substring(0, 1);
        }
    }, 300);
    onMounted(async () => {
        const response = await axios.get(`${api}/queueItem`).catch((err) => {
            console.log(err);

            return false;
        });
        queue.value = response.data.data;
        dividedQueues.value = separateQueues(queue.value);
        newItemOrder.value = getOrder(queue.value);
    });
</script>

<style lang="scss" scoped>
    .cajitaMagica {
        @apply w-[58px]
        h-[58px]
        m-[58px]
        rounded
        shadow-md
        border-none
        bg-gradient-to-tr
        from-purple-500
        to-pink-500;
    }
    progress {
        @apply bg-green-500;
    }
    progress::-webkit-progress-bar {
        @apply bg-gray-500;
    }
    progress::-webkit-progress-value {
        @apply bg-green-500;
    }
    progress::-moz-progress-bar {
        @apply bg-green-500;
    }
</style>
