<template>
    <form method="POST" action="/" class="p-4 md:flex md:flex-wrap md:gap-20">
        <FieldGroup v-for="(crew, key) in crews" :key="crew.id" class="max-w-sm w-full content-start">
            <FieldLegend>
                <span>{{ crew.title }}</span>
                <CircularBtn v-if="crews.length > 1" class="btn__delete" size="sm" @click="removeCrew(crew.id)">
                    <Icon icon="Trash" class="icon" />
                </CircularBtn>
            </FieldLegend>
            <section class="flex gap-2 flex-col sm:flex-row items-start mb-4 col-span-full">
                <label class="flex flex-col" :for="`crew-${crew.id}-start-time`">
                    <p>Hora de Inicio</p>
                    <TimePicker :timetrack="Number(crew.timeStart)" @update:timetrack="crew.timeStart = $event" />
                </label>
                <label class="flex flex-col" :for="`crew-${crew.id}-end-time`">
                    <p>Hora de Fin</p>
                    <TimePicker :timetrack="Number(crew.timeEnd)" @update:timetrack="crew.timeEnd = $event" />
                </label>
            </section>
            <section class="col-span-full">
                <FieldGroup v-for="(people, peopleI) in crew.resources" :key="people.id" class="pt-2 pb-3 relative">
                    <!-- TODO: Pasaria a FiledSelect si tuvieramos ABM de roles y Usuarios -->
                    <FieldInput
                        class="col-span-full mr-5"
                        :title="peopleI === 0 ? 'Rol' : null"
                        :field-name="`crew-${crew.id}-${people.id}-role`"
                        placeholder="Rol"
                        :data="people.role"
                        @update:data="people.role = $event"
                    />
                    <span
                        v-if="notOnly(crew.resources)"
                        :class="peopleI === 0 ? 'md:top-10' : 'md:top-6'"
                        class="md:absolute md:-right-12 ml-4"
                    >
                        <CircularBtn class="btn__delete" size="sm" @click="removeResource(crew.id, people.id)">
                            <Icon icon="Trash" class="w-6 h-6" />
                        </CircularBtn>
                    </span>
                    <FieldInput
                        class="col-span-full mr-5"
                        :field-name="`crew-${crew.id}-${people.id}-name`"
                        placeholder="Empleado"
                        :data="people.name"
                        @update:data="people.name = $event"
                    />
                </FieldGroup>
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
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';

    import { useVModels } from '@vueuse/core';
    import { HumanResource, Crew } from '@/interfaces/sandflow';

    export default {
        components: {
            FieldGroup,
            FieldInput,
            FieldLegend,
            CircularBtn,
            Icon,
            TimePicker,
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
        setup(props, { emit }) {
            const { crews } = useVModels(props, emit);
            const defaultResource = {
                id: 0,
                name: '',
                role: '',
            };
            const removeResource = (crewId: number, peopleId: number) => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                selectedCrew.resources = selectedCrew.resources.filter(
                    (resource: HumanResource) => resource.id !== peopleId
                );
            };
            const addResource = (crewId: number): void => {
                const selectedCrew = crews.value.find((crew: Crew) => crew.id === crewId);
                const lastId = selectedCrew.resources.length;
                selectedCrew.resources.push({
                    ...defaultResource,
                    id: lastId,
                });
            };
            const removeCrew = (crewId: number): void => {
                crews.value = crews.value.filter((crew: Crew) => crew.id !== crewId);
            };

            if (crews?.value?.some((crew: Crew) => crew.resources.length === 0)) {
                crews.value.forEach((crew: Crew) => {
                    if (crew.resources.length === 0) {
                        addResource(crew.id);
                    }
                });
            }

            const notLast = (crewInnerId: number, crewList: Array<HumanResource>) => {
                if (crewList.length === 0) {
                    return false;
                }
                const lastCrew = crewList[crewList.length - 1];

                return crewInnerId !== lastCrew.id;
            };
            const notOnly = (crewList: Array<HumanResource>) => {
                return crewList.length > 1;
            };

            // Is the RRHH section is full
            const isRRHHFull = computed(() => {
                return !!(crews.value.length > 0 && crews.value[0].start_time && crews.value[0].end_time);
            });

            return {
                addResource,
                crews,
                isRRHHFull,
                notLast,
                notOnly,
                removeCrew,
                removeResource,
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
