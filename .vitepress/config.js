import { defineConfig } from 'vitepress';
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "ZH的博客",
    description: "记录日常",
    cleanUrls: true,
    rewrites: { // 路径重写
    },
    lastUpdated: true,
    head: [
        ['meta', { name: 'theme-color', content: '#3c8772' }],
        // [
        //   'script',
        //   {
        //     src: 'https://cdn.usefathom.com/script.js',
        //     'data-site': 'AZBRSFGG',
        //     'data-spa': 'auto',
        //     defer: ''
        //   }
        // ]
    ],
    base: "/blogs/", // 基础url
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: "VitePress", link: "/vitepress/" },
            { text: "算法", link: "/algorithm/" },
            { text: "关于", link: "/about/" },
            { text: "Hand Over", link: "/handover/" },
        ],
        sidebar: {
            "/example/": [
                {
                    text: 'Examples',
                    items: [
                        { text: 'Markdown Examples', link: '/example//markdown-examples' },
                        { text: 'Runtime API Examples', link: '/example//api-examples' },
                    ],
                },
            ],
            "/vitepress/": [],
            "/algorithm/": [],
            "/handover/": "auto",
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/zh601095001' },
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present ZH',
        },
    },
});
