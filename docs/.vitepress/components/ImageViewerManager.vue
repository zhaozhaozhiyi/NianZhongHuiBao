<template>
  <ImageViewer
    ref="viewerRef"
    :images="imageList"
    @close="handleClose"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import ImageViewer from './ImageViewer.vue'

const route = useRoute()
const viewerRef = ref(null)
const imageList = ref([])
const clickHandlers = new Map()
let observer = null

const getAllImages = () => {
  return document.querySelectorAll('.vp-doc img, .content img, main img, article img')
}

const collectImages = () => {
  nextTick(() => {
    const imgElements = getAllImages()
    const images = []
    
    imgElements.forEach((img) => {
      // 跳过已经处理过的图片
      if (img.dataset.viewerProcessed) return
      
      const src = img.src || img.getAttribute('src')
      if (!src) return
      
      images.push({
        src: src,
        alt: img.alt || img.getAttribute('alt') || ''
      })
      
      // 添加点击事件
      img.style.cursor = 'pointer'
      img.dataset.viewerProcessed = 'true'
      
      const clickHandler = () => {
        // 重新收集所有图片（确保获取最新状态）
        const allImgs = getAllImages()
        const currentImages = []
        
        allImgs.forEach((i) => {
          const imgSrc = i.src || i.getAttribute('src')
          if (imgSrc) {
            currentImages.push({
              src: imgSrc,
              alt: i.alt || i.getAttribute('alt') || ''
            })
          }
        })
        
        // 找到当前点击的图片索引
        const currentIndex = Array.from(allImgs).findIndex(i => i === img)
        
        imageList.value = currentImages
        if (viewerRef.value && currentIndex >= 0) {
          viewerRef.value.open(currentIndex)
        }
      }
      
      img.addEventListener('click', clickHandler)
      clickHandlers.set(img, clickHandler)
    })
    
    if (images.length > 0) {
      imageList.value = images
    }
  })
}

const cleanup = () => {
  // 清理所有事件监听器
  clickHandlers.forEach((handler, img) => {
    img.removeEventListener('click', handler)
    delete img.dataset.viewerProcessed
  })
  clickHandlers.clear()
}

const handleClose = () => {
  // 关闭时的处理
}

// 监听路由变化
watch(() => route.path, () => {
  cleanup()
  // 重新收集图片
  setTimeout(() => {
    collectImages()
  }, 150)
})

onMounted(() => {
  // 延迟收集，确保 DOM 已渲染
  setTimeout(() => {
    collectImages()
  }, 100)
  
  // 使用 MutationObserver 监听 DOM 变化
  const contentEl = document.querySelector('.vp-doc') || document.querySelector('main') || document.querySelector('article') || document.body
  if (contentEl) {
    observer = new MutationObserver(() => {
      collectImages()
    })
    
    observer.observe(contentEl, {
      childList: true,
      subtree: true
    })
  }
})

onUnmounted(() => {
  cleanup()
  if (observer) {
    observer.disconnect()
  }
})
</script>

