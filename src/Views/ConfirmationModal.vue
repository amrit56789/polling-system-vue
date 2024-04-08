<template>
<div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="text-center">
            <h2 class="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this poll?</p>
            <div class="mt-4">
                <button @click="confirm" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Confirm
                </button>
                <button @click="cancel" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>
</template>

    
<script setup>
import {
    defineProps,
    defineEmits
} from 'vue';

defineProps({
    isVisible: Boolean
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
    emit('confirm');
};

const cancel = () => {
    emit('cancel');
};
</script>
