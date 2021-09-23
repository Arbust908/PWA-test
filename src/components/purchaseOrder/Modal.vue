<template>
  <Modal type="off" :open="showModal" @close="$emit('close')">
      <template #body>
        <h2 class="text-lg mb-6 font-semibold text-left text-gray-800">Orden de pedido</h2>
        <div class="w-full max-w-sm text-left text-gray-800 divide-y">
            <div class="space-y-2 pb-4">
                <h3 class="font-semibold">{{ po.sandProvider.name }}</h3>
                <p>Pedido:</p>
                <template v-for="so in po.sandOrders">
                    <p>
                        {{ so.amount }}t - 
                        {{ getSandType(so?.sandTypeId) }} -
                        {{ so.boxId !== '' ? so.boxId : 'Sin ID de caja'}}
                    </p>
                </template>
            </div>
            <div class="space-y-2 py-4">
                <h3 class="font-semibold">{{ po.transportProvider.name }}</h3>
                <template v-for="tp in po.transportOrders">
                   <p>Patente: {{ tp.licensePlate }}{{ tp.observations !== '' ? ' - ' + tp.observations : null }}</p>
                    <p>Cantidad: {{ tp.boxAmount }} caja{{ tp.boxAmount > 1 ? 's' : null }}</p>
                </template>
            </div>
        </div>
      </template>
      <template #btn>
          <div class="w-full flex gap-x-6 justify-end">
              <NoneBtn
                @click.prevent="$emit('close')"
              >
                Volver
              </NoneBtn>
              <PrimaryBtn
                @click.prevent="$emit('confirm')"
              >
                Confirmar
              </PrimaryBtn>
          </div>
      </template>
    </Modal>
</template>

<script lang='ts'>
    import { defineComponent } from 'vue';
    import Modal from '@/components/modal/General.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    export default defineComponent({
        components: {
            Modal,
            PrimaryBtn,
            NoneBtn,
        },
        props: {
            po: {
                type: Object,
                required: true,
            },
            showModal: {
                type: Boolean,
                required: true,
            },
        },
        setup(props){
            const getSandType = (sandTypeId: number) => {
                const sandType = props.po.sands.find(st => st.id === sandTypeId);
                return sandType ? sandType.type : 'Sin tipo de arena';
            }
            return {
                getSandType,
            }
        }
    });
</script>
