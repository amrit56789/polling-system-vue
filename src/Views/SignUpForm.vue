<template>
<div class="flex justify-center gap-10 mt-4">
    <form @submit.prevent="submitSignup" class=" border-2 border-slate-200 rounded-xl space-y-4 p-4 shadow-lg flex flex-col justify-between">
        <h1 class="font-bold text-2xl text-center">{{formTitle}}</h1>
        <div class="field">
            <label for="first-name" class="label">First name:</label>
            <input type="text" v-model="form.firstName" placeholder="First Name" class="input" id="first-name" />
            <p v-if="errors.firstName" class="text-red-500 text-sm mt-1 text-left">{{ errors.firstName }}</p>
        </div>

        <div class="field">
            <label for="last-name" class="label">Last name:</label>
            <input type="text" v-model="form.lastName" placeholder="Last Name" class="input" id="last-name" />
            <p v-if="errors.lastName" class="text-red-500 text-sm mt-1 text-left">{{ errors.lastName }}</p>
        </div>

        <div class="field">
            <label for="email" class="label">Email:</label>
            <input type="email" v-model="form.email" placeholder="Email" class="input" id="email" />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1 text-left">{{ errors.email }}</p>
        </div>

        <div class="field">
            <label for="roles" class="label">Roles:</label>
            <select v-model="form.roleId" class="input" id="roles">
                <option disabled value="">Select a role</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
            <p v-if="errors.roleId" class="text-red-500 text-sm mt-1 text-left">{{ errors.roleId }}</p>
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

        <div class="field">
            <label for="confirm-password" class="label">Confirm Password:</label>
            <div class="input-wrapper">
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="Confirm Password" class="input" id="confirm-password" />
                <span @click="toggleConfirmPasswordVisibility" class="icon-eye">
                    <i :class="{'fas fa-eye-slash': showConfirmPassword, 'fas fa-eye': !showConfirmPassword}"></i>
                </span>
            </div>
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 text-left">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="btn flex justify-center items-center" :disabled="isSubmitting">
            <span v-if="!isSubmitting">{{formTitle}}</span>
            <div v-else class="button-loader"></div>
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

    
<script>
import {
    ref,
    onMounted,
    computed
} from 'vue';
import {
    useSignup,
    useToggleVisibility
} from '../composables/useLoginSignup';
import {
    useAuthStore
} from '../stores/auth';
import PopupModal from './PopupModal.vue';
import {
    useRouter,
    useRoute
} from 'vue-router';
import {
    storeToRefs
} from 'pinia';
export default {
    name: 'SignUpForm',
    components: {
        PopupModal
    },
    setup() {
        const {
            form,
            errors,
            isSubmitting,
            submitSignup,
        } = useSignup();

        const showModal = ref(false);
        const modalTitle = ref('');
        const modalMessage = ref('');
        const modalType = ref('success');
        const router = useRouter();
        const route = useRoute();
        const authStore = useAuthStore();
        const {
            signupError,
            roles
        } = storeToRefs(authStore)
        const {
            fetchRoles,
        } = authStore

        onMounted(async () => {
            await fetchRoles();
        });

        const formTitle = computed(() => {
            return route.name === 'create-user' ? 'Create User' : 'Sign Up Form';
        });

        const customSubmitSignup = async () => {
            const result = await submitSignup(formTitle.value);
            if (result) {
                modalTitle.value = "Success";
                modalMessage.value = `User created Successful!`;
                modalType.value = 'success';
                showModal.value = true;
            }
        };

        const handleModalConfirm = () => {
            if (modalType.value === 'success' && formTitle.value === "Sign Up Form") {
                router.push('/login');
            } else {
                showModal.value = false;
            }
        };

        return {
            form,
            signupError,
            errors,
            isSubmitting,
            roles,
            formTitle,
            submitSignup: customSubmitSignup,
            showModal,
            modalMessage,
            modalType,
            modalTitle,
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

.input:focus {
    outline: none;
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
