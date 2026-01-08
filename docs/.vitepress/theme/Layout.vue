<template>
  <Layout>
    <template #layout-top>
      <ImageViewerManager />
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import ImageViewerManager from '../components/ImageViewerManager.vue'

const { Layout } = DefaultTheme
</script>

