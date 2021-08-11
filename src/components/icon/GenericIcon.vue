<template>
  <component :is="icon" aria-hidden="true" />
</template>

<script lang="ts">
  import {
    AdjustmentsIcon,
    AnnotationIcon,
    ArchiveIcon,
    AtSymbolIcon,
    BellIcon,
    ChipIcon,
    ClipboardListIcon,
    HomeIcon,
    LogoutIcon,
    MenuAlt2Icon,
    UsersIcon,
    XIcon,
    ViewGridAddIcon,
    ClipboardIcon,
    CogIcon,
    UserGroupIcon,
    TruckIcon,
    UserCircleIcon,
  } from '@heroicons/vue/outline';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      AdjustmentsIcon,
      AnnotationIcon,
      ArchiveIcon,
      AtSymbolIcon,
      BellIcon,
      ChipIcon,
      ClipboardListIcon,
      HomeIcon,
      LogoutIcon,
      MenuAlt2Icon,
      UsersIcon,
      XIcon,
      ViewGridAddIcon,
      ClipboardIcon,
      CogIcon,
      UserGroupIcon,
      TruckIcon,
      UserCircleIcon,
    },
    props: {
      icon: {
        type: String,
        required: true,
      },
    },
  });
</script>
