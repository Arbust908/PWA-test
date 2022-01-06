<template>
    <FieldGroup class="pt-2 pb-3 relative">
        <FieldSelect
            v-model:data="resource.role"
            class="col-span-full mr-5"
            title="Rol"
            :field-name="`crew-${crewId}-${resource.id}-role`"
            placeholder="Seleccione Rol"
            :endpoint-data="roles"
        />
        <span v-if="notLonlyResource" :class="lonlyClasses" class="md:absolute md:-right-12 ml-4">
            <CircularBtn class="btn__delete" size="sm" @click="$emit('removeResource', [crewId, resource.id])">
                <Icon icon="Trash" class="w-6 h-6" />
            </CircularBtn>
            <!-- 
                crews = [ crewA, crewB, crewC]
                crewA = [ peopl1, people2]
                crewB = [ peoplA, peopleB, peopleC]
                crewC = [ lonlyPerson ]
             -->
        </span>

        <FieldSelect
            v-model:data="resource.name"
            class="col-span-full mr-5"
            title="Empleado"
            :field-name="`crew-${crewId}-${resource.id}-name`"
            placeholder="Empleado"
            :endpoint-data="noAdminUsers"
            endpoint-key="firstName"
        />
    </FieldGroup>
</template>

<script lang="ts">
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldSelect,
            CircularBtn,
            Icon,
        },
        props: {
            people: {
                type: Object,
                required: true,
            },
            roles: {
                type: Array,
                required: true,
            },
            users: {
                type: Array,
                required: true,
            },
            crewId: {
                type: Number,
                required: true,
            },
            peopleIndex: {
                type: Number,
                default: 0,
            },
            notLonlyResource: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['removeResource', 'update:people'],
        setup(props) {
            const resource = useVModel(props, 'people');

            const lonlyClasses = () => {
                return props.peopleIndex === 0 ? 'md:top-10' : 'md:top-6';
            };

            const noAdminUsers = computed(() => {
                if (props.roles && props.people.role > -1) {
                    return props.users.filter((user: any) => {
                        console.log('USER', user);
                        console.log('crews.value ROLE', props.people.role);

                        return user.roleId === props.people.role;
                    });
                }

                return [];
            });

            return {
                lonlyClasses,
                noAdminUsers,
                resource,
            };
        },
    });
</script>

<style scoped></style>
