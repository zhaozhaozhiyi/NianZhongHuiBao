import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '年度总结报告',
  description: '2025年总结报告与2026年目标',
  lang: 'zh-CN',
  
  markdown: {
    sidebarDepth: 4
  },
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '2025年总结', link: '/2025年总结' },
      { text: '问题与思考', link: '/问题与思考' },
      { text: '2026年目标', link: '/2026年目标' }
    ],
    
    sidebar: [
      {
        text: '概述',
        items: [
          { text: '首页', link: '/' }
        ]
      },
      {
        text: '2025年总结',
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
        text: '2026年目标',
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
      provider: 'local'
    }
  }
})

