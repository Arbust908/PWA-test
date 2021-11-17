<template>
    <dl class="rounded-md shadow-md bg-white p-3 grid gap-2">
        <div class="flex justify-between">
            <dt class="font-semibold text-xl">{{ name }}</dt>
            <dd class="flex items-center mb-2">
                <Icon
                    icon="PencilAlt"
                    type="outline"
                    class="w-7 h-7 cursor-pointer text-blue-600"
                    @click="editDriver()"
                />
                <Icon
                    icon="Trash"
                    type="outline"
                    class="w-7 h-7 cursor-pointer text-gray-500"
                    @click="deleteDriver()"
                />
            </dd>
        </div>
        <div>
            <dt class="font-bold">Teléfono:</dt>
            <dd>{{ phone }}</dd>
        </div>
        <div>
            <dt class="font-bold">Mail:</dt>
            <dd>{{ email }}</dd>
        </div>
        <div>
            <dt class="font-bold">Tipo de transporte:</dt>
            <dd>{{ vehicleType }}</dd>
        </div>
        <div>
            <dt class="font-bold">Patente de camión:</dt>
            <dd>{{ transportId }}</dd>
        </div>
        <div>
            <dt class="font-bold">Patente del acoplado:</dt>
            <dd>{{ transportId2 }}</dd>
        </div>
        <div>
            <dt class="font-bold">Observaciones:</dt>
            <dd>{{ observations }}</dd>
        </div>
    </dl>
</template>

<script>
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { ref, toRefs } from 'vue';
    export default {
        components: {
            Icon,
        },
        props: {
            name: {
                type: String,

                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            vehicleType: {
                type: String,
                required: true,
            },
            transportId: {
                type: String,
                required: true,
            },
            transportId2: {
                type: String,
                required: true,
            },
            observations: {
                type: String,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { name, phone, email, vehicleType, vehicleId, transportId, transportId2, observations, key } =
                toRefs(props);

            const deleteDriver = () => {
                emit('delete-driver');
            };

            const editDriver = () => {
                emit('edit-driver');
            };

            return {
                name,
                phone,
                email,
                vehicleType,
                vehicleId,
                transportId,
                transportId2,
                observations,
                deleteDriver,
                editDriver,
            };
        },
    };
</script>

<style lang="scss" scoped>
    dl > div {
        @apply flex gap-2;
    }
</style>
