<template>
  <Layout>
    <h2 class="text-2xl font-semibold text-gray-900">Home</h2>
    <section class="space-y-4">
      <p class="mt-4 max-w-3xl text-xl text-gray-500">Esta es la home</p>
      <ul class="flex space-x-4">
        <li>
          <router-link
            class="
              inline-flex
              items-center
              px-3
              py-2
              border border-transparent
              text-sm
              leading-4
              font-medium
              rounded-md
              shadow-sm
              text-white
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            "
            to="/login"
            >Ingreso</router-link
          >
        </li>
        <li>
          <router-link
            type="button"
            class="
              inline-flex
              items-center
              px-3
              py-2
              border border-transparent
              text-sm
              leading-4
              font-medium
              rounded-md
              text-indigo-700
              bg-indigo-100
              hover:bg-indigo-200
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            "
            to="/about"
            >About*</router-link
          >
        </li>
        <li>
          <router-link
            type="button"
            class="
              inline-flex
              items-center
              px-3
              py-2
              border border-gray-300
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-md
              text-gray-700
              bg-white
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            "
            to="/orden-de-trabajo"
            >Orden de Trabajo</router-link
          >
        </li>
        <li>
          <router-link
            type="button"
            class="
              inline-flex
              items-center
              px-3
              py-2
              border border-transparent
              focus:shadow-sm
              hover:shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-md
              text-gray-700
              bg-transparent
              hover:bg-gray-50
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            "
            to="/orden-de-trabajo/nueva"
            >Nueba OT</router-link
          >
        </li>
      </ul>
    </section>
  </Layout>
</template>

<script lang="ts">
import Layout from "@/layouts/Main.vue";
export default {
  components: {
    Layout,
  },
};
</script>
