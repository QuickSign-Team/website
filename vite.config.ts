import { defineConfig } from 'vite';
import { dreamlandPlugin } from 'vite-plugin-dreamland';
import { fileURLToPath, URL } from 'node:url';

const dreamlandRouterSource = fileURLToPath(
    new URL('./node_modules/@dreamlandjs/dreamland-router/src/index.tsx', import.meta.url)
);

export default defineConfig({
    plugins: [dreamlandPlugin()],
    esbuild: {
        jsx: 'transform',
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    },
    resolve: {
        alias: {
            'dreamland-router': dreamlandRouterSource,
            '@dreamlandjs/dreamland-router': dreamlandRouterSource
        }
    },
    optimizeDeps: {
        exclude: ['dreamland-router', '@dreamlandjs/dreamland-router']
    }
});
