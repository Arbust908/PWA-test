!
<template>
    <div>
        <h3 class="text-lg mb-2 font-bold">{{ info.sandProvider.name }}</h3>
        <dl>
            <template v-if="info" class="mb-4">
                <dt>Estado:</dt>
                <Badge text="Completado" classes="bg-gray-500 text-white" />
                <br class="w-full mb-2" />
            </template>
            <template v-if="info.sandProvider.name">
                <dt>Ctro. de carga:</dt>
                <dd>{{ info.sandProvider.name }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.data?.sandOrders">
                <dt>Arena(s):</dt>
                <dd>{{ listSandTypes(info.data?.sandOrders) }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.transportProvider.name">
                <dt>Transporte:</dt>
                <dd>{{ info.transportProvider.name }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.data?.cantidadCamiones">
                <dt>Cant. de camiones:</dt>
                <dd>{{ info.data?.cantidadCamiones }}</dd>
                <br class="w-full" />
            </template>
            <template>
                <dt>Estado:</dt>
                <Badge text="Completado" classes="bg-gray-500 text-white px-5" />
                <Badge text="En proceso" classes="bg-gray-300 text-gray-600" />
            </template>
        </dl>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import Badge from '@/components/ui/Badge.vue';
    import axios from 'axios';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            Badge,
        },
        props: {
            info: {
                type: Object,
                default: () => ({}),
            },
        },
        setup() {
            const sandTypesFromId = ref([]);

            const getSands = async () => {
                const res = await axios.get(`${apiUrl}/sand`).catch((err) => {
                    console.log(err);
                });
                sandTypesFromId.value = res.data.data;
            };

            const getSTName = (id) => {
                const st = sandTypesFromId.value.find((st) => {
                    return st.id == id;
                });
                return st ? st.type : '';
            };

            const listSandTypes = (sandOrders) => {
                let names = '';
                sandOrders.forEach((sand) => {
                    names += getSTName(sand.sandTypeId) + ' ';
                });
                return names;
            };

            onMounted(async () => {
                await getSands();
            });

            return {
                sandTypesFromId,
                getSands,
                getSTName,
                listSandTypes,
            };
        },
    });
</script>

<style lang="scss" scoped>
    dt,
    dd {
        @apply inline-block text-sm;
    }
    dt {
        @apply mr-2 font-semibold;
    }
</style>
