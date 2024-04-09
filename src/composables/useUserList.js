import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useUserList() {
     const isLoading = ref(false);
     const currentPage = ref(1);
     const limit = ref(10);

     const authStore = useAuthStore()
     const fetchUserList = async () => {
          isLoading.value = true;
          try {
               await authStore.getUserList(currentPage.value, limit.value)
               return true
          } catch (err) {
               console.error("Failed to fetch users:", err.message);
               return false
          } finally {
               isLoading.value = false;
          }
     };

     const nextPage = () => {
          currentPage.value++;
          fetchUserList();
     };

     const prevPage = () => {
          if (currentPage.value > 1) {
               currentPage.value--;
               fetchUserList();
          }
     };

     return {
          isLoading,
          currentPage,
          nextPage,
          prevPage,
          fetchUserList,
     };
}
