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
                    <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-second-50">
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
                                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    @click="sidebarOpen = false"
                                >
                                    <span class="sr-only">Close sidebar</span>
                                    <Icon icon="X" class="h-6 w-6 text-second-50" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div class="flex-shrink-0 flex items-center px-4">
                            <Logo class="h-8 w-auto" />
                        </div>
                        <div class="mt-5 flex-1 h-0 overflow-y-auto">
                            <nav class="px-2 space-y-1">
                                <NavWrapper v-for="item in navigation" :key="item.to" v-bind="item" />
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
                <div class="flex flex-col flex-grow border-r border-second-200 pt-5 pb-4 bg-second-50 overflow-y-auto">
                    <div class="flex items-center flex-shrink-0 px-4">
                        <Logo class="hidden lg:block h-8 w-auto hover:cursor-pointer" @click="goHome()" />
                    </div>
                    <div class="mt-5 flex-grow flex flex-col">
                        <nav class="flex-1 px-2 bg-second-50 space-y-1">
                            <NavWrapper v-for="item in navigation" :key="item.to" v-bind="item" mode="desk" />
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-0 flex-1 overflow-hidden">
            <div class="relative z-10 flex-shrink-0 flex h-16 bg-second-50 shadow">
                <button
                    class="px-4 border-r border-second-200 text-second-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    @click="sidebarOpen = true"
                >
                    <span class="sr-only">Open sidebar</span>
                    <Icon icon="MenuAlt2" class="h-6 w-6" aria-hidden="true" />
                </button>
                <div class="flex-1 px-4 flex justify-between">
                    <div class="flex-1 flex">
                        <form class="w-full flex md:ml-0" action="#" method="GET">
                            <label for="search_field" class="sr-only">Search</label>
                            <div class="relative w-full text-second-400 focus-within:text-second-600">
                                <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <!-- <SearchIcon class="h-5 w-5" aria-hidden="true" /> -->
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="ml-4 flex items-center md:ml-6">
                        <!-- Profile dropdown -->
                        <Menu as="div" class="ml-3 relative">
                            <div>
                                <MenuButton
                                    class="max-w-xs bg-second-50 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <span class="sr-only">Open user menu</span>
                                    <span
                                        class="flex justify-center items-center h-8 w-8 rounded-full bg-main-600 uppercase text-second-50 font-bold hover:bg-gradient-br hover:from-main-400 hover:to-main-700 hover:shadow-lg"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </span>
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
                                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-second-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                        <router-link
                                            :to="item.to"
                                            :class="active ? 'bg-second-100' : ''"
                                            class="flex px-4 py-2 text-sm text-second-700 items-center"
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

            <main class="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 lg:p-8 gutter-stable-both">
                <div class="max-w-7xl">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
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
        async setup() {
            const store = useStore();
            const sidebarOpen = ref(false);
            const navigation = computed(() => {
                const hasCustom = store.state.global.isCustom;

                // if (hasCustom) {
                //     console.log('has custom');

                //     return store.state.global.navigation;
                // }
                //Filtramos los items por permiso
                const navigationItems = JSON.parse(JSON.stringify(store.state.global.navigation));
                //TODO: usar el permissionManager
                const storePermissions = store.state.loggedUser.permissions || [];
                const permissions = JSON.parse(JSON.stringify(storePermissions));
                // console.log('permissions', permissions);

                const fN = navigationItems.filter((nav) => {
                    if (nav.name === 'LINE') {
                        return true;
                    }

                    if (nav.keep) {
                        return nav.keep;
                    }

                    if (nav.subNav) {
                        nav.subNav = nav.subNav.filter((subNav) => {
                            return permissions.view.includes(subNav.title);
                        });

                        return nav.subNav.length > 0;
                    }

                    return permissions.view.includes(nav.title);
                });
                // store.commit('SET_NEW_NAVIGATION', fN);
                // store.commit('SET_CUSTOM');

                // console.log('Custome', fN);

                return fN;
            });
            const userNavigation = computed(() => {
                return store.state.global.user_navigation;
            });
            const user = computed(() => {
                return store.state.loggedUser;
            });
            const router = useRouter();
            const goHome = () => {
                router.push('/home');
            };

            return {
                navigation,
                userNavigation,
                sidebarOpen,
                user,
                goHome,
            };
        },
    });
</script>

<style lang="scss">
    .gutter-stable-both {
        scrollbar-gutter: stable both-edges;
    }
</style>
