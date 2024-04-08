<template>
  <div class="max-w-xs mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl py-6">
      <div v-if="isLoading" class="text-center text-sm sm:text-base">Loading polls...</div>
      <div v-if="error" class="text-red-500 text-center text-sm sm:text-base">{{ error }}</div>
      <div v-for="(poll, index) in polls" :key="poll.id" class="mt-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-lg shadow-lg px-2 sm:px-5 py-4 hover:shadow-xl transition-shadow duration-300">
          <h3 class="text-xl sm:text-2xl font-bold text-black-900 text-left p-4">{{ index + 1 }}. {{ poll.title }}</h3>
          <form @submit.prevent="submitVote(poll.id)" class="p-4">
              <div v-for="option in poll.optionList" :key="option.id" class="mt-2">
                  <label :for="`option-${option.id}`" class="flex items-center cursor-pointer">
                      <input type="radio" :id="`option-${option.id}`" :name="`poll-${poll.id}`" :disabled="isVoted(poll.id)" v-model="selectedOption[poll.id]" :value="option.id" class="accent-blue-500 h-4 w-4">
                      <span class="ml-2 text-lg text-gray-700">{{ option.optionTitle }}</span>
                  </label>
              </div>
              <button type="submit" class="mt-4 px-4 sm:px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200" :disabled="isVoted(poll.id)">Submit</button>
          </form>
  
          <!-- Admin controls -->
          <div v-if="user?.roleId === ADMIN_ROLE_ID" class="flex flex-col sm:flex-row mt-4 justify-end gap-2">
              <button @click="editPoll(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center">
                  <Icon icon="mdi:pencil" class="w-8 h-8 sm:w-12 sm:h-5 text-yellow-500" />
              </button>
              <button @click="showResults(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center">
                  <Icon icon="mdi:chart-bar" class="w-8 h-8 sm:w-12 sm:h-5 text-blue-500" />
              </button>
              <button @click="deletePoll(poll.id)" class="text-white font-semibold rounded-lg transition-colors duration-200 flex items-center">
                  <Icon icon="mdi:delete" class="w-8 h-8 sm:w-10 sm:h-5 text-red-500" />
              </button>
          </div>
      </div>
      <div v-if="!isLoading && polls.length === 0" class="text-center text-gray-700 text-sm sm:text-base">No data found</div>
      <button v-if="!isLoading && !isAllPollsLoaded" @click="loadMore" class="mt-6 px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 w-full font-semibold rounded-lg transition-colors duration-200">
          Load More
      </button>
  </div>
  </template>

<script setup>
import {
    Icon
} from '@iconify/vue';
import {
    reactive,
    ref
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
const {
    isLoading,
    error,
    loadMore,
    submitVoteResponse,
    deletePoll,
    editPoll,
    getVotes
} = usePolls();
const {
    polls,
    user,
    isAllPollsLoaded
} = storeToRefs(useAuthStore());

const selectedOption = ref({});
const pollResultsData = ref(null);
let votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
const submissionState = reactive({});

const isVoted = (pollId) => {
    return votedPolls.includes(pollId) || submissionState[pollId];
};

const showResults = async (pollId) => {
    try {
        const response = await getVotes(pollId);
        pollResultsData.value = response;
    } catch (error) {
        console.error("Failed to fetch poll results:", error);
    }
};

const submitVote = async (pollId) => {
    if (!selectedOption.value[pollId] || isVoted(pollId)) return;
    submissionState[pollId] = true;
    try {
        await submitVoteResponse(selectedOption.value[pollId]);
        votedPolls.push(pollId);
        localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
    } catch (error) {
        console.error("Failed to submit vote:", error.message);
    }
};
</script>
