<template>
  <div class="rounded-md shadow-md bg-white p-3">
    <div class="flex justify-between">
      <div class="font-semibold">{{name}}</div>
      <div class="flex items-center mb-2">
        <Icon icon="PencilAlt" type="outline" class="w-7 h-7 cursor-pointer text-blue-600" @click="editDriver()" />
        <Icon icon="Trash" type="outline" class="w-7 h-7 cursor-pointer text-gray-500" @click="deleteDriver()" />
      </div>
    </div>
    <div><span class="font-bold">Teléfono:</span> {{phone}}</div>
    <div><span class="font-bold">Mail:</span> {{email}}</div>
    <div><span class="font-bold">Tipo de transporte:</span> {{vehicleType}}</div>
    <div><span class="font-bold">Patente:</span> {{vehicleId}}</div>
    <div><span class="font-bold">Observaciones:</span> {{observations}}</div>
  </div>
</template>

<script>
  import Icon from '@/components/icon/TheAllIcon.vue';
  import {ref, toRefs} from 'vue'
  export default {
    props: {
      name: {
        type: String,

        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      vehicleType: {
        type: String,
        required: true
      },
      vehicleId: {
        type: String,
        required: true
      },
      observations: {
        type: String,
        required: false
      },
    },
    components: {
      Icon
    },
    setup(props, {emit}) {
      const {name,phone,email,vehicleType,vehicleId,observations,key} = toRefs(props)

      const deleteDriver = () => {
        emit('delete-driver')
      }
      
      const editDriver = () => {
        emit('edit-driver')
      }

      return {
        name,
        phone,
        email,
        vehicleType,
        vehicleId,
        observations,
        deleteDriver,
        editDriver
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>