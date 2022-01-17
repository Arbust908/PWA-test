<template>
    <FieldGroup class="max-w-lg">
        <FieldLegend>Pickup</FieldLegend>
        <FieldGroup v-for="(pickup, pickupI) in pickups" :key="pickupI" class="relative col-span-full max-w-2xl">
            <FieldInput
                class="col-span-6 lg:col-span-4"
                field-name="pickupId"
                placeholder="Patente"
                :title="pickupI === firstIndex ? 'ID Pickup' : null"
                :data="pickup.pickupId"
                @update:data="pickup.pickupId = $event"
            />
            <FieldInput
                class="col-span-5"
                field-name="description"
                placeholder="Descripción de pickup"
                :title="pickupI === firstIndex ? 'Descripción' : null"
                :data="pickup.description"
                @update:data="pickup.description = $event"
            />
            <AddDeleteBtn
                v-if="pickups.length > 1"
                :class="pickupI == 0 ? 'mt-7' : 'mt-2'"
                purpose="remove"
                @click.prevent="remove(pickup.innerId)"
            />
        </FieldGroup>
        <button class="mt-1 flex items-center col-span-6" @click.prevent="add">
            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
            <span class="font-bold w-full sm:w-max"> Agregar pickup </span>
        </button>
    </FieldGroup>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';
    import { useVModel } from '@vueuse/core';

    export default defineComponent({
        name: 'WoPickupField',
        components: {
            FieldInput,
            FieldGroup,
            FieldLegend,
            Icon,
            AddDeleteBtn,
        },
        props: {
            pickups: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:pickups'],
        setup(props, { emit }) {
            const pickups = useVModel(props, 'pickups', emit);
            const lastIndex = computed(() => {
                return props.pickups.length - 1;
            });

            const defaultPickup = {
                pickupId: '',
                description: '',
            };

            if (pickups.value.length === 0) {
                pickups.value.push(defaultPickup);
            }

            const firstIndex = 0;
            const pickupInnerId = ref(0);
            pickups.value = pickups.value.map((pickup: any) => {
                pickupInnerId.value++;
                pickup.innerId = pickup?.innerId ?? pickupInnerId.value;

                return pickup;
            });
            const remove = (id: number) => {
                pickups.value = pickups.value.filter((pickup: any) => {
                    if (pickup.innerId !== id) {
                        return pickup;
                    }
                });
            };
            const add = (): void => {
                pickupInnerId.value++;
                const newPickupId = pickupInnerId.value;
                pickups.value.push({
                    innerId: newPickupId,
                    pickupId: '',
                    description: '',
                });
            };

            if (pickups?.value?.length === 0) {
                add();
            }

            return {
                lastIndex,
                firstIndex,
                pickups,
                remove,
                add,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .icon {
        @apply w-5 h-5;
    }
    .ghost {
        @apply border-none shadow-none;
        & > .icon {
            @apply text-transparent;
        }
    }
</style>
