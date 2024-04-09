import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
export function useAddPoll(existingPoll = null) {
     const authStore = useAuthStore();
     const isLoading = ref(false);
     const error = ref(null);
     const originalOptions = ref([]);
     const originalPollTitle = ref(existingPoll?.title || '');

     const isEdit = existingPoll !== null;
     const poll = ref(existingPoll ? {
          id: existingPoll.id,
          createdBy: existingPoll.createdBy,
          title: existingPoll.title,
          options: existingPoll.optionList.map(option => ({
               id: option.id,
               title: option.optionTitle,
          }))
     } : getInitialPollState());

     function resetPoll() {
          poll.value = getInitialPollState();
     }

     function getInitialPollState() {
          return {
               id: '',
               createdBy: '',
               title: '',
               options: [{ title: '' }, { title: '' }],
          };
     }

     if (existingPoll) {
          originalOptions.value = existingPoll.optionList.map(option => ({
               id: option.id,
               title: option.optionTitle,
          }));
     }

     const addOption = () => {
          error.value = null;
          poll.value.options.push({ title: '' });
     };

     const submitForm = async () => {
          if (!poll.value.title || poll.value.title.length < 10) {
               error.value = "Poll title must be at least 10 characters.";
          }
          if (poll.value.options.some(option => !option.title.trim())) {
               error.value = "All options must have a title.";
          }

          const addNewPollPayload = {
               title: poll.value.title,
               options: poll.value.options.map(option => ({ optionTitle: option.title.trim() })),
          };
          const editPayload = {
               title: poll.value.title,
               createdBy: poll.value.createdBy
          }
          try {
               isLoading.value = true;
               if (isEdit) {
                    let hasUpdates = false;
                    if (poll.value.title.trim() !== originalPollTitle.value.trim()) {
                         hasUpdates = true;
                    }
                    for (const option of poll.value.options) {
                         const originalOption = originalOptions.value.find(o => o.id === option.id);

                         if (originalOption && originalOption.title.trim() !== option.title.trim()) {
                              await authStore.updateOption(option.id, option.title.trim());
                         } else if (!option.id) {
                              const addOptionPayload = {
                                   optionTitle: option.title.trim()
                              };
                              await authStore.updateNewOptionInExistingPoll(poll.value.id, addOptionPayload)
                         }
                    }
                    if (hasUpdates) {
                         await authStore.addEditPoll(poll.value.id, editPayload, isEdit);
                    }
                    resetPoll();
                    return true;
               } else {
                    await authStore.addEditPoll('', addNewPollPayload, '');
                    isLoading.value = false;
                    resetPoll();
                    return true;
               }
          } catch (err) {
               console.error("Failed to submit the poll:", err.message);
               error.value = err.message || 'Unknown error occurred.';
               return false;
          } finally {
               isLoading.value = false;
          }
     };

     const deleteOption = async (optionId, index) => {
          try {
               isLoading.value = true;
               let result;
               if (poll.value.options.length > 2 && optionId) {
                    result = await authStore.deletePollOptions(optionId);
                    poll.value.options.splice(index, 1);
                    return result
               } else if (poll.value.options.length > 2) {
                    poll.value.options.splice(index, 1);
               } else {
                    error.value = 'Minimum two options should be required.';
                    return error
               }

          } catch (err) {
               console.error("Failed to delete the option:", err.message);
               error.value = err.message || 'Unknown error occurred.';
          } finally {
               isLoading.value = false;
          }
     };


     return {
          poll,
          addOption,
          submitForm,
          isLoading,
          error,
          deleteOption,
          isEdit,
          resetPoll
     };
}
