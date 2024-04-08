<template>
<div class="flex justify-center gap-10 mt-32">
    <form @submit.prevent="submitLogin" class="border-2 border-slate-200 rounded-xl space-y-4 p-4 shadow-lg flex flex-col justify-between">
        <h1 class="font-bold text-2xl text-center">Login</h1>
        <div class="field">
            <label for="email" class="label">Email:</label>
            <input type="email" v-model="form.email" placeholder="Email" class="input" id="email" />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1 text-left">{{ errors.email }}</p>
        </div>

        <div class="field">
            <label for="password" class="label">Password:</label>
            <div class="input-wrapper">
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Password" class="input" id="password" />
                <span @click="togglePasswordVisibility" class="icon-eye">
                    <i :class="{'fas fa-eye-slash': showPassword, 'fas fa-eye': !showPassword}"></i>
                </span>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1 text-left">{{ errors.password }}</p>
        </div>

        <button type="submit" class="btn flex justify-center items-center" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Login</span>
            <div v-else class="button-loader"></div>
        </button>
        <span v-if="loginError" class="text-red-500">{{ loginError }}</span>
        <div class="flex text-sm justify-center">
            <p>Don't have an account yet?</p>
            <router-link to="/signup" class="text-blue-500 hover:text-blue-600 mx-1">Sign Up</router-link>
        </div>
    </form>
    <PopupModal :isVisible="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" @confirmed="handleModalConfirm" />

</div>
</template>

    
<script>
import {
    ref
} from 'vue';
import {
    useLogin,
    useToggleVisibility
} from '../composables/useLoginSignup';

import PopupModal from './PopupModal.vue';
import {
    useAuthStore
} from '../stores/auth';
import {
    storeToRefs
} from 'pinia';
import {
    useRouter
} from 'vue-router';

export default {
    name: 'LoginForm',
    components: {
        PopupModal
    },
    setup() {
        const {
            form,
            errors,
            isSubmitting,
            submitLogin,
        } = useLogin();
        const router = useRouter();
        const authStore = useAuthStore();
        const {
            loginError
        } = storeToRefs(authStore)
        const showModal = ref(false);
        const modalTitle = ref('');
        const modalMessage = ref('');
        const modalType = ref('success');
        const customSubmitLogin = async () => {
            const result = await submitLogin();
            if (result) {
                modalTitle.value = "Success";
                modalMessage.value = "Login Successful!";
                modalType.value = 'success';
                showModal.value = true;
                router.push('/polls');
            }
        };

        const handleModalConfirm = () => {
            showModal.value = false;
        };
        return {
            form,
            errors,
            isSubmitting,
            submitLogin: customSubmitLogin,
            showModal,
            modalMessage,
            modalType,
            modalTitle,
            loginError,
            handleModalConfirm,
            ...useToggleVisibility()
        };
    },
};
</script>

    
<style scoped>
form {
    width: 30%;
    background-color: #FFFFFF;
    padding: 20px 40px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;

}

.input {
    flex: 1;
    padding: 0.5rem;
    margin: 0.1rem 0;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #592525;
    background-color: transparent;
    font-size: 0.8rem;
}

.icon-eye {
    position: absolute;
    right: 0.5rem;
    cursor: pointer;
}

.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.label {
    text-align: start;
    margin-bottom: 5px;
    color: #929191;
    font-size: 0.95rem;
}

.input:focus {
    outline: none;
}

.btn {
    background-color: #1DB75F;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    width: 100%;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.button-loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
}

.btn:hover {
    background-color: #23824c;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
