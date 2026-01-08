import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '年度总结报告',
  description: '从做题到出题：构建持续创造价值的系统',
  lang: 'zh-CN',
  
  // 设置导航栏 logo
  logo: '/images/logo/logo-128x128.png',
  
  // 在 HTML head 中添加 favicon 和其他图标
  head: [
    // 标准 favicon
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon/favicon-16x16.png' }],
    ['link', { rel: 'shortcut icon', href: '/images/favicon/favicon.ico' }],
    
    // Apple Touch Icon
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicon/apple-touch-icon.png' }],
    
    // Android Chrome Icons
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/favicon/android-chrome-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/images/favicon/android-chrome-512x512.png' }],
    
    // Web Manifest
    ['link', { rel: 'manifest', href: '/images/favicon/site.webmanifest' }],
    
    // Microsoft Tile
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-config', content: '/images/favicon/browserconfig.xml' }],
    
    // Theme Color
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
  
  markdown: {
    sidebarDepth: 4
  },
  
  server: {
    port: 5173,
    host: 'localhost'
  },
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '回顾2025', link: '/2025年总结' },
      { text: '问题与思考', link: '/问题与思考' },
      { text: '展望2026', link: '/2026年目标' }
    ],
    
    sidebar: [
      {
        text: '概述',
        items: [
          { text: '首页', link: '/' }
        ]
      },
      {
        text: '回顾2025',
        items: [
          { text: '2025年总结', link: '/2025年总结' }
        ]
      },
      {
        text: '问题与思考',
        items: [
          { text: '问题与思考', link: '/问题与思考' }
        ]
      },
      {
        text: '展望2026',
        items: [
          { text: '2026年目标', link: '/2026年目标' }
        ]
      }
      
    ],
    
    socialLinks: [],
    
    footer: {
      message: '年度总结报告',
      copyright: 'Copyright © 2025'
    },
    
    search: {
      provider: 'local',
      placeholder: '搜索文档...',
      translations: {
        button: {
          buttonText: '搜索文档',
          buttonAriaLabel: '搜索文档'
        },
        modal: {
          noResultsText: '无法找到相关结果',
          resetButtonTitle: '清除查询条件',
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭'
          }
        }
      }
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    returnToTopLabel: '返回顶部',
    
    sidebarMenuLabel: '菜单',
    
    darkModeSwitchLabel: '主题',
    
    outline: {
      label: '页面导航',
      level: [2, 4]
    }
  }
})

