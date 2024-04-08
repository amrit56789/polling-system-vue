<template>
<div>
    <nav class="" v-if="isLoggedIn && !isLoginOrSignupPage">
        <NavbarHeader />
    </nav>
    <router-view></router-view>
</div>
</template>

  
    
  
<script>
import NavbarHeader from "./Views/NavbarHeader.vue"
import {
    useAuthStore
} from './stores/auth';
import {
    computed
} from 'vue';
import {
    useRoute
} from 'vue-router';

export default {
    name: 'App',
    components: {
        NavbarHeader,
    },
    setup() {
        const authStore = useAuthStore();
        const isLoggedIn = computed(() => authStore.isLoggedIn);
        const route = useRoute();

        const isLoginOrSignupPage = computed(() => {
            return ['login', 'signup'].includes(route.name);
        });

        return {
            isLoggedIn,
            isLoginOrSignupPage,
        };
    },
};
</script>
  
  
<style>
body {
    background-color: #e3e4eb;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-bottom: 20px;
}
</style>
