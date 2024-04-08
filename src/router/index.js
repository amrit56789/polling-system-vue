import { createRouter, createWebHashHistory } from 'vue-router';
import SignUpForm from "../Views/SignUpForm.vue"
import LoginForm from '../Views/LoginForm.vue';
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
