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
    BriefcaseIcon,
    ChipIcon,
    ClipboardCopyIcon,
    ClipboardIcon,
    ClipboardListIcon,
    CogIcon,
    HomeIcon,
    LogoutIcon,
    MenuAlt2Icon,
    TagIcon,
    TruckIcon,
    UserCircleIcon,
    UserGroupIcon,
    UsersIcon,
    ViewGridAddIcon,
    XIcon,
  } from '@heroicons/vue/outline';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      AdjustmentsIcon,
      AnnotationIcon,
      ArchiveIcon,
      AtSymbolIcon,
      BellIcon,
      BriefcaseIcon,
      ChipIcon,
      ClipboardCopyIcon,
      ClipboardIcon,
      ClipboardListIcon,
      CogIcon,
      HomeIcon,
      LogoutIcon,
      MenuAlt2Icon,
      TagIcon,
      TruckIcon,
      UserCircleIcon,
      UserGroupIcon,
      UsersIcon,
      ViewGridAddIcon,
      XIcon,
    },
    props: {
      icon: {
        type: String,
        required: true,
      },
    },
  });
</script>
