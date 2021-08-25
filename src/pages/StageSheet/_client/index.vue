<template>
  <Layout>
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Stage sheets</h1>
      <router-link to="/stage-sheet/nuevo">
        <PrimaryBtn>Crear nuevo</PrimaryBtn>
      </router-link>
    </header>
    <section class="mb-9">
      <h3 class="font-bold text-lg">Filtros</h3>
      <FieldGroup class="max-w-xl">
        <FieldSelect
          v-if="clients.length > 0"
          class="col-span-6"
          fieldName="client"
          placeholder="Seleccionar cliente"
          title="Cliente"
          endpoint="/company"
          :endpointData="clients"
          :data="filterCompanyId"
          @update:data="filterCompanyId = $event"
        />
        <FieldLoading class="col-span-6" v-else />
        <FieldSelect
          v-if="pits.length > 0"
          class="col-span-6"
          fieldName="pit"
          placeholder="Seleccionar pozo"
          title="Pozo"
          endpoint="/pit"
          :endpointData="pits"
          :data="filterPitId"
          @update:data="filterPitId = $event"
        />
        <FieldLoading class="col-span-6" v-else />
      </FieldGroup>
    </section>
    <UiTable class="centered">
      <template #header>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Pozo</th>
          <th scope="col">Etapas creadas</th>
          <th scope="col">Estado</th>
          <th scope="col">
            <span class="sr-only"> Acciones </span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(st, Key) in stDB"
          :key="st.id"
          :class="Key % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td scope="col">Cliente</td>
          <td scope="col">VC01</td>
          <td scope="col">x - 40</td>
          <td scope="col">
            <Pill>
              Estado
              <!-- {{ sheet.state }} -->
            </Pill>
          </td>
          <td>
            <div class="btn-panel centered">
              <router-link :to="`/tipos-de-arena/${st.id}`" class="add">
                <Icon icon="PlusCircle" class="w-5 h-5" />
                <span class="sr-only"> Agregar </span>
              </router-link>
              <router-link :to="`/tipos-de-arena/${st.id}`" class="edit">
                <Icon icon="DocumentText" class="w-5 h-5" />
                <span class="sr-only"> Ver lista </span>
              </router-link>
              <button class="delete" @click="">
                <Icon icon="Trash" class="w-5 h-5" />
                <span class="sr-only"> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="stDB.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay arenas cargadas</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script>
  import { ref, watchEffect } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Pill from '@/components/ui/Pill.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';

  import '@/assets/table.scss';

  import { useApi } from '@/helpers/useApi';

  export default {
    components: {
      Layout,
      PrimaryBtn,
      UiTable,
      Icon,
      Pill,
      FieldGroup,
      FieldSelect,
      FieldLoading,
    },
    setup() {
      const store = useStore();
      const stDB = ref([]);
      const sandDB = JSON.parse(JSON.stringify(store.state.sand.all));

      const { read: getClients } = useApi('/company');
      const clients = getClients();
      const backupClients = getClients();
      const { read: getPits } = useApi('/pit');
      const pits = getPits();
      const backupPits = getPits();

      const filterCompanyId = ref(-1);
      const filterPitId = ref(-1);
      watchEffect(() => {
        if (filterCompanyId.value !== -1) {
          pits.value = [];
          setTimeout(() => {
            pits.value = backupPits.value.filter((pit) => {
              return pit.companyId == filterCompanyId.value;
            });
            if (pits.value.length === 1) {
              filterPitId.value = pits.value[0].id;
            } else if (pits.value.length <= 0) {
              pits.value = [{ name: 'No hay pozos', id: -1 }];
              filterPitId.value = -1;
            }
          }, 100);
        }
        if (filterPitId.value !== -1) {
          const curPit = backupPits.value.find((pit) => {
            return pit.id == filterPitId.value;
          });
          if (curPit) {
            clients.value = [];
            setTimeout(() => {
              clients.value = backupClients.value.filter((client) => {
                return client.id == curPit.companyId;
              });
              if (clients.value.length === 1) {
                filterCompanyId.value = clients.value[0].id;
              } else if (clients.value.length <= 0) {
                clients.value = [{ name: 'No hay clientes', id: -1 }];
              }
            }, 100);
          }
        }
      });

      return {
        stDB,
        filterCompanyId,
        filterPitId,
        clients,
        pits,
      };
    },
  };
</script>
