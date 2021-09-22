<template>
  <Modal type="off" :open="showModal" @close="$emit('close')">
      <template #body>
        <div class="w-full max-w-sm text-left text-gray-800">
            <h2 class="text-lg mb-6 font-semibold">Orden de pedido</h2>
            <h3 class="mb-2 font-semibold">{{ po.sandProvider.name }}</h3>
            <p>Pedido:</p>
            <p>
                {{ po.sandOrder.amount }}t - 
                {{ po.sandOrder.type }} -
                {{ po.sandOrder.boxId !== '' ? po.sandOrder.boxId : 'Sin ID de caja'}}
            </p>
            <hr class="my-2" />
            <h3 class="mb-2 font-semibold">{{ po.transportProvider.name }}</h3>
            <div class="w-full h-2"></div>
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
        setup(){
            return {
                
            }
        }
    });
</script>
