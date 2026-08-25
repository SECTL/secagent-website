import { defineConfig } from 'vitepress'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  lang: 'zh-CN',
  title: 'SecAgent',
  description: '专注智教场景的 AI Agent，把自然语言连接到可审计、可扩展的工具调用。',
  base: isGitHubActions ? '/secagent-website/' : '/',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    server: {
      port: 45396,
      strictPort: true
    }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#08111f' }],
    ['link', { rel: 'icon', href: '/icon.png' }]
  ],
  themeConfig: {
    logo: '/icon.png',
    siteTitle: 'SecAgent',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/quickstart' },
      { text: '文档', link: '/guide/desktop' },
      { text: '插件生态', link: '/guide/plugins' },
      {
        text: '资源',
        items: [
          { text: 'CLI 参考', link: '/reference/cli' },
          { text: '架构概览', link: '/reference/architecture' },
          { text: 'GitHub', link: 'https://github.com/SECTL/SecAgent' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '桌面端', link: '/guide/desktop' },
            { text: '配置模型', link: '/guide/configuration' }
          ]
        },
        {
          text: '扩展 SecAgent',
          items: [
            { text: '插件与 Skill', link: '/guide/plugins' },
            { text: 'MCP 连接', link: '/guide/mcp' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: 'CLI 命令', link: '/reference/cli' },
            { text: '架构概览', link: '/reference/architecture' }
          ]
        }
      ]
    },
    outline: { level: [2, 3] },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SECTL/SecAgent' }
    ],
    footer: {
      message: 'SecAgent · 专注智教场景的 AI Agent',
      copyright: 'Copyright © 2026 SECTL'
    },
    search: { provider: 'local' },
    editLink: {
      pattern: 'https://github.com/SECTL/secagent-website/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdatedText: '最后更新于'
  }
})
