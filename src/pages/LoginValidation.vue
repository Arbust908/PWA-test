<template>
    <main class="relative">
        <section class="login-card">
            <aside class="login-card__image">
                <img src="@/assets/imgs/login_side.png" alt="" />
            </aside>
            <article class="login-box">
                <header class="login-box__header">
                    <Logo class="login-logo" />
                    <p class="text-sm text-gray-400 font-bold mb-2">Inicia sesión para validar tu cuenta.</p>
                </header>
                <form class="login-box__form" action="#" method="POST">
                    <div :class="{ hasError: formWithError || usernameError }" class="login-form__input-block">
                        <label for="username" class=""> Usuario </label>
                        <div class="mt-1">
                            <input
                                id="username"
                                v-model="email"
                                name="username"
                                type="text"
                                autocomplete="username"
                                required
                                placeholder="Nombre de Usuario"
                                @blur="validate"
                            />
                            <p v-if="formWithError"></p>
                            <p v-else-if="usernameError">El usuario tiene que tener mas de 3 caracteres</p>
                        </div>
                    </div>

                    <div :class="{ hasError: formWithError || passwordError }" class="login-form__input-block">
                        <label for="password"> Contraseña </label>
                        <div class="mt-1">
                            <input
                                id="password"
                                v-model="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                placeholder="Contraseña"
                                @blur="validate"
                            />
                            <p v-if="formWithError">Los datos no coinciden</p>
                            <p v-else-if="passwordError">La contraseña deber tener mas de 5 caracteres</p>
                        </div>
                    </div>

                    <div>
                        <PrimaryBtn class="mx-auto" @click.prevent="formValidation"> Validar cuenta </PrimaryBtn>
                    </div>
                </form>
            </article>
            <ErrorModal
                :open="showModal"
                title="Hubo un error"
                text="Alguno de los datos no coinciden con los datos que tenemos registrados. Volve a ingresar los datos
                        correctos."
                @close="toggleModal(false)"
                @main="toggleModal(false)"
            />
        </section>
    </main>
</template>

<script lang="ts">
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';
    import { useActions } from 'vuex-composition-helpers';
    import { Role } from '@/interfaces/sandflow';
    import Logo from '@/components/Logo.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import PermissionsManager from '@/helpers/canI';

    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const api = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            Logo,
            PrimaryBtn,
            ErrorModal,
        },
        data() {
            return {
                error: {
                    username: false,
                    password: false,
                    new_password: false,
                },
            };
        },
        setup() {
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const router = useRouter();
            const route = useRoute();
            const store = useStore();

            const usernameError: Ref<boolean> = ref(false);
            const passwordError: Ref<boolean> = ref(false);
            const formWithError: Ref<boolean | null> = ref(null);
            const shouldRemember: Ref<boolean> = ref(true);

            const email: Ref<string> = ref('');
            const password: Ref<string> = ref('');
            const token: Ref<string> = route.query.token;

            const showModal: Ref<boolean> = ref(false);
            const toggleModal = useToggle(showModal);

            const validate = (event: any) => {
                const name: string = event.target.name;
                const isLong: boolean = event.target.value.length >= 3;

                if (!isLong) {
                    if (name === 'username') {
                        usernameError.value = true;
                    } else if (name === 'password') {
                        passwordError.value = true;
                    }
                }
            };

            const { setUser } = useActions(['setUser']);
            const formValidation = () => {
                usernameError.value = email.value.length <= 3;
                passwordError.value = password.value.length <= 3;
                formWithError.value = usernameError.value || passwordError.value || email.value !== password.value;

                if (!formWithError.value) {
                    firstLogin();
                } else {
                    toggleModal(true);
                }
            };

            const firstLogin = async () => {
                const loading = ref(true);
                const user = {
                    email: email.value,
                    password: email.value,
                    token: token,
                };

                localStorage.setItem('userToken', user.token);

                const response = await axios.post(`${apiUrl}/auth/login`, user).catch((err) => {
                    console.log(err);
                    toggleModal(true);
                    return false;
                });
                console.log(response);

                loading.value = false;
                router.push('/register-new-password');
            };

            return {
                usernameError,
                passwordError,
                formWithError,
                validate,
                formValidation,
                showModal,
                toggleModal,
                email,
                password,
            };
        },
    });
</script>

<style lang="scss" scoped>
    main {
        @apply min-h-screen bg-white flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8;
    }
    .login {
        &-card {
            @apply m-auto sm:w-full sm:max-w-3xl sm:bg-gray-50 sm:shadow sm:rounded-lg flex overflow-hidden justify-center;
            &__image {
                @apply hidden md:block relative max-h-[30rem] max-w-[17rem];
                &:after {
                    content: '';
                    @apply absolute inset-0 bg-gradient-to-t from-main-600 to-transparent;
                }
            }
        }
        &-box {
            @apply px-4 sm:px-8 flex-1 flex flex-col justify-center;
            &__header {
                @apply sm:mx-auto sm:w-full sm:max-w-sm mb-2;
                & > h2 {
                    @apply mb-4 text-center text-xl font-extrabold text-gray-900;
                }
            }
            &__form {
                @apply space-y-6 w-full sm:max-w-sm sm:mx-auto;
            }
        }
        &-logo {
            @apply mx-auto h-12 w-auto mb-8;
        }
        &-form {
            &__input-block {
                & > label {
                    @apply block text-sm font-medium text-gray-700;
                }
                & input {
                    @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main-500 focus:border-main-500 sm:text-sm;
                }
            }
        }
        &-back {
            @apply text-center;
            & button {
                @apply text-main-500 hover:text-main-300 hover:underline;
            }
        }
    }
</style>
