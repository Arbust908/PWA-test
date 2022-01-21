<template>
    <FieldGroup class="pt-2 pb-3 relative">
        <FieldSelect
            v-model:data="resource.role"
            class="col-span-full mr-5"
            title="Rol"
            :field-name="`crew-${crewId}-${resource.id}-role`"
            placeholder="Seleccione Rol"
            :endpoint-data="roles"
            @change="resource.name = -1"
        />
        <span v-if="notLonlyResource" :class="lonlyClasses" class="md:absolute md:-right-12 ml-4">
            <AddDeleteBtn class="mt-8" purpose="remove" @click="$emit('removeResource', [crewId, resource.id])" />
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

<script setup lang="ts">
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';

    const props = defineProps({
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
    });
    const emits = defineEmits(['removeResource', 'update:people']);
    const resource = useVModel(props, 'people', emits);

    resource.value.role = Number(resource.value.role);
    resource.value.name = Number(resource.value.name);

    const lonlyClasses = () => {
        return props.peopleIndex === 0 ? 'md:top-10' : 'md:top-6';
    };

    const noAdminUsers = computed(() => {
        if (props.roles && props.people.role > -1) {
            return props.users.filter((user: any) => {
                return user.roleId === props.people.role;
            });
        }

        return [];
    });
</script>
