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
                response = await apiClient.post(`/user/create`, formData);
            } else {
                response = await axios.post(`${apiUrl}/user/register`, formData)
            }
            if (!endPoint === 'Create User') {
                state.user = response.data.user;
                state.userToken = response.data.token;
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
            state.polls =response.data.rows;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    };

    const loadMorePolls = async () => {
        if (!state.isAllPollsLoaded) {
            state.currentPage++;
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

    const addEditPoll = async (pollId, payload, isEdit) => {
        try {
            if (isEdit) {
                await apiClient.put(`${apiUrl}/poll/${pollId}`, payload);
            } else {
                await apiClient.post(`${apiUrl}/poll/add`, payload);
            }
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
            state.userListError = err.response?.data?.message || 'Failed to fetch polls.';
        }
    }

    const setCurrentPoll = (pollData) => {
        state.currentPoll = pollData;
    };

    const getCurrentPoll = () => {
        return state.currentPoll;
    };

    async function updateOption(optionId, title) {
        try {
            const response = await apiClient.put(`${process.env.VUE_APP_API_BASE_URL}/option/edit/${optionId}`, { optionTitle: title });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }

    }

    const updateNewOptionInExistingPoll = async (pollId, payload) => {
        try {
            const response = await apiClient.post(`${process.env.VUE_APP_API_BASE_URL}/poll/addPollOption/${pollId}`,
                payload,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }

    }

    const deletePollOptions = async (optionId) => {
        try {
            const result = await apiClient.delete(`${process.env.VUE_APP_API_BASE_URL}/option/delete/${optionId}`);
            return result
        } catch (err) {
            console.log(err)
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
        getUserList,
        addEditPoll,
        setCurrentPoll,
        getCurrentPoll,
        updateOption,
        updateNewOptionInExistingPoll,
        deletePollOptions
    };
});
