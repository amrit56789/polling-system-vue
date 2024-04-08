import { createRouter, createWebHashHistory } from 'vue-router';
import SignUpForm from '../Views/SignUpForm.vue';
import LoginForm from '../Views/LoginForm.vue';
import PollList from '../Views/PollList.vue';
import UserList from '../Views/UserList.vue';
import AddPoll from '../Views/AddPoll.vue';
import { useAuthStore } from '../stores/auth'; 
const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUpForm
    },
    {
        path: '/login',
        name: 'login',
        component: LoginForm
    },

    {
        path: '/polls',
        name: 'polls',
        component: PollList
    },
    {
        path: '/create-user',
        name: 'create-user',
        component: SignUpForm
    },
    {
        path: '/users-list',
        name: 'users-list',
        component: UserList
    },
    {
        path: '/add-poll',
        name: 'add-poll',
        component: AddPoll
    },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = !['/login', '/signup'].includes(to.path); 
    const requiresAdmin = ['/add-poll', '/create-user', '/users-list'].includes(to.path);

    if (requiresAuth && !authStore.isLoggedIn) {
        next('/login');
    } else if (requiresAdmin && authStore.user.roleId !== 1) {
        next('/polls'); 
    } else {
        next();
    }
});

export default router;
