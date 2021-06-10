import { Component } from 'vue'
import Home from './pages/Home.vue';
import About from './pages/About.vue';
import NotFound from './pages/404.vue';

const routes: { [key: string]: Component } = {
    "/": Home,
    "/about": About,
    "*": NotFound,
};

export default routes;
