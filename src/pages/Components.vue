<template>
  <div class="mt-4 text-red-500"></div>
</template>

<script>
  import Layout from '@/layouts/Main.vue';
  import BaseBtn from '../components/ui/BaseBtn.vue';
  import Button from '../components/ui/Button.vue';
  import CircularBtn from '../components/ui/CircularBtn.vue';
  import GhostBtn from '../components/ui/GhostBtn.vue';
  import IconBtn from '../components/ui/IconBtn.vue';
  import PrimaryBtn from '../components/ui/PrimaryBtn.vue';
  import SecondaryBtn from '../components/ui/SecondaryBtn.vue';
  import InputPack from '../components/ui/InputPack.vue';
  import Title1 from '../components/ui/Title1.vue';
  import Title2 from '../components/ui/Title2.vue';
  import Title3 from '../components/ui/Title3.vue';

  import { MailIcon } from '@heroicons/vue/solid';

  export default {
    components: {
      Layout,
      BaseBtn,
      Button,
      CircularBtn,
      GhostBtn,
      IconBtn,
      PrimaryBtn,
      SecondaryBtn,
      InputPack,
      Title1,
      Title2,
      Title3,
      MailIcon,
    },
    setup() {
      return {};
    },
  };
</script>
