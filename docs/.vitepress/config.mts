import { defineConfig } from 'vitepress'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

// GitHub Pages serves the site under /secagent-website/, while the dedicated
// server deployment serves it at the domain root. The server workflow sets
// VITEPRESS_BASE=/ to override the Pages sub-path base.
const base = process.env.VITEPRESS_BASE || (isGitHubActions ? '/secagent-website/' : '/')

export default defineConfig({
  lang: 'zh-CN',
  title: 'SecAgent',
  description: '专注智教场景的 AI Agent，把自然语言连接到可审计、可扩展的工具调用。',
  base,
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
      { text: '快速开始', link: '/#quick-start' },
      { text: '模型服务', link: '/guide/service' },
      { text: '开发文档', link: '/dev/plugin-development' },
      {
        text: '资源',
        items: [
          { text: '官方服务说明', link: '/guide/service' },
          { text: '自定义服务提供商', link: '/guide/custom-providers' },
          { text: '插件开发', link: '/dev/plugin-development' },
          { text: 'GitHub', link: 'https://github.com/SECTL/SecAgent' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '模型服务',
          items: [
            { text: '官方服务说明', link: '/guide/service' },
            { text: '自定义服务提供商', link: '/guide/custom-providers' }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发文档',
          items: [
            { text: '插件开发', link: '/dev/plugin-development' }
          ]
        }
      ]
    },
    outline: { level: [2, 3], label: '本页目录' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    langMenuLabel: '切换语言',
    skipToContentLabel: '跳转到正文',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SECTL/SecAgent', ariaLabel: 'GitHub 仓库' }
    ],
    footer: {
      message: 'SecAgent · 专注智教场景的 AI Agent',
      copyright: 'Copyright © 2026 SECTL'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详细结果',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到与',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '移动',
              navigateUpKeyAriaLabel: '向上箭头',
              navigateDownKeyAriaLabel: '向下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    notFound: {
      title: '页面不存在',
      quote: '你访问的页面可能已经移动，或者链接地址有误。',
      linkLabel: '返回首页',
      linkText: '返回首页'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        forceLocale: true,
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
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
