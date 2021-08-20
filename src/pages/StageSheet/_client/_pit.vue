<template>
  <Layout>
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">
        <span> Stage sheets </span>
        >
        <route-link :to="`/stage-sheet/${}`">{{}}</route-link>
        >
        <span>{{}}</span>
      </h1>
    </header>
    <section class="panel col-span-full">
      <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <StageHeader />
                  </thead>
                  <tbody class="divide-y">
                    <SandPlanStage
                      v-for="(stage, Key) in currentStageSheet.stages"
                      :key="Key"
                      :stage="stage"
                      :editing="editingStage"
                      :sands="sands"
                      @editStage="editStage"
                      @saveStage="saveStage"
                      @duplicateStage="duplicateStage"
                      @deleteStage="deleteStage"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  </Layout>
</template>

<script>
  import { ref, watchEffect } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import UiBtn from '@/components/ui/Button.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Pill from '@/components/ui/Pill.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import FieldLoading from '@/components/ui/form/FieldLoading.vue';
  import StageHeader from '@/components/sandPlan/StageHeader.vue';
  import SandPlanStage from '@/components/sandPlan/SandPlanStage.vue';

  import '@/assets/table.scss';

  import { useApi } from '@/helpers/useApi';

  export default {
    components: {
      Layout,
      UiBtn,
      UiTable,
      Icon,
      Pill,
      FieldGroup,
      FieldSelect,
      FieldLoading,
      StageHeader,
      SandPlanStage,
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
