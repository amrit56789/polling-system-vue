<template>
  <div class="max-w-4xl mx-auto p-5">
       <h2 class="text-2xl font-semibold mb-5">User List</h2>
       <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                 <thead class="bg-gray-800 text-white">
                      <tr>
                           <th class="px-4 py-2">ID</th>
                           <th class="px-4 py-2">First Name</th>
                           <th class="px-4 py-2">Last Name</th>
                           <th class="px-4 py-2">Email</th>
                      </tr>
                 </thead>
                 <tbody>
                      <tr v-for="user in userList" :key="user.id" class="bg-white border-b">
                           <td class="px-4 py-2">{{ user.id }}</td>
                           <td class="px-4 py-2">{{ user.firstName }}</td>
                           <td class="px-4 py-2">{{ user.lastName }}</td>
                           <td class="px-4 py-2">{{ user.email }}</td>
                      </tr>
                 </tbody>
            </table>
       </div>
       <div class="flex justify-between items-center mt-4">
            <button @click="prevPage" :disabled="currentPage === 1" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400 disabled:bg-gray-300">Prev</button>
            <button @click="nextPage" :disabled="currentPage >= totalPages" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400">Next</button>
       </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserList } from '../composables/useUserList';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { userList, totalPages } = storeToRefs(authStore);
const {  currentPage, nextPage, prevPage, fetchUserList } = useUserList();

onMounted(fetchUserList);
</script>
