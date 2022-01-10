<template>
    <form method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-20">
        <FieldGroup v-for="(crew, key) in crews" :key="crew.id + key" class="max-w-sm w-full content-start">
            <FieldLegend>
                <span>{{ crew.title }}</span>
                <AddDeleteBtn v-if="crews.length > 1" purpose="remove" @click="removeCrew(crew.id)" />
            </FieldLegend>
            <section class="flex gap-2 flex-col sm:flex-row items-start mb-4 col-span-full">
                <label class="flex flex-col" :for="`crew-${crew.id}-start-time`">
                    <p>Hora de inicio</p>
                    <TimePicker :timetrack="Number(crew.timeStart)" @update:timetrack="crew.timeStart = $event" />
                </label>
                <label class="flex flex-col" :for="`crew-${crew.id}-end-time`">
                    <p>Hora de fin</p>
                    <TimePicker :timetrack="Number(crew.timeEnd)" @update:timetrack="crew.timeEnd = $event" />
                </label>
            </section>
            <section class="col-span-full">
                <PeopleGroup
                    v-for="(people, peopleI) in crew.resources"
                    :key="people.id"
                    :people="people"
                    :people-index="peopleI"
                    :crew-id="crew.id"
                    :not-lonly-resource="notLonly(crew.resources)"
                    :users="users"
                    :roles="roles"
                    @remove-resource="removeResource($event[0], $event[1])"
                />
            </section>
            <span class="col-span-12">
                <button class="mt-1 flex items-center" @click.prevent="addResource(crew.id)">
                    <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                    <span class="font-bold text-lg"> Agregar rol </span>
                </button>
            </span>
        </FieldGroup>
    </form>
</template>

<script setup lang="ts">
    import Icon from '@/components/icon/TheAllIcon.vue';
    import TimePicker from '@/components/ui/form/TimePicker.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import PeopleGroup from '@/components/workOrder/peopleGroup.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';

    import { HumanResource, Crew } from '@/interfaces/sandflow';

    import { notLonly, getLast } from '@/helpers/iteretionHelpers';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    const props = defineProps({
        crews: {
            type: Array,
            default: () => [],
        },
        isFull: {
            type: Boolean,
            default: false,
        },
    });
    const emits = defineEmits(['update:crews']);
    const { crews } = useVModels(props, emits);
    const roles = ref([]);
    const users = ref([]);

    onMounted(async () => {
        const result = await axios.get(`${api}/role`);
        roles.value = result.data.data.filter((role: any) => role.id !== 2);
        const result2 = await axios.get(`${api}/user`);
        users.value = result2.data.data;
    });

    const defaultResource = {
        id: 0,
        name: -1,
        role: -1,
    };

    const removeResource = (crewId: number, peopleId: number) => {
        const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
        selectedCrew.resources = selectedCrew.resources.filter((resource: HumanResource) => resource.id !== peopleId);
    };

    const addResource = (crewId: number): void => {
        const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
        const lastResource = getLast(selectedCrew.resources);
        const lastId = lastResource.id + 1 || 1; // ***
        selectedCrew.resources.push({
            ...defaultResource,
            id: lastId,
        });
    };

    const removeCrew = (crewId: number): void => {
        crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
    };

    if (crews?.value?.some((crew: Crew) => crew.resources?.length === 0)) {
        crews.value.forEach((crew: Crew) => {
            if (crew.resources?.length === 0 && crew.id) {
                addResource(crew.id);
            }
        });
    }
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
