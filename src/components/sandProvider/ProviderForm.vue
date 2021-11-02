<template>
    <FieldGroup>
        <FieldInput
            class="col-span-full"
            title="Nombre / Razón Social"
            field-name="sandProvName"
            placeholder="Ingresar Nombre / Razón Social"
            :data="spName"
            require-validation
            entity="sandProvider"
            @update:data="spName = $event"
        />
        <FieldInput
            class="col-span-full"
            title="CUIT / CUIL"
            field-name="sandProvId"
            placeholder="Ingresar CUIT / CUIL"
            mask="#*"
            :data="spLegalId"
            require-validation
            validation-type="extension"
            :char-amount="{ min: 11, max: 11 }"
            entity="sandProvider"
            @update:data="spLegalId = Number($event)"
        />
        <FieldInput
            class="col-span-full"
            title="Domicilio"
            field-name="sandProvAddress"
            placeholder="Ingresar domicilio"
            :data="spAddress"
            require-validation
            entity="sandProvider"
            @update:data="spAddress = $event"
        />
        <label class="col-span-full" for="meshType">
            <span>Tipo de malla</span>
            <div v-if="spMeshTypes.length > 0" class="mb-4">
                <div v-for="(mesh, i) in spMeshTypes" :key="i" class="flex items-center">
                    <FieldInput
                        class="col-span-7"
                        field-name="mesh"
                        placeholder="Malla"
                        is-readonly
                        :data="mesh.type"
                        require-validation
                        entity="sandProvider"
                    />
                    <Icon
                        icon="Trash"
                        type="outline"
                        size="lg"
                        class="ml-3 w-5 h-5 cursor-pointer"
                        @click="deleteMeshType(i)"
                    />
                </div>
            </div>
            <div v-else class="mb-6 hidden">
                <FieldInput
                    class="col-span-7"
                    field-name="mesh"
                    placeholder="Malla"
                    is-readonly
                    require-validation
                    entity="sandProvider"
                />
            </div>
            <div class="flex items-center">
                <FieldSelect
                    field-name="sandType"
                    placeholder="Seleccionar"
                    endpoint-key="type"
                    :data="spMesh"
                    :filtered-data="filteredMeshTypes"
                    require-validation
                    entity="sandProvider"
                    @is-blured="checkMeshValidation"
                    @change="addMeshType($event.target.value)"
                />
            </div>
            <InvalidInputLabel v-if="!isMeshValid && wasMeshSelectBlured" validation-type="empty" />
        </label>

        <FieldTextArea
            class="col-span-full"
            field-name="observations"
            placeholder="Observaciones..."
            title="Observaciones"
            :rows="5"
            is-fixed
            is-optional
            :data="spObs"
            @update:data="spObs = $event"
        />
    </FieldGroup>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue';
    import { useVModels } from '@vueuse/core';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';

    export default defineComponent({
        components: {
            FieldGroup,
            FieldInput,
            FieldSelect,
            FieldTextArea,
            Icon,
            InvalidInputLabel,
        },
        props: {
            spName: {
                type: String,
                default: '',
            },
            spLegalId: {
                type: Number,
                default: 12345678901,
            },
            spAddress: {
                type: String,
                default: '',
            },
            spMeshTypes: {
                type: Array,
                default: () => [],
            },
            spMesh: {
                type: String,
                default: '',
            },
            spObs: {
                type: String,
                default: '',
            },
            meshTypes: {
                type: Array,
                default: [],
            },
            sandProvider: {
                type: Object,
                default: {},
            },
        },
        setup(props, { emit }) {
            const { spName, spLegalId, spAddress, spMeshTypes, spMesh, spObs, sandProvider } = useVModels(props, emit);
            const { meshTypes } = toRefs(props);

            const filteredMeshTypes = computed(() => {
                const selectedMeshTypes = spMeshTypes.value.map((mesh) => mesh.id);

                return meshTypes.value.filter((m: any) => !selectedMeshTypes.includes(m.id));
            });

            const deleteMeshType = (index: number) => {
                emit('delete-mesh-type', index);
                spMesh.value = -1;
                checkMeshValidation();
            };

            const addMeshType = (mesh: Object) => {
                if (mesh) {
                    emit('add-mesh-type', mesh);
                }
                spMesh.value = -1;
            };

            const wasMeshSelectBlured = ref(false);

            const isMeshValid = computed(() => {
                if (!wasMeshSelectBlured.value) {
                    return;
                }

                if (spMeshTypes.value.length > 0) {
                    return true;
                }

                return false;
            });

            const checkMeshValidation = () => {
                if (!wasMeshSelectBlured.value) {
                    wasMeshSelectBlured.value = true;
                }
            };

            return {
                deleteMeshType,
                addMeshType,
                spName,
                spLegalId,
                spAddress,
                spMeshTypes,
                spMesh,
                spObs,
                checkMeshValidation,
                wasMeshSelectBlured,
                isMeshValid,
                meshTypes,
                filteredMeshTypes,
            };
        },
    });
</script>
