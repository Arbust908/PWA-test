<template>
  <FieldGroup>
    <FieldInput
      class="col-span-full"
      title="Nombre y apellido"
      fieldName="driverName"
      placeholder="Ingresar conductor"
      :data="driverName"
      @update:data="driverName = $event"
      requireValidation
      :silenced="silenced"
      entity="transportProvider"
      @change="validationHandler"
    />
    <FieldInput
      class="col-span-full"
      fieldName="driverPhone"
      placeholder="+11 1234 5678"
      mask="#*"
      title="Teléfono"
      :data="driverPhone"
      @update:data="driverPhone = $event"
      requireValidation
      :silenced="silenced"
      entity="transportProvider"
    />
    <FieldInput
      class="col-span-full"
      fieldName="driverEmail"
      placeholder="empresa@mail.com"
      title="Email"
      :data="driverEmail"
      @update:data="driverEmail = $event"
      requireValidation
      :silenced="silenced"
      entity="transportProvider"
      validationType="email"
    />
    <FieldInput
      class="col-span-full"
      title="Tipo de transporte"
      fieldName="driverVehicleType"
      placeholder="Doble carga"
      :data="driverTType"
      @update:data="driverTType = $event"
      requireValidation
      :silenced="silenced"
      entity="transportProvider"
    />
    <FieldInput
      class="col-span-full"
      title="Patente"
      fieldName="driverVehicleId"
      placeholder="patente"
      :data="driverTId"
      @update:data="driverTId = $event"
      requireValidation
      :silenced="silenced"
      entity="transportProvider"
    />
    <button
      :class="[
        'flex items-center w-[250px]',
        driverFull ? null : 'text-gray-200 cursor-not-allowed',
      ]"
      @click.prevent="driverFull && addDriver()"
    >
      <Icon icon="Plus" type="outline" class="w-5 h-5" />
      <h2>Agregar Transportista</h2>
    </button>
  </FieldGroup>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import { useVModels } from '@vueuse/core';
  import Icon from '@/components/icon/TheAllIcon.vue';

  export default defineComponent({
    props: {
      driverName: {
        type: String,
        default: '',
      },
      driverPhone: {
        type: String,
        default: '123456789',
      },
      driverEmail: {
        type: String,
        default: '',
      },
      driverTType: {
        type: String,
        default: '',
      },
      driverTId: {
        type: String,
        default: '',
      },
      driverObs: {
        type: String,
        default: '',
      }
    },
    components: {
      FieldGroup,
      FieldInput,
      Icon
    },
    setup(props, { emit }) {
      const {
        driverName,
        driverPhone,
        driverEmail,
        driverTType,
        driverTId,
        driverObs
      } = useVModels(props, emit);

      const silenced = ref(true)

      const validationHandler = () => {
        silenced.value = false
      }

      const addDriver = () => {
        silenced.value = true
        emit('add-driver')
      }

      const driverFull: ComputedRef<boolean> = computed(() => {
        return driverName.value !== '' &&
        driverPhone.value !== '' &&
        driverEmail.value !== '' &&
        driverTType.value !== '' &&
        driverTId.value !== ''
      });

      return {
        driverName,
        driverPhone,
        driverEmail,
        driverTType,
        driverTId,
        driverObs,
        silenced,
        validationHandler,
        driverFull,
        addDriver,
        Icon
      };
    },
  });
</script>
