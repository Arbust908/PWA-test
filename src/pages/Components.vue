<template>
  <Layout>
    <Title2></Title2>
    <section class="space-y-4">
      <Title3></Title3>
      <article>
        <BaseBtn></BaseBtn>
      </article>
      <article>
        <Button></Button>
      </article>
      <article class="space-x-4 flex items-end">
        <CircularBtn size="xs"><MailIcon class="w-5 h-5" aria-hidden="true" /></CircularBtn>
        <CircularBtn size="sm"><MailIcon class="w-5 h-5" aria-hidden="true" /></CircularBtn>
        <CircularBtn><MailIcon class="w-5 h-5" aria-hidden="true" /></CircularBtn>
        <CircularBtn size="lg"><MailIcon class="w-6 h-6" aria-hidden="true" /></CircularBtn>
        <CircularBtn size="xl"><MailIcon class="w-6 h-6" aria-hidden="true" /></CircularBtn>
      </article>
      <article>
        <PrimaryBtn></PrimaryBtn>
      </article>
      <article>
        <SecondaryBtn></SecondaryBtn>
      </article>
      <article>
        <GhostBtn></GhostBtn>
      </article>
      <article>
        <IconBtn></IconBtn>
      </article>
    </section>
    <section>
      <Title3></Title3>
      <InputPack></InputPack>
    </section>
  </Layout>
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
