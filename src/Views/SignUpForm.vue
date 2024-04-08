<template>
<div class="flex justify-center gap-10 mt-10">
    <form @submit.prevent="customSubmitSignup" class="w-1/4 border-2 border-slate-200 rounded-xl space-y-4 p-6 shadow-lg flex flex-col justify-between bg-white">
        <h1 class="font-bold text-2xl text-center">{{formTitle}}</h1>
        <div class="mb-4 flex flex-col">
            <label for="first-name" class="text-left mb-1 text-gray-500 text-sm">First name:</label>
            <input type="text" v-model="form.firstName" placeholder="First Name" class="p-2 shadow text-sm appearance-none border-b border-gray-700 bg-transparent text-gray-700 leading-tight focus:outline-none" id="first-name" />
            <p v-if="errors.firstName" class="text-red-500 text-sm mt-1 text-left">{{ errors.firstName }}</p>
        </div>

        <div class="mb-4 flex flex-col">
            <label for="last-name" class="text-left mb-1 text-gray-500 text-sm">Last name:</label>
            <input type="text" v-model="form.lastName" placeholder="Last Name" class="p-2 shadow text-sm appearance-none border-b border-gray-700 bg-transparent text-gray-700 leading-tight focus:outline-none" id="first-name" />
            <p v-if="errors.lastName" class="text-red-500 text-sm mt-1 text-left">{{ errors.lastName }}</p>
        </div>

        <div class="mb-4 flex flex-col">
            <label for="email" class="text-left mb-1 text-gray-500 text-sm">Email:</label>
            <input type="text" v-model="form.email" placeholder="Email" class="p-2 shadow text-sm appearance-none border-b border-gray-700 bg-transparent text-gray-700 leading-tight focus:outline-none" id="first-name" />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1 text-left">{{ errors.email }}</p>
        </div>

        <div class="mb-4 flex flex-col">
            <label for="roles" class="text-left mb-1 text-gray-500 text-sm">Roles:</label>
            <select v-model="form.roleId" id="roles" class="p-2 w-full shadow appearance-none border-b border-gray-700 bg-white text-gray-700 leading-tight focus:outline-none">
                <option disabled value="">Select a role</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <p v-if="errors.roleId" class="text-red-500 text-sm mt-1 text-left">{{ errors.roleId }}</p>
        </div>

        <div class="mb-4 flex flex-col">
            <label for="password" class="text-left mb-1 text-gray-500 text-sm">Password:</label>
            <div class="relative flex items-center w-full">
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Password" class="p-2 w-full shadow text-sm appearance-none border-b border-gray-700 bg-transparent text-gray-700 leading-tight focus:outline-none" id="password" />
                <span @click="togglePasswordVisibility" class="absolute right-3 cursor-pointer">
                    <i :class="{'fas fa-eye-slash': showPassword, 'fas fa-eye': !showPassword}"></i>
                </span>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1 text-left">{{ errors.password }}</p>
        </div>

        <div class="mb-4 flex flex-col">
            <label for="confirm-password" class="text-left mb-1 text-gray-500 text-sm">Confirm Password:</label>
            <div class="relative flex items-center w-full">
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="Confirm Password" class="p-2 w-full shadow text-sm appearance-none border-b border-gray-700 bg-transparent text-gray-700 leading-tight focus:outline-none" id="confirm-password" />
                <span @click="toggleConfirmPasswordVisibility" class="absolute right-3 cursor-pointer">
                    <i :class="{'fas fa-eye-slash': showConfirmPassword, 'fas fa-eye': !showConfirmPassword}"></i>
                </span>
            </div>
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 text-left">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full inline-flex items-center justify-center relative" :disabled="isSubmitting">
            <span v-if="!isSubmitting">{{formTitle}}</span>
            <div v-else class="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
        </button>
        <span v-if="signupError" class="text-red-500">{{ signupError }}</span>

        <div v-if="formTitle === 'Sign Up Form'" class="flex text-sm justify-center">
            <p>Do you have already account?</p>
            <router-link to="/login" class="text-blue-500 hover:text-blue-200 mx-1">Click here</router-link>
        </div>
    </form>
    <PopupModal :isVisible="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" @confirmed="handleModalConfirm" />
</div>
</template>

<script setup>
import {
    onMounted,
    computed
} from 'vue';
import {
    useRouter,
    useRoute
} from 'vue-router';
import {
    storeToRefs
} from 'pinia';
import {
    useSignup,
    useToggleVisibility
} from '../composables/useLoginSignup';
import {
    useAuthStore
} from '../stores/auth';
import PopupModal from './PopupModal.vue'

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const {
    signupError,
    roles,
    showModal,
    modalTitle,
    modalMessage,
    modalType,
} = storeToRefs(authStore);

const {
    fetchRoles,
    openModal,
    closeModal
} = authStore;

const formTitle = computed(() => route.name === 'create-user' ? 'Create User' : 'Sign Up Form');
const {
    form,
    errors,
    isSubmitting,
    submitSignup
} = useSignup();

onMounted(async () => {
    await fetchRoles();
});

const customSubmitSignup = async () => {
    const result = await submitSignup(formTitle.value);
    if (result) {
        openModal({
            title: "Success",
            message: "User created Successful!",
            type: 'success',
        });
    }
};

const handleModalConfirm = () => {
     showModal.value = false; 
    if (modalType.value === 'success' && formTitle.value === "Sign Up Form") {
        router.push('/login');
    } else {
        closeModal()
    }
};

const {
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility
} = useToggleVisibility();
</script>

<style scoped>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
