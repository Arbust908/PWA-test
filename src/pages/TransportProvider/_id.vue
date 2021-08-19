<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Proveedor de transporte - ID {{id}}
      </h1>
    </header>
    <section class="flex">
      <section class="w-7/12">
        <nav class="flex justify-between max-w-2xl bg-white">
          <button
            :class="[
              'section-tab',
              activeSection === 'provider' ? 'active' : '',
            ]"
            :selected="activeSection === 'provider'"
            @click.prevent="changeSection('provider')"
          >
            <span> Proveedor </span>
          </button>
          <button
            :class="['section-tab', activeSection === 'driver' ? 'active' : '']"
            :selected="activeSection === 'driver'"
            @click.prevent="changeSection('driver')"
          >
            <span> Transportista </span>
          </button>
        </nav>
        <section class="bg-white rounded-md max-w-2xl shadow-sm" v-if="activeSection === 'provider'">
          <form method="POST" action="/" class="p-4 max-w-lg">
            <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
              <label class="col-span-full" for="name">
                <span>Nombre / Razón Social</span>
                <input
                  id="name"
                  v-model="newTransportProvider.name"
                  class="input"
                  type="text"
                  name="name"
                />
              </label>
              <label class="col-span-full" for="legalId">
                <span>CUIT / CUIL</span>
                <input
                  id="legalId"
                  v-model.number="newTransportProvider.legalId"
                  v-maska="'###########'"
                  class="input"
                  type="text"
                  name="legalId"
                  placeholder="CUIT / CUIL"
                />
              </label>
              <label class="col-span-full" for="address">
                <span>Domicilio</span>
                <input
                  id="address"
                  v-model="newTransportProvider.address"
                  class="input"
                  type="text"
                  name="address"
                />
              </label>
              <label class="col-span-full" for="observations">
                <span>Observaciones<span class="italic text-gray-400"> (opcional)</span></span>
                <textarea
                  id="observations"
                  v-model="newTransportProvider.observations"
                  class="input resize-none"
                  type="text"
                  name="observations"
                  placeholder="Observaciones..."
                  rows="4"
                ></textarea>
              </label>
            </fieldset>
            <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
              <h2 class="col-span-full text-xl flex justify-between items-end">
                <span> Contacto principal </span>
              </h2>
              <label class="col-span-full" for="nr-name">
                <span>Nombre y Apellido</span>
                <input
                  id="nr-name"
                  v-model="companyRepresentative.name"
                  class="input"
                  type="text"
                  name="name"
                  placeholder="Nombre y Apellido"
                />
              </label>
              <label class="col-span-full" for="phone">
                <span>Teléfono</span>
                <input
                  id="nr-phone"
                  :read-only="!isNewRep"
                  v-maska="'##-####-####'"
                  v-model="companyRepresentative.phone"
                  class="input"
                  type="text"
                  name="phone"
                  placeholder="+11 1234 5678"
                />
              </label>
              <label class="col-span-full" for="email">
                <span>Email</span>
                <input
                  id="nr-email"
                  :read-only="!isNewRep"
                  v-model="companyRepresentative.email"
                  class="input"
                  type="text"
                  name="email"
                  placeholder="empresa@mail.com"
                />
              </label>
            </fieldset>
          </form>
          <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
            <section class="space-x-6 flex items-center justify-end">
              <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')">
                Cancelar
              </NoneBtn>
              <PrimaryBtn
                :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
                @click="isFull && save()"
                :disabled="!isFull"
              >
                Finalizar
              </PrimaryBtn>
            </section>
          </footer>
        </section>
        <section class="bg-white rounded-md max-w-2xl shadow-sm" v-if="activeSection === 'driver'">
          <form method="POST" action="/" class="p-4 max-w-lg">
            <fieldset class="py-2 w-full max-w-md grid grid-cols-12 gap-3 md:gap-4">
              <label class="col-span-full" for="name">
                <span>Nombre y apellido</span>
                <input
                  id="name"
                  v-model="newDriver.name"
                  class="input"
                  type="text"
                  name="name"
                />
              </label>
              <label class="col-span-full" for="phone">
                <span>Teléfono</span>
                <input
                  id="nr-phone"
                  :read-only="!isNewRep"
                  v-maska="'##-####-####'"
                  v-model="newDriver.phone"
                  class="input"
                  type="text"
                  name="phone"
                  placeholder="+11 1234 5678"
                />
              </label>
              <label class="col-span-full" for="email">
                <span>Email</span>
                <input
                  id="nr-email"
                  :read-only="!isNewRep"
                  v-model="newDriver.email"
                  class="input"
                  type="text"
                  name="email"
                  placeholder="empresa@mail.com"
                />
              </label>
              <label class="col-span-full" for="vehicleType">
                <span>Tipo de transporte</span>
                <input
                  id="name"
                  v-model="newDriver.vehicleType"
                  class="input"
                  type="text"
                  name="vehicleType"
                />
              </label>
              <label class="col-span-full" for="vehicleId">
                <span>Patente</span>
                <input
                  id="name"
                  v-model="newDriver.vehicleId"
                  class="input"
                  type="text"
                  name="vehicleId"
                />
              </label>
              <label class="col-span-full" for="observations">
                <span>Observaciones<span class="italic text-gray-400"> (opcional)</span></span>
                <textarea
                  id="observations"
                  v-model="newDriver.observations"
                  class="input resize-none"
                  type="text"
                  name="observations"
                  placeholder="Observaciones..."
                  rows="4"
                ></textarea>
              </label>
            </fieldset>
            <div

              :class="['flex','items-center','cursor-pointer',
              driverFull ? null : 'text-gray-200'
              ]" 
              @click="driverFull && addDriver()"
            >
              <Icon icon="Plus" type="outline" class="w-5 h-5" />
              <h2>Agregar Transportista</h2>
            </div>
          </form>
          <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
            <section class="space-x-6 flex items-center justify-end">
              <NoneBtn @click.prevent="$router.push('/proveedores-de-transporte')">
                Cancelar
              </NoneBtn>
              <PrimaryBtn
                :class="isFull ? null : 'opacity-50 cursor-not-allowed'"
                @click="isFull && update()"
                :disabled="!isFull"
              >
                Finalizar
              </PrimaryBtn>
            </section>
          </footer>
        </section>
      </section>
      <section class="w-3/12 mt-12 ml-4">
        <driver-card 
          v-for="(driver,index) in drivers"
          :key="index"
          :name="driver.name"
          :phone="driver.phone"
          :email="driver.email"
          :vehicleType="driver.vehicleType"
          :vehicleId="driver.vehicleId"
          :observations="driver.observations"
          @delete-driver="deleteDriver(index)"
          @edit-driver="editDriver(index)"
        />
      </section>
    </section>
  </Layout>
