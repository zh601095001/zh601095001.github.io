import {defineConfig} from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
// @ts-ignore
import topLevelAwait from "vite-plugin-top-level-await";
// https://vitejs.dev/config/

export default defineConfig({
    plugins: [
        // 添加JSX插件
        vueJsx(),
        topLevelAwait({
            promiseExportName: '__tla',
            promiseImportName: i => `__tla_${i}`,
        }),
    ],
    server: {
        proxy: {
            // 使用 "/api" 前缀
            '/api': {
                target: 'https://typro-zh.oss-cn-shanghai.aliyuncs.com', // 后端目标接口地址
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                rewrite: (path) => path.replace(/^\/api/, '') // 重写接口路径
            }
        }
    }
});
