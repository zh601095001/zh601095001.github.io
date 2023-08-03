import {defineConfig} from 'vitepress';
import algorithm from "./algorithm";
import mathjax3 from "markdown-it-mathjax3";
import theoreticalCalc from "./theoreticalCalc";
// https://vitepress.dev/reference/site-config
const customElements = [
    'math',
    'maction',
    'maligngroup',
    'malignmark',
    'menclose',
    'merror',
    'mfenced',
    'mfrac',
    'mi',
    'mlongdiv',
    'mmultiscripts',
    'mn',
    'mo',
    'mover',
    'mpadded',
    'mphantom',
    'mroot',
    'mrow',
    'ms',
    'mscarries',
    'mscarry',
    'mscarries',
    'msgroup',
    'mstack',
    'mlongdiv',
    'msline',
    'mstack',
    'mspace',
    'msqrt',
    'msrow',
    'mstack',
    'mstack',
    'mstyle',
    'msub',
    'msup',
    'msubsup',
    'mtable',
    'mtd',
    'mtext',
    'mtr',
    'munder',
    'munderover',
    'semantics',
    'math',
    'mi',
    'mn',
    'mo',
    'ms',
    'mspace',
    'mtext',
    'menclose',
    'merror',
    'mfenced',
    'mfrac',
    'mpadded',
    'mphantom',
    'mroot',
    'mrow',
    'msqrt',
    'mstyle',
    'mmultiscripts',
    'mover',
    'mprescripts',
    'msub',
    'msubsup',
    'msup',
    'munder',
    'munderover',
    'none',
    'maligngroup',
    'malignmark',
    'mtable',
    'mtd',
    'mtr',
    'mlongdiv',
    'mscarries',
    'mscarry',
    'msgroup',
    'msline',
    'msrow',
    'mstack',
    'maction',
    'semantics',
    'annotation',
    'annotation-xml',
    'mjx-container',
    'mjx-assistive-mml',
];
export default defineConfig({
    title: "ZH的博客",
    description: "记录日常",
    cleanUrls: true,
    rewrites: { // 路径重写
    },
    markdown: {
        config: (md) => {
            md.use(mathjax3);
        },
        lineNumbers: true
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag),
            },
        },
    },
    lastUpdated: true,
    head: [
        ['meta', {name: 'theme-color', content: '#3c8772'}],
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
        outlineTitle: '本页导航',
        lastUpdatedText: "最后修改",
        search: {
            provider: 'local',
            disableDetailedView: false,
            disableQueryPersistence: true
        },
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: '/'},
            {text: "算法", link: "/algorithm/"},
            {
                text: "三方应用",
                items: [
                    {text: "Stackblitz", link: "https://stackblitz.com/"},
                    {text: "VitePress", link: "https://vitepress.dev/"},
                ],
            },
            {
                text: "理论计算",
                items: [
                    {text: "VASP Wiki", link: "https://www.vasp.at/wiki/index.php/The_VASP_Manual"},
                    {text: "Material Project", link: "https://materialsproject.org/"},
                    {text: "Crystallography Open Database", link: "http://www.crystallography.net/cod/search.html"},
                    {text: "Crystallography Open Database", link: "http://www.crystallography.net/cod/search.html"},
                    {text: "VASPKIT", link: "http://vaspkit.sourceforge.net/"}
                ],
            },
            {
                text: "科研",
                items: [
                    {text: "Web of Science", link: "http://apps.webofknowledge.com/"},
                    {text: "万方数据", link: "http://www.wanfangdata.com.cn/index.html"},
                    {text: "谷歌学术", link: "https://scholar.google.com/"}
                ],
            },
            {
                text: "笔记",
                items: [
                    {text: "理论计算", link: "/theoreticalCalc/"},
                    {text: "高对称点选取", link: "https://www.cryst.ehu.es/rep/repres.html"},
                    {text: "高对称点选取2", link: "https://www.materialscloud.org/work/tools/seekpath"},
                    {text: "操作系统", link: "/notes/操作系统"},
                    {text: "计算机组成原理", link: "/notes/计算机组成原理/"},
                ],
            },
            {text: "关于", link: "/about/"},
        ],
        sidebar: {
            "/example/": [
                {
                    text: 'Examples',
                    items: [
                        {text: 'Markdown Examples', link: '/example//markdown-examples'},
                        {text: 'Runtime API Examples', link: '/example/api-examples'},
                    ],
                },
            ],
            "/vitepress/": [],
            "/algorithm/": algorithm,
            "/theoreticalCalc/": theoreticalCalc,
            "/notes/计算机组成原理/":[
                {
                    text:"简介",
                    items:[
                        {
                            text:"计算机硬件的基本组成",
                            link:"/notes/计算机组成原理/计算机硬件的基本组成"
                        },
                        {
                            text:"各个硬件的工作原理",
                            link:"/notes/计算机组成原理/各个硬件的工作原理"
                        },
                        {
                            text:"计算机系统的层次结构",
                            link:"/notes/计算机组成原理/计算机系统的层次结构"
                        }
                    ]
                }
            ]
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/zh601095001/blogs'},
        ],
        docFooter: {
            prev: "上一页",
            next: "下一页",
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present ZH',
        },
        editLink: {
            pattern: "https://github.com/zh601095001/blogs/blob/master/:path",
            text: "Edit this page on GitHub"
        }
    },
});
