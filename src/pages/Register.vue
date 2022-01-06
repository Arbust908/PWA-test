<template>
    <section class="recover-card">
        <aside class="recover-card__image">
            <img src="@/assets/imgs/login_side.png" alt="" />
        </aside>
        <article class="recover-box">
            <header class="recover-box__header">
                <Logo class="recover-logo" />
                <h2>Establecer contraseña</h2>
                <p class="text-sm text-gray-400 font-bold mb-2">
                    Tu nueva contraseña debe tener al menos 8 carácteres y una mayúscula.
                </p>
            </header>
            <form class="recover-box__form" action="#" method="POST">
                <div class="recover-form__input-block">
                    <label for="password" class=""> Nueva Contraseña </label>
                    <div class="mt-1">
                        <input
                            id="password"
                            v-model="password"
                            name="password"
                            placeholder=""
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                        <p v-if="error.password"></p>
                    </div>
                </div>

                <div class="recover-form__input-block">
                    <label for="new-password"> Confirmar Nueva Contraseña </label>
                    <div class="mt-1">
                        <input
                            id="new-password"
                            v-model="confirmPassword"
                            name="new-password"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                        <p v-if="error.new_password">Las contraseñas no coinciden</p>
                    </div>
                </div>

                <div>
                    <PrimaryBtn class="w-full" @click.prevent="saveUserWithNewPassword()">
                        Confirmar Nueva Contraseña
                    </PrimaryBtn>
                </div>

                <div class="recover-back">
                    <button @click.prevent="">Volver al Login</button>
                </div>
            </form>
        </article>
        <SuccessModal
            :open="showSuccessModal"
            text="Tu nueva contraseña fue creada con éxito."
            @close="$router.push('/login')"
            @main="$router.push('/login')"
        />
        <ErrorModal
            :open="showErrorModal"
            title="Hubo un error"
            text="Las contraseñas no coindicen."
            @close="toggleErrorModal(false)"
            @main="toggleErrorModal(false)"
        />
    </section>
</template>

<script lang="ts">
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import Logo from '@/components/Logo.vue';
    import Button from '@/components/ui/buttons/BaseBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import axios from 'axios';
    import { useStore } from 'vuex';

    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));

    export default {
        components: {
            Logo,
            Button,
            PrimaryBtn,
            ErrorModal,
            SuccessModal,
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

            const token = localStorage.getItem('userToken');

            const password: Ref<string> = ref('');
            const confirmPassword: Ref<string> = ref('');

            const showSuccessModal: Ref<boolean> = ref(false);
            const showErrorModal: Ref<boolean> = ref(false);
            const toggleSuccesModal = useToggle(showSuccessModal);
            const toggleErrorModal = useToggle(showErrorModal);

            const saveUserWithNewPassword = async () => {
                const user = {
                    password: password.value,
                    passwordValidate: confirmPassword.value,
                    token: localStorage.getItem('userToken'),
                };

                if (password.value === confirmPassword.value) {
                    console.log('true');
                    const response = await axios.post(`${apiUrl}/auth/activate`, user);
                    await console.log(response);
                    toggleSuccesModal(true);
                } else {
                    toggleErrorModal(true);
                }
            };

            return {
                saveUserWithNewPassword,
                print,
                password,
                confirmPassword,
                showSuccessModal,
                showErrorModal,
                toggleErrorModal,
                toggleSuccesModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .recover {
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
