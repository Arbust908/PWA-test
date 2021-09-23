<template>
  <Layout>
    <header class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-900">Ordenes de Pedido</h2>
      <router-link to="/orden-de-pedido/nueva">
        <PrimaryBtn>Crear nueva</PrimaryBtn>
      </router-link>
    </header>
    <UiTable>
      <template #header>
        <tr>
          <!-- <th scope="col" title="Numero de Pedido">N°</th> -->
          <th scope="col">Proveedor de arena</th>
          <th scope="col">Proveedor de transporte</th>
          <!-- <th scope="col">Estado</th> -->
          <th scope="col">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(pO, poKey) in PurchaseOrders"
          :key="pO.id"
          :class="poKey % 2 === 0 ? 'even' : 'odd'"
          class="body-row"
        >
          <!-- <td>
            {{ pO.id }}
          </td> -->
          <td :class="pO.sandProvider ? null : 'empty'">
            {{ (pO.sandProvider && pO.sandProvider.name) || 'Sin proveedor' }}
          </td>
          <!-- <td :class="pO.sandOrder ? null : 'empty'">
            {{ pO.sandOrder.amount }}
          </td> -->
          <td :class="pO.transportProvider ? null : 'empty'">
            {{
              (pO.transportProvider && pO.transportProvider.name) ||
              'Sin proveedor'
            }}
          </td>
          <td>
            <div class="btn-panel">
              <!-- <router-link :to="`/orden-de-pedido/${pO.id}`" class="edit">
                <Icon icon="PencilAlt" class="w-5 h-5" />
                <span> Editar </span>
              </router-link> -->
              <button class="delete" @click="deletePO(pO.id)">
                <Icon icon="Trash" class="w-5 h-5" />
                <span> Eliminar </span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="PurchaseOrders.length <= 0">
          <td colspan="5" class="emptyState">
            <p>No hay Ordenes de Pedidos</p>
          </td>
        </tr>
      </template>
    </UiTable>
  </Layout>
</template>

<script lang="ts">
  import { ref, watch } from 'vue';
  import { createNamespacedHelpers } from 'vuex-composition-helpers';
  const { useState } = createNamespacedHelpers('purchaseOrder');
  import { useActions } from 'vuex-composition-helpers';
  import Layout from '@/layouts/Main.vue';
  import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
  import UiTable from '@/components/ui/TableWrapper.vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import { useTitle, useMagicKeys, whenever } from '@vueuse/core';

  import { PurchaseOrder } from '@/interfaces/sandflow.Types';
  import { useApi } from '@/helpers/useApi';

  export default {
    components: {
      PrimaryBtn,
      Layout,
      UiTable,
      Icon,
    },
    setup() {
      useTitle('Ordenes de Pedido <> Sandflow');

      const { Ctrl_C } = useMagicKeys();
      whenever(Ctrl_C, () => {
        console.log('Crear Nuevo!');
      });

      const { deletePurchaseOrder, savePurchaseOrder } = useActions([
        'deletePurchaseOrder',
        'savePurchaseOrder',
      ]);
      const { read, destroy } = useApi('/purchaseOrder');
      const PurchaseOrders = read();
      watch(PurchaseOrders, (newValue, _) => {
        if (newValue) {
          storeToState(newValue);
        }
      });
      const storeToState = (pOs: PurchaseOrder[]) => {
        return pOs.map((pO) => {
          savePurchaseOrder(pO);
        });
      };
      const deletePO = async (poId: number) => {
        PurchaseOrders.value = PurchaseOrders.value.filter(
          (pO: PurchaseOrder) => {
            return pO.id !== poId;
          }
        );
        const data = destroy(poId);
        deletePurchaseOrder(poId);
      };
      return {
        PurchaseOrders,
        deletePO,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/table.scss';
</style>
