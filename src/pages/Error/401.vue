<template>
	<Layout>
		<section class="bg-white rounded-md shadow-sm h-full pt-20 pb-12">
			<img 
				src="../../assets/errors/401.png" 
				alt="404 not found"
				class="w-4/5 sm:w-auto mx-auto">
			<h1 class="text-center text-xl sm:text-2xl text-black font-bold mt-8">Parece que no has iniciado sesión</h1>
			<p class="text-center text-gray-400 font-bold mt-2">Por favor, ingresá tu usuario y contraseña para continuar</p>
			<div class="flex justify-center mt-6">
			<PrimaryBtn @click="goToLogin()">Iniciar sesión</PrimaryBtn>
			</div>
		</section>
	</Layout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import Layout from '@/layouts/Main.vue';
import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

export default {
	components: {
		Layout,
		PrimaryBtn
	},
	setup() {
		const router = useRouter();

		const goToLogin = () => {
			router.push('/login');
		}

		return{
			goToLogin
		}
	}
}
</script>