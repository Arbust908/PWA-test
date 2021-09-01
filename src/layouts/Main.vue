<template>
  <div class="h-screen flex overflow-hidden bg-second-100">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        static
        class="fixed inset-0 flex z-40 md:hidden"
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-second-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <div
            class="
              relative
              flex-1 flex flex-col
              max-w-xs
              w-full
              pt-5
              pb-4
              bg-second-50
            "
          >
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  class="
                    ml-1
                    flex
                    items-center
                    justify-center
                    h-10
                    w-10
                    rounded-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-white
                  "
                  @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <Icon
                    icon="X"
                    class="h-6 w-6 text-second-50"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </TransitionChild>
            <div class="flex-shrink-0 flex items-center px-4">
              <Logo class="h-8 w-auto" />
            </div>
            <div class="mt-5 flex-1 h-0 overflow-y-auto">
              <nav class="px-2 space-y-1">
                <NavWrapper
                  v-for="item in navigation"
                  :key="item.to"
                  v-bind="item"
                />
              </nav>
            </div>
          </div>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col lg:w-64">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div
          class="
            flex flex-col flex-grow
            border-r border-second-200
            pt-5
            pb-4
            bg-second-50
            overflow-y-auto
          "
        >
          <div class="flex items-center flex-shrink-0 px-4">
            <Logo class="hidden lg:block h-8 w-auto" />
          </div>
          <div class="mt-5 flex-grow flex flex-col">
            <nav class="flex-1 px-2 bg-second-50 space-y-1">
              <NavWrapper
                v-for="item in navigation"
                :key="item.to"
                v-bind="item"
                mode="desk"
              />
              <!-- <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :class="
                  item.to === $route.fullPath
                    ? 'bg-second-100 text-second-900'
                    : 'text-second-600 hover:bg-second-50 hover:text-second-900'
                "
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
              >
                <component
                  :is="item.icon"
                  :class="item.to === $route.fullPath ? 'text-second-500' : 'text-second-400 group-hover:text-second-500'"
                  class="mr-3 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                <span>
                  {{ item.name }}
                </span>
              </router-link> -->
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-second-50 shadow">
        <button
          class="
            px-4
            border-r border-second-200
            text-second-500
            focus:outline-none
            focus:ring-2
            focus:ring-inset
            focus:ring-indigo-500
            md:hidden
          "
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Icon icon="MenuAlt2" class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <form class="w-full flex md:ml-0" action="#" method="GET">
              <label for="search_field" class="sr-only">Search</label>
              <div
                class="
                  relative
                  w-full
                  text-second-400
                  focus-within:text-second-600
                "
              >
                <div
                  class="
                    absolute
                    inset-y-0
                    left-0
                    flex
                    items-center
                    pointer-events-none
                  "
                >
                  <!-- <SearchIcon class="h-5 w-5" aria-hidden="true" /> -->
                </div>
                <!-- <input
                  id="search_field"
                  class="
                    block
                    w-full
                    h-full
                    pl-8
                    pr-3
                    py-2
                    border-transparent
                    text-second-900
                    placeholder-second-500
                    focus:outline-none focus:placeholder-second-400 focus:ring-0 focus:border-transparent
                    sm:text-sm
                  "
                  placeholder="Search"
                  type="search"
                  name="search"
                /> -->
              </div>
            </form>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <!-- <button
              class="
                bg-second-50
                p-1
                rounded-full
                text-second-400
                hover:text-second-500
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              "
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button> -->

            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="
                    max-w-xs
                    bg-second-50
                    flex
                    items-center
                    text-sm
                    rounded-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-indigo-500
                  "
                >
                  <span class="sr-only">Open user menu</span>
                  <!-- <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  /> -->
                  <span
                    class="
                      flex
                      justify-center
                      items-center
                      h-8
                      w-8
                      rounded-full
                      bg-main-600
                      uppercase
                      text-second-50
                      font-bold
                      hover:bg-gradient-br
                      hover:from-main-400
                      hover:to-main-700
                      hover:shadow-lg
                    "
                    >{{ user.username.split('')[0] }}</span
                  >
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="
                    origin-top-right
                    absolute
                    right-0
                    mt-2
                    w-48
                    rounded-md
                    shadow-lg
                    py-1
                    bg-second-50
                    ring-1 ring-black ring-opacity-5
                    focus:outline-none
                  "
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <router-link
                      :to="item.to"
                      :class="active ? 'bg-second-100' : ''"
                      class="
                        flex
                        px-4
                        py-2
                        text-sm text-second-700
                        items-center
                      "
                    >
                      <Icon
                        :icon="item.icon"
                        type="outline"
                        class="mr-3 flex-shrink-0 h-6 w-6 text-second-500"
                        aria-hidden="true"
                      />
                      {{ item.name }}
                    </router-link>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main
        class="
          flex-1
          relative
          overflow-y-auto
          focus:outline-none
          p-4
          md:p-6
          lg:p-8
        "
      >
        <div class="max-w-7xl">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, computed, defineComponent } from 'vue';
  import { useStore } from 'vuex';
  import {
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue';
  import Icon from '@/components/icon/TheAllIcon.vue';
  import Logo from '@/components/Logo.vue';
  import NavWrapper from '@/components/navigation/NavWrapper.vue';

  export default defineComponent({
    components: {
      Dialog,
      DialogOverlay,
      Menu,
      MenuButton,
      MenuItem,
      MenuItems,
      TransitionChild,
      TransitionRoot,
      Logo,
      NavWrapper,
      Icon,
    },
    setup() {
      const store = useStore();
      const sidebarOpen = ref(false);
      const navigation = computed(() => {
        return store.state.global.navigation;
      });
      const userNavigation = computed(() => {
        return store.state.global.user_navigation;
      });
      const user = computed(() => {
        return store.state.user;
      });

      return {
        navigation,
        userNavigation,
        sidebarOpen,
        user,
      };
    },
  });
</script>
