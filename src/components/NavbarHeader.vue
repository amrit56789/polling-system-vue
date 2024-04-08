<template>
<nav v-if="isLoggedIn" class="bg-blue-600 p-1 pb-2 text-white shadow-lg mb-4">
    <div class="container mx-auto flex justify-end items-center">
        <div class="relative mr-4">
            <button @click="toggleDropdown" class="flex items-center focus:outline-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                <span class="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    <svg class="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.188l-8-5.625v-7.82c0-1.008-.792-1.8-1.8-1.8s-1.8.792-1.8 1.8v7.82l-8 5.625v1.5l8-5.625v7.82l-3 .75v1.192l4-1 4 1v-1.192l-3-.75v-7.82l8 5.625v-1.5z" />
                    </svg>
                </span>
                <span class="ml-3">{{ user.firstName }}</span>
            </button>
            <div v-show="showDropdown" @click="toggleDropdown" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                <div class="px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-t-lg">
                    <div class="font-medium">{{ user.firstName }}</div>
                    <div class="text-gray-500">{{ user.email }}</div>
                </div>
                <div class="border-t border-gray-200"></div>
                <button @click="handleLogout" class="w-full hover:text-white text-left block px-4 py-3 text-sm text-gray-700 hover:bg-gray-500 focus:outline-none focus:bg-gray-100">
                    Logout
                </button>
            </div>
        </div>
    </div>
</nav>
</template>
    
<script setup>
import {
    ref
} from 'vue';
import {
    storeToRefs
} from 'pinia';
import {
    useAuthStore
} from '../stores/auth'; 

const authStore = useAuthStore();
const {
    logout
} = authStore;
const {
    user,
    isLoggedIn
} = storeToRefs(authStore);
const showDropdown = ref(false);

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const handleLogout = async () => {
    logout();
};
</script>