</template>

<script lang="ts">
  import { maska } from 'maska';
  import { computed, reactive, watch, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter,useRoute } from 'vue-router';
  import {
    BookmarkIcon,
    TrashIcon,
    CheckCircleIcon,
  } from '@heroicons/vue/outline';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import DriverCard from '@/components/transportProvider/DriverCard.vue';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import CircularBtn from '@/components/ui/CircularBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldLegend from '@/components/ui/form/FieldLegend.vue';
  // AXIOS
  import axios from 'axios';
  import { useAxios } from '@vueuse/integrations/useAxios';
  const api = import.meta.env.VITE_API_URL || '/api';
  // TIPOS
  import { TransportProvider, CompanyRepresentative, Driver } from '@/interfaces/sandflow';

  export default {
    directives: { maska },
    components: {
      Layout,
      NoneBtn,
      BookmarkIcon,
      TrashIcon,
      CheckCircleIcon,
      CircularBtn,
      PrimaryBtn,
      FieldGroup,
      FieldInput,
      FieldLegend,
      Icon,
      DriverCard
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const instance = axios.create({
        baseURL: api,
      });
      const id = Number(route.params.id);

      const transportProviders: Array<TransportProvider> = JSON.parse(
        JSON.stringify(store.state.transportProviders.all)
      );

      const currentTransportProvider: TransportProvider =
        transportProviders.find((sp) => {
          return sp.id == id;
        });

        console.log(currentTransportProvider)

      let activeSection = ref('provider');

      const changeSection = (option: String) => {
        return (activeSection.value = option);
      };

      const drivers: Array<Driver> = reactive([])

      let newDriver = reactive({
        name: '', 
        phone: '',
        email: '',
        vehicleType: '',
        vehicleId: '',
        observations: ''
      })

      const addDriver = () => {
        const driver = {...newDriver}
        drivers.push(driver)
        cleanNewDriver()
      }

      const deleteDriver = (index: number) => {
        drivers.splice(index)
      }

      const editDriver = (index: number) => {
        const driver = {...drivers[index]}
        deleteDriver(index)
        
        newDriver.name = driver.name
        newDriver.phone = driver.phone
        newDriver.email = driver.email
        newDriver.vehicleType = driver.vehicleType
        newDriver.vehicleId = driver.vehicleId
        newDriver.observations = driver.observations
      }

      const cleanNewDriver = () => {
        newDriver.name = ''
        newDriver.phone = ''
        newDriver.email = ''
        newDriver.vehicleType = ''
        newDriver.vehicleId = ''
        newDriver.observations = ''
      }

      const newTransportProvider: TransportProvider = reactive({
        name: '',
        legalId: null,
        adress: '',
        observations: '',
        companyRepresentativeId: -1
      });

      const companyRepresentative: CompanyRepresentative = reactive({
        name: '',
        phone: '',
        email: '',
      });

      const transportProviderFull: ComputedRef<boolean> = computed(() => {
        return !!(
          newTransportProvider.name !== '' &&
          newTransportProvider.address !== '0' &&
          newTransportProvider.legalId >= 0
        );
      });
      
      const driverFull: ComputedRef<boolean> = computed(() => {
        return !!(
          newDriver.name !== '' &&
          newDriver.phone !== '0' &&
          newDriver.email !== '' &&
          newDriver.vehicleType !== '' &&
          newDriver.vehicleId !== ''
        );
      });

      const repFull: ComputedRef<boolean> = computed(() => {
        return !!(
          companyRepresentative.name !== '' &&
          companyRepresentative.phone !== '' &&
          companyRepresentative.email !== ''
        );
      });

      const isFull: ComputedRef<boolean> = computed(() => {
        return transportProviderFull.value && repFull.value && driverFull.value;
      });

      const update = async () => {
        const { providerNotificationId, providerNotification, ...newTProv } =
          currentTransportProvider;
        const { data } = useAxios(
          `/transportProvider/${id}`,
          { method: 'PUT', data: newTProv },
          instance
        );
        watch(data, (newData, _) => {
          if (newData && newData.data) {
            store.dispatch('updateTransportProvider', newData.data);
            router.push('/proveedores-de-transporte');
          }
        });
      };

      return {
        newTransportProvider,
        isFull,
        companyRepresentative,
        activeSection,
        changeSection,
        drivers,
        Icon,
        addDriver,
        newDriver,
        driverFull,
        deleteDriver,
        editDriver,
        id,
        currentTransportProvider,
        update,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .btn {
    &__draft {
      @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
    }
    &__delete {
      @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
      /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
    }
    &__add {
      @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
    }
    &__add--special {
      @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
    }
    &__mobile-only {
      @apply lg:hidden;
    }
    &__desktop-only {
      @apply hidden lg:inline-flex;
    }
  }
  .section-tab {
    @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
  }
  .section-tab[selected='true'] {
    @apply border-main-500 text-main-500;
  }
  .input-block select,
  .input-block input {
    @apply w-full rounded mb-3 p-2;
  }

  .pit-block {
    @apply flex mt-1 items-center w-full mb-3;
    & select,
    & input {
      @apply rounded p-2 max-w-md inline-block w-full;
    }
  }

  fieldset {
    @apply mb-6;
  }
  label {
    @apply text-sm;
  }
  .equip-grid {
    @apply grid gap-4 grid-cols-2 md:grid-cols-3;
  }
</style>
