<template>
  <form method="POST" action="/" class="p-4 flex flex-col gap-4">
    <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
        <legend class="col-span-12 text-xl">Arena</legend>
        <label class="col-span-12" for="sandProvider">
        <span>Proveedor</span>
        <input v-model="sandProvider.name" class="input" type="text" name="sandProvider" list="sandProvider" placeholder="Proveedor de Arena">
        <datalist id="sandProvider">
            <option value="San Luis">San Luis</option>
            <option value="Orange">Orange</option>
        </datalist>
        </label>
        <template v-for="(order, orderKey) in sandProvider.sandOrder" :key="orderKey">
        <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full">
        <label class="col-span-10" for="sandType">
            <span>Tipo</span>
            <input v-model="order.type" class="input" type="text" name="sandType" list="sandType" placeholder="arena-#30/40">
            <datalist id="sandType">
            <option value="30/40">Arena #30/40</option>
            <option value="50/100">Arena #30/40</option>
            </datalist>
        </label>
        <div class="col-span-2 flex justify-end items-end">
            <CircularBtn class="btn__delete" size="sm" @click="removeOrder(order.id)">
            <TrashIcon class="w-5 h-5" />
            </CircularBtn>
        </div>
        
        <label class="col-span-6" for="sandQuantity">
            <span>Cantidad</span>
            <div class="mt-1 flex rounded shadow-sm">
            <input v-model="order.quantity" type="number" name="sandQuantity" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-r-0 rounded-l focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 sm:text-sm" placeholder="22" list="sandQuantity" />
            <datalist id="sandQuantity">
                <option value="12">12</option>
                <option value="22">22</option>
                <option value="44">44</option>
                <option value="88">88</option>
            </datalist>
            <span class="inline-flex items-center px-3 rounded-r border  border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" title="Peso en Toneladas">
                t
            </span>
            </div>
        </label>

        <label class="col-span-6" for="sandBoxId">
            <span>ID Caja</span>
            <input v-model="order.boxId" class="input" type="text" name="sandBoxId" list="sandBoxId" placeholder="Ingrear ID">
            <datalist id="sandBoxId">
            <option value="#123">#123</option>
            <option value="#856">#856</option>
            </datalist>
        </label>
        </template>
        <button class="col-span-full mt-1 flex items-center" @click.prevent="addOrder">
        <CircularBtn class="btn__add" size="xs">
            <PlusIcon class="w-4 h-4" />
        </CircularBtn>
        <span class="font-bold text"> Agregar </span>
        </button>
    </fieldset>
    <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
        <legend class="col-span-full text-xl">Transporte</legend>
        <label class="col-span-full" for="transportProvider">
        <span>Proveedor</span>
        <input v-model="transportProvider.name" class="input" type="text" name="transportProvider" list="transportProvider" placeholder="Proveedor de Transporte">
        <datalist id="transportProvider">
            <option value="Logistica Rapida">Logistica Rapida</option>
            <option value="Orange">Orange</option>
        </datalist>
        </label>

        <label class="col-span-6" for="transportId">
        <span>Patente</span>
        <input v-model="transportProvider.transportId" class="input" type="text" name="transportId" list="transportId" placeholder="AC 245 XX">
        <datalist id="transportId">
            <option value="AC 245 WC">AC 245 WC</option>
            <option value="CC 345 ER">CC 345 ER</option>
        </datalist>
        </label>

        <label class="col-span-6" for="quantityBoxes">
        <span>Cantidad de cajas</span>
        <input v-model="transportProvider.boxQuantity" class="input" type="number" name="quantityBoxes" list="quantityBoxes" placeholder="0">
        <datalist id="quantityBoxes">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </datalist>
        </label>

        <label class="col-span-full" for="transportDescription">
        <span>Observaciones</span>
        <input v-model="transportProvider.observation" class="input" type="text" name="transportDescription" list="transportDescription" placeholder="Chasis chico">
        <datalist id="transportDescription">
            <option value="Chasis Grande">Chasis Grande</option>
            <option value="Chasis Chico">Chasis Chico</option>
        </datalist>
        </label>
    </fieldset>
    </form>
</template>

<script lang="ts">
export default {
    setup(props) {
        
         return {
            
        }
    }
}
</script>

<style>

</style>