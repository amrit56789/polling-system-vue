<template>
<div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div :class="['p-5 rounded', typeClass, 'w-96']">
        <h2 class="text-4xl font-bold">{{ title }}</h2>
        <p class="my-3 text-md">{{ message }}</p>
        <button @click="confirm" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            OK
        </button>
    </div>
</div>
</template>

    
<script setup>
import {
    computed
} from 'vue';
import {
    defineProps,
    defineEmits
} from 'vue';

const props = defineProps({
    isVisible: Boolean,
    title: String,
    message: String,
    type: String,
});

const emit = defineEmits(['confirmed']);

const typeClass = computed(() => {
    return props.type === 'error' ? 'bg-red-500 text-white' : 'bg-white';
});

const confirm = () => {
    emit('confirmed');
};
</script>
