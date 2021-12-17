<template>
    <form method="POST" action="/" class="p-4" @submit.prevent>
        <FieldGroup>
            <FieldInput
                class="col-span-full sm:col-span-9"
                field-name="firstName"
                placeholder="Ingresar nombre"
                title="Nombre"
                :data="user.firstName"
                require-validation
                entity="user"
                @update:data="user.firstName = $event"
            />
            <FieldInput
                class="col-span-full sm:col-span-9"
                field-name="email"
                placeholder="empresa@mail.com"
                title="Correo personal de la compañia"
                :data="user.email"
                require-validation
                entity="user"
                @update:data="user.email = $event"
            />
            <FieldRadio
                id="rol"
                v-model="user.roleId"
                class="col-span-full sm:col-span-9 mt-3"
                title="Asignar Rol"
                :options="roles"
            />
        </FieldGroup>
    </form>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldRadio from '@/components/ui/form/FieldRadio.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            FieldRadio,
        },
        props: {
            modelValue: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                default: '',
            },
            description: {
                type: String,
                default: '',
            },
        },
        emits: ['update:modelValue'],
        setup(props, { emit }) {
            const store = useStore();
            const router = useRouter();

            const roles = ref([]);

            const user = computed({
                get: () => props.modelValue,
                set: (value) => emit('update:modelValue', value),
            });

            const loadRoles = async () => {
                const result = await useStoreLogic(router, store, 'role', 'getAll');

                if (result.type == 'success') {
                    roles.value = result.res.map((role) => ({
                        value: role.id,
                        text: role.name,
                    }));
                }
            };

            onMounted(async () => {
                await loadRoles();

                if (user.value.roleId == null) {
                    user.value.roleId = roles.value[0].value;
                }
            });

            return {
                roles,
                user,
            };
        },
    });
</script>
