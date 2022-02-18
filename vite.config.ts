import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        Vue(),
        AutoImport({
            imports: ['vue', 'vuex', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
            dts: 'src/auto-imports.d.ts',
        }),
        VitePWA({
            mode: 'development',
            base: '/',
            srcDir: 'src',
            filename: 'sw.ts',
            strategies: 'injectManifest',
            includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
            manifest: {
                name: 'SandFlow',
                short_name: 'SandFlow',
                icons: [
                    {
                        src: '/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
                theme_color: '#117e49',
                background_color: '#117e49',
                start_url: '/',
                display: 'standalone',
            },
            registerType: 'autoUpdate',
            workbox: {
                sourcemap: true,
            },
        }),
    ],
    server: {
        host: true,
    },
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
});
