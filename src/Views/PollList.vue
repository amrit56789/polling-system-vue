<template>
<div class="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl">
    <div v-if="isLoading" class="text-center text-sm sm:text-base">Loading polls...</div>
    <div v-if="error" class="text-red-500 text-center text-sm sm:text-base">{{ error }}</div>
    <div v-for="(poll, index) in polls" :key="poll.id" class="mt-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-black text-left">{{ index + 1 }}. {{ poll.title }}</h3>
        <form @submit.prevent="submitVote(poll.id)" class="mt-4">
            <div v-for="option in poll.optionList" :key="option.id" class="mt-2">
                <label :for="`option-${option.id}`" class="flex items-center cursor-pointer">
                    <input type="radio" :id="`option-${option.id}`" :name="`poll-${poll.id}`" :disabled="isVoted(poll.id)" v-model="selectedOption[poll.id]" :value="option.id" class="accent-blue-500 h-4 w-4">
                    <span class="ml-2 text-base sm:text-lg">{{ option.optionTitle }}</span>
                </label>
            </div>
            <button type="submit" class="mt-4 px-4 sm:px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200" :disabled="isVoted(poll.id)">Submit</button>
        </form>

        <!-- Admin controls -->
        <div v-if="user?.roleId === ADMIN_ROLE_ID" class="flex flex-wrap justify-end gap-2 mt-4">
            <button @click="editPoll(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center w-10 h-10 bg-yellow-500 hover:bg-yellow-600">
                <Icon icon="mdi:pencil" class="text-xl" />
            </button>
            <button @click="showResults(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600">
    <Icon icon="mdi:chart-bar" class="text-xl" />
</button>
            <button @click="confirmDelete(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600">
                <Icon icon="mdi:delete" class="text-xl" />
            </button>
            <BarChartModal :isVisible="isModalVisible" :chartData="pollResultsData" @close="isModalVisible = false" />
        </div>
    </div>
    <div v-if="!isLoading && polls.length === 0" class="text-center text-gray-700 text-sm sm:text-base">No data found</div>
    <button v-if="!isLoading && !isAllPollsLoaded" @click="loadMore" class="mt-6 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 w-full font-semibold rounded-lg transition-colors duration-200">
        Load More
    </button>
   

    <ConfirmationModal :isVisible="showModal" @confirm="onConfirm" @cancel="onCancel" />

</div>
</template>

<script setup>
import {
    Icon
} from '@iconify/vue';
import {
    reactive,
    ref,
    watch
} from 'vue';
import {
    usePolls
} from '../composables/usePollList';
import {
    useAuthStore
} from '../stores/auth';
import {
    storeToRefs
} from 'pinia';
import {
    ADMIN_ROLE_ID
} from '@/Constant/constants';
import ConfirmationModal from './ConfirmationModal.vue';
import BarChartModal from "./BarChatModal.vue"
const {
    isLoading,
    error,
    loadMore,
    submitVoteResponse,
    deletePoll,
    editPoll,
    getVotes,
} = usePolls();
const {
    polls,
    user,
    isAllPollsLoaded
} = storeToRefs(useAuthStore());

const isModalVisible = ref(false);
const pollResultsData = ref(null);

const showModal = ref(false);
const pollIdToDelete = ref(null);

function confirmDelete(pollId) {
    pollIdToDelete.value = pollId;
    showModal.value = true;
}

const onConfirm = async () => {
    showModal.value = false;
    try {
        await deletePoll(pollIdToDelete.value);
        pollIdToDelete.value = null;
    } catch (error) {
        console.error("Failed to delete poll:", error.message);
    }
}

const onCancel = () => {
    showModal.value = false;
    pollIdToDelete.value = null;
}

const selectedOption = ref({});
let votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
const submissionState = reactive({});

const isVoted = (pollId) => {
    return votedPolls.includes(pollId) || submissionState[pollId];
};

const showResults = async (pollId) => {
  try {
    const response = await getVotes(pollId);
    const optionList = response.optionList;
    const labels = optionList.map(option => option.optionTitle);
    const data = optionList.map(option => option.totalVoteCount);
    pollResultsData.value = {
      labels: labels,
      datasets: [{
        label: 'Total Votes',
        data: data,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
      }]
    };
    isModalVisible.value = true;
  } catch (error) {
    console.error("Failed to fetch poll results:", error.message);
  }
};

watch([polls, isLoading], ([newPolls, newIsLoading]) => {
    if (!newIsLoading && newPolls.length > 0) {
        newPolls.forEach(poll => {
            const savedOptionId = localStorage.getItem(`selectedOption-${poll.id}`);
            if (savedOptionId) {
                selectedOption.value[poll.id] = savedOptionId;
            }
        });
    }
}, { immediate: true });

const submitVote = async (pollId) => {
    const selectedOptionId = selectedOption.value[pollId];
    if (!selectedOptionId || isVoted(pollId)) return;
    submissionState[pollId] = true;
    try {
        await submitVoteResponse(selectedOptionId);
        votedPolls.push(pollId);
        localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
        localStorage.setItem(`selectedOption-${pollId}`, selectedOptionId);
    } catch (error) {
        console.error("Failed to submit vote:", error.message);
    }
};

</script>
