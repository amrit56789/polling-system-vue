import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
export function usePolls() {
    const isLoading = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();
    const router = useRouter()

    const fetchPolls = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            await authStore.getPollList();
        } catch (err) {
            console.error("Failed to fetch polls:", err.message);
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const deletePoll = async (pollId) => {
        isLoading.value = true;
        try {
            const result = await authStore.deletePolls(pollId);
            if (result.statusText === "OK") {
                const index = authStore.polls.findIndex(poll => poll.id === pollId);
                if (index !== -1) {
                    authStore.polls.splice(index, 1);
                }
                await fetchPolls();
                return true;
            }
        } catch (err) {
            console.error("Failed to delete poll:", err.message);
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const loadMore = async () => {
        await authStore.loadMorePolls();
    };

    const submitVoteResponse = async (optionId) => {
        isLoading.value = true;
        const payload = { optionId };
        try {
            const result = await authStore.voteCountResponse(payload);
            if (result.statusText === "OK") {
                return true;
            }
        } catch (err) {
            console.error("Failed to submit vote:", err.message);
            error.value = err.message;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const editPoll = (pollId) => {
        const pollToEdit = authStore.polls.find(poll => poll.id === pollId);
        if (!pollToEdit) {
            console.error('Poll not found');
            return;
        }
        authStore.setCurrentPoll(pollToEdit);
        router.push({
            name: 'EditPoll'
        });
    };

          onMounted(fetchPolls);

    return {
        isLoading,
        error,
        fetchPolls,
        deletePoll,
        loadMore,
        submitVoteResponse,
        editPoll
    };
}
