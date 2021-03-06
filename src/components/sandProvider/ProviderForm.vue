<template>
    <FieldGroup>
        <FieldInput
            class="col-span-full"
            title="Nombre / Razón social"
            field-name="sandProvName"
            placeholder=""
            :data="sandProvider.name"
            require-validation
            entity="sandProvider"
            @update:data="sandProvider.name = $event"
        />

        <FieldInput
            class="col-span-full"
            title="CUIT / CUIL"
            field-name="sandProvId"
            placeholder="Ingrese sólo números"
            mask="###########"
            :data="sandProvider.legalId"
            require-validation
            validation-type="extension"
            :char-amount="{ min: 11, max: 11 }"
            entity="sandProvider"
            @update:data="sandProvider.legalId = Number($event)"
        />

        <FieldInput
            class="col-span-full"
            title="Domicilio"
            field-name="sandProvAddress"
            placeholder="Ingrese domicilio"
            :data="sandProvider.address"
            require-validation
            entity="sandProvider"
            @update:data="sandProvider.address = $event"
        />

        <label class="col-span-full" for="meshType">
            <span>Tipo de malla</span>
            <div v-if="sandProvider.meshType?.length > 0" class="mb-4 col-span-12">
                <div v-for="(mesh, i) in sandProvider.meshType" :key="i" class="flex items-center">
                    <FieldInput
                        class="w-5/6"
                        field-name="mesh"
                        placeholder="Malla"
                        is-readonly
                        :data="mesh.type"
                        require-validation
                        entity="sandProvider"
                    />
                    <AddDeleteBtn class="mt-2" purpose="remove" @click.prevent="deleteMeshType(i)" />
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
                    class="w-full"
                    field-name="sandType"
                    placeholder="Ingrese tipo de malla"
                    endpoint-key="type"
                    :data="selectedMesh"
                    :endpoint-data="filteredMeshTypes"
                    require-validation
                    entity="sandProvider"
                    @is-blured="checkMeshValidation"
                    @update:data="addMeshType(String($event))"
                />
            </div>
            <InvalidInputLabel v-if="!isMeshValid && wasMeshSelectBlured" validation-type="empty" />
        </label>

        <FieldTextArea
            class="col-span-full"
            field-name="observations"
            placeholder=""
            title="Observaciones"
            :rows="5"
            is-fixed
            is-optional
            :data="sandProvider.observations"
            @update:data="sandProvider.observations = $event"
        />
    </FieldGroup>
</template>

<script setup lang="ts">
    import { computed, defineComponent, ref, onMounted } from 'vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { Sand } from '@/interfaces/sandflow';

    const props = defineProps({
        modelValue: {
            type: Object,
            required: true,
        },
    });
    const emits = defineEmits(['update:modelValue']);
    const store = useStore();
    const router = useRouter();
    const sandProvider = computed({
        get: () => props.modelValue,
        set: (value) => emits('update:modelValue', value),
    });

    const selectedMesh = ref(-1);
    const meshTypes = ref([]);

    const filteredMeshTypes = computed(() => {
        const selectedMeshTypes = sandProvider.value.meshType?.map((mesh: Sand) => mesh.id);

        return meshTypes.value
            .filter((mesh: Sand) => mesh.visible)
            .filter((m: any) => !selectedMeshTypes.includes(m.id));
    });

    const addMeshType = (newMeshType: string) => {
        // check duplicates
        const exists = sandProvider.value.meshType.map((mesh: Sand) => mesh.id).includes(newMeshType);

        if (exists) {
            return;
        }

        const newMesh = meshTypes.value.find((mesh: Sand) => {
            if (mesh.id === Number(newMeshType)) {
                return mesh;
            }
        });

        sandProvider.value.meshType.push(newMesh);
    };

    const deleteMeshType = (index: any) => {
        sandProvider.value.meshType.splice(index, 1);
    };

    const wasMeshSelectBlured = ref(false);

    const isMeshValid = computed(() => {
        if (sandProvider.value.meshType?.length > 0) {
            return true;
        }

        return false;
    });

    const checkMeshValidation = () => {
        if (!wasMeshSelectBlured.value) {
            wasMeshSelectBlured.value = true;
        }
    };

    onMounted(async () => {
        const result = await useStoreLogic(router, store, 'sand', 'getAll');

        if (result.type == 'success') {
            meshTypes.value = result.res;
        }
    });
</script>
