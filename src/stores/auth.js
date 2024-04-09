import { reactive, toRefs, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';
import apiClient from '../api/apiClient';
const apiUrl = process.env.VUE_APP_API_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
    const state = reactive({
        user: JSON.parse(localStorage.getItem('user')),
        userToken: localStorage.getItem('token'),
        roles: [],
        polls: [],
        signupError: null,
        loginError: null,
        showModal: false,
        modalTitle: '',
        modalMessage: '',
        modalType: 'info',
        currentPage: 1,
        isAllPollsLoaded: false,
        userList: [],
        userListError: null,
    });
    const router = useRouter();

    const resetError = () => {
        state.signupError = null;
        state.loginError = null;
    };


    const signUp = async (formData, endPoint) => {
        resetError();
        try {
            let response;
            if (endPoint === 'Create User') {
                response = await axios.post(`${apiUrl}/user/create`, formData, {
                    headers: {
                        token: state.userToken
                    }
                });
            } else {
                response = await axios.post(`${apiUrl}/user/register`, formData)
            }
            state.user = response.data.user;
            state.userToken = response.data.token;
            if (!endPoint === 'Create User') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
            }
        } catch (err) {
            console.log(err.response?.data);
            state.signupError = err.response?.data || 'Signup failed';
            throw new Error(state.signupError);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${apiUrl}/role/list`);
            state.roles = response.data;
        } catch (err) {
            console.log('Failed to fetch roles:', err);
            throw err;
        }
    };

    const isLoggedIn = computed(() => !!state.user && !!state.userToken);

    const login = async (formData) => {
        resetError();
        try {
            const response = await axios.post(`${apiUrl}/user/login`, formData);
            state.user = response.data.user;
            state.userToken = response.data.token;
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            state.loginError = err.response?.data?.message || 'Login failed.';
            console.log('Login error:', state.loginError);
            throw err;
        }
    };

    const logout = () => {
        state.user = null;
        state.userToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    function openModal({ title, message, type = 'info' }) {
        state.modalTitle = title;
        state.modalMessage = message;
        state.modalType = type;
        state.showModal = true;
    }

    function closeModal() {
        state.showModal = false;
    }

    const getPollList = async () => {
        if (!state.userToken) {
            console.error("Authentication token not found.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/poll/list/${state.currentPage}?limit=10`, {
                headers: {
                    token: state.userToken
                }
            });
            if (response.data.rows.length < 10) {
                state.isAllPollsLoaded = true;
            }
            state.polls = [...state.polls, ...response.data.rows];
            state.currentPage++;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    };

    const loadMorePolls = async () => {
        if (!state.isAllPollsLoaded) {
            await getPollList();
        }
    };

    const voteCountResponse = async (payload) => {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vote/count`, payload,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    }

    const deletePolls = async (pollId) => {
        try {
            const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/poll/${pollId}`,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    }

    const getUserList = async (page, limit) => {
        if (!state.userToken) {
            console.error("Authentication token not found.");
            return;
        }
        try {
            const response = await apiClient.get(`/user/list/${page}?limit=${limit}`);
            state.userList = response.data.rows;
            const totalUsers = response.data.count; 
            state.totalPages = Math.ceil(totalUsers / limit);
            state.userListError = null;
        } catch (err) {
            console.error('Failed to fetch user list:', err);
            state.userListError = 'Failed to fetch user list.'; 
        }
    }

    return {
        ...toRefs(state),
        resetError,
        signUp,
        login,
        fetchRoles,
        logout,
        isLoggedIn,
        openModal,
        closeModal,
        getPollList,
        loadMorePolls,
        voteCountResponse,
        deletePolls,
        getUserList
    };
});
