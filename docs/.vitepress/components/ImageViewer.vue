<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="image-viewer"
        @click="handleBackdropClick"
      >
        <div class="image-viewer__close" @click="close">×</div>
        
        <div class="image-viewer__nav image-viewer__nav--prev" 
             v-if="hasPrev" 
             @click.stop="prev">
          ‹
        </div>
        
        <div class="image-viewer__nav image-viewer__nav--next" 
             v-if="hasNext" 
             @click.stop="next">
          ›
        </div>
        
        <img
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="image-viewer__image"
          @click.stop
        />
        
        <div class="image-viewer__info">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value] || {})
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.images.length - 1)

const open = (index = 0) => {
  currentIndex.value = index
  visible.value = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  visible.value = false
  document.body.style.overflow = ''
  emit('close')
}

const prev = () => {
  if (hasPrev.value) {
    currentIndex.value--
  }
}

const next = () => {
  if (hasNext.value) {
    currentIndex.value++
  }
}

const handleBackdropClick = (e) => {
  if (e.target.classList.contains('image-viewer')) {
    close()
  }
}

const handleKeydown = (e) => {
  if (!visible.value) return
  
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowLeft') {
    prev()
  } else if (e.key === 'ArrowRight') {
    next()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({
  open,
  close
})
</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-viewer__image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
}

.image-viewer__close {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 50px;
  color: white;
  cursor: pointer;
  line-height: 1;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.image-viewer__close:hover {
  transform: scale(1.2);
}

.image-viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 60px;
  color: white;
  cursor: pointer;
  padding: 20px;
  user-select: none;
  transition: opacity 0.2s;
  opacity: 0.7;
}

.image-viewer__nav:hover {
  opacity: 1;
}

.image-viewer__nav--prev {
  left: 30px;
}

.image-viewer__nav--next {
  right: 30px;
}

.image-viewer__info {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

