<template>
  <Layout>
    <nav>
      <button>Orden</button>
      <button>Equipamento</button>
      <button>RRHH</button>
    </nav>
    <form action="">
      <div class="recover-form__input-block">
        <label for="order-number" class=""> Número de Orden </label>
        <div class="mt-1">
          <input id="order-number" name="order-number" type="text" required />
        </div>
      </div>
    </form>
  </Layout>
</template>

<script>
import Layout from '@/layouts/Main.vue';

export default {
  components: {
    Layout,
  },
  setup() {
    return {};
  },
};
</script>
