import { defineConfig } from 'vitepress'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "数据库设计与开发",
  description: "笔记",
  srcDir: './docs',
  base: '/Database-zxl-Notes/', 
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 5],
    nav: [
      { text: '首页', link: '/' },

    ],

    sidebar: [
      {
        text: '课程章节',
        items: [
          { text: '数据库系统导论', link: '/chapters/1-intro' },
          { text: '实体关系模型', link: '/chapters/2-er' },
          { text: '函数依赖与关系模式设计', link: '/chapters/3-fds' },
          { text: '多值依赖与关系模式设计', link: '/chapters/4-mvds' },
          { text: '关系代数', link: '/chapters/5-ra' },
          { text: 'SQL', link: '/chapters/6-sql' },
          { text: '并发控制', link: '/chapters/7-concurrency' },
          { text: 'XML', link: '/chapters/8-xml' }
        ]
      },
      {
        text: '往年试题',
        items: [
          { text: '2022年网传往年题', link: '/paper/2022' },
          { text: '2022年网传往年题中文版', link: '/paper/2022-zh' },
          { text: '2022年网传往年题解析', link: '/paper/2022-analysis' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    math: true,
    config(md) {
      md.use(MermaidMarkdown);
    },
  },
  vite: {
    plugins: [MermaidPlugin()],
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
  },
})
