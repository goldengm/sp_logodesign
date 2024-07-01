import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
//import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { compilerOptions } from './tsconfig.json';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const alias = Object.entries(compilerOptions.paths).reduce((acc, [key, [dist, src]]) => {
    return {
        ...acc,
        // [key]: path.resolve(__dirname, '../', src),
        [key]: path.resolve(src),
    };
}, {});

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/app/styles/index.scss',
                'resources/app/index.tsx',
            ],
            refresh: true,
            // @ts-ignore
            postcss: [
                tailwindcss(),
                autoprefixer(),
            ],
        }),
        react({ jsxImportSource: "@emotion/react" }),
        
    ],
    css: {
        preprocessorOptions: {
            scss: {},
        },
    },
    resolve: {
        alias: {
            ...alias,
            // '@': path.resolve(__dirname, 'resources/app'),
            '@': path.resolve('resources/app'),
        },
    },
});