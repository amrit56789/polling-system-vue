<template>
<div class="flex justify-center px-4 mt-10 lg:mt-32">
    <form @submit.prevent="customSubmitLogin" class="border-2 border-slate-200 rounded-xl space-y-4 p-4 shadow-lg flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white">
        <h1 class="font-bold text-xl md:text-2xl text-center">Login</h1>
        <div class="flex flex-col mb-4">
            <label for="email" class="text-gray-500 text-sm md:text-md text-left mb-2 lg:mb-3">Email:</label>
            <input type="email" v-model="form.email" placeholder="Email" class="p-2 shadow appearance-none border-b border-gray-500 bg-transparent w-full focus:outline-none" id="email" />
            <p v-if="errors.email" class="text-red-500 text-xs md:text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="relative flex flex-col mb-4">
            <label for="password" class="text-gray-500 text-sm md:text-md text-left mb-2 lg:mb-3">Password:</label>
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Password" class="p-2 shadow appearance-none border-b border-gray-500 bg-transparent w-full focus:outline-none" id="password" />
            <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-3 lg:top-9 md:top-7 flex items-center cursor-pointer text-gray-700">
                <i :class="{'fas fa-eye-slash': showPassword, 'fas fa-eye': !showPassword}"></i>
            </span>
            <p v-if="errors.password" class="text-red-500 text-xs md:text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Login</span>
            <div v-else class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        </button>
        <span v-if="loginError" class="text-red-500 text-xs md:text-sm">{{ loginError }}</span>

        <div class="flex text-xs md:text-sm justify-center mt-4">
            <p>Don't have an account yet?</p>
            <router-link to="/signup" class="text-blue-500 hover:text-blue-600 mx-1">Sign Up</router-link>
        </div>
    </form>
</div>
</template>

<script setup>
import {
    useLogin,
    useToggleVisibility
} from '../composables/useLoginSignup';
import {
    useAuthStore
} from '../stores/auth';
import {
    useRouter
} from 'vue-router';
import {
    storeToRefs
} from 'pinia';

const router = useRouter();
const authStore = useAuthStore();
const {
    loginError,
} = storeToRefs(authStore);

const {
    form,
    errors,
    isSubmitting,
    submitLogin
} = useLogin();

const {
    showPassword,
    togglePasswordVisibility
} = useToggleVisibility();

const customSubmitLogin = async () => {
    const result = await submitLogin();
    if (result) {
        router.push('/polls');
    }
};

</script>


