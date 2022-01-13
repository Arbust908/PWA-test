import { createApp } from 'vue';

import router from '@/router';
import store from '@/store';
import App from '@/App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './index.css';
import { abilitiesPlugin } from '@casl/vue';
import ability from './helpers/canI';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        // show a prompt to user
    },
    onOfflineReady() {
        // show a ready to work offline to user
    },
});
// when user clicked the "refresh" button
updateSW();
// the page will reload and the up-to-date content will be served.
createApp(App)
    .use(router)
    .use(store)
    .use(VueAxios, axios)
    .use(ElementPlus)
    .use(abilitiesPlugin, ability.getInstance(), { useGlobalProperties: true })
    .mount('#app');
