<template>
  <Layout>
    <header
      class="flex flex-col md:flex-row md:justify-between items-center md:mb-4"
    >
      <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">
        Nuevo tipo de arena
      </h1>
    </header>
    <section class="bg-white rounded-md shadow-sm max-w-2xl">
      <form method="POST" action="/" class="p-4">
        <FieldGroup>
          <FieldInput
            class="col-span-full"
            fieldName="sandMesh"
            placeholder="Ingrese tipo de malla"
            title="Tipo de malla"
            :data="type"
            @update:data="type = $event"
          />
          <FieldTextArea
            class="col-span-full"
            fieldName="observations"
            placeholder="Observaciones..."
            title="Observaciones"
            :rows="5"
            isOptional
            :data="description"
            @update:data="description = $event"
          />
        </FieldGroup>
      </form>
      <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
        <section class="space-x-6 flex items-center justify-end">
          <NoneBtn @click.prevent="goToIndex">Cancelar</NoneBtn>
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
  </Layout>
</template>

<script lang="ts">
  import { reactive, toRefs, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import NoneBtn from '@/components/ui/NoneBtn.vue';
  import PrimaryBtn from '@/components/ui/PrimaryBtn.vue';
  import FieldGroup from '@/components/ui/form/FieldGroup.vue';
  import FieldInput from '@/components/ui/form/FieldInput.vue';
  import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
  import axios from 'axios';

  const api = import.meta.env.VITE_API_URL || '/api';

  export default {
    components: {
      PrimaryBtn,
      NoneBtn,
      Layout,
      NoneBtn,
      FieldGroup,
      FieldInput,
      FieldTextArea,
    },
    setup() {
      const router = useRouter();
      const store = useStore();

      const goToIndex = () => {
        router.push('/tipos-de-arena');
      };

      const newSand = reactive({
        type: '',
        description: '',
        meshType: '',
        grainType: '',
        observations: '',
      });

      const isFull = computed(() => {
        return !!(
          newSand.type.length > 0 &&
          newSand.description.length > 0 &&
          newSand.meshType.length > 0 &&
          newSand.grainType.length > 0 &&
          newSand.observations.length > 0
        );
      });

      const save = async () => {
        let sandDB = await axios
          .post(`${api}/sand`, newSand)
          .catch((err) => {
            console.log(err);
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              return res.data;
            }
            return {};
          })
          .finally(() => {});
      };
      return {
        goToIndex,
        save,
        newSand,
        ...toRefs(newSand),
        isFull,
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
