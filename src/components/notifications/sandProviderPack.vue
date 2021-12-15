<template>
    <FieldGroup class="py-2 w-full grid grid-cols-12 gap-3 md:gap-4">
        <FieldLegend>Arena</FieldLegend>
        <template v-for="(sPov, i) in sandProviders" :key="i">
            <FieldSelect
                class="col-span-full sm:col-span-5"
                field-name="sandProvider"
                placeholder="Seleccionar centro de carga"
                title="Centro de Carga de Arena"
                endpoint="/sandProvider"
                :data="sPov.id"
                @update:data="
                    sPov.id = $event;
                    handleSandProviderUpdate($event);
                "
            />

            <div
                v-for="(so, Key) in sPov.SandOrders"
                :key="Key"
                class="relative grid grid-cols-12 col-span-full gap-4 my-2"
            >
                <FieldSelect
                    class="col-span-5 sm:col-span-5"
                    :title="Key === 0 ? 'Tipo' : ''"
                    field-name="sandType"
                    placeholder="Arena"
                    endpoint-key="type"
                    :data="so.sandTypeId"
                    :endpoint-data="filteredSandTypes"
                    @update:data="so.sandTypeId = $event"
                />
                <FieldWithSides
                    class="col-span-5 sm:col-span-3"
                    :title="Key === 0 ? 'Cantidad' : ''"
                    :field-name="`sandQuantity${Key}`"
                    placeholder="0"
                    type="number"
                    mask="####"
                    require-validation
                    validation-type="extension"
                    :char-amount="{ min: 1, max: 4 }"
                    :post="{ title: 'Peso en Toneladas', value: 't' }"
                    :data="so.amount"
                    @update:data="so.amount = $event"
                />
                <div
                    v-if="sPov.SandOrders.length > 0 && Key + 1 === sPov.SandOrders.length"
                    class="col-span-1 my-auto mx-auto hidden sm:block"
                >
                    <Icon
                        icon="PlusCircle"
                        outline
                        class="w-7 h-7 text-green-500 mr-1"
                        :class="sPov.SandOrders.length == 1 ? 'mt-7' : 'mt-2'"
                        @click.prevent="addSandOrder(sPov.innerId)"
                    />
                </div>
                <div class="col-span-2 ml-2 my-auto">
                    <Icon
                        v-if="sPov.SandOrders.length > 1 && Key !== sPov.SandOrders.length"
                        icon="Trash"
                        outline
                        class="w-6 h-6"
                        :class="Key + 1 === sPov.SandOrders.length ? 'mt-2' : 'mt-6'"
                        @click.prevent="removeSandOrder(sPov.innerId, so.innerId)"
                    />
                </div>
            </div>
            <div class="col-span-full mt-2 sm:hidden">
                <button class="flex items-center" @click.prevent="addSandOrder(sPov.innerId)">
                    <Icon icon="PlusCircle" outline class="w-6 h-6 text-green-500" />
                    <span class="font-semibold text pl-1">Agregar</span>
                </button>
            </div>
        </template>
    </FieldGroup>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watchEffect, onMounted } from 'vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import { useVModel } from '@vueuse/core';
    import { SandProvider, SandOrder } from '@/interfaces/sandflow';
    const defaultSandOrder: SandOrder = {
        innerId: 0,
        sandTypeId: -1,
        amount: null,
    };
    const defaultSandProvider = {
        innerId: 0,
        id: -1,
        SandOrders: [],
    };
    export default defineComponent({
        components: {
            FieldGroup,
            FieldLegend,
            FieldSelect,
            FieldWithSides,
            Icon,
        },
        props: {
            sandProviders: {
                type: Array,
                required: true,
            },
            filteredSandTypes: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:sandProviders', 'update:sandOrders', 'sandProviderHandler'],
        setup(props, { emit }) {
            const sandProviders = useVModel(props, 'sandProviders', emit);

            const filteredSandTypes = ref([]);

            const getCurrentSandProvider = (Inid: number): SandProvider => {
                return sandProviders.value.find((s) => s.innerId === Inid);
            };

            watchEffect(() => {
                filteredSandTypes.value = props.filteredSandTypes;
            });

            const sandOrderInnerId = ref(0);
            const addSandOrder = (spId: number) => {
                const newSandOrder = { ...defaultSandOrder };
                newSandOrder.innerId = ++sandOrderInnerId.value;
                const currSP = getCurrentSandProvider(spId);
                currSP?.SandOrders?.push(newSandOrder);
                console.log(newSandOrder);
            };
            const removeSandOrder = (spId: number, soInid: number) => {
                const currSP = getCurrentSandProvider(spId);

                if (currSP) {
                    currSP.SandOrders = currSP.SandOrders.filter((so) => so.innerId !== soInid);
                }
            };

            const cleanSandOrders = () => {
                sandProviders.value[0].SandOrders.length = 0;
                addSandOrder(1);
            };

            const sandProviderInnerId = ref(0);
            const addSandProvider = () => {
                const newSandProvider = { ...defaultSandProvider };
                newSandProvider.innerId = ++sandProviderInnerId.value;
                newSandProvider.SandOrders = [{ ...defaultSandOrder }];
                sandProviders.value.push(newSandProvider);
            };
            const removeSandProvider = (spInid: number) => {
                sandProviders.value = sandProviders.value.filter((sp) => sp.innerId !== spInid);
            };
            const lastSandProviderInner = computed(() => {
                return sandProviders.value.length - 1;
            });

            if (sandProviders && sandProviders.value && sandProviders.value.length <= 0) {
                addSandProvider();
            }

            const handleSandProviderUpdate = (id: number) => {
                emit('sandProviderHandler', id);
                cleanSandOrders();
            };

            return {
                sandProviders,
                addSandOrder,
                removeSandOrder,
                addSandProvider,
                removeSandProvider,
                lastSandProviderInner,
                filteredSandTypes,
                cleanSandOrders,
                handleSandProviderUpdate,
            };
        },
    });
</script>

<style></style>
