import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    output: {
        assetPrefix: '/towergame/',
    },
    source: {
        define: {
            BUILD_NUM: JSON.stringify(process.env.BUILD_NUM),
            BUILD_LINK: JSON.stringify(process.env.BUILD_LINK),
        },
    },
});
