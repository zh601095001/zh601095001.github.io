// https://vitepress.dev/guide/custom-theme
import {h} from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import AlgorithmLevel from "../../components/algorithmLevel.vue";
import Stackblitz from "../../components/stackblitz.vue";
import Rank from "../../components/rank.vue";
import Highlight from "../../components/highlight.vue";
import StackblitzModal from "../../components/stackblitzModal.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import AuthUrl from "../../components/authUrl.vue";
import MyVideo from "../../components/myVideo.vue";
import "vue3-video-play/dist/style.css";

export default {
    ...Theme,
    Layout: () => {
        return h(Theme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        })
    },
    async enhanceApp({app, router, siteData}) {
        app.component('AlgorithmLevel', AlgorithmLevel)
        app.component('Stackblitz', Stackblitz)
        app.component('Rank', Rank)
        app.component('Highlight', Highlight)
        app.component('StackblitzModal', StackblitzModal)
        app.component("AuthUrl", AuthUrl)
        app.component("MyVideo", MyVideo)
        app.use(Antd)

        if (!import.meta.env.SSR) {
            const plugin = await import('vue3-video-play')
            app.use(plugin)

            document.addEventListener('click', function (event) {
                // 检查触发事件的元素是否是 img 标签或其子元素
                var targetElement = event.target;

                // 如果是 img 标签或其子元素
                if (targetElement.tagName === 'IMG') {
                    // 在这里执行你想要的操作
                    const image = new Image();
                    image.src = targetElement.src;
                    image.onload = () => {
                        // 创建弹出层
                        const previewContainer = document.createElement('div');
                        previewContainer.style.position = 'fixed';
                        previewContainer.style.top = 0;
                        previewContainer.style.bottom = 0;
                        previewContainer.style.left = 0;
                        previewContainer.style.right = 0;
                        previewContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        previewContainer.style.display = 'flex';
                        previewContainer.style.justifyContent = 'center';
                        previewContainer.style.alignItems = 'center';
                        previewContainer.style.zIndex = 99999
                        document.body.appendChild(previewContainer);
                        // 在弹出层中添加图片
                        const previewImage = document.createElement('img');
                        previewImage.src = targetElement.src;
                        previewImage.style.maxWidth = '80%';
                        previewImage.style.maxHeight = '80%';
                        previewContainer.appendChild(previewImage);
                        // 点击弹出层，关闭预览
                        previewContainer.addEventListener('click', (e) => {
                            e.stopPropagation()
                            document.body.removeChild(previewContainer);
                        });
                    };
                }
            });
        }
    }
}
