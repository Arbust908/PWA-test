<template>
  <FieldGroup>
    <FieldLegend>Arena</FieldLegend>
    <template v-for="(sPov, i) in sandProviders" :key="i">
      <FieldSelect
        class="col-span-10"
        fieldName="sandProvider"
        placeholder="Selecciona un proveedor"
        title="Proveedor"
        endpoint="/sandProvider"
        :data="sPov.id"
        @update:data="sPov.id = $event"
      />
      <div
        v-if="sandProviders.length > 1 && i !== lastSandProviderInner"
        class="col-span-2 flex items-end"
      >
        <CircularBtn
          class="btn__delete  flex items-center justify-center ml-2"
          size="sm"
          @click="removeSandProvider(sPov.innerId)"
        >
          <Icon icon="Trash" outline class="w-5 h-5" />
        </CircularBtn>
      </div>
      <div
        v-for="(so, Key) in sPov.SandOrders"
        :key="Key"
        class="relative grid grid-cols-12 col-span-full gap-4 mt-2"
      >
        <FieldSelect
          class="col-span-5"
          :title="Key === 0 ? 'Tipo' : null"
          fieldName="sandType"
          placeholder="Arena"
          endpoint="/sand"
          endpointKey="type"
          :data="so.sandTypeId"
          @update:data="so.sandTypeId = $event"
        />
        <AmountInput
          class="col-span-5"
          :title="Key === 0"
          :amount="so.amount"
          @update:amount="so.amount = $event"
        />
        <div class="flex col-span-2 ml-2 my-auto">
          <Icon v-if="sPov.SandOrders.length > 1 && Key !== sPov.SandOrders.length - 1" 
            icon="Trash" outline 
            class="w-5 h-5 mt-4" 
            @click.prevent="removeSandOrder(sPov.innerId, so.innerId)"
          />
        </div>
          <Icon 
            icon="PlusCircle" outline 
            class="w-7 h-7 text-green-500"
            @click.prevent="addSandOrder(sPov.innerId)"
          />
      </div>
    </template>
    <div class="col-span-full mt-1">
      <!-- <button
        class="flex items-center space-x-2"
        @click.prevent="addSandProvider"
      >
        <CircularBtn class="btn__add" size="xs">
          <Icon icon="Plus" outline class="w-4 h-4" />
        </CircularBtn>
        <span class="font-bold text"> Agregar proveedor </span>
      </button> -->
    </div>
  </FieldGroup>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  import FieldSelect from '@/components/ui/form/FieldSelect.vue';
  import AmountInput from '@/components/notifications/AmountInput.vue';
  import { useVModel } from '@vueuse/core';
  import { SandProvider, SandOrder } from '@/interfaces/sandflow';
  const defaultSandOrder: SandOrder = {
    innerId: 0,
    sandTypeId: -1,
    amount: null,
  };
  const defaultSandProvider = {
    innerId: 0,
    id: -1,
    SandOrders: [],
  };
  export default defineComponent({
    components: {
      CircularBtn,
      FieldGroup,
      FieldInput,
      FieldLegend,
      FieldSelect,
      AmountInput,
      Icon,
    },
    props: {
      sandProviders: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const sandProviders = useVModel(props, 'sandProviders', emit);

      const getCurrentSandProvider = (Inid: number): SandProvider => {
        return sandProviders.value.find((s) => s.innerId === Inid);
      };

      const sandOrderInnerId = ref(0);
      const addSandOrder = (spId: number) => {
        const newSandOrder = { ...defaultSandOrder };
        newSandOrder.innerId = ++sandOrderInnerId.value;
        const currSP = getCurrentSandProvider(spId);
        currSP?.SandOrders?.push(newSandOrder);
      };
      const removeSandOrder = (spId: number, soInid: number) => {
        const currSP = getCurrentSandProvider(spId);
        if (currSP) {
          currSP.SandOrders = currSP.SandOrders.filter(
            (so) => so.innerId !== soInid
          );
        }
      };

      const sandProviderInnerId = ref(0);
      const addSandProvider = () => {
        const newSandProvider = { ...defaultSandProvider };
        newSandProvider.innerId = ++sandProviderInnerId.value;
        newSandProvider.SandOrders = [{ ...defaultSandOrder }];
        sandProviders.value.push(newSandProvider);
      };
      const removeSandProvider = (spInid: number) => {
        sandProviders.value = sandProviders.value.filter(
          (sp) => sp.innerId !== spInid
        );
      };
      const lastSandProviderInner = computed(() => {
        return sandProviders.value.length - 1;
      });

      console.log(sandProviders);
      if (
        sandProviders &&
        sandProviders.value &&
        sandProviders.value.length <= 0
      ) {
        console.log('no sandProviders');
        addSandProvider();
      }
      console.log(sandProviders);
      return {
        sandProviders,
        addSandOrder,
        removeSandOrder,
        addSandProvider,
        removeSandProvider,
        lastSandProviderInner,
      };
    },
  });
</script>

<style></style>
