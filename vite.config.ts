import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './manijest';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        Vue(),
        AutoImport({
            imports: ['vue', 'vuex', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
            dts: 'src/auto-imports.d.ts',
        }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: manifest,
            workbox: {
                // workbox options for generateSW
            },
        }),
    ],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
});
