<template>
    <form method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-20">
        <FieldGroup v-for="(crew, key) in crews" :key="crew.id + key" class="max-w-sm w-full content-start">
            <FieldLegend>
                <span>{{ crew.title }}</span>
                <CircularBtn v-if="crews.length > 1" class="btn__delete" size="sm" @click="removeCrew(crew.id)">
                    <Icon icon="Trash" class="icon" />
                </CircularBtn>
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
                    <span class="font-bold text-lg"> Agregar otro </span>
                </button>
            </span>
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { computed } from 'vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import TimePicker from '@/components/ui/form/TimePicker.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import PeopleGroup from '@/components/workOrder/peopleGroup.vue';

    import { useVModels } from '@vueuse/core';
    import { HumanResource, Crew } from '@/interfaces/sandflow';

    import { notLonly } from '@/helpers/iteretionHelpers';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            FieldGroup,
            FieldLegend,
            CircularBtn,
            Icon,
            TimePicker,
            PeopleGroup,
        },
        props: {
            crews: {
                type: Array,
                default: () => [],
            },
            isFull: {
                type: Boolean,
                default: false,
            },
        },
        setup(props: any, { emit }: any) {
            const { crews } = useVModels(props, emit);
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
                selectedCrew.resources = selectedCrew.resources.filter(
                    (resource: HumanResource) => resource.id !== peopleId
                );
            };

            const addResource = (crewId: number): void => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                const lastId = selectedCrew.resources.length; // ***
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

            const isRRHHFull = computed(() => {
                return !!(crews.value.length > 0 && crews.value[0].start_time && crews.value[0].end_time);
            });

            return {
                addResource,
                crews,
                users,
                roles,
                isRRHHFull,
                removeCrew,
                removeResource,
                notLonly,
            };
        },
    };
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
