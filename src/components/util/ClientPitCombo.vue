<template class="gap-2">
  <FieldSelect
    v-if="clients.length > 0"
    class="col-span-full md:col-span-6"
    fieldName="client"
    placeholder="Seleccionar cliente"
    title="Cliente"
    :endpointData="clients"
    :data="clientId"
    @update:data="clientId = $event"
  />
  <FieldLoading class="col-span-6" v-else />
  <FieldSelect
    v-if="pits.length > 0"
    class="col-span-full md:col-span-6"
    fieldName="pit"
    placeholder="Seleccionar pozo"
    title="Pozo"
    :endpointData="pits"
    :data="pitId"
    @update:data="pitId = $event"
  />
  <FieldLoading class="col-span-6" v-else />
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { Pit, Company } from '@/interfaces/sandflow';
  import { useApi } from '@/helpers/useApi';
  import { useVModels } from '@vueuse/core';

  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';

  export default defineComponent({
    name: 'ClientPitCombo',
    props: {
      clientId: {
        type: Number,
        required: true,
      },
      pitId: {
        type: Number,
        required: true,
      },
    },
    components: {
      FieldSelect,
      FieldLoading,
    },
    setup(props, { emit }) {
      const { clientId, pitId } = useVModels(props, emit);
      const { read: getClients } = useApi('/company');
      const backupClients = getClients();
      const clients = ref([] as Array<Company>);
      watch(backupClients, (newVal) => {
        if (newVal) {
          clients.value = newVal;
        }
      });

      const { read: getPits } = useApi('/pit');
      const backupPits = getPits();
      console.log(getPits());
      console.log(backupPits.value);
      const pits = ref([] as Array<Pit>);
      watch(backupPits, (newVal) => {
        if (newVal) {
          pits.value = newVal;
        }
      });

      const filterPitsByClient = (clientId: number) => {
        pits.value = [];
        setTimeout(() => {
          const proxyPitId = pitId.value ? pitId.value : 0;
          const waiter = setInterval(() => {
            if (backupPits.value) {
              pits.value = backupPits.value.filter((pit: Pit) => {
                console.log(pit.companyId, clientId);
                return pit.companyId == clientId;
              });
              if (pits.value.length === 1) {
                pitId.value = pits.value[0].id || -1;
              } else if (pits.value.length <= 0) {
                pits.value = [{ name: 'No hay pozos', id: -1 }];
                pitId.value = -1;
              } else {
                pitId.value = proxyPitId;
              }
              clearInterval(waiter);
              console.log('passed waiter');
            }
          }, 1000);
        }, 100);
      };
      const selectClientByPit = (pitId: number) => {
        const curPit = backupPits.value.find((pit: Pit) => {
          return pit.id == pitId;
        });
        if (curPit) {
          setTimeout(() => {
            const selectedClientId =
              backupClients.value.find((client: Company) => {
                return client.id == curPit.companyId;
              }).id || -1;
            if (selectedClientId >= 0) {
              console.log('Slected Client')
              clientId.value = Number(selectedClientId) || -1;
            } else {
              console.log('No Client');
              clientId.value = -1;
            }
          }, 100);
        }
      };
      watch(pitId, (newVal) => {
        if (newVal >= 0) {
          console.log('New pit ID', newVal);
          selectClientByPit(newVal);
        }
      });
      watch(clientId, (newVal) => {
        if (newVal >= 0) {
          console.log('New client ID', newVal);
          filterPitsByClient(newVal);
        }
      });

      return {
        clientId,
        pitId,
        clients,
        backupClients,
        pits,
        backupPits,
      };
    },
  });
</script>
