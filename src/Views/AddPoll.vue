<template>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-5">{{ isEdit ? 'Edit Poll' : 'Add Poll' }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="pollTitle" class="block text-lg sm:text-xl font-medium text-gray-700">
                Poll Title
            </label>
            <div class="mt-1">
                <input id="pollTitle" name="pollTitle" type="text" required minlength="10" class="p-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Enter poll title here..." v-model="poll.title">
            </div>
        </div>

        <div v-for="(option, index) in poll.options" :key="index" class="pt-2">
            <label class="block text-lg font-medium text-gray-700">Option {{ index + 1 }}</label>
            <div class="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
                <input type="text" v-model="option.title" required class="p-4 flex-grow block w-full min-w-0 rounded-md sm:text-sm border border-gray-300 mr-2" />
                <button type="button" @click="deleteOption(option.id, index)" class="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none">
                    Delete
                </button>
            </div>
        </div>

        <div class="pt-5">
            <div class="flex justify-start">
                <button type="button" @click="addOption" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700">
                    Add Option
                </button>
            </div>
        </div>

        <div class="pt-5">
            <div class="flex justify-end">
                <button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    {{ isEdit ? 'Update Poll' : 'Create Poll' }}
                </button>
            </div>
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">{{ error }}</span>
        </div>
    </form>

    <PopupModal :isVisible="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" @confirmed="handleModalConfirm" />
</div>
</template>

<script setup>
import {
    storeToRefs
} from 'pinia';
import {
    computed
} from 'vue';
import {
    useAuthStore
} from '../stores/auth';
import {
    useAddPoll
} from "../composables/useAddPoll";
import PopupModal from './PopupModal.vue';

const authStore = useAuthStore();
const {
    showModal,
    modalTitle,
    modalMessage,
    modalType,
} = storeToRefs(authStore);
const {
    openModal,
    closeModal
} = authStore;

const existingPoll = computed(() => authStore.getCurrentPoll());
const {
    poll,
    addOption,
    submitForm,
    deleteOption,
    error,
    isEdit,
    resetPoll
} = useAddPoll(existingPoll.value);

const handleSubmit = async () => {
    error.value = null;
    try {
        const result = await submitForm();
        if (result) {
            openModal({
                title: "Success",
                message: isEdit ? "Poll updated Successful!" : "Poll created successfully!",
                type: 'success',
            });
            resetPoll();
        }
    } catch (err) {
        openModal({
            title: "Failed",
            message: "Failed to add the poll!",
            type: 'failed',
        });
        console.error('Failed to process the poll:', err);
    }
};

const handleModalConfirm = () => {
    if (modalType.value === 'success') {
        closeModal()
    }
};
</script>
