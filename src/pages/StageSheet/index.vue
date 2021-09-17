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
          :endpointData="pits"
          :data="filterPitId"
          @update:data="filterPitId = $event"
        />
        <FieldLoading class="col-span-6" v-else />
      </FieldGroup>
      <NoneBtn v-if="hasFilters" @click="resetFilter">Eliminar filtro</NoneBtn>
    </section>
    <UiTable class="centered">
      <template #header>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Pozo</th>
          <th scope="col">Etapas creadas</th>
          <th scope="col">Estado</th>
          <th scope="col">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(StSh, Key) in stageSheets"
          :key="StSh.id"
          :class="Key % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <td scope="col"> {{ getClient(StSh) }} </td>
          <td scope="col"> {{ getPit(StSh) }} </td>
          <td scope="col"> {{ getStages(StSh) }} </td>
          <td scope="col">
            <Pill>
              {{ stageStatus(StSh) }}
            </Pill>
          </td>
          <td>
            <div class="btn-panel centered gap-4">
              <Popper hover content="Agregar etapa">
                <router-link :to="`/stage-sheet/${StSh.id}/nueva`" class="add">
                  <Icon icon="PlusCircle" class="w-5 h-5" />
                  <span class="sr-only"> Agregar </span>
                </router-link>
              </Popper>
              <Popper hover content="Ver stage sheet">
                <router-link :to="`/stage-sheet/${StSh.id}`" class="edit">
                  <Icon icon="DocumentText" class="w-5 h-5" />
                  <span class="sr-only"> Ver lista </span>
                </router-link>
              </Popper>
              <Popper hover content="Eliminar stage sheet">
                <button class="delete" @click="deleteStageSheet(StSh.id)">
                  <Icon icon="Trash" class="w-5 h-5" />
                  <span class="sr-only"> Eliminar </span>
                </button>
              </Popper>
            </div>
          </td>
        </tr>
        <tr v-if="stageSheets && stageSheets.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay Satge Sheets</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script>
  import { ref, watch, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useTitle } from '@vueuse/core';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Pill from '@/components/ui/Pill.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';
  import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
  import Popper from "vue3-popper";

  import { useApi } from '@/helpers/useApi';
  import router from '@/router';
  import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';

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
      ClientPitCombo,
      Popper,
      NoneBtn,
    },
    setup() {
      useTitle('Stage Sheets <> Sandflow');
      const store = useStore();
      const { read: getClients } = useApi('/company');
      const clients = getClients();
      const { read: getPits } = useApi('/pit');
      const pits = getPits();

      const filterCompanyId = ref(-1);
      const filterPitId = ref(-1);

      const { read: getStageSheets, destroy: deleteStSh } = useApi('/stageSheet');
      const backupStageSheets = getStageSheets();
      const stageSheets = getStageSheets();

      const filterStSH = computed(() => {
        return stageSheets?.value ? stageSheets.value
          .filter((StSh) => {
            if (filterCompanyId.value !== -1) {
              return StSh.companyId === filterCompanyId.value;
            }
            return StSh;
          })
          .filter((StSh) => {
            if (filterPitId.value !== -1) {
              return StSh.pitId === filterPitId.value;
            }
            return StSh;
          }) : [];
      });


      const hasFilters = computed(() => {
        return filterCompanyId.value !== -1 || filterPitId.value !== -1;
      });
      const resetFilter = () => {
        filterCompanyId.value = -1;
        filterPitId.value = -1;
        stageSheets.value = backupStageSheets.value;
      };



      const stageStatus = (stageSheet) => {
        console.log(stageSheet);
        return 'en progresso'
      };
      const deleteStageSheet = (id) => {
        console.log(id);
        const data = deleteStSh(id);
        console.log(backupStageSheets.value);
        console.log(stageSheets.value);
        console.log(id);
        stageSheets.value = backupStageSheets.value.filter((stSh) => stSh.id !== id);
        console.log(stageSheets.value);
      };
      const getClient = (stageSheet) => {
        const client = clients.value.find((client) => client.id === stageSheet.companyId);
        return client ? client.name : 'Sin cliente';
      }
      const getPit = (stageSheet) => {
        const pit = pits.value.find((pit) => pit.id === stageSheet.pitId);
        return pit ? pit.name : 'Sin pozo';
      }
      const getStages = (stageSheet) => {
        console.log(stageSheet);
        const amount = stageSheet.stages?.length || 0;
        return `${amount}/40`;
      }

      return {
        filterCompanyId,
        filterPitId,
        clients,
        pits,
        stageSheets: filterStSH,
        stageStatus,
        deleteStageSheet,
        getClient,
        getPit,
        getStages,
        hasFilters,
        resetFilter,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/table.scss';
</style>
