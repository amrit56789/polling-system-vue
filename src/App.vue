<template>
<div>
    <nav class="" v-if="isLoggedIn">
        <NavbarHeader />
    </nav>
    <router-view></router-view>
</div>
</template>

<script>
import NavbarHeader from "./components/NavbarHeader.vue"
import {
    useAuthStore
} from './stores/auth';
import {
    computed
} from 'vue';

export default {
    name: 'App',
    components: {
        NavbarHeader,
    },
    setup() {
        const authStore = useAuthStore();
        const isLoggedIn = computed(() => authStore.isLoggedIn);
        return {
            isLoggedIn,
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
